import {FC} from "react"
import {useDispatch, useSelector} from 'react-redux'
import { IconButton } from '@mui/material'
import DensitySmallIcon from '@mui/icons-material/DensitySmall'
import DensityMediumIcon from '@mui/icons-material/DensityMedium'
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong'
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed'
import ShareIcon from '@mui/icons-material/Share'
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth'
import PaletteIcon from '@mui/icons-material/Palette'
import Tooltip from '@mui/material/Tooltip'
import {mSelector} from "../state/EditorState"
import { CreateMapInMapIcon, TaskIcon } from './MuiSvgIcons'
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {PageState} from "../state/Enums"
import {useOpenWorkspaceQuery} from "../core/Api"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {gSaveOptional} from "../state/MapState"

export const SidebarRight: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { density, alignment } = m?.g || gSaveOptional
  const { data } = useOpenWorkspaceQuery()
  const { frameId } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className={"_bg fixed right-0 w-[48px] flex flex-col items-center py-1 px-1 border-r-0 z-50"} style={{top: 80, borderRadius: '8px 0 0 8px'}}>
      <Tooltip title="Formatter" placement="left-end">
        <IconButton color='secondary' onClick={() => {
          dispatch(actions.toggleFormatterVisible())
        }}><PaletteIcon/></IconButton>
      </Tooltip>
      {/*<Tooltip title="Cells" placement="left-end">*/}
      {/*  <IconButton color='secondary' onClick={() => {*/}
      {/*    dispatch(actions.setPageState(PageState.WS_CREATE_TABLE))*/}
      {/*  }}><CalendarViewMonthIcon/></IconButton>*/}
      {/*</Tooltip>*/}
      <Tooltip title="Tasks" placement="left-end">
        <IconButton color='secondary' onClick={() => {
          dispatch(actions.setPageState(PageState.WS_CREATE_TASK))
        }}><TaskIcon/></IconButton>
      </Tooltip>
      <Tooltip title="Submaps" placement="left-end">
        <IconButton color='secondary' onClick={() => {
          dispatch(actions.setPageState(PageState.WS_CREATE_MAP_IN_MAP))
        }}><CreateMapInMapIcon/></IconButton>
      </Tooltip>
      <Tooltip title="Density" placement="left-end">
        <IconButton color='secondary' onClick={() => {
          dispatch(actions.mapAction({type: 'changeDensity', payload: null}))
        }}>{density === 'small' && <DensitySmallIcon/>}{density === 'large' && <DensityMediumIcon/>}</IconButton>
      </Tooltip>
      <Tooltip title="Alignment" placement="left-end">
        <IconButton color='secondary' onClick={() => {
          dispatch(actions.mapAction({type: 'changeAlignment', payload: null}))
        }}>{alignment === 'adaptive' && <CenterFocusWeakIcon/>}{alignment === 'centered' && <CenterFocusStrongIcon/>}</IconButton>
      </Tooltip>
      <Tooltip title="Frames" placement="left-end">
        <IconButton id='sidebar-right-frames' color='secondary' onClick={({currentTarget}) => {
          dispatch(actions.openFrameMenu(Boolean(currentTarget)))
        }}><DynamicFeedIcon/></IconButton>
      </Tooltip>
      <Tooltip title="Shares" placement="left-end">
        <IconButton color='secondary' disabled={frameId !== ''} onClick={() => {
          dispatch(actions.setPageState(PageState.WS_SHARE_THIS_MAP))}
        }><ShareIcon/></IconButton>
      </Tooltip>
    </div>
  )
}
