import { useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import ProfileMenu from './ProfileMenu'

export function Profile () {
    const dispatch = useDispatch()
    const openMoreMenu = ({currentTarget}) => dispatch({type: 'OPEN_MORE_MENU', payload: {currentTarget}})
    return (
        <div id="profile">
            <IconButton color='secondary' onClick={openMoreMenu}>
                <PersonIcon/>
            </IconButton>
            <ProfileMenu/>
        </div>
    )
}
