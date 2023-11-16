import {DropdownMenu, IconButton} from "@radix-ui/themes"
import React from "react"
import {useDispatch} from "react-redux"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {AppDispatch} from "../../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../../state/NodeApiState"
import {KeyframesIcon} from "../assets/Icons"

export const EditorMapFrames = () => {
  const { data } = useOpenWorkspaceQuery()
  const { frameId, frameIdList } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" color="gray">
          <KeyframesIcon/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {frameId === '' && frameIdList.length > 0 && <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: getMapId(), frameId: frameIdList[0]}))}>{'Open'}</DropdownMenu.Item>}
        {<DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.createMapFrameImport.initiate({mapId: getMapId(), frameId: getFrameId()}))}>{'Import'}</DropdownMenu.Item>}
        {frameId !== '' && frameIdList.length > 0 && <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.createMapFrameDuplicate.initiate({mapId: getMapId(), frameId: getFrameId()}))}>{'Duplicate'}</DropdownMenu.Item>}
        {frameId !== '' && frameIdList.length > 0 && <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.deleteMapFrame.initiate({mapId: getMapId(), frameId: getFrameId()}))}>{'Delete'}</DropdownMenu.Item>}
        {frameId !== '' && <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: getMapId(), frameId: ''}))}>{'Close'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
