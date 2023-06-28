// @ts-ignore
import katex from "katex/dist/katex.mjs"
import {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getColors} from "./Colors"
import {mapActionResolver} from "../core/MapActionResolver"
import {getCountSC, getG, getNodeById, isR, isS} from "../core/MapUtils"
import {adjust, getLatexString} from "../core/Utils"
import {mSelector} from "../state/EditorState"
import {setEndOfContentEditable} from "./MapDivUtils"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {N} from "../state/MapPropTypes"

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
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const editType = useSelector((state: RootState) => state.editor.editType)
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div style={{position: 'absolute', display: 'flex'}}>
      {m.map((n: N) => (
        <Fragment key={n.nodeId}>
          {
            (isR(n.path) || isS(n.path)) &&
            <div
              id={'node'}
              ref={ref => ref && ref.focus()}
              style={{
                left: adjust(n.nodeStartX),
                top: adjust( n.nodeY - n.selfH / 2),
                minWidth: (g.density === 'large'? -10 : -8) + n.selfW,
                minHeight: (g.density === 'large'? -10 : 0) + n.selfH,
                paddingLeft: (g.density === 'large'? 8 : 8),
                paddingTop: (g.density === 'large'? 4 : 2),
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
                zIndex: n.path.length,
                border: 0,
                margin: 0,
                pointerEvents: n.selected && getCountSC(m, n.path) > 0 ? 'none' : 'auto'
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
                dispatch(actions.mapAction(mapActionResolver(m, e, 'de', 'finishEdit', { path: n.path, content: e.currentTarget.innerHTML })))
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
                    const add = e.ctrlKey
                    dispatch(actions.mapAction(mapActionResolver(m, e, 'de', 'select', { add, path: n.path })))
                    const abortController = new AbortController()
                    const { signal } = abortController
                    window.addEventListener('mousemove', (e) => {
                      e.preventDefault()
                      dispatch(actions.mapAction(mapActionResolver(m, e, 'de', 'simulateDrag', {n, e})))
                    }, { signal })
                    window.addEventListener('mouseup', (e) => {
                      abortController.abort()
                      e.preventDefault()
                      dispatch(actions.mapAction(mapActionResolver(m, e, 'de', 'drag', {n, e})))
                    }, { signal })
                  }
                } else if (e.button === 1) {
                  e.preventDefault()
                } else if (e.button === 2) {
                  const add = e.ctrlKey
                  dispatch(actions.mapAction(mapActionResolver(m, e, 'de', 'selectF', { add, path: n.path })))
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                dispatch(actions.mapAction(mapActionResolver(m, e, 'de', 'startEditAppend', null)))
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter' && !e.shiftKey) {
                  dispatch(actions.mapAction(mapActionResolver(m, e, 'de', 'finishEdit', { path: n.path, content: e.currentTarget.innerHTML })))
                } else if (['Insert','Tab'].includes(e.key)) {
                  dispatch(actions.mapAction(mapActionResolver(m, e, 'de', 'finishEdit', { path: n.path, content: e.currentTarget.innerHTML })))
                  dispatch(actions.mapAction(mapActionResolver(m, e, 'de', 'insert', null)))
                }
              }}
              onInput={(e) => {
                dispatch(actions.mapAction(mapActionResolver(m, e, 'de', 'typeText', { content:  e.currentTarget.innerHTML })))
              }}
              onPaste={(e) => {
                e.preventDefault()
                const pasted = e.clipboardData.getData('Text')
                e.currentTarget.innerHTML += pasted
                setEndOfContentEditable(e.currentTarget)
                dispatch(actions.mapAction(mapActionResolver(m, e, 'de', 'typeText', { content:  e.currentTarget.innerHTML })))
              }}
            >
            </div>
          }
        </Fragment>
      ))}
    </div>
  )
}
