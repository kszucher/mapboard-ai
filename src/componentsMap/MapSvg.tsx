import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../appStore/appStore.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {getG} from "../mapQueries/MapQueries.ts"
import {MapSvgCAttributes} from "./MapSvgCAttributes.tsx"
import {MapSvgCSelection} from "./MapSvgCSelection.tsx"
import {MapSvgGBackground} from "./MapSvgGBackground.tsx"
import {MapSvgL} from "./MapSvgL.tsx"
import {MapSvgRBackground} from "./MapSvgRBackground.tsx"
import {MapSvgRConnectors} from "./MapSvgRConnectors.tsx"
import {MapSvgRIcons} from "./MapSvgRIcons.tsx"
import {MapSvgRMove} from "./MapSvgRMove.tsx"
import {MapSvgRSelection} from "./MapSvgRSelection.tsx"
import {MapSvgRSeparators} from "./MapSvgRSeparators.tsx"
import {MapSvgSAttributes} from "./MapSvgSAttributes.tsx"
import {MapSvgSFamilyBackground} from "./MapSvgSFamilyBackground.tsx"
import {MapSvgSFamilyBorder} from "./MapSvgSFamilyBorder.tsx"
import {MapSvgSMove} from "./MapSvgSMove.tsx"
import {MapSvgSSelection} from "./MapSvgSSelection.tsx"
import {MapSvgSSelectionArea} from "./MapSvgSSelectionArea.tsx"
import {MapSvgSSelectionPreview} from "./MapSvgSSelectionPreview.tsx"
import {MapSvgSelfBackgroundS} from "./MapSvgSSelfBackground.tsx"
import {MapSvgSSelfBorder} from "./MapSvgSSelfBorder.tsx"
import {MapSvgSTasks} from "./MapSvgSTasks.tsx"

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
      <MapSvgL/>
      <MapSvgRBackground/>
      <MapSvgRSeparators/>
      <MapSvgSFamilyBackground/>
      <MapSvgSelfBackgroundS/>
      <MapSvgSFamilyBorder/>
      <MapSvgSSelfBorder/>
      <MapSvgSAttributes/>
      <MapSvgCAttributes/>
      <MapSvgSTasks/>
      <MapSvgRSelection/>
      <MapSvgSSelection/>
      <MapSvgCSelection/>
      <MapSvgSSelectionPreview/>
      <MapSvgSSelectionArea/>
      <MapSvgRMove/>
      <MapSvgSMove/>
      <MapSvgRIcons/>
      <MapSvgRConnectors/>
    </svg>
  )
}
