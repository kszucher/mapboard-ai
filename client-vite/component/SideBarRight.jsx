import { useDispatch, useSelector } from 'react-redux'
import { getColors } from '../core/Colors'
import { IconButton } from '@mui/material'
import DensitySmallIcon from '@mui/icons-material/DensitySmall'
import DensityMediumIcon from '@mui/icons-material/DensityMedium'
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong'
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed'
import ShareIcon from '@mui/icons-material/Share'
import InputIcon from '@mui/icons-material/Input'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import ImageIcon from '@mui/icons-material/Image';

const svgCommonParams = {viewBox:"0 0 480 480", width:"24px", height:"24px"}
const sSelectionSvg = "M 120 144 L 360 144 C 408 144 432 168 432 216 L 432 264 C 432 312 408 336 360 336 L 120 336 C 72 336 48 312 48 264 C 48 216 48 264 48 216 C 48 168 72 144 120 144 Z"
const fSelectionSvg = "M 312 72 L 360 72 C 408 72 432 96 432 144 L 432 336 C 432 384 408 408 360 408 L 312 408 C 264 408 120 312 72 312 C 24 312 24 168 72 168 C 120 168 264 72 312 72 Z"

const commonCss = (MAP_BACKGROUND, PAGE_BACKGROUND) => ({
    position: 'fixed',
    right: 0,
    width: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 12px 12px 12px',
    backgroundColor: MAP_BACKGROUND,
    borderTop: `1px solid ${PAGE_BACKGROUND}`,
    borderLeft: `1px solid ${PAGE_BACKGROUND}`,
    borderBottom: `1px solid ${PAGE_BACKGROUND}`,
    borderRight: 0,
})

const CreateMapInMapIcon = ({MAIN_COLOR}) => (
    <svg {...svgCommonParams}>
        <g>
            <path style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:48 }} d="M 216 240 L 24 240"/>
            <path style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:48 }} d="M 120 144 L 120 336"/>
            <path style={{ fill: 'none', stroke: MAIN_COLOR, strokeWidth:24 }} d="M 288 48 L 408 240 L 288 432"/>
        </g>
    </svg>
)

const SpanHighlight = ({MAIN_COLOR, formatMode}) => (
    <>
        {formatMode !== '' && <span
            style={{
                position: 'fixed',
                top: 2*48 + 12 + 40*({ line: 2, border: 3, fill: 4, text: 5 }[formatMode]),
                right: 62,
                width: 2,
                height: 40,
                backgroundColor: MAIN_COLOR,
            }}/>
        }
    </>
)

export function SideBarRight () {
    const colorMode = useSelector(state => state.colorMode)
    const formatMode = useSelector(state => state.formatMode)
    const density = useSelector(state => state.node.density)
    const alignment = useSelector(state => state.node.alignment)
    const selection = useSelector(state => state.node.selection)
    const taskStatus = useSelector(state => state.node.taskStatus)
    const frameLen = useSelector(state => state.frameLen)
    const frameEditorVisible = useSelector(state => state.frameEditorVisible)
    const {MAP_BACKGROUND, PAGE_BACKGROUND, MAIN_COLOR} = getColors(colorMode)
    const dispatch = useDispatch()
    const setNodeParam = obj => dispatch({type: 'SET_NODE_PARAMS', payload: obj })
    const changeDensity = _ => setNodeParam({density: density === 'small' ? 'large' : 'small'})
    const changeAlignment = _ => setNodeParam({alignment: alignment === 'centered' ? 'adaptive' : 'centered'})
    const toggleTask = _ => setNodeParam({taskStatus: taskStatus === -1 ? 'setTask' : 'clearTask'})
    const setFormatModeLine = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'line'})
    const setFormatModeBorder = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'border'})
    const setFormatModeFill = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'fill'})
    const setFormatModeText = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'text'})
    const closePalette = _ => dispatch({type: 'CLOSE_FORMATTER'})
    const showWsCreateMapInMap = _ => dispatch({type: 'SHOW_WS_CREATE_MAP_IN_MAP'})
    const openFrameEditor =  _ => dispatch({type: 'OPEN_FRAME_EDITOR'})
    const importFrame = _ => dispatch({type: 'IMPORT_FRAME'})
    const duplicateFrame = _ => dispatch({type: 'DUPLICATE_FRAME'})
    const deleteFrame = _ => dispatch({type: 'DELETE_FRAME'})
    const closeFrameEditor = _ => dispatch({type: 'CLOSE_FRAME_EDITOR'})
    const showSharing = _ => dispatch({type: 'SHOW_WS_SHARING'})
    return (
        <>
            <div style={{ ...commonCss(MAP_BACKGROUND, PAGE_BACKGROUND), top: 48*2, borderRadius: '16px 0 0 0' }}>
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
                        <path style={{ fill: 'none', stroke: MAIN_COLOR, strokeWidth:24 }}
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
                <IconButton color='secondary' onClick={toggleTask}>
                    <svg {...svgCommonParams}>
                        <g>
                            <ellipse style={{ fill: 'none', stroke: MAIN_COLOR, strokeWidth:24 }} cx={120} cy={240} rx={80} ry={80}/>
                            <ellipse style={{ fill: MAIN_COLOR, stroke: MAIN_COLOR, strokeWidth:24 }} cx={360} cy={240} rx={80} ry={80}/>
                        </g>
                    </svg>
                </IconButton>
                <IconButton color='secondary' onClick={showWsCreateMapInMap}>
                    <CreateMapInMapIcon MAIN_COLOR={MAIN_COLOR}/>
                </IconButton>
                <SpanHighlight MAIN_COLOR={MAIN_COLOR} formatMode={formatMode}/>
            </div>
            <div style={{ ...commonCss(MAP_BACKGROUND, PAGE_BACKGROUND), top: 48*2 + 40*8 + 2*12, borderRadius: '0 0 0 0' }}>
                <IconButton color='secondary' onClick={openFrameEditor} disabled={frameEditorVisible===1}>
                    <DynamicFeedIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={importFrame} disabled={!frameEditorVisible}>
                    <InputIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={duplicateFrame} disabled={!frameEditorVisible || frameLen === 0}>
                    <ContentCopyIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={deleteFrame} disabled={!frameEditorVisible || frameLen === 0}>
                    <DeleteIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={closeFrameEditor} disabled={!frameEditorVisible}>
                    <CloseIcon/>
                </IconButton>
            </div>
            <div style={{ ...commonCss(MAP_BACKGROUND, PAGE_BACKGROUND), top: 48*2 + 40*8 + 2*12 + 5*40 + 2*12, borderRadius: '0 0 0 16px' }}>
                <IconButton color='secondary' onClick={showSharing} disabled={frameEditorVisible}>
                    <ShareIcon/>
                </IconButton>
            </div>
        </>
    )
}
