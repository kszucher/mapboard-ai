import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../editorMutations/EditorMutations.ts"
import {getG} from "../mapQueries/MapQueries.ts"
import {MapSvgGBackground} from "./MapSvgGBackground.tsx"
import {MapSvgSFamilyBorder} from "./MapSvgSFamilyBorder.tsx"
import {MapSvgSSelfBorder} from "./MapSvgSSelfBorder.tsx"
import {MapSvgSTasks} from "./MapSvgSTasks.tsx"
import {MapSvgRBackground} from "./MapSvgRBackground.tsx"
import {MapSvgLRConnectors} from "./MapSvgLRConnectors.tsx"
import {MapSvgSFamilyBackground} from "./MapSvgSFamilyBackground.tsx"
import {MapSvgSelfBackgroundS} from "./MapSvgSSelfBackground.tsx"
import {MapSvgSAttributes} from "./MapSvgSAttributes.tsx"
import {MapSvgCAttributes} from "./MapSvgCAttributes.tsx"
import {MapSvgRMove} from "./MapSvgRMove.tsx"
import {MapSvgRSeparators} from "./MapSvgRSeparators.tsx"
import {MapSvgRSelectionSecondary} from "./MapSvgRSelectionSecondary.tsx"
import {MapSvgSSelectionSecondary} from "./MapSvgSSelectionSecondary.tsx"
import {MapSvgRSelectionPrimary} from "./MapSvgRSelectionPrimary.tsx"
import {MapSvgSSelectionPrimary} from "./MapSvgSSelectionPrimary.tsx"
import {MapSvgCSelectionPrimary} from "./MapSvgCSelectionPrimary.tsx"
import {MapSvgSSelectionPreview} from "./MapSvgSSelectionPreview.tsx"
import {MapSvgSSelectionArea} from "./MapSvgSSelectionArea.tsx"
import {MapSvgSMove} from "./MapSvgSMove.tsx"
import {MapSvgRIcons} from "./MapSvgRIcons.tsx"
import {mSelector} from "../editorQueries/EditorQueries.ts";

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
      <MapSvgGBackground/>
      <MapSvgRBackground/>
      <MapSvgRSeparators/>
      <MapSvgSFamilyBackground/>
      <MapSvgSelfBackgroundS/>
      <MapSvgSFamilyBorder/>
      <MapSvgSSelfBorder/>
      <MapSvgSAttributes/>
      <MapSvgCAttributes/>
      <MapSvgSTasks/>
      <MapSvgRSelectionSecondary/>
      <MapSvgSSelectionSecondary/>
      <MapSvgRSelectionPrimary/>
      <MapSvgSSelectionPrimary/>
      <MapSvgCSelectionPrimary/>
      <MapSvgSSelectionPreview/>
      <MapSvgSSelectionArea/>
      <MapSvgRMove/>
      <MapSvgSMove/>
      <MapSvgRIcons/>
      <MapSvgLRConnectors/>
    </svg>
  )
}
