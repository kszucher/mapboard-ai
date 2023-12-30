import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import colors from "tailwindcss/colors"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mTR} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {ControlType, LeftMouseMode} from "../../state/Enums.ts"
import {T} from "../../state/MapStateTypes"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {adjust} from "../../utils/Utils.ts"
import {getLinearLinePath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgRootBackground: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {mTR(m).map((ti: T) => (
        <rect
          {...{className: ti.selected ? "hover:cursor-default" : "hover:cursor-default"}}
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
              !e.ctrlKey && dispatch(actions.mapAction({type: 'selectT', payload: {path: ti.path}}))
              e.ctrlKey && dispatch(actions.mapAction({type: 'selectTtoo', payload: {path: ti.path}}))
            }
            if (e.buttons === 4) {
              e.preventDefault()
            }
          }}
        />
      ))}
      {mTR(m).filter(ti => ti.controlType !== ControlType.NONE).map((ti: T) => (
        <g key={`${ti.nodeId}_separator`}>
          <path
            d={
              getLinearLinePath({
                x1: adjust(ti.nodeStartX),
                x2: adjust(ti.nodeStartX + ti.selfW),
                y1: adjust(ti.nodeStartY + 40),
                y2: adjust(ti.nodeStartY + 40),
              })
            }
            stroke={'#444'}
            {...pathCommonProps}
          />
          <path
            d={
              getLinearLinePath({
                x1: adjust(ti.nodeStartX),
                x2: adjust(ti.nodeStartX + ti.selfW),
                y1: adjust(ti.nodeStartY + ti.selfH - 40),
                y2: adjust(ti.nodeStartY + ti.selfH - 40),
              })
            }
            stroke={'#444'}
            {...pathCommonProps}
          />
        </g>
      ))}
    </g>
  )
}
