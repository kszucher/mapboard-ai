import {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {getG, getXAS, getXAEO, getXFS, getXLS, getXS, isXASVN, isXARS, isXAS, mS} from "../../queries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"
import {Dialog, ContextMenu} from "@radix-ui/themes"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {DialogState} from "../../state/Enums.ts"

export const MapSvgSSelectionPrimary: FC = () => {
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const xs = getXS(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    isXAS(m) && getXAS(m).length === 1 && !selectionRectCoords.length &&
    <Fragment>
      {xs.selection === 's' && (xs.sBorderColor || xs.sFillColor || xs.taskStatus > 1 || xs.co1.length) &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}{...pathCommonProps}
          d={getPolygonPath(m, xs, 'sSelf', 2)}
        />
      }
      {xs.selection === 's' && !((xs.sBorderColor || xs.sFillColor) || xs.taskStatus > 1 || xs.co1.length) &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}{...pathCommonProps}
          d={getPolygonPath(m, xs, 'sSelf', -2)}
        />
      }
      {xs.selection === 'f' &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}{...pathCommonProps}
          d={getPolygonPath(m, xs, 'sFamily', 4)}
        />
      }
      <ContextMenu.Root onOpenChange={(value) => console.log('OPENNESS:', value /*TODO: set a redux variable, that removes map event listeners*/)}>
        <g transform={`translate(${Math.round(xs.nodeStartX)}, ${Math.round(xs.nodeStartY)})`}>
          <ContextMenu.Trigger>
            <rect width={xs.selfW} height={xs.selfH} fill={'transparent'}/>
          </ContextMenu.Trigger>
          <ContextMenu.Content alignOffset={120}>
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>{'Select'}</ContextMenu.SubTrigger>
              <ContextMenu.SubContent>
                {getXS(m).so1.length > 0 && getXS(m).selection === 's' && <ContextMenu.Item onClick={() => md(MR.selectFamilyX)}>{'Node Family'}</ContextMenu.Item>}
                {getXS(m).so1.length > 0 && getXS(m).selection === 'f' && <ContextMenu.Item onClick={() => md(MR.selectSelfX)}>{'Node'}</ContextMenu.Item>}
                {getXS(m).co1.length > 0 && <ContextMenu.Item onClick={() => md(MR.selectCFF, {path: getXS(m).path})}>{'First Cell'}</ContextMenu.Item>}
                {<ContextMenu.Item onClick={() => md(MR.selectSA)}>{'All Struct'}</ContextMenu.Item>}
              </ContextMenu.SubContent>
            </ContextMenu.Sub>
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>{'Insert'}</ContextMenu.SubTrigger>
              <ContextMenu.SubContent>
                <ContextMenu.Item onClick={() => md(MR.insertSU)}>{'Struct Above'}</ContextMenu.Item>
                <ContextMenu.Item onClick={() => md(MR.insertSSO)}>{'Struct Out'}</ContextMenu.Item>
                <ContextMenu.Item onClick={() => md(MR.insertSD)}>{'Struct Below'}</ContextMenu.Item>
                {!getXS(m).path.includes('c') && <Dialog.Trigger><ContextMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE_U))}>{'Table Above'}</ContextMenu.Item></Dialog.Trigger>}
                {!getXS(m).path.includes('c') && <Dialog.Trigger><ContextMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE_D))}>{'Table Below'}</ContextMenu.Item></Dialog.Trigger>}
                {!getXS(m).path.includes('c') && <Dialog.Trigger><ContextMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE_O))}>{'Table Out'}</ContextMenu.Item></Dialog.Trigger>}
                {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <ContextMenu.Item onClick={() => md(MR.insertSCRU)}>{'Table Row Above'}</ContextMenu.Item>}
                {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <ContextMenu.Item onClick={() => md(MR.insertSCRD)}>{'Table Row Below'}</ContextMenu.Item>}
                {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <ContextMenu.Item onClick={() => md(MR.insertSCCL)}>{'Table Column Left'}</ContextMenu.Item>}
                {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <ContextMenu.Item onClick={() => md(MR.insertSCCR)}>{'Table Column Right'}</ContextMenu.Item>}
              </ContextMenu.SubContent>
            </ContextMenu.Sub>
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>{'Move'}</ContextMenu.SubTrigger>
              <ContextMenu.SubContent>
                {isXASVN(m) && getXFS(m).su.length > 0 && <ContextMenu.Item onClick={() => md(MR.moveSU)}>{'Node Up'}</ContextMenu.Item>}
                {isXASVN(m) && getXLS(m).sd.length > 0 && <ContextMenu.Item onClick={() => md(MR.moveSD)}>{'Node Down'}</ContextMenu.Item>}
                {isXASVN(m) && getXFS(m).su.length > 0 && <ContextMenu.Item onClick={() => md(MR.moveSO)}>{'Node Out'}</ContextMenu.Item>}
                {!isXARS(m) && isXASVN(m) && <ContextMenu.Item onClick={() => md(MR.moveSI)}>{'Node In'}</ContextMenu.Item>}
                {getXS(m).so1.length > 0 && !mS(getXAEO(m)).some(ti => ti.path.includes('c')) && <ContextMenu.Item onClick={() => md(MR.moveS2TO)}>{'Sub Nodes To Table'}</ContextMenu.Item>}
              </ContextMenu.SubContent>
            </ContextMenu.Sub>
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>{'Edit'}</ContextMenu.SubTrigger>
              <ContextMenu.SubContent>
                {!formatterVisible && <ContextMenu.Item onClick={() => dispatch(actions.openFormatter())}>{'Open Formatter'}</ContextMenu.Item>}
                {formatterVisible && <ContextMenu.Item onClick={() => dispatch(actions.closeFormatter())}>{'Close Formatter'}</ContextMenu.Item>}
                <Dialog.Trigger>
                  {getXS(m).co1.length === 0 && getXS(m).linkType === '' && <ContextMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_MAP_IN_MAP))}>{'Create Sub Map'}</ContextMenu.Item>}
                </Dialog.Trigger>
                {getXS(m).co1.length > 0 && <ContextMenu.Item onClick={() => md(MR.transpose)}>{'Transpose'}</ContextMenu.Item>}
                {mS(getXAEO(m)).map(ti => ti.taskStatus).includes(0) && <ContextMenu.Item onClick={() => md(MR.setTaskModeOn)}>{'Task Mode On'}</ContextMenu.Item>}
                {mS(getXAEO(m)).map(ti => ti.taskStatus).some(el => el > 0) && <ContextMenu.Item onClick={() => md(MR.setTaskModeOff)}>{'Task Mode Off'}</ContextMenu.Item>}
                {mS(getXAEO(m)).map(ti => ti.taskStatus).some(el => el > 0) && <ContextMenu.Item onClick={() => md(MR.setTaskModeReset)}>{'Task Mode Reset'}</ContextMenu.Item>}
                <Dialog.Trigger>
                  {getXS(m).contentType === 'equation' && getXS(m).co1.length === 0 && <ContextMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.EDIT_CONTENT_EQUATION))}>{'Edit Equation'}</ContextMenu.Item>}
                </Dialog.Trigger>
                <Dialog.Trigger>
                  {getXS(m).contentType === 'mermaid' && getXS(m).co1.length === 0 && <ContextMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.EDIT_CONTENT_MERMAID))}>{'Edit Mermaid'}</ContextMenu.Item>}
                </Dialog.Trigger>
                {<ContextMenu.Item onClick={() => md(MR.setBlur)}>{'set blur'}</ContextMenu.Item>}
                {<ContextMenu.Item onClick={() => md(MR.clearBlur)}>{'clear blur'}</ContextMenu.Item>}
              </ContextMenu.SubContent>
            </ContextMenu.Sub>
          </ContextMenu.Content>
        </g>
      </ContextMenu.Root>
    </Fragment>
  )
}
