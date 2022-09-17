import { useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import ProfileMenu from './ProfileMenu'

export function ProfileButton () {
    const dispatch = useDispatch()
    const openMoreMenu = (currentTarget: EventTarget) => dispatch({type: 'OPEN_MORE_MENU', payload: {currentTarget}})
    return (
        <div className="_bg fixed right-0 w-[40px] h-[40px] py-1 px-3 flex flex-row flex-center items-center border-t-0 border-r-0 rounded-bl-2xl">
            <IconButton
                color='secondary'
                onClick={({currentTarget}) => openMoreMenu(currentTarget)}>
                <PersonIcon/>
            </IconButton>
            <ProfileMenu/>
        </div>
    )
}
