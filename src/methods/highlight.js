export const highlightElement = (el, { style, animate, scrollIntoView }) => {
  el.classList.add(`hyper-item-highlight-${style}${animate ? '-animate' : ''}`)
  el.classList.add('up-front')
  // scroll to the item
  if (scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
