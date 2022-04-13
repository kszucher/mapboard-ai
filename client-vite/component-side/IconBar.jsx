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
import IconBarMore from './IconBarMore'

const sSelectionSvg = "M 120 144 L 360 144 C 408 144 432 168 432 216 L 432 264 C 432 312 408 336 360 336 L 120 336 C 72 336 48 312 48 264 C 48 216 48 264 48 216 C 48 168 72 144 120 144 Z"
const fSelectionSvg = "M 312 72 L 360 72 C 408 72 432 96 432 144 L 432 336 C 432 384 408 408 360 408 L 312 408 C 264 408 120 312 72 312 C 24 312 24 168 72 168 C 120 168 264 72 312 72 Z"

export function IconBar () {
    const colorMode = useSelector(state => state.colorMode)
    const formatMode = useSelector(state => state.formatMode)
    const {MAP_BACKGROUND, MAIN_COLOR} = getColors(colorMode)
    const density = useSelector(state => state.node.density)
    const alignment = useSelector(state => state.node.alignment)
    const selection = useSelector(state => state.node.selection)
    const dispatch = useDispatch()
    const setNodeParam = obj => dispatch({type: 'SET_NODE_PARAMS', payload: obj })
    const changeDensity = _ => setNodeParam({density: density === 'small' ? 'large' : 'small'})
    const changeAlignment = _ => setNodeParam({alignment: alignment === 'centered' ? 'adaptive' : 'centered'})
    const changeColorMode = _ => dispatch({type: 'CHANGE_COLOR_MODE'})
    const openProfile = _ => dispatch({type: 'OPEN_PROFILE'})
    const openMoreMenu = ({currentTarget}) => dispatch({type: 'OPEN_MORE_MENU', payload: {currentTarget}})
    const setFormatModeLine = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'line'})
    const setFormatModeBorder = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'border'})
    const setFormatModeFill = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'fill'})
    const setFormatModeText = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'text'})
    const closePalette = _ => dispatch({type: 'CLOSE_PALETTE'})


    return (
        <div style={{
            position: 'fixed',
            right: 12,
            top: 12,
            width: 1*40, // n is the number of icons
            display: 'flex',
            alignItems: 'center',
            height: 9*40 + 2*12,
            paddingLeft: 12,
            paddingRight: 12,
            backgroundColor: MAP_BACKGROUND,
            borderRadius: 16,
            borderTop: 0,
            borderRight: 0,
            borderColor: MAP_BACKGROUND,
        }}>
            <div style={{ display: 'flex', flexDirection: 'column'}}>
                <IconButton color='secondary' onClick={openProfile}>
                    <PersonIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={changeColorMode}>
                    {colorMode === 'light' && <LightModeIcon/>}
                    {colorMode === 'dark' && <DarkModeIcon/>}
                </IconButton>
                <IconButton color='secondary' onClick={changeDensity}>
                    {density === 'small' && <DensitySmallIcon/>}
                    {density === 'large' && <DensityMediumIcon/>}
                </IconButton>
                <IconButton color='secondary' onClick={changeAlignment}>
                    {alignment === 'adaptive' && <CenterFocusWeakIcon/>}
                    {alignment === 'centered' && <CenterFocusStrongIcon/>}
                </IconButton>
                <IconButton color='secondary' onClick={formatMode === 'line' ? closePalette : setFormatModeLine}>
                    <svg viewBox="0 0 480 480" width="24px" height="24px" >
                        <path style={{ fill: 'none', stroke: MAIN_COLOR, strokeWidth:24}}
                              d="M 408 72 C 72 72 408 408 72 408"
                        />
                    </svg>
                </IconButton>
                <IconButton color='secondary' onClick={formatMode === 'border' ? closePalette : setFormatModeBorder}>
                    <svg viewBox="0 0 480 480" width="24px" height="24px" >
                        <path style={{ fill: 'none', stroke: MAIN_COLOR, strokeWidth:24 }}
                              d={selection === 's' ? sSelectionSvg : fSelectionSvg}
                        />
                    </svg>
                </IconButton>
                <IconButton color='secondary' onClick={formatMode === 'fill' ? closePalette : setFormatModeFill}>
                    <svg viewBox="0 0 480 480" width="24px" height="24px" >
                        <path style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:24 }}
                              d={selection === 's' ? sSelectionSvg : fSelectionSvg}
                        />
                    </svg>
                </IconButton>
                <IconButton color='secondary' onClick={formatMode === 'text' ? closePalette : setFormatModeText}>
                    <svg viewBox="0 0 480 480" width="24px" height="24px" >
                        <g>
                            <line style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:24 }}
                                  x1={96} y1={96} x2={384} y2={96}
                            />
                            <line style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:24 }}
                                  x1={240} y1={384} x2={240} y2={96}
                            />
                        </g>
                    </svg>
                </IconButton>
                <IconButton color='secondary' onClick={openMoreMenu}>
                    <MoreVertIcon/>
                </IconButton>
                <IconBarMore/>
            </div>
        </div>
    )
}
