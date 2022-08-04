import { useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import ProfileMenu from './ProfileMenu'

export function ProfileButton () {
    const dispatch = useDispatch()
    const openMoreMenu = (currentTarget: EventTarget & HTMLButtonElement) => dispatch({type: 'OPEN_MORE_MENU', payload: {currentTarget}})
    return (
        <div id="profile-button">
            <IconButton
                color='secondary'
                onClick={({currentTarget}) => openMoreMenu(currentTarget)}>
                <PersonIcon/>
            </IconButton>
            <ProfileMenu/>
        </div>
    )
}
