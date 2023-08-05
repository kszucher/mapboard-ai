import React, {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {N} from "../state/MapPropTypes"
import {getRootStartX, getRootStartY, isR, getRootMidY, getRootMidX, getRootEndX, getRootEndY} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import { AppDispatch, RootState} from "../core/EditorReducer"
import {MapSvgIconWrapper} from "./MapSvgIconWrapper"

export const MapSvgLayer10Connectors: FC = () => {
  const connectorsVisible = useSelector((state: RootState) => state.editor.connectorsVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState

  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {
        // TODO: connectors
      }
      {m.map((n: N) => (
        isR(n.path) && connectorsVisible &&
        <Fragment key={`${n.nodeId}`}>
          <Fragment key={`${n.nodeId}_plus_left`}>
            <MapSvgIconWrapper x={getRootStartX(m, n)} y={getRootMidY(m, n) - 12} iconName={'Nothing'}
              onMouseDownGuarded={() => {

              }}
              onMouseUpGuarded={() => {
                console.log('connecting to')
              }}
            />
          </Fragment>
          <Fragment key={`${n.nodeId}_plus_right`}>
            <MapSvgIconWrapper x={getRootEndX(m, n) - 24} y={getRootMidY(m, n) - 12} iconName={'Nothing'}
              onMouseDownGuarded={() => {
                console.log('connecting from')
              }}
              onMouseUpGuarded={() => {

              }}
            />
          </Fragment>
          <Fragment key={`${n.nodeId}_plus_top`}>
            <MapSvgIconWrapper x={getRootMidX(m, n) - 12} y={getRootStartY(m, n)} iconName={'Nothing'}
              onMouseDownGuarded={() => {

              }}
              onMouseUpGuarded={() => {

              }}
            />
          </Fragment>
          <Fragment key={`${n.nodeId}_plus_bottom`}>
            <MapSvgIconWrapper x={getRootMidX(m, n) - 12} y={getRootEndY(m, n) - 24} iconName={'Nothing'}
              onMouseDownGuarded={() => {

              }}
              onMouseUpGuarded={() => {

              }}
            />
          </Fragment>
        </Fragment>
      ))}
    </g>
  )
}
