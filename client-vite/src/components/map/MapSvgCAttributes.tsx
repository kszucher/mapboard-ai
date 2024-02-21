import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {isRSC, mC, getG, getHN} from "../../queries/MapQueries.ts"
import {mSelector, pmSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getNodeLinePath, pathCommonProps} from "./MapSvgUtils"
import {M, C} from "../../state/MapStateTypes.ts"

export const MapSvgCAttributes: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state)) as M
  const pm = useSelector((state:RootState) => pmSelector(state)) as M
  const hn = getHN(m)
  const phn = getHN(pm)
  const g = getG(m)
  return (
    mC(m).map(ci => (
      <Fragment key={ci.nodeId}>
        {!isRSC(ci.path) && ci.path.at(-2) > -1 && ci.path.at(-1) === 0 &&
          <path
            d={!phn.has(ci.nodeId) && phn.has(ci.si2)
              ? getNodeLinePath(g, phn.get(ci.si2)! as C, ci)
              : getNodeLinePath(g, hn.get(ci.si2)! as C, ci)
            }
            strokeWidth={ci.lineWidth}
            stroke={ci.lineColor}
            fill={'none'}
            {...pathCommonProps}
          >
            {!phn.has(ci.nodeId) && phn.has(ci.si2) &&
              <animate
                attributeName='d'
                from={getNodeLinePath(g, phn.get(ci.si2)! as C, ci)}
                to={getNodeLinePath(g, hn.get(ci.si2)! as C, ci)}
                dur={'0.3s'}
                repeatCount={'once'}
                fill={'freeze'}
              />
            }
          </path>
        }
      </Fragment>
    ))
  )
}
