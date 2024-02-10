import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {mTS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState.ts"
import {getColors} from "../assets/Colors.ts"
import {getArcPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgNodeSelfBorder: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    mTS(m).map(ti => (
      <Fragment key={ti.nodeId}>
        {ti.sBorderColor && ti.tco1.length === 0 &&
          <path
            key={`${ti.nodeId}_sBorderColor`}
            d={getArcPath(ti, -2, true)}
            stroke={ti.sBorderColor}
            strokeWidth={ti.sBorderWidth}
            fill={'none'}
            {...pathCommonProps}
          />
        }
        {ti.sBorderColor && ti.tco1.length > 0 &&
          <path
            key={`${ti.nodeId}_sBorderColor`}
            d={getArcPath(ti, 0, false)}
            stroke={ti.sBorderColor}
            strokeWidth={ti.sBorderWidth}
            fill={'none'}
            {...pathCommonProps}
          />
        }
        {!ti.sBorderColor && ti.tco1.length > 0 &&
          <path
            key={`${ti.nodeId}_sBorderColor`}
            d={getArcPath(ti, 0, false)}
            stroke={C.TABLE_FRAME_COLOR}
            strokeWidth={1}
            fill={'none'}
            {...pathCommonProps}
          />
        }
      </Fragment>
    ))
  )
}
