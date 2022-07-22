import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'
import fs from 'fs'

import { languages } from '../utils.js'

dotenv.config()

// ! firebase

// Import the functions you need from the SDKs you need
import admin from 'firebase-admin'
// import AdminSDK from './adminsdk.json'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      // eslint-disable-next-line no-undef
      Buffer.from(process.env.FIREBASE_SECRET, 'base64').toString('ascii')
    )
  ),
})

const db = admin.firestore()

/* -------------------------------------------------------------------------- */

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const main = async () => {
  const octokit = new Octokit({
    // eslint-disable-next-line no-undef
    auth: process.env.GITHUB_TOKEN,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
  })

  const logs = {}
  const logsGist = {
    counts: {}, // counts for each fileExtension
    logs: {}, // map each logs_id to doc id
  }

  let totalLogsCount = 0

  for (const language of languages) {
    logs[language.language] = {}

    for (const fileExtension of language.file_extensions) {
      console.log(`downloading ${language.language} : ${fileExtension}`)
      logs[language.language][fileExtension] = []

      const querySnapshot = await db
        .collection(`logs/${language.language}/${fileExtension}`)
        .get()

      let logsCountThisExtension = 0

      const _log_info = {
        logs_id: `${language.language}-${fileExtension}-${logsCountThisExtension}`,
        logs_in_type_order: logsCountThisExtension,
        logs_order: totalLogsCount,
      }

      for (const doc of querySnapshot.docs) {
        const docData = doc.data()

        logs[language.language][fileExtension].push({
          ...docData,
          ..._log_info,
        })

        // update to Firebase
        db.collection(`logs/${language.language}/${fileExtension}`)
          .doc(doc.id)
          .update(_log_info)

        // save logs gist
        // octokit
        //   .request(`GET /repos/${docData.repository.full_name}/stargazers`)
        //   .then(res => {
        //     return res.data
        //   })
        //   .then(data => {
        //     logsGist.logs[
        //       `${language.language}-${fileExtension}-${logsCountThisExtension}`
        //     ] = {
        //       id: doc.id,
        //       stars: data.length,
        //     }

        //     if (data.length > 0) console.log(data.length)
        //   })
        //   .catch(err => {
        //     console.log(err)
        //   })
        // await sleep(10)

        // save logs gist without stars
        logsGist.logs[
          `${language.language}-${fileExtension}-${logsCountThisExtension}`
        ] = {
          id: doc.id,
        }

        logsCountThisExtension++
        totalLogsCount++
      }

      logsGist.counts[`${language.language}-${fileExtension}`] =
        logsCountThisExtension + 1

      // const docsCount = querySnapshot.docs.length
      console.log(
        `*downloaded ${language.language} : ${fileExtension} : ${
          logsCountThisExtension + 1
        }`
      )
    }
  }

  fs.writeFileSync('../viewer/src/logs.json', JSON.stringify(logs, null, 2))
  console.log(`*logs written to the file : ${totalLogsCount + 1}`)

  fs.writeFileSync(
    '../viewer/src/logsGist.json',
    JSON.stringify(logsGist, null, 2)
  )
  console.log(`*logsGist written to the file : ${totalLogsCount + 1}`)
}

main()
