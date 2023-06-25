import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {gptPrompter} from "../core/GptPrompter"
import {mapActionResolver} from "../core/MapActionResolver"
import {N} from "../state/MapPropTypes"
import {getColors} from "./Colors"
import {getCountSS, getG, getPathDir, getX, isXACC, isXACR, isXC, isXS} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {getSelectionMargin, iconCommonProps, pathCommonProps} from "./MapSvg"
import {MapSvgIconWrapper} from "./MapSvgIconWrapper"
import {getPolygonC, getPolygonPath, getPolygonS} from "./MapSvgUtils"

const calcSvgIconOffsetX = (n: N, i: number) => (
  getPathDir(n.path) === -1
    ? n.nodeStartX - n.familyW - 4 - i * 24 - i * 6 - .5
    : n.nodeEndX + n.familyW + 4 + (i - 1) * 24 +  i * 6 + .5
)

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
        isXS(m) && x.selection === 's' && getCountSS(m, x.path) === 0 &&
        <svg x={calcSvgIconOffsetX(x, 1)} y={x.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'CirclePlusIcon'} onMouseDownGuarded={() => console.log('plus')}/>
        </svg>
      }
      {
        isXS(m) && x.selection === 'f' &&
        <svg x={calcSvgIconOffsetX(x, 1)} y={x.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'SparkleIcon'} onMouseDownGuarded={() => dispatch(api.endpoints.getGptSuggestions.initiate(gptPrompter(m, 'gptGenNodes', null)))}/>
        </svg>
      }
      {
        isXS(m) && x.selection === 'f' &&
        <svg x={(getPathDir(x.path) === -1 ? x.nodeStartX - x.familyW - 4 - 24 - 36 - .5 : x.nodeEndX + x.familyW + 4 + 36 + .5)} y={x.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'TableIcon'} onMouseDownGuarded={() => dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'moveS2T', null)))}/>
        </svg>
      }

    </g>
  )
}
