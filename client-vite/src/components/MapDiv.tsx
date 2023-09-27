// @ts-ignore
import katex from "katex/dist/katex.mjs"
import mermaid from "mermaid"
import {FC, Fragment, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {PageState} from "../state/Enums"
import {getColors} from "./Colors"
import {getG, getNodeById, isR, isS, isXR, isXS, getX, getCountTCO1, getTRD0, getTRD1, isTS, isTR, mT} from "../selectors/MapSelector"
import {adjust, getLatexString} from "../utils/Utils"
import {mSelector} from "../state/EditorState"
import {setEndOfContentEditable} from "./MapDivUtils"
import {nodeApi, useOpenWorkspaceQuery} from "../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"
import {T} from "../state/MapStateTypes"

const getInnerHtml = (t: T) => {
  if (t.contentType === 'text') {
    return t.content
  } else if (t.contentType === 'mermaid') {
    return t.content
  } else if (t.contentType === 'equation') {
    return katex.renderToString(getLatexString(t.content), {throwOnError: false})
  } else if (t.contentType === 'image') {
    let imageLink = 'https://mapboard.io/file/'
    return '<img src="' + imageLink + t.content + '" alt="" id="img">'
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
      {mT(m).map((t: T) => (
        <Fragment key={t.nodeId}>
          {
            (isR(t.path) || isS(t.path)) &&
            <div
              id={t.nodeId}
              ref={ref => ref && ref.focus()}
              className={t.contentType === 'mermaid' ? 'mermaidNode' : ''}
              style={{
                left: adjust(t.nodeStartX),
                top: adjust( t.nodeY - t.selfH / 2),
                minWidth: t.contentType === 'mermaid' ? 'inherit' : t.selfW + (g.density === 'large'? -10 : -8),
                minHeight: t.contentType === 'mermaid' ? 'inherit' : t.selfH + (g.density === 'large'? -10 : 0),
                paddingLeft: g.density === 'large'? 8 : 8,
                paddingTop: g.density === 'large'? 4 : 2,
                position: 'absolute',
                fontSize: t.textFontSize,
                fontFamily: 'Roboto',
                textDecoration: t.linkType.length ? "underline" : "",
                cursor: t.linkType !== '' ? 'pointer' : 'default',
                color: t.blur ? 'transparent' : (t.textColor === 'default' ? C.TEXT_COLOR : t.textColor),
                transition: 'all 0.3s',
                transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                userSelect: 'none',
                zIndex: t.path.length,
                border: 0,
                margin: 0,
                textShadow: t.blur? '#FFF 0 0 8px' : '',
                // pointerEvents: t.selected && getCountNCO1(m, t) > 0 ? 'none' : 'auto'
              }}
              spellCheck={false}
              dangerouslySetInnerHTML={t.nodeId === editedNodeId ? undefined : { __html: getInnerHtml(t) }}
              contentEditable={t.nodeId === editedNodeId}
              onFocus={(e) => {
                if (editType === 'append') {
                  e.currentTarget.innerHTML = getNodeById(m, editedNodeId).content
                }
                setEndOfContentEditable(e.currentTarget)
              }}
              onBlur={(e) => {
                dispatch(actions.mapAction({type: 'finishEdit', payload: {path: t.path, content: e.currentTarget.innerHTML}}))
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                dispatch(actions.closeContextMenu())
                if (e.button === 0) {
                  if (t.linkType === 'internal') {
                    dispatch(nodeApi.endpoints.selectMap.initiate({mapId: t.link, frameId: ''}))
                  } else if (t.linkType === 'external') {
                    window.open(t.link, '_blank')
                    window.focus()
                  } else {
                    !e.ctrlKey && dispatch(actions.mapAction({type: 'selectNS', payload: {path: t.path}}))
                    e.ctrlKey && dispatch(actions.mapAction({type: 'selectStoo', payload: {path: t.path}}))
                    const abortController = new AbortController()
                    const { signal } = abortController
                    window.addEventListener('mousemove', (e) => {
                      e.preventDefault()
                      !isXR(m) && dispatch(actions.mapAction({type: 'simulateDrag', payload: {t, e}}))
                    }, { signal })
                    window.addEventListener('mouseup', (e) => {
                      abortController.abort()
                      e.preventDefault()
                      !isXR(m) && dispatch(actions.mapAction({type: 'drag', payload: {t, e}}))
                    }, { signal })
                  }
                } else if (e.button === 1) {
                  e.preventDefault()
                } else if (e.button === 2) {
                  if((isTS(t) && !t.selected || isTR(t) && !getTRD0(m, t).selected && !getTRD1(m, t).selected)) {
                    dispatch(actions.mapAction({type: 'selectNS', payload: {path: t.path}}))
                  }
                  dispatch(actions.openContextMenu({type: 'node', position: {x: e.clientX, y: e.clientY}}))
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                (isXR(m) || isXS(m)) && getX(m).contentType === 'text' && getCountTCO1(m, t) === 0 && dispatch(actions.mapAction({type: 'startEditAppend', payload: null}));
                (isXR(m) || isXS(m)) && getX(m).contentType === 'mermaid' && getCountTCO1(m, t) === 0 && dispatch(actions.setPageState(PageState.WS_EDIT_CONTENT_MERMAID));
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                if(['Insert', 'Tab', 'Enter'].includes(e.key) && !e.shiftKey) {
                  dispatch(actions.mapAction({type: 'finishEdit', payload: {path: t.path, content: e.currentTarget.innerHTML}}))
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
