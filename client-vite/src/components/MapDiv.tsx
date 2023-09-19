// @ts-ignore
import katex from "katex/dist/katex.mjs"
import mermaid from "mermaid"
import {FC, Fragment, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {PageState} from "../state/Enums"
import {getColors} from "./Colors"
import {getG, getNodeById, isR, isS, isXR, isXS, getX, getCountNCO1, getNRD0, getNRD1, isNS, isNR,} from "../selectors/MapSelector"
import {adjust, getLatexString} from "../utils/Utils"
import {mSelector} from "../state/EditorState"
import {setEndOfContentEditable} from "./MapDivUtils"
import {nodeApi, useOpenWorkspaceQuery} from "../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"
import {N} from "../state/MapStateTypes"

const getInnerHtml = (n: N) => {
  if (n.contentType === 'text') {
    return n.content
  } else if (n.contentType === 'mermaid') {
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

  useEffect(() => {
    mermaid.run({
      nodes: document.querySelectorAll('.mermaidNode'),
      postRenderCallback: () => {
        dispatch(actions.mapAction({type: 'resetDimensions', payload: null}))
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
                minWidth: n.contentType === 'mermaid' ? 'inherit' : n.selfW + (g.density === 'large'? -10 : -8),
                minHeight: n.contentType === 'mermaid' ? 'inherit' : n.selfH + (g.density === 'large'? -10 : 0),
                paddingLeft: g.density === 'large'? 8 : 8,
                paddingTop: g.density === 'large'? 4 : 2,
                position: 'absolute',
                fontSize: n.textFontSize,
                fontFamily: 'Roboto',
                textDecoration: n.linkType.length ? "underline" : "",
                cursor: n.linkType !== '' ? 'pointer' : 'default',
                color: n.blur ? 'transparent' : (n.textColor === 'default' ? C.TEXT_COLOR : n.textColor),
                transition: 'all 0.3s',
                transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                userSelect: 'none',
                zIndex: n.path.length,
                border: 0,
                margin: 0,
                textShadow: n.blur? '#FFF 0 0 8px' : '',
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
                dispatch(actions.closeContextMenu())
                if (e.button === 0) {
                  if (n.linkType === 'internal') {
                    dispatch(nodeApi.endpoints.selectMap.initiate({mapId: n.link, frameId: ''}))
                  } else if (n.linkType === 'external') {
                    window.open(n.link, '_blank')
                    window.focus()
                  } else {
                    !e.ctrlKey && dispatch(actions.mapAction({type: 'selectNS', payload: {path: n.path}}))
                    e.ctrlKey && dispatch(actions.mapAction({type: 'selectStoo', payload: {path: n.path}}))
                    const abortController = new AbortController()
                    const { signal } = abortController
                    window.addEventListener('mousemove', (e) => {
                      e.preventDefault()
                      !isXR(m) && dispatch(actions.mapAction({type: 'simulateDrag', payload: {n, e}}))
                    }, { signal })
                    window.addEventListener('mouseup', (e) => {
                      abortController.abort()
                      e.preventDefault()
                      !isXR(m) && dispatch(actions.mapAction({type: 'drag', payload: {n, e}}))
                    }, { signal })
                  }
                } else if (e.button === 1) {
                  e.preventDefault()
                } else if (e.button === 2) {
                  if((isNS(m, n) && !n.selected || isNR(m, n) && !getNRD0(m, n).selected && !getNRD1(m, n).selected)) {
                    dispatch(actions.mapAction({type: 'selectNS', payload: {path: n.path}}))
                  }
                  dispatch(actions.openContextMenu({type: 'node', position: {x: e.clientX, y: e.clientY}}))
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                (isXR(m) || isXS(m)) && getX(m).contentType === 'text' && getCountNCO1(m, n) === 0 && dispatch(actions.mapAction({type: 'startEditAppend', payload: null}));
                (isXR(m) || isXS(m)) && getX(m).contentType === 'mermaid' && getCountNCO1(m, n) === 0 && dispatch(actions.setPageState(PageState.WS_EDIT_CONTENT_MERMAID));
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
