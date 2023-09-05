import React, {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {getG, isR,} from "../core/MapUtils"
import {adjustIcon} from "../core/Utils";
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {Sides} from "../state/Enums"
import {Connection, N} from "../state/MapStateTypes"
import {pathCommonProps} from "./MapSvg";
import {getLinePathBetweenRoots, getRootSideX, getRootSideY} from "./MapSvgUtils"

export const MapSvgLayer10Connections: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  const connectionStart = useSelector((state: RootState) => state.editor.connectionStart)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {m.map((n: N) => (
        isR(n.path) && connectionHelpersVisible &&
        <g key={`${n.nodeId}`}>
          {['L', 'R', 'T', 'B'].map(side => (
              <rect
                key={`${n.nodeId}_plus_${side}`}
                viewBox="0 0 24 24"
                width="24"
                height="24"
                rx={4}
                ry={4}
                fill={'#666666'}
                transform={`translate(${adjustIcon(getRootSideX(m, n, side))}, ${adjustIcon(getRootSideY(m, n, side))})`}
                {...{vectorEffect: 'non-scaling-stroke'}}
                style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  dispatch(actions.setConnectionStart({fromNodeId: n.nodeId, fromNodeSide: Sides[side as keyof typeof Sides]}))
                }}
                onMouseUp={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  connectionStart.fromNodeId !== '' && connectionStart.fromNodeId !== n.nodeId && !g.connections.some(el => el.fromNodeSide === connectionStart.fromNodeId) &&
                  dispatch(actions.mapAction({type: 'saveConnection', payload: {...connectionStart, toNodeId: n.nodeId, toNodeSide: Sides[side as keyof typeof Sides]}}))
                }}
              />
            )
          )}
        </g>
      ))}
      {g.connections.map((connection: Connection) => (
        <Fragment key={JSON.stringify(connection)}>
          <path
            d={getLinePathBetweenRoots(m, connection)}
            strokeWidth={1}
            stroke={'#ffffff'}
            fill={'none'}
            {...pathCommonProps}
          />
        </Fragment>
      ))}
    </g>
  )
}
