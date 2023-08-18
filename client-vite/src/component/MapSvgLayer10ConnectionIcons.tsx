import React, {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {adjustIcon} from "../core/Utils";
import {Sides} from "../state/Enums"
import {M, N} from "../state/MapStateTypes"
import {getRootStartX, getRootStartY, isR, getRootMidY, getRootMidX, getRootEndX, getRootEndY, getG,} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"

const getX = (m: M, n: N, side: string) => {
  switch (true) {
    case (side === 'L'): return getRootStartX(m, n)
    case (side === 'R'): return getRootEndX(m, n) - 24
    case (side === 'T'): return getRootMidX(m, n) - 12
    case (side === 'B'): return getRootMidX(m, n) - 12
    default: return 0
  }
}

const getY = (m: M, n: N, side: string) => {
  switch (true) {
    case (side === 'L'): return getRootMidY(m, n) - 12
    case (side === 'R'): return getRootMidY(m, n) - 12
    case (side === 'T'): return getRootStartY(m, n)
    case (side === 'B'): return getRootEndY(m, n) - 24
    default: return 0
  }
}

export const MapSvgLayer10ConnectionIcons: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const connectionIconsVisible = useSelector((state: RootState) => state.editor.connectionIconsVisible)
  const connectionStart = useSelector((state: RootState) => state.editor.connectionStart)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {m.map((n: N) => (
        isR(n.path) && connectionIconsVisible &&
        <g key={`${n.nodeId}`}>
          {['L', 'R', 'T', 'B'].map(side => (
              <rect
                key={`${n.nodeId}_plus_${side}`}
                // width="24" height="24"
                viewBox="0 0 24 24"
                transform={`translate(${adjustIcon(getX(m, n, side))}, ${adjustIcon(getY(m, n, side))})`}
                {...{vectorEffect: 'non-scaling-stroke'}}
                style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}
                width="24" height="24" rx={4} ry={4} fill={'#666666'}
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
    </g>
  )
}
