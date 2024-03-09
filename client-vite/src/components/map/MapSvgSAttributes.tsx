import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {mS, getG, getHN, isSS} from "../../queries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector, pmSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getGridPath, getNodeLinePath, pathCommonProps} from "./MapSvgUtils"
import {M, S} from "../../state/MapStateTypes.ts"

export const MapSvgSAttributes: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state)) as M
  const pm = useSelector((state:RootState) => pmSelector(state)) as M
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const hn = getHN(m)
  const phn = getHN(pm)
  const g = getG(m)
  return (
    mS(m).map(si => (
      <Fragment key={si.nodeId}>
        {isSS(si.path) && si.co1.length === 0 &&
          <path
            d={!phn.has(si.nodeId) && phn.get(si.si1)
              ? getNodeLinePath(g, phn.get(si.si1) as S, si)
              : getNodeLinePath(g, hn.get(si.si1) as S, si)
            }
            strokeWidth={si.lineWidth}
            stroke={si.taskStatus > 1
              ? [C.TASK_LINE_1, C.TASK_LINE_2, C.TASK_LINE_3].at(si.taskStatus - 2)
              : si.lineColor
            }
            fill={'none'}
            {...pathCommonProps}
          >
            {
              !phn.has(si.nodeId) && phn.has(si.si1) &&
              <animate
                attributeName='d'
                from={getNodeLinePath(g, phn.get(si.si1) as S, si)}
                to={getNodeLinePath(g, hn.get(si.si1) as S, si)}
                dur={'0.3s'}
                repeatCount={'once'}
                fill={'freeze'}
              />
            }
          </path>
        }
        {si.co1.length > 0 &&
          <path
            d={getGridPath(m, si)}
            stroke={C.TABLE_GRID}
            strokeWidth={1}
            fill={'none'}
            {...pathCommonProps}
          />
        }
      </Fragment>
    ))
  )
}
