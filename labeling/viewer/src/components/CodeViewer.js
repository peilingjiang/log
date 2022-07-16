import React, { useEffect, useRef } from 'react'

import '../css/CodeViewer.scss'
import {
  constructTextHighlighting,
  getLanguage,
  languages,
  sleep,
} from './utils'

export const CodeViewer = ({
  log,
  fragment,
  language,
  fileExtension,
  order,
}) => {
  const codeViewRef = useRef(null)
  const codeWindow = useRef(null)

  const _openCodePage = () => {
    if (codeWindow.current) {
      codeWindow.current.close()
      codeWindow.current = null
    }

    if (log) {
      const bounding = codeViewRef.current.getBoundingClientRect()

      let popWidth, popHeight, popLeft, popTop
      if (
        window.outerHeight > window.screen.height * 0.8 &&
        window.outerWidth < window.screen.width * 0.6
      ) {
        popWidth = window.screen.availWidth * 0.5
        popHeight = window.screen.availHeight
        popLeft = 0
        popTop = 0
      } else {
        popWidth = bounding.width
        popHeight = bounding.height - 70
        popLeft = window.screenLeft + bounding.left
        popTop =
          window.screenTop +
          (window.outerHeight - window.innerHeight) +
          bounding.top
      }

      console.log(
        log['html_url'] +
          `#:~:text=${constructTextHighlighting(
            fragment,
            getLanguage(language).statement
          )}`
      )
      codeWindow.current = window.open(
        log['html_url'] +
          `#:~:text=${constructTextHighlighting(
            fragment,
            getLanguage(language).statement
          )}`,
        'window',
        `noopener,titlebar=yes,toolbar=yes,location=yes,menubar=yes,left=${popLeft},top=${popTop},height=${popHeight},width=${popWidth},scrollbars=yes,resizable=yes`
      )
    }
  }

  useEffect(() => {
    // fetch
    // fetch(log.git_url)
    //   .then(response => {
    //     return response.json()
    //   })
    //   .then(data => {
    //     console.log(data);
    //     iframeRef.current.src =
    //       'data:text/html;base64,' + encodeURIComponent(data['content'])
    //   })
    // _openCodePage()

    return () => {
      if (codeWindow.current) codeWindow.current.close()
    }
  })

  return (
    <div
      ref={e => (codeViewRef.current = e)}
      id="code-viewer"
      onClick={() => {
        _openCodePage()
      }}
    >
      {/* <iframe
        ref={e => (iframeRef.current = e)}
        title={log['logs_id']}
        src={log['html_url']}
      ></iframe> */}
      click to reopen the code page
    </div>
  )
}
