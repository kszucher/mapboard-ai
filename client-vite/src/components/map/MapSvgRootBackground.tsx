import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import colors from "tailwindcss/colors"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MRT} from "../../reducers/MapReducerEnum.ts"
import {mTR} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {LeftMouseMode} from "../../state/Enums.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"

export const MapSvgRootBackground: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    mTR(m).map(ti => (
      <rect
        key={`${ti.nodeId}_svg_root_background`}
        x={ti.nodeStartX}
        y={ti.nodeStartY}
        width={ti.selfW}
        height={ti.selfH}
        rx={16}
        ry={16}
        fill={colorMode === 'dark' ? colors.zinc[800] : colors.zinc[50]}
        style={{
          transition: '0.3s ease-out',
          pointerEvents: leftMouseMode === LeftMouseMode.SELECT_BY_RECTANGLE ? 'none' : 'auto'
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          if (e.buttons === 1 && leftMouseMode === LeftMouseMode.SELECT_BY_CLICK_OR_MOVE) {
            !e.ctrlKey && dispatch(actions.mapAction({type: MRT.selectT, payload: {path: ti.path}}))
            e.ctrlKey && dispatch(actions.mapAction({type: MRT.selectTtoo, payload: {path: ti.path}}))
          }
          if (e.buttons === 4) {
            e.preventDefault()
          }
        }}
      />
    ))
  )
}
