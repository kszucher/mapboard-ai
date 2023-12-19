import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../../reducers/EditorReducer"
import {getG} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"
import {MapSvgLayer0RootBackground} from "./MapSvgLayer0RootBackground"
import {MapSvgLayer10Connections} from "./MapSvgLayer10Connections"
import {MapSvgLayer1NodeFamilyBackground} from "./MapSvgLayer1NodeFamilyBackground"
import {MapSvgLayer2NodeBackground} from "./MapSvgLayer2NodeBackground"
import {MapSvgLayer3NodeAttributes} from "./MapSvgLayer3NodeAttributes"
import {MapSvgLayer4SelectionSecondary} from "./MapSvgLayer4SelectionSecondary"
import {MapSvgLayer5SelectionPrimary} from "./MapSvgLayer5SelectionPrimary"
import {MapSvgLayer6SelectionPreview} from "./MapSvgLayer6SelectionPreview"
import {MapSvgLayer7SelectionArea} from "./MapSvgLayer7SelectionArea"
import {MapSvgLayer8SelectionMove} from "./MapSvgLayer8SelectionMove"
import {MapSvgLayer9DecorationIcons} from "./MapSvgLayer9DecorationIcons"

export const MapSvg: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  return (
    <svg
      key={g.nodeId}
      width={g.mapWidth}
      height={g.mapHeight}
      style={{transition: '0.3s ease-out'}}
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
