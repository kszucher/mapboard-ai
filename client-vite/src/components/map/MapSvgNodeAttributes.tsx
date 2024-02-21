import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {isRS, isRSC, isCS, mS, mC, getG, getHN} from "../../queries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector, pmSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getGridPath, getNodeLinePath, pathCommonProps} from "./MapSvgUtils"
import {M} from "../../state/MapStateTypes.ts"

export const MapSvgNodeAttributes: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state)) as M
  const pm = useSelector((state:RootState) => pmSelector(state)) as M
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const hn = getHN(m)
  const phn = getHN(pm)
  const g = getG(m)
  return (
    <Fragment>
      {mS(m).map(si => (
        <Fragment key={si.nodeId}>
          {!isRS(si.path) && !isCS(si.path) && si.co1.length === 0 &&
            <path
              d={!phn.has(si.nodeId) && phn.get(si.si1)
                ? getNodeLinePath(g, phn.get(si.si1)!, si)
                : getNodeLinePath(g, hn.get(si.si1)!, si)
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
                  from={getNodeLinePath(g, phn.get(si.si1)!, si)}
                  to={getNodeLinePath(g, hn.get(si.si1)!, si)}
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
      ))}
      {mC(m).map(ci => (
        <Fragment key={ci.nodeId}>
          {!isRSC(ci.path) && ci.path.at(-2) > -1 && ci.path.at(-1) === 0 &&
            <path
              d={!phn.has(ci.nodeId) && phn.has(ci.si2)
                ? getNodeLinePath(g, phn.get(ci.si2)!, ci)
                : getNodeLinePath(g, hn.get(ci.si2)!, ci)
              }
              strokeWidth={ci.lineWidth}
              stroke={ci.lineColor}
              fill={'none'}
              {...pathCommonProps}
            >
              {!phn.has(ci.nodeId) && phn.has(ci.si2) &&
                <animate
                  attributeName='d'
                  from={getNodeLinePath(g, phn.get(ci.si2)!, ci)}
                  to={getNodeLinePath(g, hn.get(ci.si2)!, ci)}
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
