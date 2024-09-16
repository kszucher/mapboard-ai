import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../api/Api.ts"
import {actions, AppDispatch, RootState} from "../editorMutations/EditorMutations.ts"
import {getG} from "../mapQueries/MapQueries.ts"
import {DialogState, Flow} from "../consts/Enums.ts"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import Dots from "../../assets/dots.svg?react"
import {mSelector} from "../editorQueries/EditorQueries.ts"

export const MapActions = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { breadcrumbMapIdList, isShared } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
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
          {breadcrumbMapIdList.length === 1 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapInTabDuplicate.initiate())}>{'Duplicate'}</DropdownMenu.Item>}
          {breadcrumbMapIdList.length === 1 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.moveUpMapInTab.initiate())}>{'Move Up'}</DropdownMenu.Item>}
          {breadcrumbMapIdList.length === 1 && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.moveDownMapInTab.initiate())}>{'Move Down'}</DropdownMenu.Item>}
          {breadcrumbMapIdList.length === 1 && !isShared && <DropdownMenu.Item onClick={() => dispatch(api.endpoints.deleteMap.initiate())}>{'Remove'}</DropdownMenu.Item>}
          <DropdownMenu.Separator/>
          {getG(m).density === 'small' && <DropdownMenu.Item onClick={() => dispatch(actions.setDensityLarge())}>{'Density - Cozy'}</DropdownMenu.Item>}
          {getG(m).density === 'large' && <DropdownMenu.Item onClick={() => dispatch(actions.setDensitySmall())}>{'Density - Compact'}</DropdownMenu.Item>}
          {getG(m).flow === Flow.EXPLODED && <DropdownMenu.Item onClick={() => dispatch(actions.setPlaceTypeIndented())}>{'Flow - Indented'}</DropdownMenu.Item>}
          {getG(m).flow === Flow.INDENTED && <DropdownMenu.Item onClick={() => dispatch(actions.setPlaceTypeExploded())}>{'Flow - Exploded'}</DropdownMenu.Item>}
          <DropdownMenu.Separator/>
          <Dialog.Trigger>{<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARE_THIS_MAP))}>{'Share'}</DropdownMenu.Item>}</Dialog.Trigger>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  )
}
