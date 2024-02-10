// @ts-ignore
import katex from "katex/dist/katex.mjs"
import mermaid from "mermaid"
import {FC, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../../api/Api.ts"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getG, getNodeById, getX, getXA, isXS, mTS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {LeftMouseMode} from "../../state/Enums.ts"
import {T} from "../../state/MapStateTypes"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {adjust, getLatexString} from "../../utils/Utils"
import {getColors} from "../assets/Colors"
import {setEndOfContentEditable} from "./MapDivUtils"

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
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const editType = useSelector((state: RootState) => state.editor.editType)
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))

  useEffect(() => {
    mermaid.run({
      nodes: document.querySelectorAll('.mermaidNode'),
      postRenderCallback: () => {
        md(MR.clearDimensions)
      }
    })
  }, [m])

  return (
    mTS(m).map(ti => (
      <div
        key={ti.nodeId}
        id={ti.nodeId}
        ref={ref => ref && ref.focus()}
        className={ti.contentType === 'mermaid' ? 'mermaidNode' : ''}
        style={{
          left: adjust(ti.nodeStartX),
          top: adjust( ti.nodeStartY),
          minWidth: ti.contentType === 'mermaid' ? 'inherit' : ti.selfW + (g.density === 'large'? -10 : -8),
          minHeight: ti.contentType === 'mermaid' ? 'inherit' : ti.selfH + (g.density === 'large'? -10 : 0),
          paddingLeft: g.density === 'large'? 8 : 8,
          paddingTop: g.density === 'large'? 4 : 2,
          position: 'absolute',
          fontSize: ti.textFontSize,
          fontFamily: 'Roboto',
          textDecoration: ti.linkType.length ? "underline" : "",
          cursor: leftMouseMode === LeftMouseMode.NONE && ti.linkType !== '' ? 'pointer' : 'default',
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
          pointerEvents: [
            LeftMouseMode.CLICK_SELECT_STRUCT,
            LeftMouseMode.CLICK_SELECT_AND_MOVE_STRUCT
          ].includes(leftMouseMode) || leftMouseMode === LeftMouseMode.NONE && ti.linkType.length
            ? 'auto'
            : 'none'
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
          md(MR.removeMapListEntriesOfEdit)
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          let didMove = false
          if (e.buttons === 1) {
            if (leftMouseMode === LeftMouseMode.NONE) {
              if (ti.linkType === 'internal') {
                dispatch(api.endpoints.selectMap.initiate({mapId: ti.link, frameId: ''}))
              } else if (ti.linkType === 'external') {
                window.open(ti.link, '_blank')
                window.focus()
              }
            } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT_STRUCT) {
              !e.ctrlKey && md(MR.selectT, {path: ti.path})
              e.ctrlKey && !ti.selected && isXS(m) && md(MR.selectAddT, {path: ti.path})
              e.ctrlKey && ti.selected && getXA(m).length > 1 && md(MR.selectRemoveT, {path: ti.path})
            } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT_AND_MOVE_STRUCT) {
              !e.ctrlKey && md(MR.selectT, {path: ti.path})
              const abortController = new AbortController()
              const {signal} = abortController
              window.addEventListener('mousemove', (e) => {
                e.preventDefault()
                didMove = true
                md(MR.moveSByDragPreview, {t: ti, e})
              }, {signal})
              window.addEventListener('mouseup', (e) => {
                abortController.abort()
                e.preventDefault()
                if (didMove) {
                  md(MR.moveSByDrag, {t: ti, e})
                }
              }, {signal})
            }
          } else if (e.buttons === 4) {
            e.preventDefault()
          } else if (e.buttons === 2) {
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation()
          if (getX(m).contentType === 'text' && ti.tco1.length === 0 && leftMouseMode === LeftMouseMode.CLICK_SELECT_STRUCT) {
            md(MR.startEditAppend)
          }
        }}
        onKeyDown={(e) => {
          e.stopPropagation()
          if(['Insert', 'Tab', 'Enter'].includes(e.key) && !e.shiftKey) {
            md(MR.removeMapListEntriesOfEdit)
          }
          if (['Insert','Tab'].includes(e.key)) {
            md(MR.insertSO)
          }
        }}
        onInput={(e) => {
          md(MR.setContentText, {content: e.currentTarget.innerHTML})
        }}
        onPaste={(e) => {
          e.preventDefault()
          const pasted = e.clipboardData.getData('Text')
          e.currentTarget.innerHTML += pasted
          setEndOfContentEditable(e.currentTarget)
          md(MR.setContentText, {content: e.currentTarget.innerHTML})
        }}
      >
      </div>
    ))
  )
}
