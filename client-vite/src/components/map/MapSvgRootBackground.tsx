import {FC} from "react"
import {useSelector} from "react-redux"
import colors from "tailwindcss/colors"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {RootState} from "../../reducers/EditorReducer"
import {mTR} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"

export const MapSvgRootBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  return (
    mTR(m).map(ti => (
      <rect
        key={`${ti.nodeId}_svg_root_background`}
        x={ti.nodeStartX}
        y={ti.nodeStartY}
        width={ti.selfW}
        height={ti.selfH}
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
