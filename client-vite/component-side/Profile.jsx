import { useDispatch, useSelector } from 'react-redux'
import { getColors } from '../core/Colors'
import { IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import ProfileMenu from './ProfileMenu'
import '../css/Component-Side.css'

export function Profile () {
    const colorMode = useSelector(state => state.colorMode)
    const {MAP_BACKGROUND, PAGE_BACKGROUND} = getColors(colorMode)
    const dispatch = useDispatch()
    const openMoreMenu = ({currentTarget}) => dispatch({type: 'OPEN_MORE_MENU', payload: {currentTarget}})
    return (
        <div id="profile" style={{
            backgroundColor: MAP_BACKGROUND,
            borderLeft: `1px solid ${PAGE_BACKGROUND}`,
            borderBottom: `1px solid ${PAGE_BACKGROUND}`,

        }}>
            <IconButton color='secondary' onClick={openMoreMenu}>
                <PersonIcon/>
            </IconButton>
            <ProfileMenu/>
        </div>
    )
}
