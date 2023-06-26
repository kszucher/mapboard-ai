import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {gptPrompter} from "../core/GptPrompter"
import {mapActionResolver} from "../core/MapActionResolver"
import {N} from "../state/MapPropTypes"
import {getCountSC, getCountSS, getPathDir, getX, getXSSCXX, isXS} from "../core/MapUtils"
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

export const MapSvgLayer9SelectionIcons: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const nx = getX(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {
        isXS(m) && nx.selection === 's' && getCountSS(m, nx.path) === 0 &&
        <svg x={calcSvgIconOffsetX(nx, getCountSC(m, nx.path) ? 5 : 1)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'CirclePlusIcon'} onMouseDownGuarded={() =>
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertSO', null)))
          }/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 'f' &&
        <svg x={calcSvgIconOffsetX(nx, 1)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'SparkleIcon'} onMouseDownGuarded={() =>
            dispatch(api.endpoints.getGptSuggestions.initiate(gptPrompter(m, 'gptGenNodes', null)))
          }/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 'f' &&
        <svg x={calcSvgIconOffsetX(nx, 2)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'TableIcon'} onMouseDownGuarded={() =>
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'moveS2T', null)))
          }/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSC(m, nx.path) &&
        <svg x={calcSvgIconOffsetX(nx, 4)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'RowInsertBottom'} onMouseDownGuarded={() =>
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertSCRD', null)))
          }/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSC(m, nx.path) &&
        <svg x={calcSvgIconOffsetX(nx, 3)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'RowInsertTop'} onMouseDownGuarded={() =>
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertSCRU', null)))
          }/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSC(m, nx.path) &&
        <svg x={calcSvgIconOffsetX(nx, 2)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'ColumnInsertRight'} onMouseDownGuarded={() =>
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertSCCR', null)))
          }/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSC(m, nx.path) &&
        <svg x={calcSvgIconOffsetX(nx, 1)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'ColumnInsertLeft'} onMouseDownGuarded={() =>
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertSCCL', null)))
          }/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSS(m, nx.path) === 0 &&
        getXSSCXX(m).map((n) => (
            getCountSS(m, n.path) === 0 &&
            <svg key={n.nodeId} x={n.nodeStartX + 10} y={n.nodeY - 12 + .5} {...iconCommonProps}>
              <MapSvgIconWrapper m={m} iconName={'CirclePlusIcon'} onMouseDownGuarded={() =>
                dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertSCSO', {rowIndex: n.path.at(-2) as number, colIndex: n.path.at(-1) as number})))
              }/>
            </svg>
          )
        )
      }
    </g>
  )
}
