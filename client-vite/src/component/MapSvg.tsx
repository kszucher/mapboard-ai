import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getCountNCO1, getG, getR0, isXACC, isXACR, isXC} from "../core/MapUtils"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {mSelector} from "../state/EditorState"
import {getMapX, getMapY} from "./MapDivUtils"
import {MapSvgLayer0RootBackground} from "./MapSvgLayer0RootBackground"
import {MapSvgLayer1NodeFamilyBackground} from "./MapSvgLayer1NodeFamilyBackground"
import {MapSvgLayer2NodeBackground} from "./MapSvgLayer2NodeBackground"
import {MapSvgLayer3NodeAttributes} from "./MapSvgLayer3NodeAttributes"
import {MapSvgLayer4SelectionSecondary} from "./MapSvgLayer4SelectionSecondary"
import {MapSvgLayer5SelectionPrimary} from "./MapSvgLayer5SelectionPrimary"
import {MapSvgLayer6SelectionPreview} from "./MapSvgLayer6SelectionPreview"
import {MapSvgLayer7SelectionArea} from "./MapSvgLayer7SelectionArea"
import {MapSvgLayer8SelectionMove} from "./MapSvgLayer8SelectionMove"
import {MapSvgLayer9DecorationIcons} from "./MapSvgLayer9DecorationIcons"
import {MapSvgLayer10Connections} from "./MapSvgLayer10Connections"
import {mapFindIntersecting} from "../core/MapFindIntersecting"
import {M, N} from "../state/MapStateTypes"

export const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill, stroke-width'
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
    getCountNCO1(m, n)
  ) ? 4 : -2
)

export const MapSvg: FC = () => {
  const zoomInfo = useSelector((state: RootState) => state.editor.zoomInfo)
  const m = useSelector((state:RootState) => mSelector(state))
  const r0 = getR0(m)
  const g = getG(m)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <svg
      key={r0.nodeId}
      width={g.mapWidth}
      height={g.mapHeight}
      style={{transition: '0.3s ease-out'}}
      onMouseDown={(e) => {
        if (e.button === 1) {
          e.preventDefault()
        }
        const {scale, prevMapX, prevMapY, originX, originY } = zoomInfo
        const mapX = getMapX(e)
        const mapY = getMapY(e)
        const fromX = originX + ((mapX - prevMapX) / scale)
        const fromY = originY + ((mapY - prevMapY) / scale)
        let didMove = false
        const abortController = new AbortController()
        const { signal } = abortController
        window.addEventListener('mousemove', (e) => {
          e.preventDefault()
          didMove = true
          if (e.buttons === 1) {
            const {scale, prevMapX, prevMapY, originX, originY } = zoomInfo
            const mapX = getMapX(e)
            const mapY = getMapY(e)
            const toX = originX + ((mapX - prevMapX) / scale)
            const toY = originY + ((mapY - prevMapY) / scale)
            dispatch(actions.setSelectionRectCoords([Math.min(fromX, toX), Math.min(fromY, toY), Math.abs(toX - fromX), Math.abs(toY - fromY)]))
            dispatch(actions.setIntersectingNodes(mapFindIntersecting(m, fromX, fromY, toX, toY)))
          }
        }, { signal })
        window.addEventListener('mouseup', (e) => {
          e.preventDefault()
          abortController.abort()
          const mapX = getMapX(e)
          const mapY = getMapY(e)
          const toX = originX + ((mapX - prevMapX) / scale)
          const toY = originY + ((mapY - prevMapY) / scale)
          if (didMove) {
            if (e.button === 0) {
              const nList = mapFindIntersecting(m, fromX, fromY, toX, toY)
              nList.length && dispatch(actions.mapAction({type: 'selectDragged', payload: {pathList: nList.map(n => n.path)}}))
              dispatch(actions.setSelectionRectCoords([]))
              dispatch(actions.setIntersectingNodes([]))
            }
          }
        }, { signal })
      }}
    >
      <MapSvgLayer0RootBackground/>
      <MapSvgLayer1NodeFamilyBackground/>
      <MapSvgLayer2NodeBackground/>
      <MapSvgLayer3NodeAttributes/>
      <MapSvgLayer4SelectionSecondary/>
      <MapSvgLayer5SelectionPrimary/>
      <MapSvgLayer6SelectionPreview/>
      <MapSvgLayer7SelectionArea/>
      <MapSvgLayer8SelectionMove/>
      <MapSvgLayer9DecorationIcons/>
      <MapSvgLayer10Connections/>
    </svg>
  )
}
