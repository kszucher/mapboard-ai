import {FC} from "react"
import {useDispatch, useSelector} from 'react-redux'
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
import {mapActionResolver} from "../core/MapActionResolver"
import {mSelector} from "../state/EditorState"
import { CreateMapInMapIcon, TaskIcon } from './MuiSvgIcons'
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {PageState} from "../state/Enums"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../state/ApiState"
import {gSaveOptional} from "../state/MapProps"

const iconSize = 40
const topOffs1 = 40*2
const topOffs2 = topOffs1 + iconSize*4 + 2*4
const topOffs3 = topOffs2 + iconSize*2 + 2*4
const topOffs4 = topOffs3 + iconSize*5 + 2*4

const crd = "_bg fixed right-0 w-[48px] flex flex-col items-center py-1 px-1 border-r-0"

export const Sidebar: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { density, alignment } = m?.g || gSaveOptional
  const { data } = useOpenWorkspaceQuery()
  const { frameId, frameIdList } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
      <div className={crd} style={{top: topOffs1, borderRadius: '8px 0 0 0' }}>
        <IconButton
          color='secondary'
          onClick={() => dispatch(actions.toggleFormatterVisible())}
        >
          <PaletteIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          onClick={() => dispatch(actions.setPageState(PageState.WS_CREATE_TABLE))}
        >
          <CalendarViewMonthIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          onClick={() => dispatch(actions.setPageState(PageState.WS_CREATE_TASK))}
        >
          <TaskIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          onClick={() => dispatch(actions.setPageState(PageState.WS_CREATE_MAP_IN_MAP))}
        >
          <CreateMapInMapIcon/>
        </IconButton>
      </div>
      <div className={crd} style={{top: topOffs2, borderRadius: '0 0 0 0' }}>
        <IconButton
          color='secondary'
          onClick={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'changeDensity', null)))
          }}
        >
          {density === 'small' && <DensitySmallIcon/>}
          {density === 'large' && <DensityMediumIcon/>}
        </IconButton>
        <IconButton
          color='secondary'
          onClick={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'ce', 'changeAlignment', null)))
          }}
        >
          {alignment === 'adaptive' && <CenterFocusWeakIcon/>}
          {alignment === 'centered' && <CenterFocusStrongIcon/>}
        </IconButton>
      </div>
      <div className={crd} style={{top: topOffs3, borderRadius: '0 0 0 0' }}>
        <IconButton
          color='secondary'
          disabled={frameId !== '' || frameIdList.length === 0}
          onClick={() => dispatch(api.endpoints.selectMap.initiate({mapId: getMapId(), frameId: frameIdList[0]}))}
        >
          <DynamicFeedIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          // disabled={frameId === ''}
          onClick={() => dispatch(api.endpoints.createMapFrameImport.initiate({mapId: getMapId(), frameId: getFrameId()}))}
        >
          <InputIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          disabled={frameId === '' || frameIdList.length === 0}
          onClick={() => dispatch(api.endpoints.createMapFrameDuplicate.initiate({mapId: getMapId(), frameId: getFrameId()}))}
        >
          <ContentCopyIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          disabled={frameId === '' || frameIdList.length === 0}
          onClick={() => dispatch(api.endpoints.deleteMapFrame.initiate({mapId: getMapId(), frameId: getFrameId()}))}
        >
          <DeleteIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          disabled={frameId === ''}
          onClick={() => dispatch(api.endpoints.selectMap.initiate({mapId: getMapId(), frameId: ''}))}
        >
          <CloseIcon/>
        </IconButton>
      </div>
      <div className={crd} style={{top: topOffs4, borderRadius: '0 0 0 8px' }}>
        <IconButton
          color='secondary'
          disabled={frameId !== ''}
          onClick={ () => dispatch(actions.setPageState(PageState.WS_SHARE_THIS_MAP))}
        >
          <ShareIcon/>
        </IconButton>
      </div>
    </>
  )
}
