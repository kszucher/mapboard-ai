import React, {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {genPromptJsonS, genPromptJsonT, gptPrompter} from "../core/GptPrompter"
import {mapActionResolver} from "../core/MapActionResolver"
import {PageState} from "../state/Enums";
import {N} from "../state/MapPropTypes"
import {getCountCO1, getCountSO1, getPathDir, getR0, getX, getXSSCXX, isXD, isXR, isXS, getXRi, getNodeByPath, getRi} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {MapSvgIconWrapper} from "./MapSvgIconWrapper"

const calcSvgIconOffsetX = (n: N, i: number) => (
  getPathDir(n.path) === -1
    ? n.nodeStartX - n.familyW - 4 - i * 24 - i * 6 - .5
    : n.nodeEndX + n.familyW + 4 + (i - 1) * 24 +  i * 6 + .5
)

export const MapSvgLayer9SelectionIcons: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const nx = getX(m)
  const ri = getXRi(m)
  const rx = getNodeByPath(m, ['r', ri]) as N
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {
        <Fragment key={rx.nodeId}>
          <MapSvgIconWrapper
            x={rx.nodeStartX + rx.selfW / 2 -12 - .5}
            y={rx.nodeY - rx.selfH /2 - 24  - 12 + .5}
            iconName={rx.note === '' ? 'FileUpload' : 'FileText'}
            onMouseDownGuarded={() => {
              dispatch(actions.setPageState(PageState.WS_EDIT_NOTE))
            }}/>
        </Fragment>
      }
      {
        ((isXR(m) && getCountSO1(m, ['r', getRi(nx.path), 'd', 0]) === 0) || isXS(m) && getCountSO1(m, nx.path) === 0) && nx.selection === 's' &&
        <MapSvgIconWrapper
          x={calcSvgIconOffsetX(nx, getCountCO1(m, nx.path) ? 6 : 1)}
          y={nx.nodeY - 12 + .5}
          iconName={'CirclePlus'}
          onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'insertS', null)))
          }}/>
      }
      {
        isXD(m) && nx.selection === 'f' && getR0(m).note !== '' &&
        <MapSvgIconWrapper
          x={calcSvgIconOffsetX(nx, 1)}
          y={rx.nodeY - 12 + .5}
          iconName={'Sparkle'} onMouseDownGuarded={() => {
          dispatch(actions.setPageState(PageState.WS_LOADING))
          dispatch(api.endpoints.getGptSuggestions.initiate(gptPrompter(m, genPromptJsonS(m))))
        }}/>
      }
      {
        isXS(m) && nx.selection === 'f' &&
        <MapSvgIconWrapper
          x={calcSvgIconOffsetX(nx, 1)}
          y={nx.nodeY - 12 + .5}
          iconName={'TableExport'}
          onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'moveS2T', null)))
          }}/>
      }
      {
        isXS(m) && nx.selection === 's' && getCountCO1(m, nx.path) &&
        <MapSvgIconWrapper
          x={calcSvgIconOffsetX(nx, 1)}
          y={nx.nodeY - 12 + .5}
          iconName={'ColumnInsertLeft'}
          onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'insertSCCL', null)))
          }}/>
      }
      {
        isXS(m) && nx.selection === 's' && getCountCO1(m, nx.path) &&
        <MapSvgIconWrapper
          x={calcSvgIconOffsetX(nx, 2)}
          y={nx.nodeY - 12 + .5}
          iconName={'ColumnInsertRight'}
          onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'insertSCCR', null)))
          }}/>
      }
      {
        isXS(m) && nx.selection === 's' && getCountCO1(m, nx.path) &&
        <MapSvgIconWrapper
          x={calcSvgIconOffsetX(nx, 3)}
          y={nx.nodeY - 12 + .5}
          iconName={'RowInsertTop'}
          onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'insertSCRU', null)))
          }}/>
      }
      {
        isXS(m) && nx.selection === 's' && getCountCO1(m, nx.path) &&
        <MapSvgIconWrapper
          x={calcSvgIconOffsetX(nx, 4)}
          y={nx.nodeY - 12 + .5}
          iconName={'RowInsertBottom'}
          onMouseDownGuarded={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'insertSCRD', null)))
          }}/>
      }
      {
        isXS(m) && nx.selection === 's' && getCountCO1(m, nx.path) &&
        <MapSvgIconWrapper
          x={calcSvgIconOffsetX(nx, 5)}
          y={nx.nodeY - 12 + .5}
          iconName={'TablePlus'}
          onMouseDownGuarded={() => {
            dispatch(actions.setPageState(PageState.WS_LOADING))
            dispatch(api.endpoints.getGptSuggestions.initiate(gptPrompter(m, genPromptJsonT(m))))
          }}/>
      }
      {
        isXS(m) && nx.selection === 's' && getCountSO1(m, nx.path) === 0 &&
        getXSSCXX(m).map((n) => (
            getCountSO1(m, n.path) === 0 &&
            <Fragment key={n.nodeId}>
              <MapSvgIconWrapper
                x={n.nodeStartX + 10}
                y={n.nodeY - 12 + .5}
                iconName={'CirclePlus'}
                onMouseDownGuarded={() => {
                  dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'insertSCSO', {rowIndex: n.path.at(-2) as number, colIndex: n.path.at(-1) as number})))
                }}/>
            </Fragment>
          )
        )
      }
    </g>
  )
}
