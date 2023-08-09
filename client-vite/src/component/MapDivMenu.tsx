import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getColors} from "./Colors"
import {getG, getX} from "../core/MapUtils"
import {mSelector} from "../state/EditorState"
import {useOpenWorkspaceQuery} from "../core/Api"
import {AppDispatch, RootState} from "../core/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {calcSvgIconOffsetX} from "./MapSvgUtils";

const menuElemClassName = "block px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-500 dark:hover:text-white"

export const MapDivMenu: FC = () => {
  const nodeMenu = useSelector((state: RootState) => state.editor.nodeMenu)
  const m = useSelector((state:RootState) => mSelector(state))
  const xn = getX(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <>
      {
        nodeMenu &&
        <div
          id="dropdownDotsHorizontal"
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-neutral-600 dark:divide-neutral-400"
          style={{left: calcSvgIconOffsetX(xn, 1) + 36, top: xn.nodeY - 12}}
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
            <li><a href="#" className={menuElemClassName} onClick={(e)=> {e.preventDefault(); console.log('click')}}>Dashboard</a></li>
            <li><a href="#" className={menuElemClassName}>Settings</a></li>
            <li><a href="#" className={menuElemClassName}>Earnings</a></li>
          </ul>
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
            <li><a href="#" className={menuElemClassName}>Whatnot</a></li>
          </ul>
        </div>
      }
    </>
  )
}
