import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {mS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState.ts"
import {getColors} from "../assets/Colors.ts"
import {getArcPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgSSelfBorder: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    mS(m).map(si => (
      <Fragment key={si.nodeId}>
        {si.sBorderColor && si.co1.length === 0 &&
          <path
            key={`${si.nodeId}_sBorderColor`}
            d={getArcPath(si, -2, true)}
            stroke={si.sBorderColor}
            strokeWidth={si.sBorderWidth}
            fill={'none'}
            {...pathCommonProps}
          />
        }
        {si.sBorderColor && si.co1.length > 0 &&
          <path
            key={`${si.nodeId}_sBorderColor`}
            d={getArcPath(si, 0, false)}
            stroke={si.sBorderColor}
            strokeWidth={si.sBorderWidth}
            fill={'none'}
            {...pathCommonProps}
          />
        }
        {!si.sBorderColor && si.co1.length > 0 &&
          <path
            key={`${si.nodeId}_sBorderColor`}
            d={getArcPath(si, 0, false)}
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
