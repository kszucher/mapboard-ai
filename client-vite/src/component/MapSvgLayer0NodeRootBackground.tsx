import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {N} from "../state/MapPropTypes";
import {getColors} from "./Colors"
import {getG, getRootStartY, getRootH, getRootStartX, getRootW, isR} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {RootState} from "../core/EditorReducer"

export const MapSvgLayer0NodeRootBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <>
      <g>
        <rect
          key={`${g.nodeId}_svg_map_background`}
          x={0}
          y={0}
          width={g.mapWidth}
          height={g.mapHeight}
          rx={32}
          ry={32}
          fill={'none'}
          stroke={'#dddddd'}
          strokeWidth={0.5}
          style={{transition: '0.3s ease-out'}}
        >
        </rect>
      </g>
      <g>
        {m.map((n: N) => (
          <Fragment key={n.nodeId}>
            {
              isR(n.path) &&
              <rect
                key={`${g.nodeId}_svg_root_background`}
                x={getRootStartX(m, n)}
                y={getRootStartY(m, n)}
                width={getRootW(m, n)}
                height={getRootH(m, n)}
                rx={32}
                ry={32}
                fill={C.MAP_BACKGROUND}
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
