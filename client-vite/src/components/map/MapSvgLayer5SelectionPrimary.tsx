import {FC} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {getColors} from "../assets/Colors"
import {getCountTCO1, getG, getX, isXACC, isXACR, isXC, isXS} from "../../selectors/MapSelector"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {pathCommonProps} from "./MapSvg"
import {getPolygonC, getPolygonPath, getPolygonS} from "./MapSvgUtils"


// const getSelectionMargin = (m: M, t: T) => (
//   (
//     isXC(m) ||
//     isXACR(m) ||
//     isXACC(m) ||
//     (t.selection === 's' && (t.sBorderColor  || t.sFillColor)) ||
//     (t.selection === 'f') ||
//     t.taskStatus > 1 ||
//     getCountTCO1(m, t)
//   ) ? 4 : -2
// )


export const MapSvgLayer5SelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const x = getX(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g>
      {
        !selectionRectCoords.length &&
        isXS(m) && (
          (x.selection === 's' && (x.sBorderColor  || x.sFillColor)) ||
          (x.selection === 'f') ||
          x.taskStatus > 1 ||
          getCountTCO1(m, x)
        ) &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          d={getPolygonPath(x, getPolygonS(m, x, x.selection), x.selection, 4)}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}
          {...pathCommonProps}
        >
        </path>
      }
      {
        !selectionRectCoords.length &&
        isXS(m) &&
        !(
          (x.selection === 's' && (x.sBorderColor  || x.sFillColor)) ||
          (x.selection === 'f') ||
          x.taskStatus > 1 ||
          getCountTCO1(m, x)
        ) &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          d={getPolygonPath(x, getPolygonS(m, x, x.selection), x.selection, -2)}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}
          {...pathCommonProps}
        >
        </path>
      }
      {
        !selectionRectCoords.length && (isXC(m) || isXACR(m) || isXACC(m)) &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          d={getPolygonPath(x, getPolygonC(m), x.selection, 4)}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}
          {...pathCommonProps}
        >
        </path>
      }
    </g>
  )
}
