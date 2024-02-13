import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {isRS, isRSC, isCS, mTS, mTC, getG} from "../../queries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector, pmSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getGridPath, getNodeLinePath, pathCommonProps} from "./MapSvgUtils"
import {M, T} from "../../state/MapStateTypes.ts"

export const MapSvgNodeAttributes: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state)) as M
  const pm = useSelector((state:RootState) => pmSelector(state)) as M
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const mHash = new Map<string, T>(m.map(ti => [ti.nodeId, ti as T]))
  const pmHash = new Map<string, T>(pm.map(ti => [ti.nodeId, ti as T]))
  const g = getG(m)
  return (
    <Fragment>
      {mTS(m).map(ti => (
        <Fragment key={ti.nodeId}>
          {!isRS(ti.path) && !isCS(ti.path) && ti.co1.length === 0 &&
            <path
              d={!pmHash.has(ti.nodeId) && pmHash.get(ti.si1)
                ? getNodeLinePath(g, pmHash.get(ti.si1)!, ti)
                : getNodeLinePath(g, mHash.get(ti.si1)!, ti)
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
                !pmHash.has(ti.nodeId) && pmHash.has(ti.si1) &&
                <animate
                  attributeName='d'
                  from={getNodeLinePath(g, pmHash.get(ti.si1)!, ti)}
                  to={getNodeLinePath(g, mHash.get(ti.si1)!, ti)}
                  dur={'0.3s'}
                  repeatCount={'once'}
                  fill={'freeze'}
                />
              }
            </path>
          }
          {ti.co1.length > 0 &&
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
          {!isRSC(ti.path) && ti.path.at(-2) > -1 && ti.path.at(-1) === 0 &&
            <path
              d={!pmHash.has(ti.nodeId) && pmHash.has(ti.si2)
                ? getNodeLinePath(g, pmHash.get(ti.si2)!, ti)
                : getNodeLinePath(g, mHash.get(ti.si2)!, ti)
              }
              strokeWidth={ti.lineWidth}
              stroke={ti.lineColor}
              fill={'none'}
              {...pathCommonProps}
            >
              {!pmHash.has(ti.nodeId) && pmHash.has(ti.si2) &&
                <animate
                  attributeName='d'
                  from={getNodeLinePath(g, pmHash.get(ti.si2)!, ti)}
                  to={getNodeLinePath(g, mHash.get(ti.si2)!, ti)}
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
