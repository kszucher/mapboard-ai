// @ts-ignore
import katex from "katex/dist/katex.mjs"
import mermaid from "mermaid"
import {FC, Fragment, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getColors} from "../assets/Colors"
import {getG, getNodeById, isR, isS, isXR, isXS, getX, getCountTCO1, getTRD0, getTRD1, isTS, isTR, mT} from "../../selectors/MapSelector"
import {adjust, getLatexString} from "../../utils/Utils"
import {mSelector} from "../../state/EditorState"
import {setEndOfContentEditable} from "./MapDivUtils"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {T} from "../../state/MapStateTypes"

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
        dispatch(actions.mapAction({type: 'clearDimensions', payload: null}))
      }
    })
  }, [m])

  return (
    <>
      {mT(m).map(ti => (
        <Fragment key={ti.nodeId}>
          {
            (isR(ti.path) || isS(ti.path)) &&
            <div
              id={ti.nodeId}
              ref={ref => ref && ref.focus()}
              className={ti.contentType === 'mermaid' ? 'mermaidNode' : ''}
              style={{
                left: adjust(ti.nodeStartX),
                top: adjust( ti.nodeY - ti.selfH / 2),
                minWidth: ti.contentType === 'mermaid' ? 'inherit' : ti.selfW + (g.density === 'large'? -10 : -8),
                minHeight: ti.contentType === 'mermaid' ? 'inherit' : ti.selfH + (g.density === 'large'? -10 : 0),
                paddingLeft: g.density === 'large'? 8 : 8,
                paddingTop: g.density === 'large'? 4 : 2,
                position: 'absolute',
                fontSize: ti.textFontSize,
                fontFamily: 'Roboto',
                textDecoration: ti.linkType.length ? "underline" : "",
                cursor: ti.linkType !== '' ? 'pointer' : 'default',
                color: ti.blur ? 'transparent' : (ti.textColor === 'default' ? C.TEXT_COLOR : ti.textColor),
                transition: 'all 0.3s',
                transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                userSelect: 'none',
                zIndex: ti.path.length,
                border: 0,
                margin: 0,
                textShadow: ti.blur? '#FFF 0 0 8px' : '',
                // pointerEvents: ti.selected && getCountNCO1(m, ti) > 0 ? 'none' : 'auto'
              }}
              spellCheck={false}
              dangerouslySetInnerHTML={ti.nodeId === editedNodeId ? undefined : { __html: getInnerHtml(ti) }}
              contentEditable={ti.nodeId === editedNodeId}
              onFocus={(e) => {
                if (editType === 'append') {
                  e.currentTarget.innerHTML = getNodeById(m, editedNodeId).content
                }
                setEndOfContentEditable(e.currentTarget)
              }}
              onBlur={() => {
                dispatch(actions.mapAction({type: 'removeMapListEntriesOfEdit', payload: null}))
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                dispatch(actions.closeContextMenu())
                let didMove = false
                if (e.button === 0) {
                  if (ti.linkType === 'internal') {
                    dispatch(nodeApi.endpoints.selectMap.initiate({mapId: ti.link, frameId: ''}))
                  } else if (ti.linkType === 'external') {
                    window.open(ti.link, '_blank')
                    window.focus()
                  } else {
                    !e.ctrlKey && dispatch(actions.mapAction({type: 'selectT', payload: {path: ti.path}}))
                    e.ctrlKey && dispatch(actions.mapAction({type: 'selectTtoo', payload: {path: ti.path}}))
                    const abortController = new AbortController()
                    const { signal } = abortController
                    window.addEventListener('mousemove', (e) => {
                      e.preventDefault()
                      didMove = true
                      !isXR(m) && dispatch(actions.mapAction({type: 'moveByDragPreview', payload: {t: ti, e}}))
                    }, { signal })
                    window.addEventListener('mouseup', (e) => {
                      abortController.abort()
                      e.preventDefault()
                      if (didMove) {
                        !isXR(m) && dispatch(actions.mapAction({type: 'moveByDrag', payload: {t: ti, e}}))
                      }
                    }, { signal })
                  }
                } else if (e.button === 1) {
                  e.preventDefault()
                } else if (e.button === 2) {
                  if((isTS(ti) && !ti.selected || isTR(ti) && !getTRD0(m, ti).selected && !getTRD1(m, ti).selected)) {
                    dispatch(actions.mapAction({type: 'selectT', payload: {path: ti.path}}))
                  }
                  dispatch(actions.openContextMenu({type: 'node', position: {x: e.clientX, y: e.clientY}}))
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                if ((isXR(m) || isXS(m)) && getX(m).contentType === 'text' && getCountTCO1(m, ti) === 0) {
                  dispatch(actions.mapAction({type: 'startEditAppend', payload: null}))
                }
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                if(['Insert', 'Tab', 'Enter'].includes(e.key) && !e.shiftKey) {
                  dispatch(actions.mapAction({type: 'removeMapListEntriesOfEdit', payload: null}))
                }
                if (['Insert','Tab'].includes(e.key)) {
                  isXR(m) && dispatch(actions.mapAction({type: 'insertSOR', payload: null}))
                  isXS(m) && dispatch(actions.mapAction({type: 'insertSO', payload: null}))
                }
              }}
              onInput={(e) => {
                dispatch(actions.mapAction({type: 'setContentText', payload: {content: e.currentTarget.innerHTML}}))
              }}
              onPaste={(e) => {
                e.preventDefault()
                const pasted = e.clipboardData.getData('Text')
                e.currentTarget.innerHTML += pasted
                setEndOfContentEditable(e.currentTarget)
                dispatch(actions.mapAction({type: 'setContentText', payload: {content: e.currentTarget.innerHTML}}))
              }}
            >
            </div>
          }
        </Fragment>
      ))}
    </>
  )
}
