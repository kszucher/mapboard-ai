import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../appStore/appStore.ts"
import {mSelector, pmSelector} from "../editorQueries/EditorQueries.ts"
import {getG, getHN, mC} from "../mapQueries/MapQueries.ts"
import {isSSC} from "../mapQueries/PathQueries.ts"
import {C, M} from "../mapState/MapStateTypes.ts"
import {getNodeLinePath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgCAttributes: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state)) as M
  const pm = useSelector((state:RootState) => pmSelector(state)) as M
  const hn = getHN(m)
  const phn = getHN(pm)
  const g = getG(m)
  return (
    mC(m).filter(ci => isSSC(ci.path) && ci.path.at(-2) > -1 && ci.path.at(-1) === 0).map(ci =>
      <path
        key={`${ci.nodeId}_ca`}
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
    )
  )
}
