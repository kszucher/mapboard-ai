import { useDispatch, useSelector } from 'react-redux'
import { getColors } from '../core/Colors'
import { IconButton } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'


export function SideBarTop () {
    const colorMode = useSelector(state => state.colorMode)
    const {MAP_BACKGROUND, PAGE_BACKGROUND} = getColors(colorMode)
    const dispatch = useDispatch()
    const changeColorMode = _ => dispatch({type: 'CHANGE_COLOR_MODE'})
    const openProfile = _ => dispatch({type: 'OPEN_PROFILE'})
    return (
        <div style={{
            position: 'fixed',
            right: 0,
            width: 40*4,
            height: 40,
            padding: '4px 12px 4px 12px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: MAP_BACKGROUND,
            borderTop: 0,
            borderLeft: `1px solid ${PAGE_BACKGROUND}`,
            borderBottom: `1px solid ${PAGE_BACKGROUND}`,
            borderRight: 0,
            borderRadius: '0 0 0 16px',
        }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <IconButton color='secondary' onClick={changeColorMode}>
                    {colorMode === 'light' && <LightModeIcon/>}
                    {colorMode === 'dark' && <DarkModeIcon/>}
                </IconButton>
                <IconButton color='secondary' onClick={openProfile}>
                    <HelpIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={openProfile}>
                    <SettingsIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={openProfile}>
                    <PersonIcon/>
                </IconButton>
            </div>
        </div>
    )
}
