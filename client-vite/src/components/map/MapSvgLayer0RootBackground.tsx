import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {T} from "../../state/MapStateTypes"
import colors from "tailwindcss/colors"
import {getG, mTR} from "../../selectors/MapSelector"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"

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
          rx={32}
          ry={32}
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
    </g>
  )
}
