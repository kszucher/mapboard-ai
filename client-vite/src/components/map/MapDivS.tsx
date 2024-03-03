// @ts-ignore
import katex from "katex/dist/katex.mjs"
import mermaid from "mermaid"
import {FC, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../../api/Api.ts"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getG, getMapMode, getNodeById, getXAS, getXS, isXAS, mS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {LeftMouseMode, MapMode} from "../../state/Enums.ts"
import {S} from "../../state/MapStateTypes"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {adjust, getLatexString} from "../../utils/Utils"
import {getColors} from "../assets/Colors"
import {setEndOfContentEditable} from "./MapDivUtils"

const getInnerHtml = (s: S) => {
  if (s.contentType === 'text') {
    return s.content
  } else if (s.contentType === 'mermaid') {
    return s.content
  } else if (s.contentType === 'equation') {
    return katex.renderToString(getLatexString(s.content), {throwOnError: false})
  } else if (s.contentType === 'image') {
    let imageLink = 'https://mapboard.io/file/'
    return '<img src="' + imageLink + s.content + '" alt="" id="img">'
  }
}

export const MapDivS: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const editType = useSelector((state: RootState) => state.editor.editType)
  const m = useSelector((state:RootState) => mSelector(state))
  const mapMode = getMapMode(m)
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
    mS(m).map(si => (
      <div
        key={si.nodeId}
        id={si.nodeId}
        ref={ref => ref && ref.focus()}
        className={si.contentType === 'mermaid' ? 'mermaidNode' : ''}
        style={{
          left: adjust(si.nodeStartX),
          top: adjust( si.nodeStartY),
          minWidth: si.contentType === 'mermaid' ? 'inherit' : si.selfW + (g.density === 'large'? -10 : -8),
          minHeight: si.contentType === 'mermaid' ? 'inherit' : si.selfH + (g.density === 'large'? -10 : 0),
          paddingLeft: g.density === 'large'? 8 : 8,
          paddingTop: g.density === 'large'? 4 : 2,
          position: 'absolute',
          fontSize: si.textFontSize,
          fontFamily: 'Roboto',
          textDecoration: si.linkType.length ? "underline" : "",
          cursor: mapMode === MapMode.VIEW && si.linkType !== '' ? 'pointer' : 'default',
          color: si.blur ? 'transparent' : (si.textColor === 'default' ? C.TEXT_COLOR : si.textColor),
          transition: 'all 0.3s',
          transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          userSelect: 'none',
          zIndex: si.path.length,
          border: 0,
          margin: 0,
          textShadow: si.blur? '#FFF 0 0 8px' : '',
          pointerEvents: si.selected !== 1 && [
            LeftMouseMode.CLICK_SELECT,
            LeftMouseMode.CLICK_SELECT_AND_MOVE
          ].includes(leftMouseMode) && mapMode === MapMode.EDIT_STRUCT || mapMode === MapMode.VIEW && si.linkType.length
            ? 'auto'
            : 'none'
        }}
        spellCheck={false}
        dangerouslySetInnerHTML={si.nodeId === editedNodeId ? undefined : { __html: getInnerHtml(si) }}
        contentEditable={si.nodeId === editedNodeId}
        onFocus={(e) => {
          if (editType === 'append') {
            e.currentTarget.innerHTML = (getNodeById(m, editedNodeId) as S).content
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
            if (mapMode === MapMode.VIEW) {
              if (si.linkType === 'internal') {
                dispatch(api.endpoints.selectMap.initiate({mapId: si.link, frameId: ''}))
              } else if (si.linkType === 'external') {
                window.open(si.link, '_blank')
                window.focus()
              }
            } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT && mapMode === MapMode.EDIT_STRUCT) {
              !e.ctrlKey && md(MR.selectS, {path: si.path})
              e.ctrlKey && !si.selected && isXAS(m) && md(MR.selectAddS, {path: si.path})
              e.ctrlKey && si.selected && getXAS(m).length > 1 && md(MR.unselectS, {path: si.path})
            } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT_AND_MOVE && mapMode === MapMode.EDIT_STRUCT) {
              !e.ctrlKey && md(MR.selectS, {path: si.path})
              const abortController = new AbortController()
              const {signal} = abortController
              window.addEventListener('mousemove', (e) => {
                e.preventDefault()
                didMove = true
                md(MR.moveSByDragPreview, {s: si, e})
              }, {signal})
              window.addEventListener('mouseup', (e) => {
                abortController.abort()
                e.preventDefault()
                if (didMove) {
                  md(MR.moveSByDrag, {s: si, e})
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
          if (
            getXS(m).contentType === 'text' &&
            si.co1.length === 0 &&
            leftMouseMode === LeftMouseMode.CLICK_SELECT &&
            mapMode === MapMode.EDIT_STRUCT
          ) {
            md(MR.startEditAppend)
          }
        }}
        onKeyDown={(e) => {
          e.stopPropagation()
          if(['Insert', 'Tab', 'Enter'].includes(e.key) && !e.shiftKey) {
            md(MR.removeMapListEntriesOfEdit)
          }
          if (['Insert','Tab'].includes(e.key)) {
            isXAS(m) && md(MR.insertSSO)
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
