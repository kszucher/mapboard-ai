import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {mapActionResolver} from "../core/MapActionResolver"
import {isChrome} from "../core/Utils"
import {getCountSC, getG, isXACC, isXACR, isXC} from "../core/MapUtils"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {mSelector} from "../state/EditorState"
import {MapSvgLayer0MapBackground} from "./MapSvgLayer0MapBackground"
import {MapSvgLayer1FamilyBackground} from "./MapSvgLayer1FamilyBackground"
import {MapSvgLayer2NodeBackground} from "./MapSvgLayer2NodeBackground"
import {MapSvgLayer3} from "./MapSvgLayer3"
import {MapSvgLayer4SelectionSecondary} from "./MapSvgLayer4SelectionSecondary"
import {MapSvgLayer5SelectionPrimary} from "./MapSvgLayer5SelectionPrimary"
import {MapSvgLayer6} from "./MapSvgLayer6"
import {MapSvgLayer7} from "./MapSvgLayer7"
import {MapSvgLayer8} from "./MapSvgLayer8"
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
    getCountSC(m, n.path)
  ) ? 4 : -2
)

export const MapSvg: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <svg
      style={{position: 'absolute', left: 0, top: 0, width: 'calc(200vw + ' + g.mapWidth + 'px)', height: 'calc(200vh + ' + g.mapHeight + 'px)'}}
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
              dispatch(actions.mapAction(mapActionResolver(m, e, 'se', 'selectDragged', {nList: mapFindIntersecting(m, fromCoords, toCoords)})))
              dispatch(actions.setSelectionRectCoords([]))
              dispatch(actions.setIntersectingNodes([]))
            }
          } else {
            if (e.button === 0) {
              dispatch(actions.mapAction(mapActionResolver(m, e, 'se', 'selectR', null)))
            }
          }
        }, { signal })
      }}
    >
      <svg
        style={{overflow: 'visible', transform: isChrome ? '' : 'translate(calc(100vw), calc(100vh))'}}
        x={isChrome? 'calc(100vw)' : ''}
        y={isChrome? 'calc(100vh)' : ''}
      >
        <MapSvgLayer0MapBackground/>
        <MapSvgLayer1FamilyBackground/>
        <MapSvgLayer2NodeBackground/>
        <MapSvgLayer3/>
        <MapSvgLayer4SelectionSecondary/>
        <MapSvgLayer5SelectionPrimary/>
        <MapSvgLayer6/>
        <MapSvgLayer7/>
        <MapSvgLayer8/>
      </svg>
    </svg>
  )
}
