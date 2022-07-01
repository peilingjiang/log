export const outlineToHighlightElement = (
  ele,
  highlight = true,
  offset = ''
) => {
  if (highlight && ele?.classList)
    return ele.classList.add(
      `forced-outline-bound${offset.length ? `-${offset}` : ''}`
    )
  else if (ele?.classList)
    return ele.classList.remove(
      `forced-outline-bound${offset.length ? `-${offset}` : ''}`
    )
}

export const clearAllOutlines = () => {
  for (const offset of ['', '-inside', '-mid']) {
    const ele = document.querySelector(`.forced-outline-bound${offset}`)
    if (ele) ele.classList.remove(`forced-outline-bound${offset}`)
  }
}
