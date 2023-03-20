// @ts-ignore
import katex from "katex/dist/katex.mjs"
import {FC, Fragment} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {getColors} from "../core/Colors"
import {getNodeById} from "../core/MapUtils"
import {getLatexString} from "../core/Utils"
import {actions} from "../core/EditorReducer"
import {getCoords, setEndOfContentEditable} from "./MapDivUtils"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {mapFindNearest} from "../map/MapFindNearest"
import {mapAssembly} from "../map/MapAssembly"
import {M} from "../state/MTypes"
import {N} from "../state/NPropsTypes"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState";

const getInnerHtml = (n: N) => {
  if (n.contentType === 'text') {
    // return (n.nodeId + '</br>' + n.parentNodeId)
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
  const editedNodeId = useSelector((state: RootStateOrAny) => state.editor.editedNodeId)
  const editType = useSelector((state: RootStateOrAny) => state.editor.editType)
  const ml = tm && Object.keys(tm).length ? tm : mapList[mapListIndex]
  const m = mapAssembly(ml) as M
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch()
  return (
    <div style={{position: 'absolute', display: 'flex'}}>
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
                      })
                    )
                    const abortController = new AbortController()
                    const { signal } = abortController
                    window.addEventListener('mousemove', (e) => {
                      e.preventDefault()
                      const toCoords = getCoords(e)
                      const { moveCoords } = mapFindNearest.find(m as M, n.path, toCoords.x, toCoords.y)
                      dispatch(actions.setFromCoordsMove(moveCoords))
                    }, { signal })
                    window.addEventListener('mouseup', (e) => {
                      e.preventDefault()
                      abortController.abort()
                      const toCoords = getCoords(e)
                      const { moveTargetPath, moveTargetIndex } = mapFindNearest.find(m, n.path, toCoords.x, toCoords.y)
                      if (moveTargetPath.length) {
                        dispatch(actions.mapAction({type: 'move_dragged', payload: { moveTargetPath, moveTargetIndex }}))
                      }
                      dispatch(actions.setFromCoordsMove([]))
                    }, { signal })
                  }
                } else if (e.button === 2) {
                  dispatch(actions.mapAction({
                      type: (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey)
                        ? 'selectStructFamily'
                        : 'selectStructToo',
                      payload: {lastOverPath: n.path} // TODO use id instead of path
                    })
                  )
                }
              }}
              onDoubleClick={(e) => {
                dispatch(actions.mapAction({type: 'startEditAppend', payload: {}}))
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter' && !e.shiftKey) {
                  dispatch(actions.mapAction({type: 'finishEdit', payload: { nodeId: n.nodeId, content: e.currentTarget.innerHTML }}))
                } else if (['Insert','Tab'].includes(e.key)) {
                  dispatch(actions.mapAction({type: 'finishEdit', payload: { nodeId: n.nodeId, content: e.currentTarget.innerHTML }}))
                  dispatch(actions.mapAction({type: 'insert_S_O', payload: {}}))
                }
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
