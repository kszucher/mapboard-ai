//@ts-nocheck

import { getLatexString, isChrome } from './Utils'
// @ts-ignore
import katex from 'katex/dist/katex.mjs'
import {getEditedNodeId} from "./EditorFlow"

interface DivData {
  op: string,
  divId: string,
  params: {
    content: string,
    contentType: string,
    styleData: Partial<CSSStyleDeclaration>
  }
}

let mapDivData = [] as DivData[]

const renderContent = (contentType, content) => {
  switch (contentType) {
    case 'text':
      return content
    case 'equation':
      return katex.renderToString(getLatexString(content), {throwOnError: false})
    case 'image':
      let imageLink = 'https://mapboard.io/file/'
      return '<img src="' + imageLink + content + '" alt="" id="img">'
  }
}

export const initDomData = () => {
  mapDivData = []
}

export const flagDomData = () => {
  for (let i = 0; i < mapDivData.length; i++) {
    let currDivData = mapDivData[i]
    currDivData.op = 'delete'
  }
}

export const updateMapDivData = (nodeId: string, contentType, content, path, styleData: Partial<CSSStyleDeclaration>) => {
  const divId = `${nodeId}_div`
  let el = mapDivData.find(el => el.divId === divId)
  let shouldInnerHTMLUpdate = false
  let shouldStyleUpdate = {} as any
  if (el) {
    const isEditing = getEditedNodeId().length
    if (isEditing) {
      shouldInnerHTMLUpdate = el.params.contentType !== contentType
    } else {
      shouldInnerHTMLUpdate = el.params.contentType !== contentType || el.params.content !== content
    }
    for (const style in styleData) {
      shouldStyleUpdate[style] = el.params.styleData[style] !== styleData[style]
    }
  }
  let params = { contentType, content, styleData, shouldInnerHTMLUpdate, shouldStyleUpdate }
  if (el) {
    if (!shouldInnerHTMLUpdate && !shouldStyleUpdate) {
      el.op = 'keep'
    } else {
      el.op = 'update'
      el.params = params
    }
  } else {
    const op = 'create'
    mapDivData.push({ divId, params, op })
  }
}

export const updateDomData = () => {
  for (let i = mapDivData.length - 1; i >=0; i--) {
    const currDivData = mapDivData[i]
    const { op, divId, params } = currDivData
    const { contentType, content, styleData, shouldInnerHTMLUpdate, shouldStyleUpdate } = params
    switch (op) {
      case 'create': {
        const div = document.createElement('div') as HTMLDivElement
        div.id = divId as string
        div.contentEditable = String(false)
        div.spellcheck = false
        div.appendChild(document.createTextNode(''))
        document.getElementById('mapDiv').appendChild(div)
        for (const style in styleData) {
          div.style[style] = styleData[style]
        }
        div.innerHTML = renderContent(contentType, content)
        break
      }
      case 'update': {
        let div = document.getElementById(divId)
        if (div) {
          if (shouldInnerHTMLUpdate) {
            div.innerHTML = renderContent(contentType, content)
          }
          for (const style in styleData) {
            if (shouldStyleUpdate[style]) {
              div.style[style] = styleData[style]
            }
          }
        }
        break
      }
      case 'delete': {
        const currDiv = document.getElementById(divId) as HTMLDivElement
        currDiv.parentNode?.removeChild(currDiv)
        mapDivData.splice(i, 1)
        break
      }
    }
  }
}

export const updateDomDataContentEditableFalse = () => {
  for (let i = 0; i < mapDivData.length; i++) {
    const currDivData = mapDivData[i]
    const holderElement = document.getElementById(currDivData.divId) as HTMLDivElement
    holderElement.contentEditable = 'false'
  }
}
