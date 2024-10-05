import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../appStore/appStore.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {mL} from "../mapQueries/MapQueries.ts"
import {getBezierLinePath, getRootLinePath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgL: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    mL(m).map(li =>
      <path
        key={`${li.nodeId}_l`}
        d={getBezierLinePath('M', getRootLinePath(m, li))}
        strokeWidth={1}
        stroke={'#ffffff'}
        fill={'none'}
        {...pathCommonProps}
      />
    )
  )
}
