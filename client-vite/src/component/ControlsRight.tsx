import {RootStateOrAny, useDispatch, useSelector} from 'react-redux'
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
import { CreateMapInMapIcon, TaskIcon } from './Icons'

const iconSize = 40
const topOffs1 = 48*2
const topOffs2 = topOffs1 + iconSize + 2*4
const topOffs3 = topOffs2 + iconSize*3 + 2*4
const topOffs4 = topOffs3 + iconSize*2 + 2*4
const topOffs5 = topOffs4 + iconSize*5 + 2*4

const crd = "_bg fixed right-0 w-[40px] flex flex-col items-center py-1 px-3 border-r-0"

export function ControlsRight () {
    const formatterVisible = useSelector((state: RootStateOrAny) => state.formatterVisible)
    const density = useSelector((state: RootStateOrAny) => state.node.density)
    const alignment = useSelector((state: RootStateOrAny) => state.node.alignment)
    const frameLen = useSelector((state: RootStateOrAny) => state.frameLen)
    const frameEditorVisible = useSelector((state: RootStateOrAny) => state.frameEditorVisible)
    const dispatch = useDispatch()
    const setNodeParam =
        (obj: { density?: string; alignment?: string }) =>
            dispatch({type: 'SET_NODE_PARAMS', payload: { node: obj, nodeTriggersMap: true } })
    const changeDensity = () => setNodeParam({density: density === 'small' ? 'large' : 'small'})
    const changeAlignment = () => setNodeParam({alignment: alignment === 'centered' ? 'adaptive' : 'centered'})
    const openFormatter = () => dispatch({type: 'SET_FORMATTER_VISIBLE', payload: true})
    const closeFormatter = () => dispatch({type: 'SET_FORMATTER_VISIBLE', payload: false})
    const showWsCreateMapInMap = () => dispatch({type: 'SHOW_WS_CREATE_MAP_IN_MAP'})
    const openFrameEditor =  () => dispatch({type: 'OPEN_FRAME_EDITOR'})
    const importFrame = () => dispatch({type: 'IMPORT_FRAME'})
    const duplicateFrame = () => dispatch({type: 'DUPLICATE_FRAME'})
    const deleteFrame = () => dispatch({type: 'DELETE_FRAME'})
    const closeFrameEditor = () => dispatch({type: 'CLOSE_FRAME_EDITOR'})
    const showShareThisMap = () => dispatch({type: 'SHOW_WS_SHARE_THIS_MAP'})
    const showCreateTable = () => dispatch({type: 'SHOW_WS_CREATE_TABLE'})
    const showCreateTask = () => dispatch({type: 'SHOW_WS_CREATE_TASK'})
    return (
        <>
            <div className={crd} style={{top: topOffs1, borderRadius: '16px 0 0 0' }}>
                <IconButton color='secondary' onClick={formatterVisible === true ? closeFormatter : openFormatter}>
                    <PaletteIcon/>
                </IconButton>
            </div>
            <div className={crd} style={{top: topOffs2, borderRadius: '0 0 0 0' }}>
                <IconButton color='secondary' onClick={showCreateTable}>
                    <CalendarViewMonthIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={showCreateTask}>
                    <TaskIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={showWsCreateMapInMap}>
                    <CreateMapInMapIcon/>
                </IconButton>
            </div>
            <div className={crd} style={{top: topOffs3, borderRadius: '0 0 0 0' }}>
                <IconButton color='secondary' onClick={changeDensity}>
                    {density === 'small' && <DensitySmallIcon/>}
                    {density === 'large' && <DensityMediumIcon/>}
                </IconButton>
                <IconButton color='secondary' onClick={changeAlignment}>
                    {alignment === 'adaptive' && <CenterFocusWeakIcon/>}
                    {alignment === 'centered' && <CenterFocusStrongIcon/>}
                </IconButton>
            </div>
            <div className={crd} style={{top: topOffs4, borderRadius: '0 0 0 0' }}>
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
            <div className={crd} style={{top: topOffs5, borderRadius: '0 0 0 16px' }}>
                <IconButton color='secondary' onClick={showShareThisMap} disabled={frameEditorVisible}>
                    <ShareIcon/>
                </IconButton>
            </div>
        </>
    )
}
