import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api} from "../core/Api";
import {gptGenNodeMermaid, gptGenNodesS, gptGenNodesT} from "../core/GptPrompter"
import {getCountNSO1, getCountXASD, getCountXASU, getCountXCO1, getCountXRXD0S, getCountXSO1, getCountXSO2, getR0, getRi, getRXD0, getRXD1, getX, getXP, isDirL, isDirR, isXASVN, isXD, isXDS, isXR, isXS} from "../core/MapUtils"
import {mSelector} from "../state/EditorState"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {PageState} from "../state/Enums"

const menuClassName = "block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
const menuButtonClassName = "flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
const subMenuClassName = "z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
const MenuButtonSvg = <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>

export const ContextMenu: FC = () => {
  const nodeMenu = useSelector((state: RootState) => state.editor.nodeMenu)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div id="dropdown" className="fixed z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" hidden={nodeMenu === null} style={{left: nodeMenu ? nodeMenu.x + 1 : 0, top: nodeMenu ? nodeMenu.y + -20 : 0}}>
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="multiLevelDropdownButton">
        <li>
          <button id="doubleDropdownButton" data-dropdown-toggle="selectSubMenu" data-dropdown-placement="right-start" type="button" className={menuButtonClassName}>Select{MenuButtonSvg}</button>
          <div id="selectSubMenu" className={subMenuClassName}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">
              { mExists && !isXS(m) && getCountXRXD0S(m) > 0 && !getRXD0(m, getRi(getXP(m))).selected && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'selectRXD0F', payload: {path: getXP(m)}}))}}>Node Branch Right</a></li> }
              { mExists && !isXS(m) && !!getRXD0(m, getRi(getXP(m))).selected && !getRXD1(m, getRi(getXP(m))).selected && getCountNSO1(m, getRXD1(m, getRi(getXP(m)))) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'selectRXD1F', payload: {path: getXP(m)}}))}}>Node Branch Left</a></li> }
              { mExists && !isXR(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'selectS', payload: {path: getXP(m)}}))}}>Node</a></li> }
              { mExists && !isXR(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'selectF', payload: {path: getXP(m)}}))}}>Node Branch</a></li> }
              { mExists && isXS(m) && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'selectCFF', payload: {path: getXP(m)}}))}}>First Cell</a></li> }
            </ul>
          </div>
        </li>
        <li>
          <button id="doubleDropdownButton" data-dropdown-toggle="insertSubMenu" data-dropdown-placement="right-start" type="button" className={menuButtonClassName}>Insert{MenuButtonSvg}</button>
          <div id="insertSubMenu" className={subMenuClassName}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">
              { mExists && isXS(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSU', payload: null}))}}>Node Above</a></li> }
              { mExists && isXR(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSOR', payload: null}))}}>Node Right</a></li> }
              { mExists && isXS(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSO', payload: null}))}}>Node Out</a></li> }
              { mExists && isXS(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSD', payload: null}))}}>Node Below</a></li> }
              { mExists && (isXR(m) || isXS(m))  && <li><a className={menuClassName} onClick={()=>{dispatch(actions.setPageState(PageState.WS_CREATE_TABLE))}}>Table Out</a></li> }
              { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSCRU', payload: null}))}}>Table Row Above</a></li> }
              { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSCRD', payload: null}))}}>Table Row Below</a></li> }
              { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSCCL', payload: null}))}}>Table Column Left</a></li> }
              { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'insertSCCR', payload: null}))}}>Table Column Right</a></li> }
            </ul>
          </div>
        </li>
        <li>
          <button id="doubleDropdownButton" data-dropdown-toggle="editSubMenu" data-dropdown-placement="right-start" type="button" className={menuButtonClassName}>Edit{MenuButtonSvg}</button>
          <div id="editSubMenu" className={subMenuClassName}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">

            </ul>
          </div>
        </li>
        <li>
          <button id="doubleDropdownButton" data-dropdown-toggle="moveSubMenu" data-dropdown-placement="right-start" type="button" className={menuButtonClassName}>Move{MenuButtonSvg}</button>
          <div id="moveSubMenu" className={subMenuClassName}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">
              { mExists && isXS(m) && isXASVN(m) && getCountXASU(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSU', payload: null}))}}>Node Up</a></li> }
              { mExists && isXS(m) && isXASVN(m) && getCountXASD(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSD', payload: null}))}}>Node Down</a></li> }
              { mExists && isXS(m) && isDirR(m) && isXASVN(m) && getCountXASU(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSO', payload: null}))}}>Node Out</a></li> }
              { mExists && isXS(m) && isDirL(m) && isXASVN(m) && getCountXASU(m) > 0 && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSO', payload: null}))}}>Node Out</a></li> }
              { mExists && isXS(m) && isDirL(m) && isXASVN(m) && !isXDS(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSI', payload: null}))}}>Node In</a></li> }
              { mExists && isXS(m) && isDirR(m) && isXASVN(m) && !isXDS(m) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveSI', payload: null}))}}>Node In</a></li> }
              { mExists && (isXR(m) && getCountXSO2(m) > 0) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveS2TOR', payload: null}))}}>Sub Nodes To Table</a></li> }
              { mExists && (isXS(m) && getCountXSO1(m) > 0) && <li><a className={menuClassName} onClick={()=>{dispatch(actions.mapAction({type: 'moveS2TO', payload: null}))}}>Sub Nodes To Table</a></li> }
            </ul>
          </div>
        </li>
        <li>
          <button id="doubleDropdownButton" data-dropdown-toggle="generateSubMenu" data-dropdown-placement="right-start" type="button" className={menuButtonClassName}>Generate{MenuButtonSvg}</button>
          <div id="generateSubMenu" className={subMenuClassName}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">
              { mExists && isXD(m) && getX(m).selection === 'f' && getR0(m).note !== '' &&
                <li>
                  <a className={menuClassName} onClick={()=>{
                    dispatch(actions.closeNodeMenu())
                    dispatch(actions.setPageState(PageState.WS_LOADING))
                    dispatch(api.endpoints.getGptSuggestions.initiate(gptGenNodesS(m)))
                  }}>Structure Extension
                  </a>
                </li>
              }
              { mExists && getCountXCO1(m) > 0 &&
                <li>
                  <a className={menuClassName} onClick={()=>{
                    dispatch(actions.closeNodeMenu())
                    dispatch(actions.setPageState(PageState.WS_LOADING))
                    dispatch(api.endpoints.getGptSuggestions.initiate(gptGenNodesT(m)))
                  }}>Table Fill
                  </a>
                </li>
              }
              { mExists && (isXR(m) || isXS(m)) && getCountXCO1(m) === 0 && getX(m).contentType === 'text' &&
                <li>
                  <a className={menuClassName} onClick={()=>{
                    dispatch(actions.closeNodeMenu())
                    dispatch(actions.setPageState(PageState.WS_LOADING))
                    dispatch(api.endpoints.getGptSuggestions.initiate(gptGenNodeMermaid(m)))
                  }}>Mermaid Flowchart
                  </a>
                </li>
              }
            </ul>
          </div>
        </li>
      </ul>
    </div>
  )
}
