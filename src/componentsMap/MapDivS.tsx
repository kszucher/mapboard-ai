// @ts-ignore
import katex from "katex/dist/katex.mjs"
import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../api/Api.ts"
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import {getG, getNodeMode, getAXS, getXS, idToS, isAXS, mS} from "../mapQueries/MapQueries.ts"
import {mSelector} from "../state/EditorState.ts"
import {LeftMouseMode, NodeMode} from "../state/Enums.ts"
import {S} from "../state/MapStateTypes.ts"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState.ts"
import {adjust, getLatexString} from "../utils/Utils.ts"
import {getColors} from "../state/Colors.ts"
import {setEndOfContentEditable} from "./MapDivUtils.ts"

const getInnerHtml = (s: S) => {
  if (s.contentType === 'text') {
    return s.content
  } else if (s.contentType === 'equation') {
    return katex.renderToString(getLatexString(s.content), {throwOnError: false})
  } else if (s.contentType === 'image') {
    const imageLink = 'https://mapboard.io/file/'
    return '<img src="' + imageLink + s.content + '" alt="" id="img">'
  }
}

export const MapDivS: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const editType = useSelector((state: RootState) => state.editor.editType)
  const m = useSelector((state:RootState) => mSelector(state))
  const nodeMode = getNodeMode(m)
  const g = getG(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  const dm = (type: MM, payload? : any) => dispatch(actions.mapReducer({type, payload}))

  return (
    mS(m).map(si => (
      <div
        key={si.nodeId}
        id={si.nodeId}
        ref={ref => ref && ref.focus()}
        style={{
          left: adjust(si.nodeStartX),
          top: adjust( si.nodeStartY),
          minWidth: si.selfW + (g.density === 'large'? -10 : -8),
          minHeight: si.selfH + (g.density === 'large'? -10 : 0),
          paddingLeft: g.density === 'large'? 8 : 8,
          paddingTop: g.density === 'large'? 4 : 2,
          position: 'absolute',
          fontSize: si.textFontSize,
          fontFamily: 'Roboto',
          textDecoration: si.linkType.length ? "underline" : "",
          cursor: nodeMode === NodeMode.VIEW && si.linkType !== '' ? 'pointer' : 'default',
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
          pointerEvents: [
            LeftMouseMode.CLICK_SELECT,
            LeftMouseMode.CLICK_SELECT_AND_MOVE
          ].includes(leftMouseMode) && nodeMode === NodeMode.EDIT_STRUCT || nodeMode === NodeMode.VIEW && si.linkType.length
            ? 'auto'
            : 'none'
        }}
        spellCheck={false}
        dangerouslySetInnerHTML={si.nodeId === editedNodeId ? undefined : { __html: getInnerHtml(si) }}
        contentEditable={si.nodeId === editedNodeId}
        onFocus={(e) => {
          if (editType === 'append') {
            e.currentTarget.innerHTML = idToS(m, editedNodeId).content
          }
          setEndOfContentEditable(e.currentTarget)
        }}
        onBlur={() => {
          dispatch(actions.removeMapListEntriesOfEdit())
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          let didMove = false
          if (e.buttons === 1) {
            if (nodeMode === NodeMode.VIEW) {
              if (si.linkType === 'internal') {
                dispatch(api.endpoints.selectMap.initiate({mapId: si.link}))
              } else if (si.linkType === 'external') {
                window.open(si.link, '_blank')
                window.focus()
              }
            } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT && nodeMode === NodeMode.EDIT_STRUCT) {
              if (!e.ctrlKey) dm(MM.selectS, {path: si.path})
              if (e.ctrlKey && !si.selected && isAXS(m)) dm(MM.selectAddS, {path: si.path})
              if (e.ctrlKey && si.selected && getAXS(m).length > 1) dm(MM.unselectS, {path: si.path})
            } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT_AND_MOVE && nodeMode === NodeMode.EDIT_STRUCT) {
              if (!e.ctrlKey) dm(MM.selectS, {path: si.path})
              const abortController = new AbortController()
              const {signal} = abortController
              window.addEventListener('mousemove', (e) => {
                e.preventDefault()
                didMove = true
                dispatch(actions.moveSByDragPreview({e}))
              }, {signal})
              window.addEventListener('mouseup', (e) => {
                abortController.abort()
                e.preventDefault()
                if (didMove) {
                  dm(MM.moveSByDrag, {s: si, e})
                }
              }, {signal})
            }
          } else if (e.buttons === 4) {
            e.preventDefault()
          } else if (e.buttons === 2) {
            // do nothing
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation()
          if (
            getXS(m).contentType === 'text' &&
            si.co1.length === 0 &&
            leftMouseMode === LeftMouseMode.CLICK_SELECT &&
            nodeMode === NodeMode.EDIT_STRUCT
          ) {
            dispatch(actions.startEditAppend())
          }
        }}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (['Insert', 'Tab', 'Enter'].includes(e.key) && !e.shiftKey) {
            dispatch(actions.removeMapListEntriesOfEdit())
          }
          if (['Insert','Tab'].includes(e.key)) {
            if(isAXS(m)) dm(MM.insertSSO)
          }
        }}
        onInput={(e) => {
          dm(MM.setContentText, {content: e.currentTarget.innerHTML})
        }}
        onPaste={(e) => {
          e.preventDefault()
          const pasted = e.clipboardData.getData('Text')
          e.currentTarget.innerHTML += pasted
          setEndOfContentEditable(e.currentTarget)
          dm(MM.setContentText, {content: e.currentTarget.innerHTML})
        }}
      >
      </div>
    ))
  )
}
