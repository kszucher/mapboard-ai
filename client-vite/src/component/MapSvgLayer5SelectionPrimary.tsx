import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {gptPrompter} from "../core/GptPrompter";
import {getColors} from "./Colors"
import {getCountSS, getG, getPathDir, getX, isD, isR, isXACC, isXACR, isXC} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {AppDispatch, RootState} from "../core/EditorReducer"
import {CirclePlusIcon, dSparkle, SparkleIcon} from "./Icons";
import {getSelectionMargin, iconCommonProps, pathCommonProps} from "./MapSvg"
import {getPolygonC, getPolygonPath, getPolygonS} from "./MapSvgUtils"

export const MapSvgLayer5SelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const x = getX(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
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
        !isR(x.path) && (x.selection === 's' && getCountSS(m, x.path) === 0) &&
        <svg x={(getPathDir(x.path) === -1 ? x.nodeStartX - x.familyW - 4 - 24 - 0.5 : x.nodeEndX + x.familyW + 4 + .5)} y={x.nodeY - 12 + .5} {...iconCommonProps}>
          <g width="24" height="24" viewBox="0 0 24 24">
            <rect width="24" height="24" rx={4} ry={4} fill={'#444444'}/>
            <CirclePlusIcon/>
            <rect
              width="24"
              height="24"
              style={{opacity: 0}}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('CLICK')
                // dispatch(api.endpoints.getGptSuggestions.initiate(gptPrompter(m, 'gptGenNodes', null)))
              }}
            />
          </g>
        </svg>
      }
      {
        !isR(x.path) && !isD(x.path) && x.selection === 'f' &&
        <svg x={(getPathDir(x.path) === -1 ? x.nodeStartX - x.familyW - 4 - 24 - 0.5 : x.nodeEndX + x.familyW + 4 + .5)} y={x.nodeY - 12 + .5} {...iconCommonProps}>
          <g width="24" height="24" viewBox="0 0 24 24">
            <rect width="24" height="24" rx={4} ry={4} fill={'#444444'}/>
            <SparkleIcon/>
            <rect
              width="24"
              height="24"
              style={{opacity: 0}}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                dispatch(api.endpoints.getGptSuggestions.initiate(gptPrompter(m, 'gptGenNodes', null)))
              }}
            />
          </g>
        </svg>
      }
    </g>
  )
}
