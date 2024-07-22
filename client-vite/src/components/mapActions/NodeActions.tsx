import {DropdownMenu, Dialog, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {getNodeMode, getXAS, getXFS, getXLS, getXR, getXS, idToS, isXARS, isXASVN} from "../../queries/MapQueries.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {mSelector} from "../../state/EditorState.ts"
import Dots from "../../assets/dots.svg?react"
import {ControlType, DialogState, NodeMode} from "../../state/Enums.ts"

export const NodeActions = () => {
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const nodeMode = getNodeMode(m)
  const dispatch = useDispatch<AppDispatch>()
  const dm = (type: MR, payload? : any) => dispatch(actions.mapReducer({type, payload}))
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={nodeMode === NodeMode.VIEW}>
        <IconButton variant="solid" color="gray">
          <Dots/>
        </IconButton>
      </DropdownMenu.Trigger>
      {nodeMode === NodeMode.EDIT_ROOT &&
        <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Select'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => dm(MR.selectRA)}>{'All Root'}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Insert'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => dm(MR.insertR)}>{'Root Out'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => dm(MR.insertRSO)}>{'Struct Out'}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Move'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Edit'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {getXR(m).controlType !== ControlType.NONE && <DropdownMenu.Item onClick={() => dm(MR.setControlTypeNone)}>{'Control Type None'}</DropdownMenu.Item>}
              {getXR(m).controlType !== ControlType.INGESTION && <DropdownMenu.Item onClick={() => dm(MR.setControlTypeIngestion)}>{'Control Type Ingestion'}</DropdownMenu.Item>}
              {getXR(m).controlType !== ControlType.EXTRACTION && <DropdownMenu.Item onClick={() => dm(MR.setControlTypeExtraction)}>{'Control Type Extraction'}</DropdownMenu.Item>}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      }
      {nodeMode === NodeMode.EDIT_STRUCT &&
        <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Select'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {getXS(m).so1.length > 0 && getXS(m).selection === 's' && <DropdownMenu.Item onClick={() => dm(MR.selectFamilyX)}>{'Node Family'}</DropdownMenu.Item>}
              {getXS(m).so1.length > 0 && getXS(m).selection === 'f' && <DropdownMenu.Item onClick={() => dm(MR.selectSelfX)}>{'Node'}</DropdownMenu.Item>}
              {getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MR.selectCFF, {path: getXS(m).path})}>{'First Cell'}</DropdownMenu.Item>}
              {<DropdownMenu.Item onClick={() => dm(MR.selectSA)}>{'All Struct'}</DropdownMenu.Item>}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Insert'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => dm(MR.insertSU)}>{'Struct Above'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => dm(MR.insertSSO)}>{'Struct Out'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => dm(MR.insertSD)}>{'Struct Below'}</DropdownMenu.Item>
              {!getXS(m).path.includes('c') && <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE_U))}>{'Table Above'}</DropdownMenu.Item></Dialog.Trigger>}
              {!getXS(m).path.includes('c') && <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE_D))}>{'Table Below'}</DropdownMenu.Item></Dialog.Trigger>}
              {!getXS(m).path.includes('c') && <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE_O))}>{'Table Out'}</DropdownMenu.Item></Dialog.Trigger>}
              {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MR.insertSCRU)}>{'Table Row Above'}</DropdownMenu.Item>}
              {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MR.insertSCRD)}>{'Table Row Below'}</DropdownMenu.Item>}
              {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MR.insertSCCL)}>{'Table Column Left'}</DropdownMenu.Item>}
              {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MR.insertSCCR)}>{'Table Column Right'}</DropdownMenu.Item>}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Move'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {isXASVN(m) && getXFS(m).su.length > 0 && <DropdownMenu.Item onClick={() => dm(MR.moveSU)}>{'Node Up'}</DropdownMenu.Item>}
              {isXASVN(m) && getXLS(m).sd.length > 0 && <DropdownMenu.Item onClick={() => dm(MR.moveSD)}>{'Node Down'}</DropdownMenu.Item>}
              {isXASVN(m) && getXFS(m).su.length > 0 && <DropdownMenu.Item onClick={() => dm(MR.moveSO)}>{'Node Out'}</DropdownMenu.Item>}
              {!isXARS(m) && isXASVN(m) && <DropdownMenu.Item onClick={() => dm(MR.moveSI)}>{'Node In'}</DropdownMenu.Item>}
              {getXS(m).so1.length > 0 && getXS(m).co.length === 0 && <DropdownMenu.Item onClick={() => dm(MR.moveS2T)}>{'Sub Nodes To Table'}</DropdownMenu.Item>}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Edit'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {!formatterVisible && <DropdownMenu.Item onClick={() => dispatch(actions.openFormatter())}>{'Open Formatter'}</DropdownMenu.Item>}
              {formatterVisible && <DropdownMenu.Item onClick={() => dispatch(actions.closeFormatter())}>{'Close NodeActionsEditFormatter'}</DropdownMenu.Item>}
              {getXS(m).co1.length === 0 && getXS(m).linkType === '' && <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_MAP_IN_MAP))}>{'Create Sub Map'}</DropdownMenu.Item></Dialog.Trigger>}
              {getXAS(m).length ===  1 && getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MR.transpose)}>{'Transpose'}</DropdownMenu.Item>}
              {getXAS(m).length ===  1 && getXS(m).co.length === 0 && [getXS(m).nodeId, ...getXS(m).so].map(nid => idToS(m, nid)).map(ti => ti.taskStatus).includes(0) && <DropdownMenu.Item onClick={() => dm(MR.setTaskModeOn)}>{'Task Mode On'}</DropdownMenu.Item>}
              {getXAS(m).length ===  1 && getXS(m).co.length === 0 && [getXS(m).nodeId, ...getXS(m).so].map(nid => idToS(m, nid)).map(ti => ti.taskStatus).some(el => el > 0) && <DropdownMenu.Item onClick={() => dm(MR.setTaskModeOff)}>{'Task Mode Off'}</DropdownMenu.Item>}
              {getXAS(m).length ===  1 && getXS(m).co.length === 0 && [getXS(m).nodeId, ...getXS(m).so].map(nid => idToS(m, nid)).map(ti => ti.taskStatus).some(el => el > 0) && <DropdownMenu.Item onClick={() => dm(MR.setTaskModeReset)}>{'Task Mode Reset'}</DropdownMenu.Item>}
              {getXS(m).contentType === 'equation' && getXS(m).co1.length === 0 && <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.EDIT_CONTENT_EQUATION))}>{'Edit Equation'}</DropdownMenu.Item></Dialog.Trigger>}
              {<DropdownMenu.Item onClick={() => dm(MR.setBlur)}>{'set blur'}</DropdownMenu.Item>}
              {<DropdownMenu.Item onClick={() => dm(MR.clearBlur)}>{'clear blur'}</DropdownMenu.Item>}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      }
      {nodeMode === NodeMode.EDIT_CELL &&
        <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Select'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Insert'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => dm(MR.insertCSO)}>{'Struct Out'}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Move'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Edit'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      }
    </DropdownMenu.Root>
  )
}
