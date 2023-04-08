// @ts-ignore
import katex from "katex/dist/katex.mjs"
import {FC, Fragment} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {getColors} from "../core/Colors"
import {getNodeById, pathSorter} from "../map/MapUtils"
import {adjust, getLatexString} from "../core/Utils"
import {getCoords, setEndOfContentEditable} from "./MapDivUtils"
import {mapFindNearest} from "../map/MapFindNearest"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {actions} from "../editor/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {N} from "../state/NPropsTypes"

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
  const editedNodeId = useSelector((state: RootStateOrAny) => state.editor.editedNodeId)
  const editType = useSelector((state: RootStateOrAny) => state.editor.editType)
  const m = tm && Object.keys(tm).length ? tm : mapList[mapListIndex]
  const g = m.filter((n: N) => n.path.length === 1).at(0)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch()
  return (
    <div style={{position: 'absolute', display: 'flex'}}>
      {m.map((n: N) => (
        <Fragment key={n.nodeId}>
          {
            n.contentType && n.path.length !== 4 &&
            // isS(n.path) && !n.cRowCount && !n.cColCount &&
            <div
              id={'node'}
              ref={ref => ref && ref.focus()}
              style = {{
                left: 1 + adjust(n.nodeStartX),
                top: 1 + adjust( n.nodeY - n.selfH / 2),
                minWidth: (g.density === 'large'? 0 : -3) + n.selfW - g.padding - 2,
                minHeight: (g.density === 'large'? -2 : -1) + n.selfH - g.padding,
                paddingLeft: (g.density === 'large'? 0 : 3) + g.padding - 2,
                paddingTop: (g.density === 'large'? 0 : 0) + g.padding - 2,
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
                  e.currentTarget.innerHTML = getNodeById(m, editedNodeId).content
                }
                setEndOfContentEditable(e.currentTarget)
              }}
              onBlur={(e) => {
                dispatch(actions.mapAction({type: 'finishEdit', payload: { nodeId: n.nodeId, content: e.currentTarget.innerHTML }}))
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                if (e.button === 0) {
                  if (n.linkType === 'internal') {
                    dispatch(api.endpoints.selectMap.initiate({mapId: n.link, frameId: ''}))
                  } else if (n.linkType === 'external') {
                    window.open(n.link, '_blank')
                    window.focus()
                  } else {
                    const add = + (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey)
                    dispatch(actions.mapAction({type: 'select_S', payload: { add, path: n.path, selection: 's' }}))
                    const abortController = new AbortController()
                    const { signal } = abortController
                    window.addEventListener('mousemove', (e) => {
                      e.preventDefault()
                      const toCoords = getCoords(e)
                      const { moveCoords } = mapFindNearest(structuredClone(m).sort(pathSorter), n, toCoords.x, toCoords.y)
                      dispatch(actions.setFromCoordsMove(moveCoords))
                    }, { signal })
                    window.addEventListener('mouseup', (e) => {
                      e.preventDefault()
                      abortController.abort()
                      const toCoords = getCoords(e)
                      const { moveTargetPath, moveTargetIndex } = mapFindNearest(structuredClone(m).sort(pathSorter), n, toCoords.x, toCoords.y)
                      if (moveTargetPath.length) {
                        dispatch(actions.mapAction({type: 'move_dragged', payload: { moveTargetPath, moveTargetIndex }}))
                      }
                      dispatch(actions.setFromCoordsMove([]))
                    }, { signal })
                  }
                } else if (e.button === 1) {
                  e.preventDefault()
                } else if (e.button === 2) {
                  const add = + (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey)
                  dispatch(actions.mapAction({type: 'select_S', payload: { add, path: n.path, selection: 'f' }}))
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
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
