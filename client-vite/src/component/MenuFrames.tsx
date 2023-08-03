import {FC} from "react"
import {useDispatch, useSelector} from 'react-redux'
import {Menu, MenuItem} from '@mui/material'
import {actions, AppDispatch, RootState} from '../core/EditorReducer'
import {genHash} from "../core/Utils"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../state/ApiState"
import {api, useOpenWorkspaceQuery} from "../core/Api"

export const MenuFrames: FC = () => {
  const frameMenu = useSelector((state: RootState) => state.editor.frameMenu)
  const { data } = useOpenWorkspaceQuery()
  const { frameId, frameIdList } = data || defaultUseOpenWorkspaceQueryState

  console.log(frameId)

  const dispatch = useDispatch<AppDispatch>()
  return (
    <Menu
      anchorEl={document.getElementById('sidebar-right-frames')}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={frameMenu}
      onClose={() => {
        dispatch(actions.closeFrameMenu())
      }}>
      {
        [
          <MenuItem key={genHash(8)} disabled={frameId !== '' || frameIdList.length === 0} onClick={() => {
            dispatch(actions.closeFrameMenu())
            dispatch(api.endpoints.selectMap.initiate({mapId: getMapId(), frameId: frameIdList[0]}))
          }}>{'Open Frames'}</MenuItem>,
          <MenuItem key={genHash(8)} disabled={false} onClick={() => {
            dispatch(actions.closeFrameMenu())
            dispatch(api.endpoints.createMapFrameImport.initiate({mapId: getMapId(), frameId: getFrameId()}))
          }}>{'Import Map Into Frame'}</MenuItem>,
          <MenuItem key={genHash(8)} disabled={frameId === '' || frameIdList.length === 0} onClick={() => {
            dispatch(actions.closeFrameMenu())
            dispatch(api.endpoints.createMapFrameDuplicate.initiate({mapId: getMapId(), frameId: getFrameId()}))
          }}>{'Duplicate Frame'}</MenuItem>,
          <MenuItem key={genHash(8)} disabled={frameId === '' || frameIdList.length === 0} onClick={() => {
            dispatch(actions.closeFrameMenu())
            dispatch(api.endpoints.deleteMapFrame.initiate({mapId: getMapId(), frameId: getFrameId()}))
          }}>{'Delete Frame'}</MenuItem>,
          <MenuItem key={genHash(8)} disabled={frameId === ''} onClick={() => {
            dispatch(actions.closeFrameMenu())
            dispatch(api.endpoints.selectMap.initiate({mapId: getMapId(), frameId: ''}))
          }}>{'Exit Frames'}</MenuItem>,
        ]
      }
    </Menu>
  )
}
