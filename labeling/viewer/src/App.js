import { Component } from 'react'
import { getDoc, collection, query, where, doc } from 'firebase/firestore/lite'

import { db } from './fire'
import { CodeViewer } from './components/CodeViewer'
import { getLanguage, languages, sleep } from './components/utils'

import LogsGist from './logsGist.json'

import './css/App.scss'

export default class App extends Component {
  maxOrderForLanguageExtension = -1

  state = {
    log: null,
    // maxOrderForLanguageExtension: -1,
    ////
    language: 'JavaScript',
    fileExtension: 'js',
    order: 0,
  }

  componentDidMount() {
    sleep(100).then(() => {
      this.retrieveNewLog()
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.language !== this.state.language ||
      prevState.fileExtension !== this.state.fileExtension ||
      prevState.order !== this.state.order
    ) {
      sleep(100).then(() => {
        this.retrieveNewLog()
      })
    }
  }

  retrieveNewLog() {
    console.log('retrieving')
    // import('./logs.json').then(logs => {
    //   this.setState({ logs })
    // })

    const { language, fileExtension, order } = this.state

    const thisDocId = LogsGist.logs[`${language}-${fileExtension}-${order}`]
    const thisExtensionCount = LogsGist.counts[`${language}-${fileExtension}`]

    this.maxOrderForLanguageExtension = thisExtensionCount - 1

    // get this log from firestore
    const logDocRef = doc(db, `logs/${language}/${fileExtension}/${thisDocId}`)

    getDoc(logDocRef).then(log => {
      this.setState({ log: log.data() })
    })
  }

  render() {
    const { log, language, fileExtension, order } = this.state

    const fragment = (log && log?.text_matches[0].fragment) || null

    const langInputOptions = languages.map(lang => {
      return (
        <option
          key={lang.language}
          value={lang.language}
          // selected={lang.language === language}
        >
          {lang.language}
        </option>
      )
    })

    const extensionOptions = getLanguage(language).file_extensions.map(
      extension => {
        return (
          <option
            key={extension}
            value={extension}
            // selected={extension === fileExtension}
          >
            {extension}
          </option>
        )
      }
    )

    return (
      <div className="App">
        <div className="controls">
          <select
            className="lang-select"
            defaultValue={language}
            onChange={event => {
              this.setState({
                language: event.target.value,
                fileExtension: getLanguage(event.target.value)
                  .file_extensions[0],
                order: 0,
              })
            }}
          >
            {langInputOptions}
          </select>
          <select
            className="extension-select"
            defaultValue={fileExtension}
            onChange={event => {
              this.setState({ fileExtension: event.target.value, order: 0 })
            }}
          >
            {extensionOptions}
          </select>
          <input
            type={'number'}
            value={order}
            onChange={event => {
              this.setState({
                order: Math.max(
                  Math.min(
                    event.target.value,
                    this.maxOrderForLanguageExtension
                  ),
                  0
                ),
              })
            }}
          />

          <button
            className="order-button"
            onClick={() =>
              this.setState({
                ...this.state,
                log: null,
                order: Math.max(order - 1, 0),
              })
            }
          >
            prev
          </button>
          <button
            className="order-button"
            onClick={() =>
              this.setState({
                ...this.state,
                log: null,
                order: Math.min(order + 1, this.maxOrderForLanguageExtension),
              })
            }
          >
            next
          </button>
        </div>

        <CodeViewer
          key="code-viewer"
          log={log}
          fragment={fragment}
          language={language}
          fileExtension={fileExtension}
          order={order}
        />

        <pre>{fragment || 'Loading...'}</pre>
      </div>
    )
  }
}
