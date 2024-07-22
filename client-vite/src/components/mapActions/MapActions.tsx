import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../../api/Api.ts"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {getG} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import {DialogState, Flow} from "../../state/Enums.ts"
import {defaultUseOpenWorkspaceQueryState, getMapId} from "../../state/ApiState.ts"
import Dots from "../../assets/dots.svg?react"
import { MR } from "../../reducers/MapReducerEnum.ts"

export const MapActions = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { breadcrumbMapIdList, isShared } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  const dm = (type: MR, payload? : any) => dispatch(actions.mapReducer({type, payload}))
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="solid" color="gray">
            <Dots/>
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
          {<Dialog.Trigger>{<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.RENAME_MAP))}>{'Rename'}</DropdownMenu.Item>}</Dialog.Trigger>}
          {breadcrumbMapIdList.length === 1 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapInTab.initiate())}>{'Create'}</DropdownMenu.Item>}
          {breadcrumbMapIdList.length === 1 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapInTabDuplicate.initiate({mapId: getMapId()}))}>{'Duplicate'}</DropdownMenu.Item>}
          {breadcrumbMapIdList.length === 1 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.moveUpMapInTab.initiate({mapId: getMapId()}))}>{'Move Up'}</DropdownMenu.Item>}
          {breadcrumbMapIdList.length === 1 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.moveDownMapInTab.initiate({mapId: getMapId()}))}>{'Move Down'}</DropdownMenu.Item>}
          {breadcrumbMapIdList.length === 1 && !isShared && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.deleteMap.initiate({mapId: getMapId()}))}>{'Remove'}</DropdownMenu.Item>}
          <DropdownMenu.Separator/>
          {getG(m).density === 'small' && <DropdownMenu.Item onClick={() => dm(MR.setDensityLarge)}>{'Density - Cozy'}</DropdownMenu.Item>}
          {getG(m).density === 'large' && <DropdownMenu.Item onClick={() => dm(MR.setDensitySmall)}>{'Density - Compact'}</DropdownMenu.Item>}
          {getG(m).flow === Flow.EXPLODED && <DropdownMenu.Item onClick={() => dm(MR.setPlaceTypeIndented)}>{'Flow - Indented'}</DropdownMenu.Item>}
          {getG(m).flow === Flow.INDENTED && <DropdownMenu.Item onClick={() => dm(MR.setPlaceTypeExploded)}>{'Flow - Exploded'}</DropdownMenu.Item>}
          <DropdownMenu.Separator/>
          <Dialog.Trigger>{<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARE_THIS_MAP))}>{'Share'}</DropdownMenu.Item>}</Dialog.Trigger>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  )
}
