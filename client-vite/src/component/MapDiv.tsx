// @ts-ignore
import katex from "katex/dist/katex.mjs"
import {FC, Fragment, useEffect} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {getColors} from "../core/Colors"
import {M, N} from "../types/DefaultProps"
import {m2ml} from "../core/MapUtils"
import {copy, getLatexString} from "../core/Utils"
import {actions} from "../core/EditorFlow";
import {mapReducer, reCalc} from "../core/MapFlow";
import {setEndOfContentEditable} from "./MapDivUtils";
import {useMapDispatch} from "../hooks/UseMapDispatch";

const getInnerHtml = (n: N) => {
  if (n.contentType === 'text') {
    return n.content
  } else if (n.contentType === 'equation') {
    return katex.renderToString(getLatexString(n.content), {throwOnError: false})
  } else if (n.contentType === 'image') {
    let imageLink = 'https://mapboard.io/file/'
    return '<img src="' + imageLink + n.content + '" alt="" id="img">'
  }
}

export const MapDiv: FC = () => {
  const colorMode = 'dark'
  const C = getColors(colorMode)
  const mapListIndex = useSelector((state: RootStateOrAny) => state.editor.mapListIndex)
  const mapList = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const tm = useSelector((state: RootStateOrAny) => state.editor.tempMap)
  const tmExists = tm && Object.keys(tm).length
  const m = tmExists ? tm : mapList[mapListIndex]
  const ml = m2ml(m)
  const editedNodeId = useSelector((state: RootStateOrAny) => state.editor.editedNodeId)
  const lastKeyboardEventData = useSelector((state: RootStateOrAny) => state.editor.lastKeyboardEventData)
  const dispatch = useDispatch()

  useEffect(() => {
    if (editedNodeId.length) {
      const editedDiv = document.getElementById(`${editedNodeId}_div`) as HTMLDivElement
      // editedDiv.focus()
      if (lastKeyboardEventData.key === 'F2') { // TODO: dispatch an editType: 'append' | 'replace'
        // editedDiv.innerHTML = getNodeById(ml, editedNodeId).content
        // TODO
      }
      setEndOfContentEditable(editedDiv)
    }
  }, [editedNodeId])

  return (
    <div
      id='mapDiv'
      style={{
        position: 'absolute',
        display: 'flex',
        // pointerEvents: 'none'
      }}
    >
      <>
        {ml.map((n: N) => (
          <Fragment key={n.nodeId}>
            {
              n.type === 'struct' &&
              !n.hasCell &&
              <div
                id={`${n.nodeId}_div`}
                style = {{
                  left: 1 + n.nodeStartX,
                  top: 1 + n.nodeY - n.selfH / 2,
                  minWidth: (m.g.density === 'large'? 0 : -3) + n.selfW - m.g.padding - 2 + 10, // do we need +10?
                  minHeight: (m.g.density === 'large'? -2 : -1) + n.selfH - m.g.padding,
                  paddingLeft: (m.g.density === 'large'? 0 : 3) + m.g.padding - 2,
                  paddingTop: (m.g.density === 'large'? 0 : 0) + m.g.padding - 2,
                  position: 'absolute',
                  fontSize: n.textFontSize,
                  fontFamily: 'Roboto',
                  textDecoration: n.linkType.length ? "underline" : "",
                  cursor: 'default',
                  color: n.textColor === 'default' ? C.TEXT_COLOR : n.textColor,
                  transition: 'all 0.3s',
                  transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // TODO add a zIndex that is dependent on path length, so a table can be selected
                }}

                spellCheck={false}

                dangerouslySetInnerHTML={
                  n.nodeId === editedNodeId
                    ? undefined
                    : {__html: getInnerHtml(n)}
                }

                contentEditable={n.nodeId === editedNodeId}

                onMouseDown={(e) => {
                  e.preventDefault()
                  useMapDispatch(dispatch, 'selectStruct', { lastOverPath: n.path })
                  // TODO extend this functionality again

                }}

                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    console.log('FINISH EDIT BY ENTER')
                  }
                }}

                onInput={(e) => {
                  const nm = reCalc(m, mapReducer(copy(m), 'typeText', e.currentTarget.innerHTML))
                  dispatch(actions.mutateTempMap(nm))

                }}

                onBlur={(e) => {
                  console.log('FINISH EDIT BY LEAVE')
                }}

              >
              </div>
            }
          </Fragment>
        ))}
      </>
    </div>
  )
}
