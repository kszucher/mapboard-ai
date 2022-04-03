import { useDispatch, useSelector } from 'react-redux'
import { getColors } from '../core/Colors'
import { IconButton } from '@mui/material'
import DensitySmallIcon from '@mui/icons-material/DensitySmall'
import DensityMediumIcon from '@mui/icons-material/DensityMedium'
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import PersonIcon from '@mui/icons-material/Person'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export function IconBar () {
    const colorMode = useSelector(state => state.colorMode)
    const {MAP_BACKGROUND} = getColors(colorMode)
    const density = useSelector(state => state.node.density)
    const alignment = useSelector(state => state.node.alignment)
    const dispatch = useDispatch()
    const setNodeParam = obj => dispatch({type: 'SET_NODE_PARAMS', payload: obj })
    const changeDensity = _ => setNodeParam({density: density === 'small' ? 'large' : 'small'})
    const changeAlignment = _ => setNodeParam({alignment: alignment === 'centered' ? 'adaptive' : 'centered'})
    const changeColorMode = _ => dispatch({type: 'CHANGE_COLOR_MODE'})
    const openProfile = _ => dispatch({type: 'OPEN_PROFILE'})
    return (
        <div style={{
            position: 'fixed',
            right: 0,
            width: 5*40, // n is the number of icons
            display: 'flex',
            alignItems: 'center',
            height: 48,
            paddingLeft: 12,
            paddingRight: 12,
            backgroundColor: MAP_BACKGROUND,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderTop: 0,
            borderRight: 0,
            borderColor: MAP_BACKGROUND,
        }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton color='secondary' onClick={changeDensity}>
                    {density === 'small' && <DensitySmallIcon/>}
                    {density === 'large' && <DensityMediumIcon/>}
                </IconButton>
                <IconButton color='secondary' onClick={changeAlignment}>
                    {alignment === 'adaptive' && <CenterFocusWeakIcon/>}
                    {alignment === 'centered' && <CenterFocusStrongIcon/>}
                </IconButton>
                <IconButton color='secondary' onClick={changeColorMode}>
                    {colorMode === 'light' && <LightModeIcon/>}
                    {colorMode === 'dark' && <DarkModeIcon/>}
                </IconButton>
                <IconButton color='secondary' onClick={openProfile}>
                    <PersonIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={_=>{}}>
                    <MoreVertIcon/>
                </IconButton>
            </div>
        </div>
    )
}
