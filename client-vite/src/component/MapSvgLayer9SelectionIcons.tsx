import React, {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {getCountCO1, getCountSO1, getNodeByPath, getR0, getRi, getX, getXRi, getXSSCXX, isXR, isXS} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {PageState} from "../state/Enums"
import {N} from "../state/MapStateTypes"
import {MapSvgIconWrapper} from "./MapSvgIconWrapper"
import {calcSvgIconOffsetX} from "./MapSvgUtils"

export const MapSvgLayer9SelectionIcons: FC = () => {
  const nodeMenu = useSelector((state: RootState) => state.editor.nodeMenu)
  const m = useSelector((state:RootState) => mSelector(state))
  const xn = getX(m)
  const r0 = getR0(m)
  const ri = getXRi(m)
  const rx = getNodeByPath(m, ['r', ri]) as N
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {
        <Fragment key={rx.nodeId}>
          <MapSvgIconWrapper x={r0.nodeStartX + r0.selfW / 2 -12} y={r0.nodeY - r0.selfH /2 - 12  - 12} iconName={r0.note === '' ? 'FileUpload' : 'FileText'} onMouseDownGuarded={() => {
            dispatch(actions.setPageState(PageState.WS_EDIT_NOTE))
          }}/>
        </Fragment>
      }
      {/*{*/}
      {/*  isXS(m) && !nodeMenu &&*/}
      {/*  <MapSvgIconWrapper x={calcSvgIconOffsetX(xn, 1)} y={xn.nodeY - 12} iconName={'Dots'} onMouseDownGuarded={(e: MouseEvent) => {*/}
      {/*    // dispatch(actions.openNodeMenu({x: getMapX(e), y: getMapY(e)}))*/}
      {/*  }}/>*/}
      {/*}*/}
      {/*{*/}
      {/*  ((isXR(m) && getCountSO1(m, ['r', getRi(xn.path), 'd', 0]) === 0) || isXS(m) && getCountSO1(m, xn.path) === 0) && xn.selection === 's' &&*/}
      {/*  <MapSvgIconWrapper x={calcSvgIconOffsetX(xn, getCountCO1(m, xn.path) ? 6 : 1)} y={xn.nodeY - 12} iconName={'CirclePlus'} onMouseDownGuarded={() => {*/}
      {/*    isXR(m) && dispatch(actions.mapAction({type: 'insertSOR', payload: null}))*/}
      {/*    isXS(m) && dispatch(actions.mapAction({type: 'insertSO', payload: null}))*/}
      {/*  }}/>*/}
      {/*}*/}
      {/*{*/}
      {/*  isXD(m) && xn.selection === 'f' && getR0(m).note !== '' &&*/}
      {/*  <MapSvgIconWrapper x={calcSvgIconOffsetX(xn, 1)} y={rx.nodeY - 12} iconName={'Sparkle'} onMouseDownGuarded={() => {*/}
      {/*    dispatch(actions.setPageState(PageState.WS_LOADING))*/}
      {/*    dispatch(api.endpoints.getGptSuggestions.initiate(gptPrompter(m, genPromptJsonS(m))))*/}
      {/*  }}/>*/}
      {/*}*/}
      {/*{*/}
      {/*  isXS(m) && xn.selection === 'f' && getCountSO1(m, xn.path) &&*/}
      {/*  <MapSvgIconWrapper x={calcSvgIconOffsetX(xn, 1)} y={xn.nodeY - 12} iconName={'TableExport'} onMouseDownGuarded={() => {*/}
      {/*    dispatch(actions.mapAction({type: 'moveS2T', payload: null}))*/}
      {/*  }}/>*/}
      {/*}*/}
      {/*{*/}
      {/*  isXS(m) && xn.selection === 's' && getCountCO1(m, xn.path) &&*/}
      {/*  <MapSvgIconWrapper x={calcSvgIconOffsetX(xn, 1)} y={xn.nodeY - 12} iconName={'ColumnInsertLeft'} onMouseDownGuarded={() => {*/}
      {/*    dispatch(actions.mapAction({type: 'insertSCCL', payload: null}))*/}
      {/*  }}/>*/}
      {/*}*/}
      {/*{*/}
      {/*  isXS(m) && xn.selection === 's' && getCountCO1(m, xn.path) &&*/}
      {/*  <MapSvgIconWrapper x={calcSvgIconOffsetX(xn, 2)} y={xn.nodeY - 12} iconName={'ColumnInsertRight'} onMouseDownGuarded={() => {*/}
      {/*    dispatch(actions.mapAction({type: 'insertSCCR', payload: null}))*/}
      {/*  }}/>*/}
      {/*}*/}
      {/*{*/}
      {/*  isXS(m) && xn.selection === 's' && getCountCO1(m, xn.path) &&*/}
      {/*  <MapSvgIconWrapper x={calcSvgIconOffsetX(xn, 3)} y={xn.nodeY - 12} iconName={'RowInsertTop'} onMouseDownGuarded={() => {*/}
      {/*    dispatch(actions.mapAction({type: 'insertSCRU', payload: null}))*/}
      {/*  }}/>*/}
      {/*}*/}
      {/*{*/}
      {/*  isXS(m) && xn.selection === 's' && getCountCO1(m, xn.path) &&*/}
      {/*  <MapSvgIconWrapper x={calcSvgIconOffsetX(xn, 4)} y={xn.nodeY - 12} iconName={'RowInsertBottom'} onMouseDownGuarded={() => {*/}
      {/*    dispatch(actions.mapAction({type: 'insertSCRD', payload: null}))*/}
      {/*  }}/>*/}
      {/*}*/}
      {/*{*/}
      {/*  isXS(m) && xn.selection === 's' && getCountCO1(m, xn.path) &&*/}
      {/*  <MapSvgIconWrapper x={calcSvgIconOffsetX(xn, 5)} y={xn.nodeY - 12} iconName={'TablePlus'} onMouseDownGuarded={() => {*/}
      {/*    dispatch(actions.setPageState(PageState.WS_LOADING))*/}
      {/*    dispatch(api.endpoints.getGptSuggestions.initiate(gptPrompter(m, genPromptJsonT(m))))*/}
      {/*  }}/>*/}
      {/*}*/}
      {
        isXS(m) && xn.selection === 's' && getCountSO1(m, xn.path) === 0 &&
        getXSSCXX(m).map((n) => (
            getCountSO1(m, n.path) === 0 &&
            <Fragment key={n.nodeId}>
              <MapSvgIconWrapper x={n.nodeStartX + 10} y={n.nodeY - 12} iconName={'CirclePlus'} onMouseDownGuarded={() => {
                dispatch(actions.mapAction({type: 'insertSCSO', payload: {rowIndex: n.path.at(-2) as number, colIndex: n.path.at(-1) as number}}))
              }}/>
            </Fragment>
          )
        )
      }
    </g>
  )
}
