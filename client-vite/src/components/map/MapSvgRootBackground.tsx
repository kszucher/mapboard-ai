import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import colors from "tailwindcss/colors"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getXA, isXR, mTR} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {LeftMouseMode} from "../../state/Enums.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"

export const MapSvgRootBackground: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
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
          pointerEvents: [LeftMouseMode.CLICK_SELECT_ROOT, LeftMouseMode.CLICK_SELECT_AND_MOVE_ROOT].includes(leftMouseMode) ? 'auto' : 'none'
        }}
        onMouseDown={(e) => {
          let didMove = false
          e.stopPropagation()
          if (e.buttons === 1) {
            !e.ctrlKey && [LeftMouseMode.CLICK_SELECT_ROOT, LeftMouseMode.CLICK_SELECT_AND_MOVE_ROOT].includes(leftMouseMode) && md(MR.selectT, {path: ti.path})
            e.ctrlKey && leftMouseMode === LeftMouseMode.CLICK_SELECT_ROOT && isXR(m) && !ti.selected && md(MR.selectAddT, {path: ti.path})
            e.ctrlKey && leftMouseMode === LeftMouseMode.CLICK_SELECT_ROOT && ti.selected && getXA(m).length > 1 && md(MR.selectRemoveT, {path: ti.path})
            if (leftMouseMode === LeftMouseMode.CLICK_SELECT_AND_MOVE_ROOT) {
              md(MR.saveFromCoordinates, {e})
              const abortController = new AbortController()
              const {signal} = abortController
              window.addEventListener('mousemove', (e) => {
                e.preventDefault()
                didMove = true
                md(MR.offsetRByDragPreview, {t: ti, e})
              }, {signal})
              window.addEventListener('mouseup', (e) => {
                abortController.abort()
                e.preventDefault()
                if (didMove) {
                  md(MR.offsetRByDrag, {t: ti, e})
                }
              }, {signal})
            }
          } else if (e.buttons === 4) {
            e.preventDefault()
          }
        }}
      />
    ))
  )
}
