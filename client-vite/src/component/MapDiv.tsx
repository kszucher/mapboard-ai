// @ts-ignore
import katex from "katex/dist/katex.mjs"
import {FC, Fragment} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {getColors} from "../core/Colors"
import {N} from "../types/DefaultProps"
import {getNodeById, m2ml} from "../core/MapUtils"
import {getLatexString} from "../core/Utils"
import {actions, defaultUseOpenWorkspaceQueryState} from "../core/EditorFlow";
import {setEndOfContentEditable} from "./MapDivUtils";
import {api, useOpenWorkspaceQuery} from "../core/Api";

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
  const mapListIndex = useSelector((state: RootStateOrAny) => state.editor.mapListIndex)
  const mapList = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const tm = useSelector((state: RootStateOrAny) => state.editor.tempMap)
  const tmExists = tm && Object.keys(tm).length
  const m = tmExists ? tm : mapList[mapListIndex]
  const ml = m2ml(m)
  const editedNodeId = useSelector((state: RootStateOrAny) => state.editor.editedNodeId)
  const editType = useSelector((state: RootStateOrAny) => state.editor.editType)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch()
  return (
    <div id='mapDiv' style={{position: 'absolute', display: 'flex'}}>
      {ml.map((n: N) => (
        <Fragment key={n.nodeId}>
          {
            n.type === 'struct' &&
            !n.hasCell &&
            <div
              id={'node'}
              ref={ref => ref && ref.focus()}
              style = {{
                left: 1 + n.nodeStartX,
                top: 1 + n.nodeY - n.selfH / 2,
                minWidth: (m.g.density === 'large'? 0 : -3) + n.selfW - m.g.padding - 2,
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
              onFocus={(e) => {
                if (editType === 'append') {
                  e.currentTarget.innerHTML = getNodeById(ml, editedNodeId).content
                }
                setEndOfContentEditable(e.currentTarget)
              }}
              onBlur={(e) => {
                dispatch(actions.mapAction({type: 'finishEdit', payload: { nodeId: n.nodeId, content: e.currentTarget.innerHTML }}))
              }}
              onDoubleClick={(e) => {
                dispatch(actions.mapAction({type: 'startEditAppend', payload: {}}))
              }}
              onMouseDown={(e) => {
                if (e.button === 0) {
                  if (n.linkType === 'internal') {
                    dispatch(api.endpoints.selectMap.initiate({mapId: n.link, frameId: ''}))
                  } else if (n.linkType === 'external') {
                    window.open(n.link, '_blank')
                    window.focus()
                  } else {
                    dispatch(actions.mapAction({
                        type: (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey)
                          ? 'selectStruct'
                          : 'selectStructToo',
                        payload: {lastOverPath: n.path} // TODO use id instead of path
                      }
                    ))
                  }
                } else if (e.button === 2) {
                  dispatch(actions.mapAction({
                      type: (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey)
                        ? 'selectStructFamily'
                        : 'selectStructToo',
                      payload: {lastOverPath: n.path} // TODO use id instead of path
                    }
                  ))
                }
              }}
              onMouseMove={(e) => {
                e.preventDefault()
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter' && !e.shiftKey) {
                  dispatch(actions.mapAction({type: 'finishEdit', payload: { nodeId: n.nodeId, content: e.currentTarget.innerHTML }}))
                }
                // TODO: call a generic action that inserts, then a starEditAppend
                // (finish will be automatic so not needed in the beginning)
              }}
              onInput={(e) =>
                dispatch(actions.mapAction({type: 'typeText', payload: e.currentTarget.innerHTML}))
              }
              onPaste={(e) => {
                e.preventDefault()
                const pasted = e.clipboardData.getData('Text')
                e.currentTarget.innerHTML += pasted
                setEndOfContentEditable(e.currentTarget)
                dispatch(actions.mapAction({type: 'typeText', payload: e.currentTarget.innerHTML}))
              }}
            >
            </div>
          }
        </Fragment>
      ))}
    </div>
  )
}
