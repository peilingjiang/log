import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'

import express from 'express'
// import cors from 'cors'

import { languages } from './utils.js'

dotenv.config()

/* -------------------------------------------------------------------------- */

const app = express()
// app.use(cors())

app.get('/', (req, res) => {
  res.send('hello world')
})

// eslint-disable-next-line no-undef
app.listen(process.env.PORT || 3000, () => {
  console.log('app is running at port 3000')
  main()
})

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

const visitLimitGapMs = 90000
const sizeGap = 2000
// const singleQueryDateRange = 180 * 24 * 60 * 60 * 1000

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
      // ! size
      for (let sizeStart = 0; sizeStart <= 10; sizeStart += 1) {
        const sizeQuery =
          sizeStart === 10
            ? `size:>${sizeStart * sizeGap}`
            : `size:${sizeStart * sizeGap}..${(sizeStart + 1) * sizeGap}`

        // ! page
        for (let page = 1; page <= 10; page++) {
          const q = `${language.statement} extension:${fileExtension} ${sizeQuery}`

          // ! try 2 times
          for (let i = 1; i < 3; i++) {
            console.log(`* searching (page ${page}, try ${i}) ${q}`)
            try {
              const options = {
                q: q,
                per_page: 100,
                page: page,
                sort: 'indexed',
                // order: i === 1 ? 'desc' : 'asc',
                headers: {
                  accept: 'application/vnd.github.text-match+json',
                },
              }

              const result = await octokit.request('GET /search/code', options)

              let addedItems = 0

              for (const item of result.data.items) {
                // stars
                octokit
                  .request(`GET /repos/${item.repository.full_name}/stargazers`)
                  .then(res => {
                    return res.data
                  })
                  .then(data => {
                    db.doc(
                      `logs/${language.language}/${fileExtension}/${item.sha}`
                    ).set({
                      ...item,
                      logs_repo_stars: data.length,
                    })
                    addedItems++
                  })
                  .catch(err => {
                    console.log(err)
                  })
                await sleep(5)
              }

              if (addedItems > 0)
                console.log(
                  `${addedItems} new logs added (${
                    result.data.incomplete_results ? 'incomplete' : 'complete'
                  })`
                )

              console.log(`* waiting ${visitLimitGapMs} ms for another try`)
            } catch (e) {
              console.log(e)
              await sleep(visitLimitGapMs)
            }

            await sleep(visitLimitGapMs)
          }
        }
      }
    }
  }
}

// main()

/* -------------------------------------------------------------------------- */

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
