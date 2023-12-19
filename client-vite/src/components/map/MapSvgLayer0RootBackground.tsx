import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import colors from "tailwindcss/colors"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getG, mTR} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"
import {ControlTypes} from "../../state/Enums.ts"
import {T} from "../../state/MapStateTypes"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {adjust} from "../../utils/Utils.ts"
import {getLinearLinePath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgLayer0RootBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {connectionHelpersVisible &&
        <rect
          key={`${g.nodeId}_svg_map_background`}
          x={0}
          y={0}
          width={g.mapWidth}
          height={g.mapHeight}
          rx={0}
          ry={0}
          fill={'none'}
          stroke={'#dddddd'}
          strokeWidth={0.5}
          style={{transition: '0.3s ease-out'}}
        />
      }
      {mTR(m).map((ti: T) => (
        <rect
          key={`${ti.nodeId}_svg_root_background`}
          x={ti.nodeStartX}
          y={ti.nodeStartY}
          width={ti.nodeEndX - ti.nodeStartX}
          height={ti.nodeEndY - ti.nodeStartY}
          rx={16}
          ry={16}
          fill={colorMode === 'dark' ? colors.zinc[800] : colors.zinc[50]}
          style={{transition: '0.3s ease-out'}}
          onMouseDown={(e) => {
            e.stopPropagation()
            if (e.button === 0) {
              if(!ti.selected) {
                dispatch(actions.mapAction({type: 'selectT', payload: {path: ti.path}}))
              }
            }
          }}
        />
      ))}
      {mTR(m).filter(ti => ti.controlType !== ControlTypes.NONE).map((ti: T) => (
        <path
          key={`${ti.nodeId}_separator`}
          d={getLinearLinePath({
            x1: adjust(ti.nodeStartX),
            x2: adjust(ti.nodeEndX),
            y: adjust(ti.nodeStartY + 40)})
          }
          stroke={'#666'}
          {...pathCommonProps}
        />
      ))}
    </g>
  )
}
