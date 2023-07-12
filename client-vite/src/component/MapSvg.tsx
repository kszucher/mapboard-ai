import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {mapActionResolver} from "../core/MapActionResolver"
import {getCountCO1, getG, getR0, isXACC, isXACR, isXC} from "../core/MapUtils"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {mSelector} from "../state/EditorState"
import {MapSvgLayer0NodeRootBackground} from "./MapSvgLayer0NodeRootBackground"
import {MapSvgLayer1NodeFamilyBackground} from "./MapSvgLayer1NodeFamilyBackground"
import {MapSvgLayer2NodeBackground} from "./MapSvgLayer2NodeBackground"
import {MapSvgLayer3NodeAttributes} from "./MapSvgLayer3NodeAttributes"
import {MapSvgLayer4SelectionSecondary} from "./MapSvgLayer4SelectionSecondary"
import {MapSvgLayer5SelectionPrimary} from "./MapSvgLayer5SelectionPrimary"
import {MapSvgLayer6SelectionPreview} from "./MapSvgLayer6SelectionPreview"
import {MapSvgLayer7SelectionArea} from "./MapSvgLayer7SelectionArea"
import {MapSvgLayer8SelectionMove} from "./MapSvgLayer8SelectionMove"
import {MapSvgLayer9SelectionIcons} from "./MapSvgLayer9SelectionIcons"
import {getCoords} from "./MapDivUtils"
import {mapFindIntersecting} from "../core/MapFindIntersecting"
import {M, N} from "../state/MapPropTypes"

export const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill, stroke-width'
  }
}

export const iconCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'all'
  }
}

export const getSelectionMargin = (m: M, n: N) => (
  (
    isXC(m) ||
    isXACR(m) ||
    isXACC(m) ||
    (n.selection === 's' && (n.sBorderColor  || n.sFillColor)) ||
    (n.selection === 'f') ||
    n.taskStatus > 1 ||
    getCountCO1(m, n.path)
  ) ? 4 : -2
)

export const MapSvg: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const r0 = getR0(m)
  const g = getG(m)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <svg
      key={r0.nodeId}
      width={g.mapWidth + 140} // space for buttons
      height={g.mapHeight}
      style={{transition: '0.3s ease-out'}}
      onMouseDown={(e) => {
        if (e.button === 1) {
          e.preventDefault()
        }
        const fromCoords = getCoords(e)
        let didMove = false
        const abortController = new AbortController()
        const { signal } = abortController
        window.addEventListener('mousemove', (e) => {
          e.preventDefault()
          didMove = true
          if (e.buttons === 1) {
            const toCoords = getCoords(e)
            dispatch(actions.setSelectionRectCoords([
              Math.min(fromCoords.x, toCoords.x),
              Math.min(fromCoords.y, toCoords.y),
              Math.abs(toCoords.x - fromCoords.x),
              Math.abs(toCoords.y - fromCoords.y)
            ]))
            dispatch(actions.setIntersectingNodes(mapFindIntersecting(m, fromCoords, toCoords)))
          }
        }, { signal })
        window.addEventListener('mouseup', (e) => {
          e.preventDefault()
          abortController.abort()
          const toCoords = getCoords(e)
          if (didMove) {
            if (e.button === 0) {
              dispatch(actions.mapAction(mapActionResolver(m, e, 'c', 'selectDragged', {nList: mapFindIntersecting(m, fromCoords, toCoords)})))
              dispatch(actions.setSelectionRectCoords([]))
              dispatch(actions.setIntersectingNodes([]))
            }
          } else {
            if (e.button === 0) {
              dispatch(actions.mapAction(mapActionResolver(m, e, 'c', 'selectR0', null)))
            }
          }
        }, { signal })
      }}
    >
      <MapSvgLayer0NodeRootBackground/>
      <MapSvgLayer1NodeFamilyBackground/>
      <MapSvgLayer2NodeBackground/>
      <MapSvgLayer3NodeAttributes/>
      <MapSvgLayer4SelectionSecondary/>
      <MapSvgLayer5SelectionPrimary/>
      <MapSvgLayer6SelectionPreview/>
      <MapSvgLayer7SelectionArea/>
      <MapSvgLayer8SelectionMove/>
      <MapSvgLayer9SelectionIcons/>
    </svg>
  )
}
