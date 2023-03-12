import LeaderLine from 'leader-line-new'

import { pxWrap } from '../methods/findPosition.js'

export const setupLeaderLine = (event, renderSudoElement, color) => {
  const sudoPointerElement = document.createElement('div')
  sudoPointerElement.classList.add('sudo-pointer-element')
  sudoPointerElement.id = 'sudo-pointer-element'
  sudoPointerElement.style.top = pxWrap(event.clientY + window.scrollY)
  sudoPointerElement.style.left = pxWrap(event.clientX + window.scrollX)
  renderSudoElement(sudoPointerElement)

  const leaderLine = new LeaderLine(
    LeaderLine.pointAnchor(event.target),
    sudoPointerElement,
    {
      path: 'straight',
      startPlug: 'disc',
      endPlug: 'disc',
    }
  )
  leaderLine.size = 2.5
  leaderLine.color = color

  return { sudoPointerElement, leaderLine }
}
