import Tooltip from "@mui/material/Tooltip"
import {FC} from "react"
import { useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import {actions, AppDispatch} from "../reducers/EditorReducer"
import {PageState} from "../state/Enums"

export const SidebarTop: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="dark:bg-zinc-800 bg-zinc-50 border-2 dark:border-neutral-700 fixed top-0 right-0 w-[96px] h-[40px] flex flex-row flex-center border-t-0 border-r-0 py-1 px-2 rounded-bl-lg z-50">
      <Tooltip title="Settings" placement="top-end"><IconButton color='secondary' onClick={({currentTarget}) => {dispatch(actions.setPageState(PageState.WS_SETTINGS))}}><SettingsIcon/></IconButton></Tooltip>
      <Tooltip title="Profile" placement="top-end"><IconButton color='secondary' onClick={({currentTarget}) => {dispatch(actions.setPageState(PageState.WS_PROFILE))}}><PersonIcon/></IconButton></Tooltip>
    </div>
  )
}
