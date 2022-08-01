import dotenv from 'dotenv'
import fs from 'fs'

import * as fastCSV from 'fast-csv'

import LogGist from '../viewer/src/logsGist.json'

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

const starThreshold = 2

export const encode = text => {
  text = encodeURIComponent(text)
  text = text.replace(/-/g, '%2D')
  text = text.replace(/\./g, '%2E')
  text = text.replace(/_/g, '%5F')

  return text
}

const removeSpacesBeforeAfter = text => {
  while (text.length && text.at(0) === ' ') text = text.substring(1)
  while (text.length && text.at(-1) === ' ')
    text = text.substring(0, text.length - 1)

  return text
}

const removeBreaksSpaces = (text, preservedPos) => {
  // remove invalid characters
  for (const invalid of ['\n', '\r', '\t']) {
    if (text.indexOf(invalid) !== -1) {
      let splittedText = text.split(invalid)
      splittedText = splittedText.map(t => {
        return removeSpacesBeforeAfter(t)
      })

      while (!splittedText.at(preservedPos).length && splittedText.length > 1) {
        if (preservedPos === 0) splittedText.shift()
        else splittedText.pop()
      }
      text = splittedText.at(preservedPos)
    }
  }

  return text
}

const constructTextHighlighting = (text, statement) => {
  // encode a string to be highlighted in Chrome
  // https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex

  const contentArray = text.split(statement)

  if (contentArray.length < 2) {
    return ''
  }

  const pre = removeBreaksSpaces(contentArray[0], -1)
  const post = removeBreaksSpaces(contentArray[1], 0)

  return `${pre.length ? `${encode(pre)}-,` : ''}${statement}${
    post.length ? `,-${encode(post)}` : ''
  }`
}

const main = async () => {
  const ws = fs.createWriteStream('logLabeling.csv')
  const stream = []

  let tracker = 0

  for (const extension in LogGist.logs.JavaScript) {
    const extensionItems = LogGist.logs.JavaScript[extension]
    for (const itemOrder in extensionItems) {
      const item = extensionItems[itemOrder]
      if (item.stars >= starThreshold) {
        const doc = await db
          .doc(`logs/JavaScript/${extension}/${item.id}`)
          .get()

        const data = doc.data()
        const fragment = data.text_matches[0].fragment
        stream.push({
          order: data.logs_order,
          order_extension: data.logs_in_type_order,
          name: data.logs_id.replace('JavaScript-', ''),
          stars: data.logs_repo_stars,
          sha: data.sha,
          api_url: data.url,
          url: data.html_url,
          location_url:
            data.html_url +
            `#:~:text=${constructTextHighlighting(fragment, 'console.log')}`,
          repository: data.repository.full_name,
          language: 'JavaScript',
          matched: fragment,
        })
      }

      tracker++
      if (tracker % 100 === 0) {
        console.log(`${tracker} logs processed`)
      }
    }
  }

  // randomize the order of the stream
  stream.sort(() => Math.random() - 0.5)

  // add index for each stream item
  for (let i = 0; i < stream.length; i++) {
    stream[i].index = i
  }

  fastCSV.write(stream, { headers: true }).pipe(ws)
}

main()
