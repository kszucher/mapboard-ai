import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch} from "react-redux"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi.ts"
import {actions, AppDispatch} from "../../reducers/EditorReducer.ts"
import {DialogState} from "../../state/Enums.ts"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../../state/NodeApiState.ts"
import Dots from "../../assets/dots.svg?react"

export const MapActions = () => {
  const { data } = useOpenWorkspaceQuery()
  const { frameId, frameIdList, breadcrumbMapIdList } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="soft" color="gray">
            <Dots/>
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {frameId === '' &&
            <Dialog.Trigger>
              {<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.RENAME_MAP))}>{'Rename'}</DropdownMenu.Item>}
            </Dialog.Trigger>
          }
          {frameId === '' && breadcrumbMapIdList.length === 1 &&
            <>
              <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.createMapInTab.initiate())}>{'Create'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.createMapInTabDuplicate.initiate({mapId: getMapId()}))}>{'Duplicate'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.moveUpMapInTab.initiate({mapId: getMapId()}))}>{'Move Up'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.moveDownMapInTab.initiate({mapId: getMapId()}))}>{'Move Down'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.deleteMap.initiate({mapId: getMapId()}))}>{'Remove'}</DropdownMenu.Item>
            </>
          }
          {frameId === '' && frameIdList.length === 0 &&
            <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.createMapFrameImport.initiate({mapId: getMapId(), frameId: getFrameId()}))}>{'Create First Frame'}</DropdownMenu.Item>
          }
          {frameId === '' && frameIdList.length > 0 &&
            <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: getMapId(), frameId: frameIdList[0]}))}>{'Open First Frame'}</DropdownMenu.Item>
          }
          {frameId !== '' && frameIdList.length > 0 &&
            <>
              <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.createMapFrameDuplicate.initiate({mapId: getMapId(), frameId: getFrameId()}))}>{'Duplicate Frame'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.deleteMapFrame.initiate({mapId: getMapId(), frameId: getFrameId()}))}>{'Delete Frame'}</DropdownMenu.Item>
            </>
          }
          <DropdownMenu.Separator/>
          <Dialog.Trigger>
            {<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARE_THIS_MAP))}>{'Share'}</DropdownMenu.Item>}
          </Dialog.Trigger>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  )
}
