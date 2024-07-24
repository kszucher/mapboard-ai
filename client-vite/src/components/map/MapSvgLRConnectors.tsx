import {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MM} from "../../reducers/MapMutationEnum.ts"
import {mR, isExistingLink, mL} from "../../mapQueries/MapQueries.ts"
import {adjustIcon} from "../../utils/Utils"
import {mSelector} from "../../state/EditorState"
import {Side} from "../../state/Enums"
import {L} from "../../state/MapStateTypes"
import {getCoordsMidBezier, getBezierLinePath, getRootLinePath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgLRConnectors: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  const connectionStart = useSelector((state: RootState) => state.editor.connectionStart)
  const dispatch = useDispatch<AppDispatch>()
  const dm = (type: MM, payload? : any) => dispatch(actions.mapReducer({type, payload}))
  return (
    <Fragment>
      {mL(m).map((li: L) => (
        <Fragment key={`${li.nodeId}_inter_root_bezier`}>
          <path
            d={getBezierLinePath('M', getRootLinePath(m, li))}
            strokeWidth={1}
            stroke={'#ffffff'}
            fill={'none'}
            {...pathCommonProps}
          />
        </Fragment>
      ))
      }
      {connectionHelpersVisible &&
        mL(m).map(li => (
          <Fragment key={`${li.nodeId}_inter_root_bezier_trash`}>
            {
              <g
                width="24" height="24" viewBox="0 0 24 24"
                transform={`translate(
                    ${adjustIcon(getCoordsMidBezier(getRootLinePath(m, li)).x) - 12},
                    ${adjustIcon(getCoordsMidBezier(getRootLinePath(m, li)).y) - 12})`}
                {...{vectorEffect: 'non-scaling-stroke'}}
                style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}>
                <rect width="24" height="24" rx={4} ry={4} fill={'#666666'}/>
                <g xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"></path>
                </g>
                <rect width="24" height="24" style={{opacity: 0}} onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  dm(MM.deleteL, li)
                }}/>
              </g>
            }
          </Fragment>
        ))
      }
      {connectionHelpersVisible &&
        mR(m).map(ri => (
          <Fragment key={`${ri.nodeId}_root_connector`}>
            {
              [
                {side: 'L', x: ri.nodeStartX, y: ri.nodeStartY + ri.selfH / 2 - 12},
                {side: 'R', x: ri.nodeStartX + ri.selfW - 24, y: ri.nodeStartY + ri.selfH / 2 - 12},
                {side: 'T', x: ri.nodeStartX + ri.selfW / 2 - 12, y: ri.nodeStartY},
                {side: 'B', x: ri.nodeStartX + ri.selfW / 2 - 12, y: ri.nodeStartY + ri.selfH - 24}
              ].map(el => (
                  <rect
                    key={`${ri.nodeId}_plus_${el.side}`}
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
                      dispatch(actions.setConnectionStart({fromNodeId: ri.nodeId, fromNodeSide: Side[el.side as keyof typeof Side]}))
                    }}
                    onMouseUp={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const newLink = {...connectionStart, toNodeId: ri.nodeId, toNodeSide: Side[el.side as keyof typeof Side]} as L
                      if (
                        connectionStart.fromNodeId !== '' &&
                        connectionStart.fromNodeId !== ri.nodeId &&
                        !isExistingLink(m, newLink)
                      ) {
                        dm(MM.insertL, newLink)
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
