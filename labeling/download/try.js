import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const main = async () => {
  const octokit = new Octokit({
    // eslint-disable-next-line no-undef
    auth: process.env.GITHUB_TOKEN,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
  })

  const q = `console.log(*) extension:js size:0..50`

  const result = await octokit.request('GET /search/code', {
    // q: `${language.statement}+language:${language.language}+created:${startDateStr}..${endDateStr}`,
    q: q,
    per_page: 100,
    page: 1,
    headers: {
      accept: 'application/vnd.github.text-match+json',
    },
  })

  console.log(result.data.items.length)
  fs.writeFileSync('try.json', JSON.stringify(result.data.items, null, 2))
}

main()
