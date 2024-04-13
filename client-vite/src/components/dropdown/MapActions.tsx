import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../../api/Api.ts"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {getG} from "../../queries/MapQueries.ts";
import {mSelector} from "../../state/EditorState.ts";
import {DialogState, Flow} from "../../state/Enums.ts"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../../state/NodeApiState.ts"
import Dots from "../../assets/dots.svg?react"
import { MR } from "../../reducers/MapReducerEnum.ts"

export const MapActions = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { frameId, frameIdList, breadcrumbMapIdList, isShared } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="solid" color="gray">
            <Dots/>
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
          {frameId === '' && <Dialog.Trigger>{<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.RENAME_MAP))}>{'Rename'}</DropdownMenu.Item>}</Dialog.Trigger>}
          {frameId === '' && breadcrumbMapIdList.length === 1 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapInTab.initiate())}>{'Create'}</DropdownMenu.Item>}
          {frameId === '' && breadcrumbMapIdList.length === 1 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapInTabDuplicate.initiate({mapId: getMapId()}))}>{'Duplicate'}</DropdownMenu.Item>}
          {frameId === '' && breadcrumbMapIdList.length === 1 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.moveUpMapInTab.initiate({mapId: getMapId()}))}>{'Move Up'}</DropdownMenu.Item>}
          {frameId === '' && breadcrumbMapIdList.length === 1 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.moveDownMapInTab.initiate({mapId: getMapId()}))}>{'Move Down'}</DropdownMenu.Item>}
          {frameId === '' && breadcrumbMapIdList.length === 1 && !isShared && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.deleteMap.initiate({mapId: getMapId()}))}>{'Remove'}</DropdownMenu.Item>}
          {frameId === '' && frameIdList.length === 0 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapFrameImport.initiate({mapId: getMapId(), frameId: getFrameId()}))}>{'Create First Frame'}</DropdownMenu.Item>}
          {frameId === '' && frameIdList.length > 0 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.selectMap.initiate({mapId: getMapId(), frameId: frameIdList[0]}))}>{'Open First Frame'}</DropdownMenu.Item>}
          {frameId !== '' && frameIdList.length > 0 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapFrameDuplicate.initiate({mapId: getMapId(), frameId: getFrameId()}))}>{'Duplicate Frame'}</DropdownMenu.Item>}
          {frameId !== '' && frameIdList.length > 0 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.deleteMapFrame.initiate({mapId: getMapId(), frameId: getFrameId()}))}>{'Delete Frame'}</DropdownMenu.Item>}
          <DropdownMenu.Separator/>
          {getG(m).density === 'small' && <DropdownMenu.Item onClick={() => md(MR.setDensityLarge)}>{'Density - Cozy'}</DropdownMenu.Item>}
          {getG(m).density === 'large' && <DropdownMenu.Item onClick={() => md(MR.setDensitySmall)}>{'Density - Compact'}</DropdownMenu.Item>}
          {getG(m).flow === Flow.EXPLODED && <DropdownMenu.Item onClick={() => md(MR.setPlaceTypeIndented)}>{'Flow - Indented'}</DropdownMenu.Item>}
          {getG(m).flow === Flow.INDENTED && <DropdownMenu.Item onClick={() => md(MR.setPlaceTypeExploded)}>{'Flow - Exploded'}</DropdownMenu.Item>}
          <DropdownMenu.Separator/>
          <Dialog.Trigger>{<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARE_THIS_MAP))}>{'Share'}</DropdownMenu.Item>}</Dialog.Trigger>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  )
}
