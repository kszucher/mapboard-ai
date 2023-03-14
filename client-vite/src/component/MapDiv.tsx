// @ts-ignore
import katex from "katex/dist/katex.mjs"
import {FC, Fragment, useEffect, useRef} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {getColors} from "../core/Colors"
import {M, N} from "../types/DefaultProps"
import {getNodeById, m2ml} from "../core/MapUtils"
import {copy, getLatexString} from "../core/Utils"
import {actions} from "../core/EditorFlow";
import {useMapDispatch} from "../hooks/UseMapDispatch";
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
  const mapListIndex = useSelector((state: RootStateOrAny) => state.editor.mapListIndex)
  const mapList = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const tm = useSelector((state: RootStateOrAny) => state.editor.tempMap)
  const tmExists = tm && Object.keys(tm).length
  const m = tmExists ? tm : mapList[mapListIndex]
  const ml = m2ml(m)
  const editedNodeId = useSelector((state: RootStateOrAny) => state.editor.editedNodeId)
  const editType = useSelector((state: RootStateOrAny) => state.editor.editType)

  const dispatch = useDispatch()

  // const nodesRef = useRef(null) as any
  // const getNodeRef = () => {
  //   if (!nodesRef.current) {
  //     nodesRef.current = new Map()
  //   }
  //   return nodesRef.current
  // }

  useEffect(() => {
    if (editedNodeId.length) {

      console.log('should start edit...')

      const editedDiv = document.getElementById(`${editedNodeId}_div`) as HTMLDivElement
      // editedDiv.focus()
      if (editType === 'append') {
        editedDiv.innerHTML = getNodeById(ml, editedNodeId).content
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
                // ref={(el) => {
                //   const nodeRef = getNodeRef()
                //   if (el) {
                //     nodeRef.set(n.nodeId, el)
                //   } else {
                //     nodeRef.delete(n.nodeId)
                //   }
                // }}
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
                  userSelect: 'none',
                  // TODO add a zIndex that is dependent on path length, so a table can be selected
                }}
                spellCheck={false}
                dangerouslySetInnerHTML={n.nodeId === editedNodeId ? undefined : { __html: getInnerHtml(n) }}
                contentEditable={n.nodeId === editedNodeId}
                onBlur={(e) => {
                  console.log('FINISH EDIT BY LEAVE', e.currentTarget.innerHTML)
                  dispatch(actions.finishEdit({ nodeId: n.nodeId, content: e.currentTarget.innerHTML }))
                }}
                onDoubleClick={(e) => {
                  dispatch(actions.startEditAppend())
                }}
                onMouseDown={(e) => {
                  dispatch(actions.genericMapAction({type: 'selectStruct', payload: { lastOverPath: n.path }})) // TODO use id instead of path
                  // TODO extend this functionality again
                }}
                onMouseMove={(e) => {
                  e.preventDefault()
                }}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter' && !e.shiftKey) {
                    console.log('FINISH EDIT BY ENTER')
                    dispatch(actions.finishEdit({ nodeId: n.nodeId, content: e.currentTarget.innerHTML }))
                  }
                  // TODO: call a generic action that inserts, then a starEditAppend
                  // (finish will be automatic so not needed in the beginning)
                }}
                onInput={(e) => {
                  dispatch(actions.typeText(e.currentTarget.innerHTML))
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

// TODO add doubleclick and finish up with all the things... !!!!
// TODO do insert SOU stuff
// TODO do move/selection stuff so useMD can be replaced
// reintroduce column: isGeneric: 1/0 and based on that we either call an action, or a genericMapAction
