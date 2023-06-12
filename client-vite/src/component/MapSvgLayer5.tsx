import React, {FC} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {mapActionResolver} from "../core/MapActionResolver";
import {getColors} from "./Colors"
import { getCountSS, getG, getX, isR, isXACC, isXACR, isXC} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {actions, RootState} from "../core/EditorReducer"
import {getSelectionMargin, pathCommonProps} from "./MapSvg"
import {getPolygonC, getPolygonPath, getPolygonS} from "./MapSvgUtils"

export const MapSvgLayer5: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const x = getX(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g id="layer5">
      {
        !selectionRectCoords.length &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          d={getPolygonPath(x, (isXC(m) || isXACR(m) || isXACC(m)) ? getPolygonC(m) : getPolygonS(m, x, x.selection), x.selection, getSelectionMargin(m, x))}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}
          {...pathCommonProps}
        >
        </path>




      }
      {
        !isR(x.path) && (x.selection === 's' && getCountSS(m, x.path) === 0 || x.selection === 'f') &&
        <svg
          x={x.selection === 's' ? x.nodeEndX + 6 : x.nodeEndX + x.familyW + 6}
          y={x.nodeY - 24/2}
          style={{transitionProperty: 'x, y'}}

        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-square-rounded-plus-filled"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#ffffff"
            fill="#ffffff"
            strokeLinecap="round"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('SCCCCCCCCCCCCCCCCCCCCCadding nodes...')
            }}
            strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M12 2l.324 .001l.318 .004l.616 .017l.299 .013l.579 .034l.553 .046c4.785 .464 6.732 2.411 7.196 7.196l.046 .553l.034 .579c.005 .098 .01 .198 .013 .299l.017 .616l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.464 4.785 -2.411 6.732 -7.196 7.196l-.553 .046l-.579 .034c-.098 .005 -.198 .01 -.299 .013l-.616 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.785 -.464 -6.732 -2.411 -7.196 -7.196l-.046 -.553l-.034 -.579a28.058 28.058 0 0 1 -.013 -.299l-.017 -.616c-.003 -.21 -.005 -.424 -.005 -.642l.001 -.324l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.464 -4.785 2.411 -6.732 7.196 -7.196l.553 -.046l.579 -.034c.098 -.005 .198 -.01 .299 -.013l.616 -.017c.21 -.003 .424 -.005 .642 -.005zm0 6a1 1 0 0 0 -1 1v2h-2l-.117 .007a1 1 0 0 0 .117 1.993h2v2l.007 .117a1 1 0 0 0 1.993 -.117v-2h2l.117 -.007a1 1 0 0 0 -.117 -1.993h-2v-2l-.007 -.117a1 1 0 0 0 -.993 -.883z"
              fill="#ffffff"
              strokeWidth="0"
            ></path>
          </svg>
        </svg>
      }
    </g>
  )
}

