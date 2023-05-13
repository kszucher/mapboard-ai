// @ts-ignore
import katex from "katex/dist/katex.mjs"
import {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getColors} from "../core/Colors"
import {mapActionResolver} from "../map/MapActionResolver";
import {getG, getNodeById, isR, isS} from "../map/MapUtils"
import {adjust, getLatexString} from "../core/Utils"
import {mSelector} from "../state/EditorState";
import {setEndOfContentEditable} from "./MapDivUtils"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {actions, AppDispatch, RootState} from "../editor/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {N} from "../state/MapPropTypes";

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
                zIndex: n.path.length
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
                dispatch(actions.mapAction({type: 'finishEdit', payload: { path: n.path, content: e.currentTarget.innerHTML }}))
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
                    dispatch(actions.mapAction({type: 'selectS', payload: { add, path: n.path, selection: 's' }}))
                    const abortController = new AbortController()
                    const { signal } = abortController
                    window.addEventListener('mousemove', (e) => {
                      e.preventDefault()
                      dispatch(actions.mapAction(mapActionResolver(e, 'dmm', {n, e})))
                    }, { signal })
                    window.addEventListener('mouseup', (e) => {
                      abortController.abort()
                      e.preventDefault()
                      dispatch(actions.mapAction(mapActionResolver(e, 'dmu', {n, e})))
                    }, { signal })
                  }
                } else if (e.button === 1) {
                  e.preventDefault()
                } else if (e.button === 2) {
                  const add = e.ctrlKey
                  dispatch(actions.mapAction({type: 'selectS', payload: { add, path: n.path, selection: 'f' }}))
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                dispatch(actions.mapAction(mapActionResolver(e, 'dmdc', {})))
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter' && !e.shiftKey) {
                  dispatch(actions.mapAction({type: 'finishEdit', payload: { path: n.path, content: e.currentTarget.innerHTML }}))
                } else if (['Insert','Tab'].includes(e.key)) {
                  dispatch(actions.mapAction({type: 'finishEdit', payload: { path: n.path, content: e.currentTarget.innerHTML }}))
                  dispatch(actions.mapAction({type: 'insertSO', payload: {}}))
                }
              }}
              onInput={(e) =>
                dispatch(actions.mapAction({type: 'typeText', payload: { content:  e.currentTarget.innerHTML }}))
              }
              onPaste={(e) => {
                e.preventDefault()
                const pasted = e.clipboardData.getData('Text')
                e.currentTarget.innerHTML += pasted
                setEndOfContentEditable(e.currentTarget)
                dispatch(actions.mapAction({type: 'typeText', payload: { content:  e.currentTarget.innerHTML }}))
              }}
            >
            </div>
          }
        </Fragment>
      ))}
    </div>
  )
}
