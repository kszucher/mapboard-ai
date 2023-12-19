import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getG} from "../../selectors/MapSelector"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mSelector} from "../../state/EditorState"
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

export const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill, stroke-width'
  }
}

export const MapSvg: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <svg
      key={g.nodeId}
      width={g.mapWidth}
      height={g.mapHeight}
      style={{transition: '0.3s ease-out'}}
      onMouseDown={(e) => {
        if (e.button === 1) {
          e.preventDefault()
        }
        dispatch(actions.mapAction({type: 'saveFromCoordinates', payload: {e}}))
        let didMove = false
        const abortController = new AbortController()
        const { signal } = abortController
        window.addEventListener('mousemove', (e) => {
          e.preventDefault()
          didMove = true
          if (e.buttons === 1) {
            dispatch(actions.mapAction({type: 'selectByRectanglePreview', payload: {e}}))
          }
        }, { signal })
        window.addEventListener('mouseup', (e) => {
          e.preventDefault()
          abortController.abort()
          if (didMove) {
            if (e.button === 0) {
              dispatch(actions.mapAction({type: 'selectByRectangle', payload: {e}}))
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
