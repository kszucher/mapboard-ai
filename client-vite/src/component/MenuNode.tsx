import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {api} from "../core/Api";
import {gptGenNodeMermaid, gptGenNodesT} from "../core/GptPrompter"
import {getCountNSO1, getCountXCO1, getCountXRXD0S, getCountXSO1, getCountXSO2, getRi, getRXD0, getRXD1, getX, getXP, isXR, isXS} from "../core/MapUtils"
import {mSelector} from "../state/EditorState"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"

const menuClassName = "block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
const menuButtonClassName = "flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
const subMenuClassName = "z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
const MenuButtonSvg =
  <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
  </svg>
export const MenuNode: FC = () => {
  const nodeMenu = useSelector((state: RootState) => state.editor.nodeMenu)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div id="dropdown" className="fixed z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" hidden={nodeMenu === null} style={{left: nodeMenu ? nodeMenu.x + 1 : 0, top: nodeMenu ? nodeMenu.y + -20 : 0}}>
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="multiLevelDropdownButton">
        { mExists && (isXR(m) || getCountXSO1(m) > 0) &&
          <li>
            <a className={menuClassName} onClick={(e)=>{
              dispatch(actions.closeNodeMenu())
              if (!isXS(m) && getCountXRXD0S(m) > 0 && !getRXD0(m, getRi(getXP(m))).selected) {
                dispatch(actions.mapAction({type: 'selectRXD0F', payload: {path: getXP(m)}}))
              } else if (!isXS(m) && !!getRXD0(m, getRi(getXP(m))).selected && !getRXD1(m, getRi(getXP(m))).selected && getCountNSO1(m, getRXD1(m, getRi(getXP(m)))) > 0) {
                dispatch(actions.mapAction({type: 'selectRXD1F', payload: {path: getXP(m)}}))
              } else if (!isXR(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f') {
                dispatch(actions.mapAction({type: 'selectS', payload: {path: getXP(m)}}))
              } else if  (!isXR(m) && getCountXSO1(m) > 0 && getX(m).selection === 's') {
                dispatch(actions.mapAction({type: 'selectF', payload: {path: getXP(m)}}))
              }
            }}>Selection Change
            </a>
          </li>
        }
        <li>
          <button id="doubleDropdownButton" data-dropdown-toggle="insertSubMenu" data-dropdown-placement="right-start" type="button" className={menuButtonClassName}>
            Insert
            {MenuButtonSvg}
          </button>
          <div id="insertSubMenu" className={subMenuClassName}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">
              { mExists && isXS(m) &&
                <li>
                  <a className={menuClassName} onClick={(e)=>{
                    dispatch(actions.mapAction({type: 'insertSU', payload: null}))
                  }}>Node Above
                  </a>
                </li>
              }
              { mExists && isXS(m) &&
                <li>
                  <a className={menuClassName} onClick={(e)=>{
                    isXR(m) && dispatch(actions.mapAction({type: 'insertSOR', payload: null}))
                    isXS(m) && dispatch(actions.mapAction({type: 'insertSO', payload: null}))
                  }}>Node Out
                  </a>
                </li>
              }
              { mExists && isXS(m) &&
                <li>
                  <a className={menuClassName} onClick={(e)=>{
                    dispatch(actions.mapAction({type: 'insertSD', payload: null}))
                  }}>Node Below
                  </a>
                </li>
              }
              { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 &&
                <li>
                  <a className={menuClassName} onClick={(e)=>{
                    dispatch(actions.mapAction({type: 'insertSCRU', payload: null}))
                  }}>Table Row Above
                  </a>
                </li>
              }
              { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 &&
                <li>
                  <a className={menuClassName} onClick={(e)=>{
                    dispatch(actions.mapAction({type: 'insertSCRD', payload: null}))
                  }}>Table Row Below
                  </a>
                </li>
              }
              { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 &&
                <li>
                  <a className={menuClassName} onClick={(e)=>{
                    dispatch(actions.mapAction({type: 'insertSCCL', payload: null}))
                  }}>Table Column Left
                  </a>
                </li>
              }
              { mExists && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 &&
                <li>
                  <a className={menuClassName} onClick={(e)=>{
                    dispatch(actions.mapAction({type: 'insertSCCR', payload: null}))
                  }}>Table Column Right
                  </a>
                </li>
              }
            </ul>
          </div>
        </li>
        <li>
          <button id="doubleDropdownButton" data-dropdown-toggle="convertSubMenu" data-dropdown-placement="right-start" type="button" className={menuButtonClassName}>
            Convert
            {MenuButtonSvg}
          </button>
          <div id="convertSubMenu" className={subMenuClassName}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">
              { mExists && (isXR(m) && getCountXSO2(m) > 0 || isXS(m) && getCountXSO1(m) > 0) &&
                <li>
                  <a className={menuClassName} onClick={(e)=>{
                    isXR(m) && dispatch(actions.mapAction({type: 'moveS2TOR', payload: null}))
                    isXS(m) && dispatch(actions.mapAction({type: 'moveS2TO', payload: null}))
                  }}>Sub Nodes To Table
                  </a>
                </li>
              }
            </ul>
          </div>
        </li>
        <li>
          <button id="doubleDropdownButton" data-dropdown-toggle="llmSubMenu" data-dropdown-placement="right-start" type="button" className={menuButtonClassName}>
            LLM
            {MenuButtonSvg}
          </button>
          <div id="llmSubMenu" className={subMenuClassName}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">
              { mExists && getCountXCO1(m) > 0 &&
                <li>
                  <a className={menuClassName} onClick={(e)=>{
                    dispatch(actions.closeNodeMenu())
                    dispatch(api.endpoints.getGptSuggestions.initiate(gptGenNodesT(m)))
                  }}>Fill Table
                  </a>
                </li>
              }
              { mExists && (isXR(m) || isXS(m)) && getCountXCO1(m) === 0 && getX(m).contentType === 'text' &&
                <li>
                  <a className={menuClassName} onClick={(e)=>{
                    dispatch(actions.closeNodeMenu())
                    dispatch(api.endpoints.getGptSuggestions.initiate(gptGenNodeMermaid(m)))
                  }}>Generate Mermaid
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
