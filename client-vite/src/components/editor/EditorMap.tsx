import {Button, DropdownMenu, Flex, IconButton} from "@radix-ui/themes"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {AppDispatch, RootState} from "../../reducers/EditorReducer"
import {PageState} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {ChevronDownIcon, ChevronRightIcon, KeyframesIcon, ShareIcon} from "../assets/Icons"
import {EditorMapActions} from "./EditorMapActions"
import {EditorMapActionsRename} from "./EditorMapActionsRename"
import {EditorMapViews} from "./EditorMapViews"

export const EditorMap = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const { data } = useOpenWorkspaceQuery()
  const { breadcrumbMapIdList, breadcrumbMapNameList, tabMapIdList, tabMapNameList } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Flex gap="1" align="center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="soft" color="gray">
            <ChevronDownIcon/>
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {tabMapIdList.map((el: string, index) => (
            <DropdownMenu.Item key={index} onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: el, frameId: ''}))}>
              {tabMapNameList[index]?.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Button
        variant={breadcrumbMapIdList.length === 1 ? "solid" : 'soft'}
        onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: breadcrumbMapIdList[0], frameId: ''}))}>
        {breadcrumbMapNameList[0].name}
      </Button>
      {breadcrumbMapNameList.slice(1).map((el, index) => (
        <React.Fragment key={index}>
          <ChevronRightIcon/>
          <Button
            variant={index === breadcrumbMapIdList.length - 2 ? "solid" : 'soft'}
            onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: breadcrumbMapIdList[index + 1], frameId: ''}))}>
            {el.name}
          </Button>
        </React.Fragment>
      ))}
      <EditorMapActions/>
      <EditorMapViews/>

      {pageState === PageState.WS_RENAME_MAP && <EditorMapActionsRename/>}
      <IconButton variant="soft" color="gray">
        <KeyframesIcon/>
      </IconButton>
      <IconButton variant="soft" color="gray">
        <ShareIcon/>
      </IconButton>
    </Flex>
  )
}
