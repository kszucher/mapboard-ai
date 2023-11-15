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
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { frameId, frameIdList } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div id="dropdown" className="fixed z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" hidden={!contextMenu.isActive} style={{left: contextMenu.position.x + 1, top: contextMenu.position.y -20}}>
      <div hidden={contextMenu.type !== 'map'}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="">

          <Dropdown label="Dropdown" placement="right-start" renderTrigger={() => DropdownHelper('Connections')}>
            {!connectionHelpersVisible && <Dropdown.Item onClick={()=>{dispatch(actions.showConnectionHelpers())}}>{'Show Helpers'}</Dropdown.Item>}
            {connectionHelpersVisible && <Dropdown.Item onClick={()=>{dispatch(actions.hideConnectionHelpers())}}>{'Hide Helpers'}</Dropdown.Item>}
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
            {isXR(m) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setLlmData', payload: null}))}}>{'set llm data'}</Dropdown.Item>}
            {isXR(m) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'clearLlmData', payload: null}))}}>{'clear llm data'}</Dropdown.Item>}
            {(isXR(m) || isXS(m)) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'setBlur', payload: null}))}}>{'set blur'}</Dropdown.Item>}
            {(isXR(m) || isXS(m)) && <Dropdown.Item onClick={()=>{dispatch(actions.mapAction({type: 'clearBlur', payload: null}))}}>{'clear blur'}</Dropdown.Item>}
          </Dropdown>
        </ul>
      </div>
    </div>
  )
}
