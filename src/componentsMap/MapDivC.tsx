import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../editorMutations/EditorReducer.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import {getNodeMode, mC} from "../mapQueries/MapQueries.ts"
import {LeftMouseMode, NodeMode} from "../consts/Enums.ts"
import {adjust} from "../utils/Utils.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts";

export const MapDivC: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const nodeMode = getNodeMode(m)
  const dispatch = useDispatch<AppDispatch>()
  const dm = (type: MM, payload? : any) => dispatch(actions.mapReducer({type, payload}))
  return (
    mC(m).map(ci => (
      <div
        key={ci.nodeId}
        id={ci.nodeId}
        ref={ref => ref && ref.focus()}
        style={{
          left: adjust(ci.nodeStartX),
          top: adjust(ci.nodeStartY),
          minWidth: ci.selfW,
          minHeight: ci.selfH,
          position: 'absolute',
          zIndex: ci.path.length,
          border: 0,
          margin: 0,
          pointerEvents: [
            LeftMouseMode.CLICK_SELECT,
            LeftMouseMode.CLICK_SELECT_AND_MOVE
          ].includes(leftMouseMode) && nodeMode === NodeMode.EDIT_CELL
            ? 'auto'
            : 'none'
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          if (e.buttons === 1) {
            if (leftMouseMode === LeftMouseMode.CLICK_SELECT && nodeMode === NodeMode.EDIT_CELL) {
              if (!e.ctrlKey) dm(MM.selectC, {path: ci.path})
            }
          } else if (e.buttons === 4) {
            e.preventDefault()
          }
        }}
      >
      </div>
    ))
  )
}
