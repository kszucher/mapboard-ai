import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../../reducers/EditorReducer"
import {getG} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"

export const MapSvgGBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  return (
    connectionHelpersVisible &&
    <rect
      key={`${g.nodeId}_svg_map_background`}
      x={0}
      y={0}
      width={g.selfW}
      height={g.selfH}
      rx={0}
      ry={0}
      fill={'none'}
      stroke={'#dddddd'}
      strokeWidth={0.5}
      style={{transition: '0.3s ease-out'}}
    />
  )
}
