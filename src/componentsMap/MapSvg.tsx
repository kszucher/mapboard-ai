import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../appStore/appStore.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {getG} from "../mapQueries/MapQueries.ts"
import {MapSvgGBackground} from "./MapSvgGBackground.tsx"
import {MapSvgL} from "./MapSvgL.tsx"
import {MapSvgRBackground} from "./MapSvgRBackground.tsx"
import {MapSvgRConnectors} from "./MapSvgRConnectors.tsx"
import {MapSvgRIcons} from "./MapSvgRIcons.tsx"
import {MapSvgRMove} from "./MapSvgRMove.tsx"
import {MapSvgRSelection} from "./MapSvgRSelection.tsx"
import {MapSvgRSeparators} from "./MapSvgRSeparators.tsx"

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
      <MapSvgRSelection/>
      <MapSvgRMove/>
      <MapSvgRIcons/>
      <MapSvgRConnectors/>
    </svg>
  )
}
