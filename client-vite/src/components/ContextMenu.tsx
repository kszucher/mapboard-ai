import React, {FC, ReactNode} from "react"
import {useDispatch, useSelector} from "react-redux"
import {nodeApi} from "../apis/NodeApi";
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {generateLlmInfo, gptGenNodeMermaid, gptGenNodesS, gptGenNodesT} from "../selectors/GptPrompter"
import {getCountXASD, getCountXASU, getCountXCO1, getCountXRD0S, getCountXRD1S, getCountXSO1, getCountXSO2, getG, getR0, getX, getXAEO, getXRD0, getXRD1, isDirL, isDirR, isXASVN, isXD, isXDS, isXR, isXS} from "../selectors/MapSelector"
import {mSelector} from "../state/EditorState"
import {ControlTypes, PageState} from "../state/Enums"
import {getMapId} from "../state/NodeApiState"

const menuClassName = "block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"

const ContextMenuSubList = ({menuId, children}: {menuId: string, children: ReactNode}) => {
  return (
    <li>
      <button
        id="doubleDropdownButton"
        data-dropdown-toggle={'subMenu' + menuId}
        data-dropdown-placement="right-start"
        type="button"
        className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        {menuId}
        {
          <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
        }
      </button>
      <div id={'subMenu' + menuId} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">
          {children}
        </ul>
      </div>
    </li>
  )
}

