import React, {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {getG, isL, isR,} from "../selectors/MapSelector"
import {adjustIcon} from "../utils/Utils";
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"
import {mSelector} from "../state/EditorState"
import {Sides} from "../state/Enums"
import {T} from "../state/MapStateTypes"
import {pathCommonProps} from "./MapSvg"
import {calculateMiddlePoint, getBezierLinePath, getLinePathBetweenRoots, getRootSideX, getRootSideY} from "./MapSvgUtils"

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
      {m.map((n: T) => (
        <Fragment key={n.nodeId}>
          {isR(n.path) && connectionHelpersVisible &&
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
                      dispatch(actions.mapAction({type: 'insertL', payload: {...connectionStart, toNodeId: n.nodeId, toNodeSide: Sides[side as keyof typeof Sides]}}))
                    }}
                  />
                )
              )}
            </g>}
          {isL(n.path) && connectionHelpersVisible &&
            <g key={`${n.nodeId}`}>
              <path
                d={getBezierLinePath('M', getLinePathBetweenRoots(m, n))}
                strokeWidth={1}
                stroke={'#ffffff'}
                fill={'none'}
                {...pathCommonProps}
              />
              {connectionHelpersVisible &&
                <g
                  width="24" height="24" viewBox="0 0 24 24"
                  transform={`translate(
                    ${adjustIcon(calculateMiddlePoint(getLinePathBetweenRoots(m, n)).x) - 12},
                    ${adjustIcon(calculateMiddlePoint(getLinePathBetweenRoots(m, n)).y) - 12})`}
                  {...{vectorEffect: 'non-scaling-stroke'}}
                  style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}>
                  <rect width="24" height="24" rx={4} ry={4} fill={'#666666'}/>
                  <g xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"></path>
                  </g>
                  <rect width="24" height="24" style={{opacity: 0}} onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    dispatch(actions.mapAction({type: 'deleteL', payload: n}))
                  }}/>
                </g>}
            </g>}
        </Fragment>
      ))}
    </g>
  )
}
