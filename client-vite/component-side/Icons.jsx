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
import EditOffIcon from '@mui/icons-material/EditOff';
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import ShareIcon from '@mui/icons-material/Share';
import { MAP_RIGHTS } from '../core/EditorFlow'
import More from './More'
import { setClear } from '../core/Utils'

const svgCommonParams = {viewBox:"0 0 480 480", width:"24px", height:"24px"}
const sSelectionSvg = "M 120 144 L 360 144 C 408 144 432 168 432 216 L 432 264 C 432 312 408 336 360 336 L 120 336 C 72 336 48 312 48 264 C 48 216 48 264 48 216 C 48 168 72 144 120 144 Z"
const fSelectionSvg = "M 312 72 L 360 72 C 408 72 432 96 432 144 L 432 336 C 432 384 408 408 360 408 L 312 408 C 264 408 120 312 72 312 C 24 312 24 168 72 168 C 120 168 264 72 312 72 Z"

export function Icons () {
    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS

    const colorMode = useSelector(state => state.colorMode)
    const mapRight = useSelector(state => state.mapRight)
    const undoDisabled = useSelector(state => state.undoDisabled)
    const redoDisabled = useSelector(state => state.redoDisabled)
    const formatMode = useSelector(state => state.formatMode)
    const density = useSelector(state => state.node.density)
    const alignment = useSelector(state => state.node.alignment)
    const selection = useSelector(state => state.node.selection)
    const taskStatus = useSelector(state => state.node.taskStatus)

    const {MAP_BACKGROUND, MAIN_COLOR} = getColors(colorMode)

    const dispatch = useDispatch()
    const undo = _ => dispatch({ type: 'UNDO'})
    const redo = _ => dispatch({ type: 'REDO'})
    const setNodeParam = obj => dispatch({type: 'SET_NODE_PARAMS', payload: obj })
    const changeDensity = _ => setNodeParam({density: density === 'small' ? 'large' : 'small'})
    const changeAlignment = _ => setNodeParam({alignment: alignment === 'centered' ? 'adaptive' : 'centered'})
    const resetFormat = _ => setNodeParam(setClear(['lineType', 'lineWidth', 'lineColor', 'borderWidth', 'borderColor', 'fillColor', 'textColor', 'textFontSize']))
    const toggleTask = _ => setNodeParam({taskStatus: taskStatus === -1 ? 'setTask' : 'clearTask'})
    const changeColorMode = _ => dispatch({type: 'CHANGE_COLOR_MODE'})
    const openProfile = _ => dispatch({type: 'OPEN_PROFILE'})
    const openMoreMenu = ({currentTarget}) => dispatch({type: 'OPEN_MORE_MENU', payload: {currentTarget}})
    const setFormatModeLine = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'line'})
    const setFormatModeBorder = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'border'})
    const setFormatModeFill = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'fill'})
    const setFormatModeText = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'text'})
    const closePalette = _ => dispatch({type: 'CLOSE_PALETTE'})
    const createMapInMap = _ => dispatch({type: 'CREATE_MAP_IN_MAP'})

    return (
        <>
            <div style={{
                position: 'fixed',
                left: 216+48,
                width: 96,
                display: 'flex',
                alignItems: 'center',
                height: 48,
                paddingLeft: 12,
                backgroundColor: MAP_BACKGROUND,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                borderTop: 0,
                borderColor: MAP_BACKGROUND,
            }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton color='secondary' onClick={undo} disabled={[VIEW, UNAUTHORIZED].includes(mapRight) || undoDisabled}>
                        <UndoIcon/>
                    </IconButton>
                    <IconButton color='secondary' onClick={redo} disabled={[VIEW, UNAUTHORIZED].includes(mapRight) || redoDisabled}>
                        <RedoIcon/>
                    </IconButton>
                </div>
            </div>
            <div style={{
                position: 'fixed',
                right: 0,
                top: 0,
                width: 40,
                display: 'flex',
                alignItems: 'center',
                height: 40 + 2*12,
                paddingLeft: 12,
                paddingRight: 12,
                backgroundColor: MAP_BACKGROUND,
                borderRadius: '0 0 0 16px',
                borderTop: 0,
                borderRight: 0,
                borderColor: MAP_BACKGROUND,
            }}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <IconButton color='secondary' onClick={openProfile}>
                        <PersonIcon/>
                    </IconButton>
                </div>
            </div>
            <div style={{
                position: 'fixed',
                right: 0,
                top: 48*2,
                width: 40,
                display: 'flex',
                alignItems: 'center',
                height: 13*40 + 2*12,
                paddingLeft: 12,
                paddingRight: 12,
                backgroundColor: MAP_BACKGROUND,
                borderRadius: '16px 0 0 16px',
                borderTop: 0,
                borderRight: 0,
                borderColor: MAP_BACKGROUND,
            }}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
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
                        <svg {...svgCommonParams}>
                            <path style={{ fill: 'none', stroke: MAIN_COLOR, strokeWidth:24}}
                                  d="M 408 72 C 72 72 408 408 72 408"
                            />
                        </svg>
                    </IconButton>
                    <IconButton color='secondary' onClick={formatMode === 'border' ? closePalette : setFormatModeBorder}>
                        <svg {...svgCommonParams}>
                            <path style={{ fill: 'none', stroke: MAIN_COLOR, strokeWidth:24 }}
                                  d={selection === 's' ? sSelectionSvg : fSelectionSvg}
                            />
                        </svg>
                    </IconButton>
                    <IconButton color='secondary' onClick={formatMode === 'fill' ? closePalette : setFormatModeFill}>
                        <svg {...svgCommonParams}>
                            <path style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:24 }}
                                  d={selection === 's' ? sSelectionSvg : fSelectionSvg}
                            />
                        </svg>
                    </IconButton>
                    <IconButton color='secondary' onClick={formatMode === 'text' ? closePalette : setFormatModeText}>
                        <svg {...svgCommonParams}>
                            <g>
                                <line style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:24 }} x1={96} y1={96} x2={384} y2={96}/>
                                <line style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:24 }} x1={240} y1={384} x2={240} y2={96}/>
                            </g>
                        </svg>
                    </IconButton>
                    <IconButton color='secondary' onClick={resetFormat}>
                        <EditOffIcon/>
                    </IconButton>
                    <IconButton color='secondary' onClick={toggleTask}>
                        <svg {...svgCommonParams}>
                            <g>
                                <ellipse style={{ fill: 'none', stroke: MAIN_COLOR, strokeWidth:24 }} cx={120} cy={240} rx={80} ry={80}/>
                                <ellipse style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:24 }} cx={360} cy={240} rx={80} ry={80}/>
                            </g>
                        </svg>
                    </IconButton>
                    <IconButton color='secondary' onClick={createMapInMap}>
                        <svg {...svgCommonParams}>
                            <g>
                                <path style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:48 }} d="M 216 240 L 24 240"/>
                                <path style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:48 }} d="M 120 144 L 120 336"/>

                                <path style={{ fill: 'none', stroke: MAIN_COLOR, strokeWidth:24 }} d="M 288 48 L 408 240 L 288 432"/>
                            </g>
                        </svg>
                    </IconButton>
                    <IconButton color='secondary' onClick={_=>{}}>
                        <AutoAwesomeMotionIcon/>
                    </IconButton>
                    <IconButton color='secondary' onClick={_=>{}}>
                        <ShareIcon/>
                    </IconButton>
                    <IconButton color='secondary' onClick={openMoreMenu}>
                        <MoreVertIcon/>
                    </IconButton>
                    <More/>
                </div>
            </div>
        </>
    )
}
