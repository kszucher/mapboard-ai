import {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {T} from "../../state/MapStateTypes"
import colors from "tailwindcss/colors"
import {getG, getRootStartY, getRootH, getRootStartX, getRootW, isR, mT} from "../../selectors/MapSelector"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"

export const MapSvgLayer0RootBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  return (
    <>
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
          >
          </rect>
        }
      </g>
      <g>
        {mT(m).map((t: T) => (
          <Fragment key={t.nodeId}>
            {
              isR(t.path) &&
              <rect
                key={`${g.nodeId}_svg_root_background`}
                x={getRootStartX(t)}
                y={getRootStartY(t)}
                width={getRootW(m, t)}
                height={getRootH(m, t)}
                rx={32}
                ry={32}
                fill={colorMode === 'dark' ? colors.zinc[800] : colors.zinc[50]}
                style={{transition: '0.3s ease-out'}}
              >
              </rect>
            }
          </Fragment>
        ))}
      </g>
    </>
  )
}
