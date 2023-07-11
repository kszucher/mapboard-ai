import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {N} from "../state/MapPropTypes";
import {getColors} from "./Colors"
import {getG, getRi, getRXD0, getRXD1, getTaskWidth, hasTaskLeft, hasTaskRight, isR} from "../core/MapUtils"
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
                x={n.nodeStartX - getRXD1(m, getRi(n.path)).familyW - 50}
                y={n.nodeY - Math.max(...[getRXD0(m, getRi(n.path)).familyH, getRXD1(m, getRi(n.path)).familyH]) / 2 - 50}
                width={getRXD0(m, getRi(n.path)).familyW + getRXD1(m, getRi(n.path)).familyW + n.selfW  + getTaskWidth(getG(m)) * (+hasTaskLeft(m) + +hasTaskRight(m)) + 100}
                height={Math.max(...[getRXD0(m, getRi(n.path)).familyH, getRXD1(m, getRi(n.path)).familyH]) + 100}
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
