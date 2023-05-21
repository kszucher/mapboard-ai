import {FC} from "react";
import { useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import {ProfileMenu} from './ProfileMenu'
import {actions, AppDispatch} from "../core/EditorReducer";

export const ProfileButton: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="_bg fixed right-0 w-[40px] h-[40px] py-1 px-3 flex flex-row flex-center items-center border-t-0 border-r-0 rounded-bl-lg">
      <IconButton
        id='profile-button'
        color='secondary'
        onClick={({currentTarget}) => dispatch(actions.openMoreMenu(Boolean(currentTarget)))}>
        <PersonIcon/>
      </IconButton>
      <ProfileMenu/>
    </div>
  )
}
