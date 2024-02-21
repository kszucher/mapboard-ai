import {FC} from "react"
import {useSelector} from "react-redux"
import colors from "tailwindcss/colors"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {RootState} from "../../reducers/EditorReducer"
import {mR} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"

export const MapSvgRBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  return (
    mR(m).map(ri => (
      <rect
        key={`${ri.nodeId}_svg_root_background`}
        x={ri.nodeStartX}
        y={ri.nodeStartY}
        width={ri.selfW}
        height={ri.selfH}
        rx={16}
        ry={16}
        fill={colorMode === 'dark' ? colors.zinc[800] : colors.zinc[50]}
        style={{
          transition: '0.3s ease-out',
        }}
      />
    ))
  )
}
