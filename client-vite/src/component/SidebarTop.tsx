import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import Tooltip from "@mui/material/Tooltip";
import {FC} from "react"
import { useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import {actions, AppDispatch} from "../core/EditorReducer"

export const SidebarTop: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="_bg fixed top-0 right-0 w-[96px] h-[40px] flex flex-row flex-center border-t-0 border-r-0 py-1 px-2 rounded-bl-lg z-50">
      <Tooltip title="Frames" placement="top-end"><IconButton color='secondary' onClick={({currentTarget}) => {dispatch(actions.openFrameMenu(Boolean(currentTarget)))}}><DynamicFeedIcon/></IconButton></Tooltip>
      <Tooltip title="Profile" placement="top-end"><IconButton color='secondary' onClick={({currentTarget}) => {dispatch(actions.openMoreMenu(Boolean(currentTarget)))}}><PersonIcon/></IconButton></Tooltip>
    </div>
  )
}
