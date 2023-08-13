import React, {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {getCountCO1, getCountSO1, getNodeByPath, getR0, getRi, getX, getXRi, getXSSCXX, isXR, isXS} from "../core/MapUtils"
import {adjustIcon} from "../core/Utils";
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {PageState} from "../state/Enums"
import {N} from "../state/MapStateTypes"
import {MapSvgIcon} from "./MapSvgIcons";
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
              <g
                transform={`translate(${adjustIcon(n.nodeStartX + 10)}, ${adjustIcon(n.nodeY - 12)})`}
                {...{vectorEffect: 'non-scaling-stroke'}}
                style={{
                  transition: 'all 0.3s',
                  transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
                  transitionProperty: 'all'
                }}
              >
                <g width="24" height="24" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx={4} ry={4} fill={'#666666'}/>
                  <rect width="24" height="24" style={{opacity: 0}} onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    dispatch(actions.mapAction({type: 'insertSCSO', payload: {rowIndex: n.path.at(-2) as number, colIndex: n.path.at(-1) as number}}))
                  }}
                  />
                </g>
              </g>
            </Fragment>
          )
        )
      }
    </g>
  )
}
