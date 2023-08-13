// @ts-ignore
import katex from "katex/dist/katex.mjs"
import mermaid from "mermaid"
import {FC, Fragment, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getColors} from "./Colors"
import {editable, getCountNSO1, getCountNCO1, getG, getNodeById, getRi, getRXD0, getRXD1, isR, isS, isXR, isXS, getCountXRXD0S} from "../core/MapUtils"
import {adjust, getLatexString} from "../core/Utils"
import {mSelector} from "../state/EditorState"
import {setEndOfContentEditable} from "./MapDivUtils"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {N} from "../state/MapStateTypes"

const getInnerHtml = (n: N) => {
  if (n.contentType === 'text' || n.contentType === 'mermaid') {
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
  const zoomInfo = useSelector((state: RootState) => state.editor.zoomInfo)
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    mermaid.run({
      nodes: document.querySelectorAll('.mermaidNode'),
      postRenderCallback: () => {
        dispatch(actions.mapAction({type: 'LOAD', payload: null}))
      }
    })
  }, [m])

  return (
    <>
      {m.map((n: N) => (
        <Fragment key={n.nodeId}>
          {
            (isR(n.path) || isS(n.path)) &&
            <div
              id={n.nodeId}
              ref={ref => ref && ref.focus()}
              className={n.contentType === 'mermaid' ? 'mermaidNode' : ''}
              style={{
                left: adjust(n.nodeStartX),
                top: adjust( n.nodeY - n.selfH / 2),
                minWidth: n.selfW + (g.density === 'large'? -10 : -8),
                minHeight: n.selfH + (g.density === 'large'? -10 : 0),
                paddingLeft: g.density === 'large'? 8 : 8,
                paddingTop: g.density === 'large'? 4 : 2,
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
                // pointerEvents: n.selected && getCountNCO1(m, n) > 0 ? 'none' : 'auto'
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
                dispatch(actions.mapAction({type: 'finishEdit', payload: {path: n.path, content: e.currentTarget.innerHTML}}))
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                dispatch(actions.closeNodeMenu())

                if (e.button === 0) {
                  if (n.linkType === 'internal') {
                    dispatch(api.endpoints.selectMap.initiate({mapId: n.link, frameId: ''}))
                  } else if (n.linkType === 'external') {
                    window.open(n.link, '_blank')
                    window.focus()
                  } else {
                    !e.ctrlKey && dispatch(actions.mapAction({type: 'selectS', payload: {path: n.path}}))
                    e.ctrlKey && dispatch(actions.mapAction({type: 'selectStoo', payload: {path: n.path}}))
                    const abortController = new AbortController()
                    const { signal } = abortController
                    zoomInfo.scale === 1 && window.addEventListener('mousemove', (e) => {
                      e.preventDefault()
                      !isXR(m) && dispatch(actions.mapAction({type: 'simulateDrag', payload: {n, e}}))
                    }, { signal })
                    zoomInfo.scale === 1 && window.addEventListener('mouseup', (e) => {
                      abortController.abort()
                      e.preventDefault()
                      // !isXR(m) && dispatch(actions.mapAction({type: 'drag', payload: {n, e}}))
                    }, { signal })
                  }
                } else if (e.button === 1) {
                  e.preventDefault()
                } else if (e.button === 2) {
                  // if (isR(n.path) && getCountXRXD0S(m) > 0 && !getRXD0(m, getRi(n.path)).selected) {
                  //   dispatch(actions.mapAction({type: 'selectRXD0F', payload: {path: n.path}}))
                  // } else if (isR(n.path) && !!getRXD0(m, getRi(n.path)).selected && !getRXD1(m, getRi(n.path)).selected && getCountNSO1(m, getRXD1(m, getRi(n.path))) > 0) {
                  //   dispatch(actions.mapAction({type: 'selectRXD1F', payload: {path: n.path}}))
                  // } else if (!isR(n.path) && getCountNSO1(m, n) > 0) {
                  //   dispatch(actions.mapAction({type: 'selectF', payload: {path: n.path}}))
                  // } else {
                  //   !e.ctrlKey && dispatch(actions.mapAction({type: 'selectS', payload: {path: n.path}}))
                  // }
                  dispatch(actions.mapAction({type: 'selectS', payload: {path: n.path}}))
                  dispatch(actions.openNodeMenu({x: e.clientX, y: e.clientY}))
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                editable(m) && dispatch(actions.mapAction({type: 'startEditAppend', payload: null}))
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                if(['Insert', 'Tab', 'Enter'].includes(e.key) && !e.shiftKey) {
                  dispatch(actions.mapAction({type: 'finishEdit', payload: {path: n.path, content: e.currentTarget.innerHTML}}))
                }
                if (['Insert','Tab'].includes(e.key)) {
                  isXR(m) && dispatch(actions.mapAction({type: 'insertSOR', payload: null}))
                  isXS(m) && dispatch(actions.mapAction({type: 'insertSO', payload: null}))
                }
              }}
              onInput={(e) => {
                dispatch(actions.mapAction({type: 'typeText', payload: {content:  e.currentTarget.innerHTML}}))
              }}
              onPaste={(e) => {
                e.preventDefault()
                const pasted = e.clipboardData.getData('Text')
                e.currentTarget.innerHTML += pasted
                setEndOfContentEditable(e.currentTarget)
                dispatch(actions.mapAction({type: 'typeText', payload: {content:  e.currentTarget.innerHTML}}))
              }}
            >
            </div>
          }
        </Fragment>
      ))}
    </>
  )
}
