import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {gptPrompter} from "../core/GptPrompter"
import {mapActionResolver} from "../core/MapActionResolver"
import {N} from "../state/MapPropTypes"
import {getCountSS, getPathDir, getX, isXS} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {iconCommonProps} from "./MapSvg"
import {MapSvgIconWrapper} from "./MapSvgIconWrapper"

const calcSvgIconOffsetX = (n: N, i: number) => (
  getPathDir(n.path) === -1
    ? n.nodeStartX - n.familyW - 4 - i * 24 - i * 6 - .5
    : n.nodeEndX + n.familyW + 4 + (i - 1) * 24 +  i * 6 + .5
)

export const MapSvgLayer4SelectionIcons: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const x = getX(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
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
