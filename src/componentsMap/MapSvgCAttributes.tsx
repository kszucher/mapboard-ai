import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {mC, getG, getHN} from "../mapQueries/MapQueries.ts"
import {RootState} from "../editorMutations/EditorReducer.ts"
import {getNodeLinePath, pathCommonProps} from "./MapSvgUtils.ts"
import {M, C} from "../mapState/MapStateTypes.ts"
import {isSSC} from "../mapQueries/PathQueries.ts"
import {mSelector, pmSelector} from "../editorQueries/EditorQueries.ts";

export const MapSvgCAttributes: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state)) as M
  const pm = useSelector((state:RootState) => pmSelector(state)) as M
  const hn = getHN(m)
  const phn = getHN(pm)
  const g = getG(m)
  return (
    mC(m).map(ci => (
      <Fragment key={ci.nodeId}>
        {isSSC(ci.path) && ci.path.at(-2) > -1 && ci.path.at(-1) === 0 &&
          <path
            d={!phn.has(ci.nodeId) && phn.has(ci.si1!.si1!.nodeId)
              ? getNodeLinePath(g, phn.get(ci.si1!.si1!.nodeId)! as C, ci)
              : getNodeLinePath(g, hn.get(ci.si1!.si1!.nodeId)! as C, ci)
            }
            strokeWidth={ci.lineWidth}
            stroke={ci.lineColor}
            fill={'none'}
            {...pathCommonProps}
          >
            {!phn.has(ci.nodeId) && phn.has(ci.si1!.si1!.nodeId) &&
              <animate
                attributeName='d'
                from={getNodeLinePath(g, phn.get(ci.si1!.si1!.nodeId)! as C, ci)}
                to={getNodeLinePath(g, hn.get(ci.si1!.si1!.nodeId)! as C, ci)}
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
