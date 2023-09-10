import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../apis/NodeApi"
import {N} from "../state/MapStateTypes";
import {getColors} from "./Colors"
import {getG, getRootStartY, getRootH, getRootStartX, getRootW, isR} from "../selectors/MapSelectorUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"
import {mSelector} from "../state/EditorState"
import {RootState} from "../reducers/EditorReducer"

export const MapSvgLayer0RootBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <>
      <g>
        {/*<rect*/}
        {/*  key={`${g.nodeId}_svg_map_background`}*/}
        {/*  x={0}*/}
        {/*  y={0}*/}
        {/*  width={g.mapWidth}*/}
        {/*  height={g.mapHeight}*/}
        {/*  rx={0}*/}
        {/*  ry={0}*/}
        {/*  fill={'none'}*/}
        {/*  stroke={'#dddddd'}*/}
        {/*  strokeWidth={0.5}*/}
        {/*  style={{transition: '0.3s ease-out'}}*/}
        {/*>*/}
        {/*</rect>*/}
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
