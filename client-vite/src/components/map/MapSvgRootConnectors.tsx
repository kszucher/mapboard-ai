import {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import { mTR, isExistingLink, mL} from "../../selectors/MapQueries.ts"
import {adjustIcon} from "../../utils/Utils"
import {mSelector} from "../../state/EditorState"
import {Side} from "../../state/Enums"
import {L, T} from "../../state/MapStateTypes"
import {getCoordsMidBezier, getBezierLinePath, getRootLinePath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgRootConnectors: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  const connectionStart = useSelector((state: RootState) => state.editor.connectionStart)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Fragment>
      {
        mL(m).map((l: L) => (
          <Fragment key={`${l.nodeId}_inter_root_bezier`}>
            <path
              d={getBezierLinePath('M', getRootLinePath(m, l))}
              strokeWidth={1}
              stroke={'#ffffff'}
              fill={'none'}
              {...pathCommonProps}
            />
          </Fragment>
        ))
      }
      {connectionHelpersVisible &&
        mL(m).map((l: L) => (
          <Fragment key={`${l.nodeId}_inter_root_bezier_trash`}>
            {
              <g
                width="24" height="24" viewBox="0 0 24 24"
                transform={`translate(
                    ${adjustIcon(getCoordsMidBezier(getRootLinePath(m, l)).x) - 12},
                    ${adjustIcon(getCoordsMidBezier(getRootLinePath(m, l)).y) - 12})`}
                {...{vectorEffect: 'non-scaling-stroke'}}
                style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}>
                <rect width="24" height="24" rx={4} ry={4} fill={'#666666'}/>
                <g xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"></path>
                </g>
                <rect width="24" height="24" style={{opacity: 0}} onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  dispatch(actions.mapAction({type: 'deleteL', payload: l}))
                }}/>
              </g>
            }
          </Fragment>
        ))
      }
      {connectionHelpersVisible &&
        mTR(m).map((t: T) => (
          <Fragment key={`${t.nodeId}_root_connector`}>
            {
              [
                {side: 'L', x: t.nodeStartX, y: t.nodeStartY + t.selfH / 2 - 12},
                {side: 'R', x: t.nodeStartX + t.selfW - 24, y: t.nodeStartY + t.selfH / 2 - 12},
                {side: 'T', x: t.nodeStartX + t.selfW / 2 - 12, y: t.nodeStartY},
                {side: 'B', x: t.nodeStartX + t.selfW / 2 - 12, y: t.nodeStartY + t.selfH - 24}
              ].map(el => (
                  <rect
                    key={`${t.nodeId}_plus_${el.side}`}
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    rx={4}
                    ry={4}
                    fill={'#666666'}
                    transform={`translate(${adjustIcon(el.x)}, ${adjustIcon(el.y)})`}
                    {...{vectorEffect: 'non-scaling-stroke'}}
                    style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      dispatch(actions.setConnectionStart({fromNodeId: t.nodeId, fromNodeSide: Side[el.side as keyof typeof Side]}))
                    }}
                    onMouseUp={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const newLink = {...connectionStart, toNodeId: t.nodeId, toNodeSide: Side[el.side as keyof typeof Side]} as L
                      if (
                        connectionStart.fromNodeId !== '' &&
                        connectionStart.fromNodeId !== t.nodeId &&
                        !isExistingLink(m, newLink)
                      ) {
                        dispatch(actions.mapAction({type: 'insertL', payload: newLink}))
                      }
                    }}
                  />
                )
              )}
          </Fragment>
        ))
      }
    </Fragment>
  )
}
