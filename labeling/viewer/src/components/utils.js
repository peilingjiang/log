export const languages = [
  {
    language: 'JavaScript',
    statement: 'console.log',
    file_extensions: ['js', 'ts', 'jsx', 'cjs', 'mjs'],
  },
  {
    language: 'Python',
    statement: 'print',
    file_extensions: ['py'],
  },
  {
    language: 'Java',
    statement: 'System.out.print',
    file_extensions: ['java'],
  },
  {
    language: 'C',
    statement: 'printf',
    file_extensions: ['c'],
  },
]

export const getLanguage = lang => {
  return languages.find(language => language.language === lang)
}

export const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export const constructTextHighlighting = (text, statement) => {
  // encode a string to be highlighted in Chrome
  // https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex

  const contentArray = text.split(statement)

  const pre = removeBreaksSpaces(contentArray[0], -1)
  const post = removeBreaksSpaces(contentArray[1], 0)

  return `${pre.length ? `${encode(pre)}-,` : ''}${statement}${
    post.length ? `,-${encode(post)}` : ''
  }`
}

export const removeBreaksSpaces = (text, preservedPos) => {
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

  // text = encodeURI(text)
  // text.replace(/;/g, encodeURIComponent(";"))
  // text.replace(/%/g, '%25')
  // text = encodeURIComponent(text)

  // text.replace('(', '%28')
  // console.log(text);

  return text
}

export const removeSpacesBeforeAfter = text => {
  while (text.length && text.at(0) === ' ') text = text.substring(1)
  while (text.length && text.at(-1) === ' ')
    text = text.substring(0, text.length - 1)

  return text
}

export const encode = text => {
  text = encodeURIComponent(text)
  text = text.replace(/-/g, '%2D')
  text = text.replace(/\./g, '%2E')
  text = text.replace(/_/g, '%5F')

  return text
}
