import React, {FC, ReactNode, useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {nodeApi, useOpenWorkspaceQuery} from "../apis/NodeApi";
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {gptGenNodeMermaid, gptGenNodesS, gptGenNodesT} from "../selectors/GptPrompter"
import {getSubProcessList} from "../selectors/MapProcess"
import {getCountXASD, getCountXASU, getCountXCO1, getCountXRD0SO1, getCountXRD1SO1, getCountXSO1, getCountXSO2, getG, getR0, getX, getXAEO, getXRD0, getXRD1, isDirL, isDirR, isXASVN, isXD, isXDS, isXR, isXS} from "../selectors/MapSelector"
import {mSelector} from "../state/EditorState"
import {ControlTypes, PageState} from "../state/Enums"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../state/NodeApiState"

const Li2 = ({subMenuId, onClick}: {subMenuId: string, onClick: Function}) => {
  return (
    <li>
      <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => onClick()}>
        {subMenuId}
      </a>
    </li>
  )
}

const Li1 = ({menuId, children}: {menuId: string, children: ReactNode}) => {
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
        <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
        </svg>
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
  // const { data } = useOpenWorkspaceQuery()
  // const { frameId, frameIdList } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div id="dropdown" className="fixed z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" hidden={!contextMenu.isActive} style={{left: contextMenu.position.x + 1, top: contextMenu.position.y -20}}>
      <div hidden={contextMenu.type !== 'map'}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="">
          <Li1 menuId={'View'}>
            { mExists && getG(m).density === 'small' && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setDensityLarge', payload: null}))}} subMenuId={'Set Cozy'}/> }
            { mExists && getG(m).density === 'large' && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setDensitySmall', payload: null}))}} subMenuId={'Set Compact'}/> }
            { mExists && getG(m).alignment === 'adaptive' && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setAlignmentCentered', payload: null}))}} subMenuId={'Set Centered'}/> }
            { mExists && getG(m).alignment === 'centered' && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setAlignmentAdaptive', payload: null}))}} subMenuId={'Set Adaptive'}/> }
          </Li1>
          <Li1 menuId={'Connections'}>
            { mExists && !connectionHelpersVisible && <Li2 onClick={()=>{dispatch(actions.showConnectionHelpers())}} subMenuId={'Show Helpers'}/> }
            { mExists && connectionHelpersVisible && <Li2 onClick={()=>{dispatch(actions.hideConnectionHelpers())}} subMenuId={'Hide Helpers'}/> }
          </Li1>
          <Li1 menuId={'Tabs'}>
            { mExists && <Li2 onClick={()=>{dispatch(actions.setPageState(PageState.WS_RENAME_MAP))}} subMenuId={'Rename Map'}/> }
            { mExists && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.createMapInTab.initiate())}} subMenuId={'Add Tab Map'}/> }
            { mExists && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.createMapInTabDuplicate.initiate({mapId: getMapId()}))}} subMenuId={'Add Tab Map Duplicate'}/> }
            { mExists && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.moveUpMapInTab.initiate({mapId: getMapId()}))}} subMenuId={'Move Tab Map Up'}/> }
            { mExists && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.moveDownMapInTab.initiate({mapId: getMapId()}))}} subMenuId={'Move Tab Map Down'}/> }
            { mExists && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.deleteMap.initiate({mapId: getMapId()}))}} subMenuId={'Remove Tab Map'}/> }
          </Li1>
          {/*<Li1 menuId={'Frames'}>*/}
          {/*  { mExists && frameId === '' && frameIdList.length > 0 && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.selectMap.initiate({mapId: getMapId(), frameId: frameIdList[0]}))}} subMenuId={'Open Frames'}/> }*/}
          {/*  { mExists && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.createMapFrameImport.initiate({mapId: getMapId(), frameId: getFrameId()}))}} subMenuId={'Import Map Into Frame'}/> }*/}
          {/*  { mExists && frameId !== '' && frameIdList.length > 0 && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.createMapFrameDuplicate.initiate({mapId: getMapId(), frameId: getFrameId()}))}} subMenuId={'Duplicate Frame'}/> }*/}
          {/*  { mExists && frameId !== '' && frameIdList.length > 0 && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.deleteMapFrame.initiate({mapId: getMapId(), frameId: getFrameId()}))}} subMenuId={'Delete Frame'}/> }*/}
          {/*  { mExists && frameId !== '' && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.selectMap.initiate({mapId: getMapId(), frameId: ''}))}} subMenuId={'Exit Frames'}/> }*/}
          {/*</Li1>*/}
          <Li1 menuId={'Shares'}>
            { mExists && <Li2 onClick={()=>{dispatch(actions.setPageState(PageState.WS_SHARES))}} subMenuId={'Shares'}/> }
            { mExists && <Li2 onClick={()=>{dispatch(actions.setPageState(PageState.WS_SHARE_THIS_MAP))}} subMenuId={'Share This Map'}/> }
          </Li1>
        </ul>
      </div>
      <div hidden={contextMenu.type !== 'node'}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="multiLevelDropdownButton">
          <Li1 menuId={'Select'}>
            { mExists && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyX', payload: null}))}} subMenuId={'Node Family'}/> }
            { mExists && isXR(m) && getCountXRD0SO1(m) > 0 && !getXRD0(m).selected && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyXRD0', payload: null}))}} subMenuId={'Node Family Right'}/> }
            { mExists && isXR(m) && getCountXRD1SO1(m) > 0 && !getXRD1(m).selected && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyXRD1', payload: null}))}} subMenuId={'Node Family Left'}/> }
            { mExists && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'selectSelfX', payload: null}))}} subMenuId={'Node'}/> }
            { mExists && isXD(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'selectXR', payload: null}))}} subMenuId={'Node'}/> }
            { mExists && isXS(m) && getCountXCO1(m) > 0 && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'selectCFF', payload: {path: getX(m).path}}))}} subMenuId={'First Cell'}/> }
            { mExists && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'selectRA', payload: null}))}} subMenuId={'All Root'}/> }
          </Li1>
          <Li1 menuId={'Insert'}>
            { mExists && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'insertR', payload: null}))}} subMenuId={'Root'}/> }
            { mExists && isXS(m) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'insertSU', payload: null}))}} subMenuId={'Node Above'}/> }
            { mExists && isXR(m) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'insertSOR', payload: null}))}} subMenuId={'Node Right'}/> }
            { mExists && isXS(m) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'insertSO', payload: null}))}} subMenuId={'Node Out'}/> }
            { mExists && isXS(m) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'insertSD', payload: null}))}} subMenuId={'Node Below'}/> }
            { mExists && (isXR(m) || isXS(m))  && <Li2 onClick={()=>{dispatch(actions.setPageState(PageState.WS_CREATE_TABLE))}} subMenuId={'Table Out'}/> }
            { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'insertSCRU', payload: null}))}} subMenuId={'Table Row Above'}/> }
            { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'insertSCRD', payload: null}))}} subMenuId={'Table Row Below'}/> }
            { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'insertSCCL', payload: null}))}} subMenuId={'Table Column Left'}/> }
            { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'insertSCCR', payload: null}))}} subMenuId={'Table Column Right'}/> }
          </Li1>
          <Li1 menuId={'Edit'}>
            { mExists && isXS(m) && getCountXCO1(m) === 0 && getX(m).linkType === '' && <Li2 onClick={()=>{dispatch(actions.setPageState(PageState.WS_CREATE_MAP_IN_MAP))}} subMenuId={'Turn Into Submap'}/> }
            { mExists && isXS(m) && getCountXCO1(m) > 0 && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'transpose', payload: null}))}} subMenuId={'Transpose'}/> }
            { mExists && getXAEO(m).map(ti => ti.taskStatus).includes(0) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeOn', payload: null}))}} subMenuId={'Task Mode On'}/> }
            { mExists && getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeOff', payload: null}))}} subMenuId={'Task Mode Off'}/> }
            { mExists && getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeReset', payload: null}))}} subMenuId={'Task Mode Reset'}/> }
            { mExists && isXR(m) && getX(m).controlType !== ControlTypes.NONE && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeNone', payload: null}))}} subMenuId={'Control Type None'}/> }
            { mExists && isXR(m) && getX(m).controlType !== ControlTypes.INGESTION && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeIngestion', payload: null}))}} subMenuId={'Control Type Ingestion'}/> }
            { mExists && isXR(m) && getX(m).controlType !== ControlTypes.EXTRACTION && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeExtraction', payload: null}))}} subMenuId={'Control Type Extraction'}/> }
          </Li1>
          <Li1 menuId={'Move'}>
            { mExists && isXS(m) && isXASVN(m) && getCountXASU(m) > 0 && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'moveSU', payload: null}))}} subMenuId={'Node Up'}/> }
            { mExists && isXS(m) && isXASVN(m) && getCountXASD(m) > 0 && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'moveSD', payload: null}))}} subMenuId={'Node Down'}/> }
            { mExists && isXS(m) && isDirR(m) && isXASVN(m) && getCountXASU(m) > 0 && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'moveSO', payload: null}))}} subMenuId={'Node Out'}/> }
            { mExists && isXS(m) && isDirL(m) && isXASVN(m) && getCountXASU(m) > 0 && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'moveSO', payload: null}))}} subMenuId={'Node Out'}/> }
            { mExists && isXS(m) && isDirL(m) && isXASVN(m) && !isXDS(m) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'moveSI', payload: null}))}} subMenuId={'Node In'}/> }
            { mExists && isXS(m) && isDirR(m) && isXASVN(m) && !isXDS(m) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'moveSI', payload: null}))}} subMenuId={'Node In'}/> }
            { mExists && (isXR(m) && getCountXSO2(m) > 0) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'moveS2TOR', payload: null}))}} subMenuId={'Sub Nodes To Table'}/> }
            { mExists && (isXS(m) && getCountXSO1(m) > 0) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'moveS2TO', payload: null}))}} subMenuId={'Sub Nodes To Table'}/> }
          </Li1>
          <Li1 menuId={'Generate'}>
            { mExists && isXD(m) && getX(m).selection === 'f' && getR0(m).note !== '' && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.getGptSuggestions.initiate(gptGenNodesS(m)))}} subMenuId={'Structure Extension'}/> }
            { mExists && getCountXCO1(m) > 0 && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.getGptSuggestions.initiate(gptGenNodesT(m)))}} subMenuId={'Table Fill'}/> }
            { mExists && (isXR(m) || isXS(m)) && getCountXCO1(m) === 0 && getX(m).contentType === 'text' && <Li2 onClick={()=>{dispatch(nodeApi.endpoints.getGptSuggestions.initiate(gptGenNodeMermaid(m)))}} subMenuId={'Diagram'}/> }
          </Li1>
          <Li1 menuId={'Dev'}>
            { mExists && <Li2 onClick={()=>{console.log(getX(m))}} subMenuId={'show node'}/> }
            { mExists && <Li2 onClick={()=>{console.log(getX(m).path)}} subMenuId={'show node/path'}/> }
            { mExists && <Li2 onClick={()=>{console.log(getX(m).nodeId)}} subMenuId={'show node/nodeId'}/> }
            { mExists && <Li2 onClick={()=>{console.log(
              {
                processId: getMapId(),
                subProcesses: getSubProcessList(m, getX(m).nodeId)
              }
            )}} subMenuId={'show PROCESS'}/> }
            { mExists && isXR(m) && <Li2 onClick={()=>{console.log([getX(m).llmDataType, getX(m).llmDataId])}} subMenuId={'show llmData'}/> }
            { mExists && isXR(m) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setLlmData', payload: null}))}} subMenuId={'set llm data example'}/> }
            { mExists && isXR(m) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'clearLlmData', payload: null}))}} subMenuId={'reset llm data'}/> }
            { mExists && (isXR(m) || isXS(m)) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'setBlur', payload: null}))}} subMenuId={'set blur'}/> }
            { mExists && (isXR(m) || isXS(m)) && <Li2 onClick={()=>{dispatch(actions.mapAction({type: 'clearBlur', payload: null}))}} subMenuId={'clear blur'}/> }
          </Li1>
        </ul>
      </div>
      <div>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="">
          { mExists && !formatterVisible && <Li2 onClick={()=>{dispatch(actions.openFormatter())}} subMenuId={'Open Formatter'}/> }
          { mExists && formatterVisible && <Li2 onClick={()=>{dispatch(actions.closeFormatter())}} subMenuId={'Close Formatter'}/> }
        </ul>
      </div>
    </div>
  )
}
