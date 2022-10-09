import {FC} from "react";
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
import {actions, sagaActions} from "../core/EditorFlow";
import {PageState} from "../core/Types";

const iconSize = 40
const topOffs1 = 48*2
const topOffs2 = topOffs1 + iconSize + 2*4
const topOffs3 = topOffs2 + iconSize*3 + 2*4
const topOffs4 = topOffs3 + iconSize*2 + 2*4
const topOffs5 = topOffs4 + iconSize*5 + 2*4

const crd = "_bg fixed right-0 w-[40px] flex flex-col items-center py-1 px-3 border-r-0"

export const ControlsRight: FC = () => {
  const density = useSelector((state: RootStateOrAny) => state.node.density)
  const alignment = useSelector((state: RootStateOrAny) => state.node.alignment)
  const frameLen = useSelector((state: RootStateOrAny) => state.frameLen)
  const frameEditorVisible = useSelector((state: RootStateOrAny) => state.frameEditorVisible)
  const dispatch = useDispatch()
  return (
    <>
      <div className={crd} style={{top: topOffs1, borderRadius: '16px 0 0 0' }}>
        <IconButton color='secondary' onClick={_=>dispatch(actions.toggleFormatterVisible())}>
          <PaletteIcon/>
        </IconButton>
      </div>
      <div className={crd} style={{top: topOffs2, borderRadius: '0 0 0 0' }}>
        <IconButton
          color='secondary'
          onClick={_=>dispatch(actions.setPageState(PageState.WS_CREATE_TABLE))}>
          <CalendarViewMonthIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          onClick={_=>dispatch(actions.setPageState(PageState.WS_CREATE_TASK))}>
          <TaskIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          onClick={_=>dispatch(actions.setPageState(PageState.WS_CREATE_MAP_IN_MAP))}>
          <CreateMapInMapIcon/>
        </IconButton>
      </div>
      <div className={crd} style={{top: topOffs3, borderRadius: '0 0 0 0' }}>
        <IconButton
          color='secondary'
          onClick={_=>dispatch(actions.setNodeParams({ node: { density: density === 'small' ? 'large' : 'small' }, nodeTriggersMap: true }))}>
          {density === 'small' && <DensitySmallIcon/>}
          {density === 'large' && <DensityMediumIcon/>}
        </IconButton>
        <IconButton
          color='secondary'
          onClick={_=>dispatch(actions.setNodeParams({ node: { alignment: alignment === 'centered' ? 'adaptive' : 'centered' }, nodeTriggersMap: true }))}>
          {alignment === 'adaptive' && <CenterFocusWeakIcon/>}
          {alignment === 'centered' && <CenterFocusStrongIcon/>}
        </IconButton>
      </div>
      <div className={crd} style={{top: topOffs4, borderRadius: '0 0 0 0' }}>
        <IconButton
          color='secondary' disabled={frameEditorVisible}
          onClick={_=>dispatch(sagaActions.openFrame())}>
          <DynamicFeedIcon/>
        </IconButton>
        <IconButton
          color='secondary' disabled={!frameEditorVisible}
          onClick={_=>dispatch(sagaActions.importFrame())}>
          <InputIcon/>
        </IconButton>
        <IconButton
          color='secondary' disabled={!frameEditorVisible || frameLen === 0}
          onClick={_=>dispatch(sagaActions.duplicateFrame())}>
          <ContentCopyIcon/>
        </IconButton>
        <IconButton
          color='secondary' disabled={!frameEditorVisible || frameLen === 0}
          onClick={_=>dispatch(sagaActions.deleteFrame())}>
          <DeleteIcon/>
        </IconButton>
        <IconButton
          color='secondary' disabled={!frameEditorVisible}
          onClick={_=>dispatch(sagaActions.closeFrame())}>
          <CloseIcon/>
        </IconButton>
      </div>
      <div className={crd} style={{top: topOffs5, borderRadius: '0 0 0 16px' }}>
        <IconButton
          color='secondary' disabled={frameEditorVisible}
          onClick={_=>dispatch(actions.setPageState(PageState.WS_SHARE_THIS_MAP))}>
          <ShareIcon/>
        </IconButton>
      </div>
    </>
  )
}
