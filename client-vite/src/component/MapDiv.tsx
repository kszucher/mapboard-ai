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
  const mapIndexList = useSelector((state: RootStateOrAny) => state.editor.mapIndexList)
  const mapList = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const tm = useSelector((state: RootStateOrAny) => state.editor.tempMap)
  const tmExists = tm && Object.keys(tm).length
  const m = tmExists ? tm : mapList[mapIndexList]
  const ml = m2ml(m)
  const editedNodeId = useSelector((state: RootStateOrAny) => state.editor.editedNodeId)
  const lastKeyboardEventData = useSelector((state: RootStateOrAny) => state.editor.lastKeyboardEventData)
  const dispatch = useDispatch()

  useEffect(() => {
    if (editedNodeId.length) {
      const editedDiv = document.getElementById(`${editedNodeId}_div`) as HTMLDivElement
      if (lastKeyboardEventData.key !== 'F2') { // TODO also make a case for doubleclick
        editedDiv.innerHTML = ''
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
        pointerEvents: 'none'
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
                  textOverflow: 'ellipsis'
                }}
                spellCheck={false}
                dangerouslySetInnerHTML={
                  n.nodeId === editedNodeId
                    ? undefined
                    : {__html: getInnerHtml(n)}
                }
                contentEditable={n.nodeId === editedNodeId}
                onInput={(e) => {
                  const nm = reCalc(m, mapReducer(copy(m), 'typeText', e.currentTarget.innerHTML))
                  dispatch(actions.mutateTempMap(nm))
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
