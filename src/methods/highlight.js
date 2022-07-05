export const highlightElement = (
  el,
  { style, animate, scrollIntoView, upFront }
) => {
  upFront = upFront || true

  el.classList.remove(
    `hyper-item-highlight-${style}${animate ? '-animate' : ''}${
      scrollIntoView ? '-wait' : ''
    }`
  )

  el.offsetWidth // ! magic!

  el.classList.add(
    `hyper-item-highlight-${style}${animate ? '-animate' : ''}${
      scrollIntoView ? '-wait' : ''
    }`
  )

  // if (styleToAnimationTime[style])
  //   setTimeout(() => {
  //     el.classList.remove(
  //       `hyper-item-highlight-${style}${animate ? '-animate' : ''}${
  //         scrollIntoView ? '-wait' : ''
  //       }`
  //     )
  //     if (upFront) el.classList.add('up-front')
  //   }, styleToAnimationTime[style])

  if (upFront) el.classList.add('up-front')

  // scroll to the item
  scrollIntoView = scrollIntoView || true
  if (scrollIntoView) el.scrollIntoView({ block: 'center' })
}

export const removeHighlight = (
  el,
  { style, animate, scrollIntoView, upFront }
) => {
  el.classList.remove(
    `hyper-item-highlight-${style}${animate ? '-animate' : ''}${
      scrollIntoView ? '-wait' : ''
    }`
  )

  upFront = upFront || true
  if (upFront) el.classList.remove('up-front')
}

/* -------------------------------------------------------------------------- */

export const styleToAnimationTime = {
  background: 700,
}
