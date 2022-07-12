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

const main = async () => {
  const logs = {}

  for (const language of languages) {
    logs[language.language] = []

    for (const fileExtension of language.file_extensions) {
      console.log(`downloading ${language.language} : ${fileExtension}`)

      const querySnapshot = await db
        .collection(`logs/${language.language}/${fileExtension}`)
        .get()

      querySnapshot.forEach(doc => {
        logs[language.language].push(doc.data())
      })

      const docsCount = querySnapshot.docs.length
      console.log(
        `*downloaded ${language.language} : ${fileExtension} : ${docsCount}`
      )
    }
  }

  fs.writeFileSync('../viewer/src/logs.json', JSON.stringify(logs, null, 2))
}

main()
