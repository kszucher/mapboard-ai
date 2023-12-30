import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {getColors} from "../assets/Colors"
import {isRS, isRSC, isCS, isCSC, getTSI1, getTSI2, getCountTCO1, getNodeById, mTS, mTC} from "../../selectors/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector, pmSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getGridPath, getNodeLinePath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgNodeAttributes: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const pm = useSelector((state:RootState) => pmSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <Fragment>
      {mTS(m).map(ti => (
        <Fragment key={ti.nodeId}>
          {!isRS(ti.path) && !isCS(ti.path) && getCountTCO1(m, ti) === 0 &&
            <path
              d={!getNodeById(pm, ti.nodeId) && getTSI1(pm, ti)
                ? getNodeLinePath(m, getTSI1(pm, ti), ti)
                : getNodeLinePath(m, getTSI1(m, ti), ti)
              }
              strokeWidth={ti.lineWidth}
              stroke={ti.taskStatus > 1
                ? [C.TASK_LINE_1, C.TASK_LINE_2, C.TASK_LINE_3].at(ti.taskStatus - 2)
                : ti.lineColor
              }
              fill={'none'}
              {...pathCommonProps}
            >
              {
                !getNodeById(pm, ti.nodeId) && getTSI1(pm, ti) &&
                <animate
                  attributeName='d'
                  from={getNodeLinePath(m, getTSI1(pm, ti), ti)}
                  to={getNodeLinePath(m, getTSI1(m, ti), ti)}
                  dur={'0.3s'}
                  repeatCount={'once'}
                  fill={'freeze'}
                />
              }
            </path>
          }
          {getCountTCO1(m, ti) > 0 &&
            <path
              d={getGridPath(m, ti)}
              stroke={C.TABLE_GRID}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
            />
          }
        </Fragment>
      ))}
      {mTC(m).map(ti => (
        <Fragment key={ti.nodeId}>
          {!isRSC(ti.path) && !isCSC(ti.path) && ti.path.at(-2) > -1 && ti.path.at(-1) === 0 &&
            <path
              d={!getNodeById(pm, ti.nodeId) && getTSI2(pm, ti)
                ? getNodeLinePath(m, getTSI2(pm, ti), ti)
                : getNodeLinePath(m, getTSI2(m, ti), ti)
              }
              strokeWidth={ti.lineWidth}
              stroke={ti.lineColor}
              fill={'none'}
              {...pathCommonProps}
            >
              {!getNodeById(pm, ti.nodeId) && getTSI2(pm, ti) &&
                <animate
                  attributeName='d'
                  from={getNodeLinePath(m, getTSI2(pm, ti), ti)}
                  to={getNodeLinePath(m, getTSI2(m, ti), ti)}
                  dur={'0.3s'}
                  repeatCount={'once'}
                  fill={'freeze'}
                />
              }
            </path>
          }
        </Fragment>
      ))}
    </Fragment>
  )
}
