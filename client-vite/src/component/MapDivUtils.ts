// @ts-ignore
import katex from "katex/dist/katex.mjs"
import {getLatexString} from "../core/Utils"

const easeOut = (t: any, b: number, c: number, d: number) => {
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
}

export const scrollTo = (to: number, duration: number) => {
  const element = document.getElementById('mainMapDiv') as HTMLDivElement
  const start = element.scrollLeft
  const change = to - start
  const startDate = +new Date()
  const animateScroll = function () {
    const currentDate = +new Date()
    const currentTime = currentDate - startDate
    element.scrollLeft = parseInt(String(easeOut(currentTime, start, change, duration)))
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll)
    } else {
      element.scrollLeft = to
    }
  }
  animateScroll()
}

export const getCoords = (e: any) => {
  const winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  const winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  const mainMapDiv = document.getElementById('mainMapDiv') as HTMLDivElement
  return {
    x:  e.pageX - winWidth + mainMapDiv.scrollLeft,
    y: e.pageY - winHeight + mainMapDiv.scrollTop
  }
}

export const setEndOfContentEditable = (contentEditableElement: HTMLElement) => {
  // https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
  let range, selection
  range = document.createRange()//Create a range (a range is a like the selection but invisible)
  range.selectNodeContents(contentEditableElement)//Select the entire contents of the element with the range
  range.collapse(false)//collapse the range to the end point. false means collapse to end rather than the start
  selection = window.getSelection()//get the selection object (allows you to change selection)
  selection?.removeAllRanges()//remove any selections already made
  selection?.addRange(range)//make the range you have just created the visible selection
}

export const getTextDim = (innerHTML: string, fontSize: number) => {
  const tmpDiv = document.createElement('div')
  tmpDiv.id = "Test"
  tmpDiv.innerHTML = innerHTML
  window.document.body.appendChild(tmpDiv)
  const test = document.getElementById("Test") as HTMLDivElement
  test.style.fontFamily = 'Roboto'
  test.style.fontSize = fontSize + 'px'
  const width = test.clientWidth ? test.clientWidth : 14
  const height = test.clientHeight
  const element = document.getElementById("Test")
  element?.parentNode?.removeChild(element)
  return [width, height]
}

export const getEquationDim = (content: string) => {
  const str = katex.renderToString(getLatexString(content), {throwOnError: false})
  const tmpDiv = document.createElement('div') as HTMLDivElement
  tmpDiv.id = "Test"
  tmpDiv.style.fontFamily = 'Roboto'
  tmpDiv.style.fontSize = 14 + 'px'
  tmpDiv.innerHTML = str
  window.document.body.appendChild(tmpDiv)
  const firstChildNode = tmpDiv.childNodes[0] as HTMLDivElement
  let dim = [
    firstChildNode.offsetWidth,
    firstChildNode.offsetHeight
  ]
  const element = document.getElementById("Test")
  element?.parentNode?.removeChild(element)
  return dim
}
