import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getColors} from "./Colors"
import {getX} from "../core/MapUtils"
import {mSelector} from "../state/EditorState"
import {useOpenWorkspaceQuery} from "../core/Api"
import {AppDispatch, RootState} from "../core/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"

export const MenuNode: FC = () => {
  const nodeMenu = useSelector((state: RootState) => state.editor.nodeMenu)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const xn = mExists && getX(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div
      id="dropdown"
      className="fixed z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
      hidden={nodeMenu === null}
      style={{left: nodeMenu ? nodeMenu.x + 1 : 0, top: nodeMenu ? nodeMenu.y + -20 : 0,}}
    >
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="multiLevelDropdownButton">
        { mExists && xn.content === 'Solution' &&
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              Dashboard
            </a>
          </li>
        }
        <li>
          <button
            id="doubleDropdownButton"
            data-dropdown-toggle="doubleDropdown"
            data-dropdown-placement="right-start"
            type="button"
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >Dropdown
            <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
          </button>
          <div id="doubleDropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Overview</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  My downloads</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Billing</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Rewards
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
            Earnings
          </a>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
            Sign out
          </a>
        </li>
      </ul>
    </div>
  )
}
