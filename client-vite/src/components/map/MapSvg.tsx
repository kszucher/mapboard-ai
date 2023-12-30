import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../../reducers/EditorReducer"
import {getG} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {MapSvgMapBackground} from "./MapSvgMapBackground.tsx"
import {MapSvgNodeFamilyBorder} from "./MapSvgNodeFamilyBorder.tsx"
import {MapSvgNodeSelfBorder} from "./MapSvgNodeSelfBorder.tsx"
import {MapSvgNodeTasks} from "./MapSvgNodeTasks.tsx"
import {MapSvgRootBackground} from "./MapSvgRootBackground.tsx"
import {MapSvgRootConnectors} from "./MapSvgRootConnectors.tsx"
import {MapSvgNodeFamilyBackground} from "./MapSvgNodeFamilyBackground.tsx"
import {MapSvgNodeSelfBackground} from "./MapSvgNodeSelfBackground.tsx"
import {MapSvgNodeAttributes} from "./MapSvgNodeAttributes.tsx"
import {MapSvgRootSeparators} from "./MapSvgRootSeparators.tsx"
import {MapSvgSelectionSecondary} from "./MapSvgSelectionSecondary.tsx"
import {MapSvgSelectionPrimary} from "./MapSvgSelectionPrimary.tsx"
import {MapSvgSelectionPreview} from "./MapSvgSelectionPreview.tsx"
import {MapSvgSelectionArea} from "./MapSvgSelectionArea.tsx"
import {MapSvgSelectionMove} from "./MapSvgSelectionMove.tsx"
import {MapSvgNodeIcons} from "./MapSvgNodeIcons.tsx"

export const MapSvg: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  return (
    <svg
      key={g.nodeId}
      width={g.selfW}
      height={g.selfH}
      style={{transition: '0.3s ease-out'}}
    >
      <MapSvgMapBackground/>
      <MapSvgRootBackground/>
      <MapSvgRootSeparators/>
      <MapSvgNodeFamilyBackground/>
      <MapSvgNodeSelfBackground/>
      <MapSvgNodeFamilyBorder/>
      <MapSvgNodeSelfBorder/>
      <MapSvgNodeAttributes/>
      <MapSvgNodeTasks/>
      <MapSvgSelectionSecondary/>
      <MapSvgSelectionPrimary/>
      <MapSvgSelectionPreview/>
      <MapSvgSelectionArea/>
      <MapSvgSelectionMove/>
      <MapSvgNodeIcons/>
      <MapSvgRootConnectors/>
    </svg>
  )
}
