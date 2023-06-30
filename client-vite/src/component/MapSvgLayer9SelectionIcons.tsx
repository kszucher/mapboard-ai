import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {genPromptJsonS, genPromptJsonT, gptPrompter} from "../core/GptPrompter"
import {mapActionResolver} from "../core/MapActionResolver"
import {PageState} from "../state/Enums";
import {N} from "../state/MapPropTypes"
import {getCountD0S, getCountSC, getCountSS, getPathDir, getR0, getX, getXSSCXX, isXD, isXR, isXS} from "../core/MapUtils"
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
  const r0 = getR0(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {
        <svg x={r0.nodeStartX + r0.selfW / 2 -12 - .5} y={r0.nodeY - r0.selfH /2 - 24  - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={r0.note === '' ? 'FileUpload' : 'FileText'} onMouseDownGuarded={() => {
            dispatch(actions.setPageState(PageState.WS_EDIT_NOTE))
          }}/>
        </svg>
      }
      {
        ((isXR(m) && getCountD0S(m) === 0) || isXS(m) && getCountSS(m, nx.path) === 0) && nx.selection === 's' &&
        <svg x={calcSvgIconOffsetX(nx, getCountSC(m, nx.path) ? 6 : 1)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'CirclePlus'} onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertS', null)))
          }}/>
        </svg>
      }
      {
        isXD(m) && nx.selection === 'f' &&
        <svg x={calcSvgIconOffsetX(nx, 1)} y={r0.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'Sparkle'} onMouseDownGuarded={() => {
            dispatch(api.endpoints.getGptSuggestions.initiate(gptPrompter(m, genPromptJsonS(m))))
          }}/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 'f' && nx.path.length !== 6 &&
        <svg x={calcSvgIconOffsetX(nx, 1)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'TableExport'} onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'moveS2T', null)))
          }}/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSC(m, nx.path) &&
        <svg x={calcSvgIconOffsetX(nx, 1)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'ColumnInsertLeft'} onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertSCCL', null)))
          }}/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSC(m, nx.path) &&
        <svg x={calcSvgIconOffsetX(nx, 2)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'ColumnInsertRight'} onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertSCCR', null)))
          }}/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSC(m, nx.path) &&
        <svg x={calcSvgIconOffsetX(nx, 3)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'RowInsertTop'} onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertSCRU', null)))
          }}/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSC(m, nx.path) &&
        <svg x={calcSvgIconOffsetX(nx, 4)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'RowInsertBottom'} onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertSCRD', null)))
          }}/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSC(m, nx.path) &&
        <svg x={calcSvgIconOffsetX(nx, 5)} y={nx.nodeY - 12 + .5} {...iconCommonProps}>
          <MapSvgIconWrapper m={m} iconName={'TablePlus'} onMouseDownGuarded={() => {
            dispatch(api.endpoints.getGptSuggestions.initiate(gptPrompter(m, genPromptJsonT(m))))
          }}/>
        </svg>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSS(m, nx.path) === 0 &&
        getXSSCXX(m).map((n) => (
            getCountSS(m, n.path) === 0 &&
            <svg key={n.nodeId} x={n.nodeStartX + 10} y={n.nodeY - 12 + .5} {...iconCommonProps}>
              <MapSvgIconWrapper m={m} iconName={'CirclePlus'} onMouseDownGuarded={() => {
                dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'insertSCSO', {rowIndex: n.path.at(-2) as number, colIndex: n.path.at(-1) as number})))
              }}/>
            </svg>
          )
        )
      }
    </g>
  )
}
