// @ts-nocheck

import katex from "katex/dist/katex.mjs"
import {getLatexString} from "./Utils"

export const scrollTo = (to, duration) => {
  const
    element = document.getElementById('mapHolderDiv'),
    start = element.scrollLeft,
    change = to - start,
    startDate = +new Date(),
    easeOut = function (t, b, c, d) {
      // t = current time
      // b = start value
      // c = change in value
      // d = duration
      // https://www.gizma.com/easing/
      // https://easings.net/
      // https://css-tricks.com/ease-out-in-ease-in-out/
      // TODO: trying to set if for everything
      t /= d
      t--
      return c * (t * t * t + 1) + b
    },
    animateScroll = function () {
      const currentDate = +new Date()
      const currentTime = currentDate - startDate
      element.scrollLeft = parseInt(easeOut(currentTime, start, change, duration))
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll)
      } else {
        element.scrollLeft = to
      }
    }
  animateScroll()
}

export const getCoords = (e) => {
  let winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  let winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  let mapHolderDiv = document.getElementById('mapHolderDiv')
  let x = e.pageX - winWidth + mapHolderDiv.scrollLeft
  let y = e.pageY - winHeight + mapHolderDiv.scrollTop
  return [x, y]
}

export const getNativeEvent = ({path, composedPath, key, code, which}) =>
  ({path: path || (composedPath && composedPath()), key, code, which})

export const setEndOfContentEditable = (contentEditableElement) => {
  // https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
  let range, selection
  range = document.createRange()//Create a range (a range is a like the selection but invisible)
  range.selectNodeContents(contentEditableElement)//Select the entire contents of the element with the range
  range.collapse(false)//collapse the range to the end point. false means collapse to end rather than the start
  selection = window.getSelection()//get the selection object (allows you to change selection)
  selection.removeAllRanges()//remove any selections already made
  selection.addRange(range)//make the range you have just created the visible selection
}

export const getTextDim = (innerHTML, fontSize) => {
  const tmpDiv = document.createElement('div')
  tmpDiv.id = "Test"
  tmpDiv.innerHTML = innerHTML
  page.appendChild(tmpDiv)
  const test = document.getElementById("Test")
  test.style.fontFamily = 'Roboto'
  test.style.fontSize = fontSize + 'px'
  const height = test.clientHeight
  let width = test.clientWidth
  const element = document.getElementById("Test")
  element.parentNode.removeChild(element)
  if (width === 0)
    width = 14
  return [width, height]
}

export const getEquationDim = (content) => {
  let str = katex.renderToString(getLatexString(content), {throwOnError: false})
  let tmpDiv = document.createElement('TTT')
  tmpDiv.id = "Test"
  tmpDiv.style.fontFamily = 'Roboto'
  tmpDiv.style.fontSize = 14 + 'px'
  tmpDiv.innerHTML = str
  page.appendChild(tmpDiv)
  let dim = {
    w: tmpDiv.childNodes[0].offsetWidth,
    h: tmpDiv.childNodes[0].offsetHeight,
  }
  const element = document.getElementById("Test")
  element.parentNode.removeChild(element)
  return dim
}
