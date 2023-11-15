import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import React from "react"
import {useDispatch} from "react-redux"
import {nodeApi} from "../../apis/NodeApi"
import {actions, AppDispatch} from "../../reducers/EditorReducer"
import {PageState} from "../../state/Enums"
import {getMapId} from "../../state/NodeApiState"
import {DotsIcon} from "../assets/Icons"

export const EditorMapActions = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" color="gray">
          <DotsIcon/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <Dialog.Trigger>
          {<DropdownMenu.Item onClick={()=>{dispatch(actions.setPageState(PageState.WS_RENAME_MAP))}}>{'Rename'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        {<DropdownMenu.Item onClick={()=>{dispatch(nodeApi.endpoints.createMapInTab.initiate())}}>{'Create'}</DropdownMenu.Item>}
        {<DropdownMenu.Item onClick={()=>{dispatch(nodeApi.endpoints.createMapInTabDuplicate.initiate({mapId: getMapId()}))}}>{'Duplicate'}</DropdownMenu.Item>}
        {<DropdownMenu.Item onClick={()=>{dispatch(nodeApi.endpoints.moveUpMapInTab.initiate({mapId: getMapId()}))}}>{'Move Up'}</DropdownMenu.Item>}
        {<DropdownMenu.Item onClick={()=>{dispatch(nodeApi.endpoints.moveDownMapInTab.initiate({mapId: getMapId()}))}}>{'Move Down'}</DropdownMenu.Item>}
        {<DropdownMenu.Item onClick={()=>{dispatch(nodeApi.endpoints.deleteMap.initiate({mapId: getMapId()}))}}>{'Remove'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
