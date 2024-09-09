import {DropdownMenu, Dialog, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../editorMutations/EditorMutations.ts"
import {getNodeMode, getAXS, getFXS, getLXS, getXR, getXS, isAXRS, isAXSN} from "../mapQueries/MapQueries.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import Dots from "../../assets/dots.svg?react"
import {ControlType, DialogState, NodeMode} from "../consts/Enums.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts";

export const NodeActions = () => {
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const nodeMode = getNodeMode(m)
  const dispatch = useDispatch<AppDispatch>()
  const dm = (type: MM, payload? : any) => dispatch(actions.mapReducer({type, payload}))
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
              <DropdownMenu.Item onClick={() => dm(MM.selectRA)}>{'All Root'}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Insert'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => dm(MM.insertR)}>{'Root Out'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => dm(MM.insertRSO)}>{'Struct Out'}</DropdownMenu.Item>
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
              {getXR(m).controlType !== ControlType.NONE && <DropdownMenu.Item onClick={() => dm(MM.setControlTypeNone)}>{'Control Type None'}</DropdownMenu.Item>}
              {getXR(m).controlType !== ControlType.INGESTION && <DropdownMenu.Item onClick={() => dm(MM.setControlTypeIngestion)}>{'Control Type Ingestion'}</DropdownMenu.Item>}
              {getXR(m).controlType !== ControlType.EXTRACTION && <DropdownMenu.Item onClick={() => dm(MM.setControlTypeExtraction)}>{'Control Type Extraction'}</DropdownMenu.Item>}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      }
      {nodeMode === NodeMode.EDIT_STRUCT &&
        <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Select'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {getXS(m).so1.length > 0 && getXS(m).selection === 's' && <DropdownMenu.Item onClick={() => dm(MM.selectFamilyX)}>{'Node Family'}</DropdownMenu.Item>}
              {getXS(m).so1.length > 0 && getXS(m).selection === 'f' && <DropdownMenu.Item onClick={() => dm(MM.selectSelfX)}>{'Node'}</DropdownMenu.Item>}
              {getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MM.selectCFF, {path: getXS(m).path})}>{'First Cell'}</DropdownMenu.Item>}
              {<DropdownMenu.Item onClick={() => dm(MM.selectSA)}>{'All Struct'}</DropdownMenu.Item>}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Insert'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => dm(MM.insertSU)}>{'Struct Above'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => dm(MM.insertSSO)}>{'Struct Out'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => dm(MM.insertSD)}>{'Struct Below'}</DropdownMenu.Item>
              {!getXS(m).path.includes('c') && <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE_O))}>{'Table Out'}</DropdownMenu.Item></Dialog.Trigger>}
              {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MM.insertSCRU)}>{'Table Row Above'}</DropdownMenu.Item>}
              {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MM.insertSCRD)}>{'Table Row Below'}</DropdownMenu.Item>}
              {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MM.insertSCCL)}>{'Table Column Left'}</DropdownMenu.Item>}
              {getXS(m).selection === 's' && getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MM.insertSCCR)}>{'Table Column Right'}</DropdownMenu.Item>}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Move'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {isAXSN(m) && getFXS(m).su.length > 0 && <DropdownMenu.Item onClick={() => dm(MM.moveSU)}>{'Node Up'}</DropdownMenu.Item>}
              {isAXSN(m) && getLXS(m).sd.length > 0 && <DropdownMenu.Item onClick={() => dm(MM.moveSD)}>{'Node Down'}</DropdownMenu.Item>}
              {isAXSN(m) && getFXS(m).su.length > 0 && <DropdownMenu.Item onClick={() => dm(MM.moveSO)}>{'Node Out'}</DropdownMenu.Item>}
              {!isAXRS(m) && isAXSN(m) && <DropdownMenu.Item onClick={() => dm(MM.moveSI)}>{'Node In'}</DropdownMenu.Item>}
              {getXS(m).so1.length > 0 && getXS(m).co.length === 0 && <DropdownMenu.Item onClick={() => dm(MM.moveS2T)}>{'Sub Nodes To Table'}</DropdownMenu.Item>}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Edit'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {!formatterVisible && <DropdownMenu.Item onClick={() => dispatch(actions.openFormatter())}>{'Open Formatter'}</DropdownMenu.Item>}
              {formatterVisible && <DropdownMenu.Item onClick={() => dispatch(actions.closeFormatter())}>{'Close NodeActionsEditFormatter'}</DropdownMenu.Item>}
              {getXS(m).co1.length === 0 && getXS(m).linkType === '' && <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_MAP_IN_MAP))}>{'Create Sub Map'}</DropdownMenu.Item></Dialog.Trigger>}
              {getAXS(m).length === 1 && getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => dm(MM.transpose)}>{'Transpose'}</DropdownMenu.Item>}
              {getAXS(m).length === 1 && getXS(m).co.length === 0 && [getXS(m), ...getXS(m).so].map(ti => ti.taskStatus).includes(0) && <DropdownMenu.Item onClick={() => dm(MM.setTaskModeOn)}>{'Task Mode On'}</DropdownMenu.Item>}
              {getAXS(m).length === 1 && [getXS(m), ...getXS(m).so].map(ti => ti.taskStatus).some(el => el > 0) && <DropdownMenu.Item onClick={() => dm(MM.setTaskModeOff)}>{'Task Mode Off'}</DropdownMenu.Item>}
              {getAXS(m).length === 1 && [getXS(m), ...getXS(m).so].map(ti => ti.taskStatus).some(el => el > 0) && <DropdownMenu.Item onClick={() => dm(MM.setTaskModeReset)}>{'Task Mode Reset'}</DropdownMenu.Item>}
              {getXS(m).contentType === 'equation' && getXS(m).co1.length === 0 && <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.EDIT_CONTENT_EQUATION))}>{'Edit Equation'}</DropdownMenu.Item></Dialog.Trigger>}
              {<DropdownMenu.Item onClick={() => dm(MM.setBlur)}>{'set blur'}</DropdownMenu.Item>}
              {<DropdownMenu.Item onClick={() => dm(MM.clearBlur)}>{'clear blur'}</DropdownMenu.Item>}
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
              <DropdownMenu.Item onClick={() => dm(MM.insertCSO)}>{'Struct Out'}</DropdownMenu.Item>
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
