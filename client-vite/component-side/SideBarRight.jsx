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
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth'
import PaletteIcon from '@mui/icons-material/Palette'
import { CreateMapInMapIcon, TaskIcon } from '../component/Icons'

const commonCss = (MAP_BACKGROUND, PAGE_BACKGROUND) => ({
    position: 'fixed',
    right: 0,
    width: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '4px 12px 4px 12px',
    backgroundColor: MAP_BACKGROUND,
    borderTop: `1px solid ${PAGE_BACKGROUND}`,
    borderLeft: `1px solid ${PAGE_BACKGROUND}`,
    borderBottom: `1px solid ${PAGE_BACKGROUND}`,
    borderRight: 0,
})

const iconSize = 40
const topOffs1 = 48*2
const topOffs2 = topOffs1 + iconSize + 2*4
const topOffs3 = topOffs2 + iconSize*3 + 2*4
const topOffs4 = topOffs3 + iconSize*2 + 2*4
const topOffs5 = topOffs4 + iconSize*5 + 2*4

export function SideBarRight () {
    const colorMode = useSelector(state => state.colorMode)
    const formatMode = useSelector(state => state.formatMode)
    const density = useSelector(state => state.node.density)
    const alignment = useSelector(state => state.node.alignment)
    const frameLen = useSelector(state => state.frameLen)
    const frameEditorVisible = useSelector(state => state.frameEditorVisible)
    const {MAP_BACKGROUND, PAGE_BACKGROUND, MAIN_COLOR} = getColors(colorMode)
    const dispatch = useDispatch()
    const setNodeParam = obj => dispatch({type: 'SET_NODE_PARAMS', payload: obj })
    const changeDensity = _ => setNodeParam({density: density === 'small' ? 'large' : 'small'})
    const changeAlignment = _ => setNodeParam({alignment: alignment === 'centered' ? 'adaptive' : 'centered'})
    const setFormatModeText = _ => dispatch({type: 'SET_FORMAT_MODE', payload: 'text'})
    const closeFormatter = _ => dispatch({type: 'SET_FORMAT_MODE', payload: ''})
    const showWsCreateMapInMap = _ => dispatch({type: 'SHOW_WS_CREATE_MAP_IN_MAP'})
    const openFrameEditor =  _ => dispatch({type: 'OPEN_FRAME_EDITOR'})
    const importFrame = _ => dispatch({type: 'IMPORT_FRAME'})
    const duplicateFrame = _ => dispatch({type: 'DUPLICATE_FRAME'})
    const deleteFrame = _ => dispatch({type: 'DELETE_FRAME'})
    const closeFrameEditor = _ => dispatch({type: 'CLOSE_FRAME_EDITOR'})
    const showSharing = _ => dispatch({type: 'SHOW_WS_SHARING'})
    const showCreateTable = _ => dispatch({type: 'SHOW_WS_CREATE_TABLE'})
    const showCreateTask = _ => dispatch({type: 'SHOW_WS_CREATE_TASK'})
    return (
        <>
            <div style={{ ...commonCss(MAP_BACKGROUND, PAGE_BACKGROUND), top: topOffs1, borderRadius: '16px 0 0 16px' }}>
                <IconButton color='secondary' onClick={formatMode !== '' ? closeFormatter : setFormatModeText}>
                    <PaletteIcon/>
                </IconButton>
            </div>
            <div style={{ ...commonCss(MAP_BACKGROUND, PAGE_BACKGROUND), top: topOffs2, borderRadius: '16px 0 0 16px' }}>
                <IconButton color='secondary' onClick={showCreateTable}>
                    <CalendarViewMonthIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={showCreateTask}>
                    <TaskIcon MAIN_COLOR={MAIN_COLOR}/>
                </IconButton>
                <IconButton color='secondary' onClick={showWsCreateMapInMap}>
                    <CreateMapInMapIcon MAIN_COLOR={MAIN_COLOR}/>
                </IconButton>
            </div>
            <div style={{ ...commonCss(MAP_BACKGROUND, PAGE_BACKGROUND), top: topOffs3, borderRadius: '16px 0 0 16px' }}>
                <IconButton color='secondary' onClick={changeDensity}>
                    {density === 'small' && <DensitySmallIcon/>}
                    {density === 'large' && <DensityMediumIcon/>}
                </IconButton>
                <IconButton color='secondary' onClick={changeAlignment}>
                    {alignment === 'adaptive' && <CenterFocusWeakIcon/>}
                    {alignment === 'centered' && <CenterFocusStrongIcon/>}
                </IconButton>
            </div>
            <div style={{ ...commonCss(MAP_BACKGROUND, PAGE_BACKGROUND), top: topOffs4, borderRadius: '16px 0 0 16px' }}>
                <IconButton color='secondary' onClick={openFrameEditor} disabled={frameEditorVisible}>
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
            <div style={{ ...commonCss(MAP_BACKGROUND, PAGE_BACKGROUND), top: topOffs5, borderRadius: '16px 0 0 16px' }}>
                <IconButton color='secondary' onClick={showSharing} disabled={frameEditorVisible}>
                    <ShareIcon/>
                </IconButton>
            </div>
        </>
    )
}
