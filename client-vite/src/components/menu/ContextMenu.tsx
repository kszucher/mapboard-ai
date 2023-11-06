import {Dropdown} from "flowbite-react"
import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {gptGenNodeMermaid, gptGenNodesS, gptGenNodesT} from "../../selectors/GptPrompter"
import {getSubProcessList} from "../../selectors/MapProcess"
import {getCountXASD, getCountXASU, getCountXCO1, getCountXRD0SO1, getCountXRD1SO1, getCountXSO1, getCountXSO2, getG, getR0, getX, getXAEO, getXRD0, getXRD1, isDirL, isDirR, isXASVN, isXD, isXDS, isXR, isXS} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"
import {ControlTypes, PageState} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../../state/NodeApiState"

const DropdownHelper = (label: string) => {
  return (
    <li>
      <button id="doubleDropdownButton" type="button" className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
        {label}
        <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
        </svg>
      </button>
    </li>
  )
}

export const ContextMenu: FC = () => {
  const contextMenu = useSelector((state: RootState) => state.editor.contextMenu)
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { frameId, frameIdList } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div id="dropdown" className="fixed z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" hidden={!contextMenu.isActive} style={{left: contextMenu.position.x + 1, top: contextMenu.position.y -20}}>
      <div hidden={contextMenu.type !== 'map'}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="">
          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('View')}>
            {getG(m).density === 'small' && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setDensityLarge', payload: null}))}}>{'Set Cozy'}</Dropdown.Item>}
            {getG(m).density === 'large' && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setDensitySmall', payload: null}))}}>{'Set Compact'}</Dropdown.Item>}
            {getG(m).alignment === 'adaptive' && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setAlignmentCentered', payload: null}))}}>{'Set Centered'}</Dropdown.Item>}
            {getG(m).alignment === 'centered' && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setAlignmentAdaptive', payload: null}))}}>{'Set Adaptive'}</Dropdown.Item>}
          </Dropdown>
          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('Connections')}>
            {!connectionHelpersVisible && <Dropdown.Item onClick={()=>{dispatch(actions.showConnectionHelpers())}}>{'Show Helpers'}</Dropdown.Item>}
            {connectionHelpersVisible && <Dropdown.Item onClick={()=>{dispatch(actions.hideConnectionHelpers())}}>{'Hide Helpers'}</Dropdown.Item>}
          </Dropdown>
          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('Tabs')}>
            {<Dropdown.Item onClick={()=>{dispatch(actions.setPageState(PageState.WS_RENAME_MAP))}}>{'Rename'}</Dropdown.Item>}
            {<Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.createMapInTab.initiate())}}>{'Create'}</Dropdown.Item>}
            {<Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.createMapInTabDuplicate.initiate({mapId: getMapId()}))}}>{'Duplicate'}</Dropdown.Item>}
            {<Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.moveUpMapInTab.initiate({mapId: getMapId()}))}}>{'Move Up'}</Dropdown.Item>}
            {<Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.moveDownMapInTab.initiate({mapId: getMapId()}))}}>{'Move Down'}</Dropdown.Item>}
            {<Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.deleteMap.initiate({mapId: getMapId()}))}}>{'Remove'}</Dropdown.Item>}
          </Dropdown>
          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('Frames')}>
            {frameId === '' && frameIdList.length > 0 && <Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.selectMap.initiate({mapId: getMapId(), frameId: frameIdList[0]}))}}>{'Open'}</Dropdown.Item>}
            {<Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.createMapFrameImport.initiate({mapId: getMapId(), frameId: getFrameId()}))}}>{'Import'}</Dropdown.Item>}
            {frameId !== '' && frameIdList.length > 0 && <Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.createMapFrameDuplicate.initiate({mapId: getMapId(), frameId: getFrameId()}))}}>{'Duplicate'}</Dropdown.Item>}
            {frameId !== '' && frameIdList.length > 0 && <Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.deleteMapFrame.initiate({mapId: getMapId(), frameId: getFrameId()}))}}>{'Delete'}</Dropdown.Item>}
            {frameId !== '' && <Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.selectMap.initiate({mapId: getMapId(), frameId: ''}))}}>{'Close'}</Dropdown.Item>}
          </Dropdown>
          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('Shares')}>
            {<Dropdown.Item onClick={()=>{dispatch(actions.setPageState(PageState.WS_SHARES))}}>{'Shares'}</Dropdown.Item>}
            {<Dropdown.Item onClick={()=>{dispatch(actions.setPageState(PageState.WS_SHARE_THIS_MAP))}}>{'Share This Map'}</Dropdown.Item>}
          </Dropdown>
        </ul>
      </div>
      <div hidden={contextMenu.type !== 'node'}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="">
          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('Select')}>
            {isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyX', payload: null}))}}>{'Node Family'}</Dropdown.Item>}
            {isXR(m) && getCountXRD0SO1(m) > 0 && !getXRD0(m).selected && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyXRD0', payload: null}))}}>{'Node Family Right'}</Dropdown.Item>}
            {isXR(m) && getCountXRD1SO1(m) > 0 && !getXRD1(m).selected && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyXRD1', payload: null}))}}>{'Node Family Left'}</Dropdown.Item>}
            {isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectSelfX', payload: null}))}}>{'Node'}</Dropdown.Item>}
            {isXD(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectXR', payload: null}))}}>{'Node'}</Dropdown.Item>}
            {isXS(m) && getCountXCO1(m) > 0 && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectCFF', payload: {path: getX(m).path}}))}}>{'First Cell'}</Dropdown.Item>}
            {<Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectRA', payload: null}))}}>{'All Root'}</Dropdown.Item>}
          </Dropdown>
          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('Insert')}>
            {<Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'insertR', payload: null}))}}>{'Root'}</Dropdown.Item>}
            {isXS(m) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'insertSU', payload: null}))}}>{'Node Above'}</Dropdown.Item>}
            {isXR(m) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'insertSOR', payload: null}))}}>{'Node Right'}</Dropdown.Item>}
            {isXS(m) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'insertSO', payload: null}))}}>{'Node Out'}</Dropdown.Item>}
            {isXS(m) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'insertSD', payload: null}))}}>{'Node Below'}</Dropdown.Item>}
            {(isXR(m) || isXS(m))  && <Dropdown.Item onClick={()=>{dispatch(actions.setPageState(PageState.WS_CREATE_TABLE))}}>{'Table Out'}</Dropdown.Item>}
            {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'insertSCRU', payload: null}))}}>{'Table Row Above'}</Dropdown.Item>}
            {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'insertSCRD', payload: null}))}}>{'Table Row Below'}</Dropdown.Item>}
            {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'insertSCCL', payload: null}))}}>{'Table Column Left'}</Dropdown.Item>}
            {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'insertSCCR', payload: null}))}}>{'Table Column Right'}</Dropdown.Item>}
          </Dropdown>
          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('Edit')}>
            {!formatterVisible && <Dropdown.Item onClick={()=>{dispatch(actions.openFormatter())}}>{'Open Formatter'}</Dropdown.Item>}
            {formatterVisible && <Dropdown.Item onClick={()=>{dispatch(actions.closeFormatter())}}>{'Close Formatter'}</Dropdown.Item>}
            {isXS(m) && getCountXCO1(m) === 0 && getX(m).linkType === '' && <Dropdown.Item onClick={()=>{dispatch(actions.setPageState(PageState.WS_CREATE_MAP_IN_MAP))}}>{'Turn Into Submap'}</Dropdown.Item>}
            {isXS(m) && getCountXCO1(m) > 0 && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'transpose', payload: null}))}}>{'Transpose'}</Dropdown.Item>}
            {getXAEO(m).map(ti => ti.taskStatus).includes(0) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeOn', payload: null}))}}>{'Task Mode On'}</Dropdown.Item>}
            {getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeOff', payload: null}))}}>{'Task Mode Off'}</Dropdown.Item>}
            {getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeReset', payload: null}))}}>{'Task Mode Reset'}</Dropdown.Item>}
            {isXR(m) && getX(m).controlType !== ControlTypes.NONE && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeNone', payload: null}))}}>{'Control Type None'}</Dropdown.Item>}
            {isXR(m) && getX(m).controlType !== ControlTypes.INGESTION && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeIngestion', payload: null}))}}>{'Control Type Ingestion'}</Dropdown.Item>}
            {isXR(m) && getX(m).controlType !== ControlTypes.EXTRACTION && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeExtraction', payload: null}))}}>{'Control Type Extraction'}</Dropdown.Item>}
          </Dropdown>
          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('Move')}>
            {isXS(m) && isXASVN(m) && getCountXASU(m) > 0 && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSU', payload: null}))}}>{'Node Up'}</Dropdown.Item>}
            {isXS(m) && isXASVN(m) && getCountXASD(m) > 0 && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSD', payload: null}))}}>{'Node Down'}</Dropdown.Item>}
            {isXS(m) && isDirR(m) && isXASVN(m) && getCountXASU(m) > 0 && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSO', payload: null}))}}>{'Node Out'}</Dropdown.Item>}
            {isXS(m) && isDirL(m) && isXASVN(m) && getCountXASU(m) > 0 && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSO', payload: null}))}}>{'Node Out'}</Dropdown.Item>}
            {isXS(m) && isDirL(m) && isXASVN(m) && !isXDS(m) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSI', payload: null}))}}>{'Node In'}</Dropdown.Item>}
            {isXS(m) && isDirR(m) && isXASVN(m) && !isXDS(m) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSI', payload: null}))}}>{'Node In'}</Dropdown.Item>}
            {(isXR(m) && getCountXSO2(m) > 0) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveS2TOR', payload: null}))}}>{'Sub Nodes To Table'}</Dropdown.Item>}
            {(isXS(m) && getCountXSO1(m) > 0) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveS2TO', payload: null}))}}>{'Sub Nodes To Table'}</Dropdown.Item>}
          </Dropdown>
          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('Generate')}>
            {isXD(m) && getX(m).selection === 'f' && getR0(m).note !== '' && <Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.getGptSuggestions.initiate(gptGenNodesS(m)))}}>{'Structure Extension'}</Dropdown.Item>}
            {getCountXCO1(m) > 0 && <Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.getGptSuggestions.initiate(gptGenNodesT(m)))}}>{'Table Fill'}</Dropdown.Item>}
            {(isXR(m) || isXS(m)) && getCountXCO1(m) === 0 && getX(m).contentType === 'text' && <Dropdown.Item onClick={()=>{dispatch(nodeApi.endpoints.getGptSuggestions.initiate(gptGenNodeMermaid(m)))}}>{'Diagram'}</Dropdown.Item>}
          </Dropdown>
          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('Dev')}>
            {<Dropdown.Item onClick={()=>{console.log(getX(m))}}>{'show node'}</Dropdown.Item>}
            {<Dropdown.Item onClick={()=>{console.log(getX(m).path)}}>{'show node/path'}</Dropdown.Item>}
            {<Dropdown.Item onClick={()=>{console.log(getX(m).nodeId)}}>{'show node/nodeId'}</Dropdown.Item>}
            {<Dropdown.Item onClick={()=>{console.log({processId: getMapId(), subProcesses: getSubProcessList(m, getX(m).nodeId)})}}>{'show PROCESS'}</Dropdown.Item>}
            {isXR(m) && <Dropdown.Item onClick={()=>{console.log([getX(m).llmDataType, getX(m).llmDataId])}}>{'show llmData'}</Dropdown.Item>}
            {isXR(m) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setLlmData', payload: null}))}}>{'set llm data example'}</Dropdown.Item>}
            {isXR(m) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'clearLlmData', payload: null}))}}>{'reset llm data'}</Dropdown.Item>}
            {(isXR(m) || isXS(m)) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setBlur', payload: null}))}}>{'set blur'}</Dropdown.Item>}
            {(isXR(m) || isXS(m)) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'clearBlur', payload: null}))}}>{'clear blur'}</Dropdown.Item>}
          </Dropdown>
        </ul>
      </div>
    </div>
  )
}
