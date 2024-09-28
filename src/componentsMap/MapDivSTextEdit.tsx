import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../api/Api.ts"
import {actions, AppDispatch, RootState} from "../editorMutations/EditorMutations.ts"
import {getG, idToS, isAXS, mS} from "../mapQueries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import {adjust, removeWhitespaces} from "../utils/Utils.ts"
import {getColors} from "../consts/Colors.ts"
import {setEndOfContentEditable} from "./MapDivUtils.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"

export const MapDivSTextEdit: FC = () => {
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const editType = useSelector((state: RootState) => state.editor.editType)
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  return (
    mS(m).filter(si => si.contentType === 'text' && si.nodeId === editedNodeId).map(si => (
      <div
        key={si.nodeId}
        id={si.nodeId}
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
          color: si.textColor === 'default' ? C.TEXT_COLOR : si.textColor,
          transition: 'all 0.3s',
          transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          userSelect: 'none',
          zIndex: si.path.length,
          border: 0,
          margin: 0,
        }}
        ref={ref => ref && ref.focus()}
        spellCheck={false}
        contentEditable={true}
        onFocus={(e) => {
          if (editType === 'append') {
            e.currentTarget.innerHTML = idToS(m, editedNodeId).content
          }
          setEndOfContentEditable(e.currentTarget)
        }}
        onBlur={() => {
          dispatch(actions.removeMapListEntriesOfEdit())
        }}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (['Insert', 'Tab', 'Enter'].includes(e.key) && !e.shiftKey) {
            dispatch(actions.removeMapListEntriesOfEdit())
          }
          if (['Insert','Tab'].includes(e.key)) {
            if(isAXS(m)) dispatch(actions.insertSSO())
          }
        }}
        onInput={(e) => {
          dispatch(actions.setContentText(removeWhitespaces(e.currentTarget.innerHTML)))
        }}
        onPaste={(e) => {
          e.preventDefault()
          const pasted = e.clipboardData.getData('Text')
          e.currentTarget.innerHTML += pasted
          setEndOfContentEditable(e.currentTarget)
          console.log(e.currentTarget.innerHTML)
          dispatch(actions.setContentText(removeWhitespaces(e.currentTarget.innerHTML)))
        }}
      >
      </div>
    ))
  )
}