export const ContextMenu: FC = () => {
  const contextMenu = useSelector((state: RootState) => state.editor.contextMenu)
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div id="dropdown" className="fixed z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" hidden={!contextMenu.isActive} style={{left: contextMenu.position.x + 1, top: contextMenu.position.y -20}}>
      <div hidden={contextMenu.type !== 'map'}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="">
          <ContextMenuSubList menuId={'View'}>
            { mExists && getG(m).density === 'small' && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'setDensityLarge', payload: null}))}}>{'Set Cozy'}</a></li> }
            { mExists && getG(m).density === 'large' && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'setDensitySmall', payload: null}))}}>{'Set Compact'}</a></li> }
            { mExists && getG(m).alignment === 'adaptive' && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'setAlignmentCentered', payload: null}))}}>{'Set Centered'}</a></li> }
            { mExists && getG(m).alignment === 'centered' && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'setAlignmentAdaptive', payload: null}))}}>{'Set Adaptive'}</a></li> }
          </ContextMenuSubList>
          <ContextMenuSubList menuId={'Connections'}>
            { mExists && !connectionHelpersVisible && <li><a className={menuClassName} onClick={()=>{dispatch(actions.showConnectionHelpers())}}>{'Show Helpers'}</a></li> }
            { mExists && connectionHelpersVisible && <li><a className={menuClassName} onClick={()=>{dispatch(actions.hideConnectionHelpers())}}>{'Hide Helpers'}</a></li> }
          </ContextMenuSubList>
          <ContextMenuSubList menuId={'Tabs'}>
            { mExists && <li><a className={menuClassName} onClick={()=>{dispatch(actions.setPageState(PageState.WS_RENAME_MAP))}}>Rename Map</a></li> }
            { mExists && <li><a className={menuClassName} onClick={()=>{dispatch(nodeApi.endpoints.createMapInTab.initiate())}}>Add Tab Map</a></li> }
            { mExists && <li><a className={menuClassName} onClick={()=>{dispatch(nodeApi.endpoints.moveUpMapInTab.initiate({mapId: getMapId()}))}}>Move Tab Map Up</a></li> }
            { mExists && <li><a className={menuClassName} onClick={()=>{dispatch(nodeApi.endpoints.moveDownMapInTab.initiate({mapId: getMapId()}))}}>Move Tab Map Down</a></li> }
            { mExists && <li><a className={menuClassName} onClick={()=>{dispatch(nodeApi.endpoints.deleteMap.initiate({mapId: getMapId()}))}}>Remove Tab Map</a></li> }
          </ContextMenuSubList>
          <ContextMenuSubList menuId={'Shares'}>
            { mExists && <li><a className={menuClassName} onClick={()=>{dispatch(actions.setPageState(PageState.WS_SHARES))}}>{'Shares'}</a></li> }
            { mExists && <li><a className={menuClassName} onClick={()=>{dispatch(actions.setPageState(PageState.WS_SHARE_THIS_MAP))}}>{'Share This Map'}</a></li> }
          </ContextMenuSubList>
        </ul>
      </div>
      <div hidden={contextMenu.type !== 'node'}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="multiLevelDropdownButton">
          <ContextMenuSubList menuId={'Select'}>
            { mExists && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyX', payload: null}))}}>Node Family</a></li> }
            { mExists && isXR(m) && getCountXRD0S(m) > 0 && !getXRD0(m).selected && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyXRD0', payload: null}))}}>Node Family Right</a></li> }
            { mExists && isXR(m) && getCountXRD1S(m) > 0 && !getXRD1(m).selected && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyXRD1', payload: null}))}}>Node Family Left</a></li> }
            { mExists && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'selectXS', payload: null}))}}>Node</a></li> }
            { mExists && isXD(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'selectXR', payload: null}))}}>Node</a></li> }
            { mExists && isXS(m) && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'selectCFF', payload: {path: getX(m).path}}))}}>First Cell</a></li> }
          </ContextMenuSubList>
          <ContextMenuSubList menuId={'Insert'}>
            { mExists && isXS(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSU', payload: null}))}}>Node Above</a></li> }
            { mExists && isXR(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSOR', payload: null}))}}>Node Right</a></li> }
            { mExists && isXS(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSO', payload: null}))}}>Node Out</a></li> }
            { mExists && isXS(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSD', payload: null}))}}>Node Below</a></li> }
            { mExists && (isXR(m) || isXS(m))  && <li><a className={menuClassName} onClick={()=>{dispatch(actions.setPageState(PageState.WS_CREATE_TABLE))}}>Table Out</a></li> }
            { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSCRU', payload: null}))}}>Table Row Above</a></li> }
            { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSCRD', payload: null}))}}>Table Row Below</a></li> }
            { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSCCL', payload: null}))}}>Table Column Left</a></li> }
            { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSCCR', payload: null}))}}>Table Column Right</a></li> }
          </ContextMenuSubList>
          <ContextMenuSubList menuId={'Edit'}>
            { mExists && isXS(m) && getCountXCO1(m) === 0 && getX(m).linkType === '' && <li><a className={menuClassName} onClick={()=>{dispatch(actions.setPageState(PageState.WS_CREATE_MAP_IN_MAP))}}>Turn Into Submap</a></li> }
            { mExists && isXS(m) && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'transpose', payload: null}))}}>Transpose</a></li> }
            { mExists && getXAEO(m).map(ti => ti.taskStatus).includes(0) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeOn', payload: null}))}}>Task Mode On</a></li> }
            { mExists && getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeOff', payload: null}))}}>Task Mode Off</a></li> }
            { mExists && getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeReset', payload: null}))}}>Task Mode Reset</a></li> }
            { mExists && isXR(m) && getX(m).controlType !== ControlTypes.NONE && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeNone', payload: null}))}}>Control Type None</a></li> }
            { mExists && isXR(m) && getX(m).controlType !== ControlTypes.UPLOAD && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeUpload', payload: null}))}}>Control Type Upload</a></li> }
            { mExists && isXR(m) && getX(m).controlType !== ControlTypes.GENERATE && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeGenerate', payload: null}))}}>Control Type Generate</a></li> }
          </ContextMenuSubList>
          <ContextMenuSubList menuId={'Move'}>
            { mExists && isXS(m) && isXASVN(m) && getCountXASU(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSU', payload: null}))}}>Node Up</a></li> }
            { mExists && isXS(m) && isXASVN(m) && getCountXASD(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSD', payload: null}))}}>Node Down</a></li> }
            { mExists && isXS(m) && isDirR(m) && isXASVN(m) && getCountXASU(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSO', payload: null}))}}>Node Out</a></li> }
            { mExists && isXS(m) && isDirL(m) && isXASVN(m) && getCountXASU(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSO', payload: null}))}}>Node Out</a></li> }
            { mExists && isXS(m) && isDirL(m) && isXASVN(m) && !isXDS(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSI', payload: null}))}}>Node In</a></li> }
            { mExists && isXS(m) && isDirR(m) && isXASVN(m) && !isXDS(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSI', payload: null}))}}>Node In</a></li> }
            { mExists && (isXR(m) && getCountXSO2(m) > 0) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveS2TOR', payload: null}))}}>Sub Nodes To Table</a></li> }
            { mExists && (isXS(m) && getCountXSO1(m) > 0) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveS2TO', payload: null}))}}>Sub Nodes To Table</a></li> }
          </ContextMenuSubList>
          <ContextMenuSubList menuId={'Generate'}>
            { mExists && isXD(m) && getX(m).selection === 'f' && getR0(m).note !== '' && <li><a className={menuClassName} onClick={()=>{dispatch(nodeApi.endpoints.getGptSuggestions.initiate(gptGenNodesS(m)))}}>Structure Extension</a></li>}
            { mExists && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(nodeApi.endpoints.getGptSuggestions.initiate(gptGenNodesT(m)))}}>Table Fill</a></li>}
            { mExists && (isXR(m) || isXS(m)) && getCountXCO1(m) === 0 && getX(m).contentType === 'text' && <li><a className={menuClassName} onClick={()=>{dispatch(nodeApi.endpoints.getGptSuggestions.initiate(gptGenNodeMermaid(m)))}}>Diagram</a></li>}
          </ContextMenuSubList>
          <ContextMenuSubList menuId={'Dev'}>
            { mExists && <li><a className={menuClassName} onClick={()=>{console.log(getX(m))}}>show node</a></li> }
            { mExists && <li><a className={menuClassName} onClick={()=>{console.log(getX(m).path)}}>show node path</a></li> }
            { mExists && isXR(m) && <li><a className={menuClassName} onClick={()=>{console.log(generateLlmInfo(m))}}>show llm json</a></li>}
            { mExists && isXR(m) && <li><a className={menuClassName} onClick={()=>{console.log([getX(m).llmDataType, getX(m).llmDataId])}}>show llmData</a></li>}
            { mExists && isXR(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'devSetLlmDataExample', payload: null}))}}>set llm data example</a></li> }
            { mExists && isXR(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'devClearLlmData', payload: null}))}}>reset llm data</a></li> }
            { mExists && (isXR(m) || isXS(m)) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'devSetBlur', payload: null}))}}>set blur</a></li> }
            { mExists && (isXR(m) || isXS(m)) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'devClearBlur', payload: null}))}}>clear blur</a></li> }
          </ContextMenuSubList>
        </ul>
      </div>
      <div>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="">
          { mExists && !formatterVisible && <li><a className={menuClassName} onClick={()=>{dispatch(actions.openFormatter())}}>Open Formatter</a></li> }
          { mExists && formatterVisible && <li><a className={menuClassName} onClick={()=>{dispatch(actions.closeFormatter())}}>Close Formatter</a></li> }
        </ul>
      </div>
    </div>
  )
}
