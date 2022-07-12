import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'

dotenv.config()

/* -------------------------------------------------------------------------- */

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

const languages = [
  {
    language: 'JavaScript',
    statement: 'console.log(*)',
    file_extensions: ['js', 'ts', 'jsx', 'cjs', 'mjs'],
  },
  {
    language: 'Python',
    statement: 'print(*)',
    file_extensions: ['py'],
  },
  {
    language: 'Java',
    statement: 'System.out.print*(*)',
    file_extensions: ['java'],
  },
  {
    language: 'C',
    statement: 'printf(*)',
    file_extensions: ['c'],
  },
]

/* -------------------------------------------------------------------------- */

const visitLimitGapMs = 120000
const singleQueryDateRange = 180 * 24 * 60 * 60 * 1000

/* -------------------------------------------------------------------------- */

const main = async () => {
  // ! init octokit
  const octokit = new Octokit({
    // eslint-disable-next-line no-undef
    auth: process.env.GITHUB_TOKEN,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
  })

  // const headers = new Headers()
  // // eslint-disable-next-line no-undef
  // headers.append('Authorization', `token ${process.env.GITHUB_TOKEN}`)
  // headers.append('Accept', 'application/vnd.github.text-match+json')
  // headers.append(
  //   'User-Agent',
  //   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
  // )
  // headers.append('Content-Type', 'application/json')

  // ! for each language
  for (const language of languages) {
    // let today = new Date()

    // ! for each time range
    // for (let dateChange = 0; dateChange < 20; dateChange++) {
    //   const startDate = new Date(
    //     today.getTime() - (dateChange + 1) * singleQueryDateRange
    //   )
    //   const endDate = new Date(
    //     today.getTime() - dateChange * singleQueryDateRange
    //   )

    //   const startDateStr = startDate.toISOString().split('T')[0]
    //   const endDateStr = endDate.toISOString().split('T')[0]

    //   ////

    //   await sleep(visitLimitGapMs)
    // }

    for (const fileExtension of language.file_extensions) {
      // ! page
      for (let page = 1; page <= 10; page++) {
        const q = `${language.statement}+extension:${fileExtension}`
        console.log(`* searching (page ${page}) `, q)

        const result = await octokit.request('GET /search/code', {
          // q: `${language.statement}+language:${language.language}+created:${startDateStr}..${endDateStr}`,
          q: q,
          per_page: 100,
          page: page,
          // sort: 'indexed',
          // order: 'desc',
          headers: {
            accept: 'application/vnd.github.text-match+json',
          },
        })

        let addedItems = 0

        for (const item of result.data.items) {
          db.doc(`logs/${language.language}/${fileExtension}/${item.sha}`).set(
            item
          )
          addedItems++
        }

        if (addedItems > 0) console.log(`${addedItems} new logs added`)

        await sleep(visitLimitGapMs)
      }
    }
  }
}

main()

/* -------------------------------------------------------------------------- */

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
