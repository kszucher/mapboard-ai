import {FC} from "react"
import { useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import {ProfileMenu} from './ProfileMenu'
import {actions, AppDispatch} from "../core/EditorReducer"

export const ProfileButton: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="_bg fixed top-0 right-0 w-[48px] h-[40px] flex flex-col flex-center border-t-0 border-r-0 rounded-bl-lg z-50">
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
