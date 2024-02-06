import {FC, Fragment} from 'react'
import {useDispatch} from "react-redux"
import {AppDispatch} from "../../reducers/EditorReducer"
import {api, useOpenWorkspaceQuery} from "../../api/Api.ts"
import {defaultUseOpenWorkspaceQueryState, getMapId} from "../../state/NodeApiState"
import {IconButton, DropdownMenu, Button} from "@radix-ui/themes"
import {MapActions} from "../dropdown/MapActions.tsx"
import ChevronDown from "../../assets/chevron-down.svg?react"
import ChevronRight from "../../assets/chevron-right.svg?react"
import CircleChevronLeft from "../../assets/circle-chevron-left.svg?react"
import CircleChevronRight from "../../assets/circle-chevron-right.svg?react"

export const EditorAppBarMid: FC = () => {
  const { data, isFetching } = useOpenWorkspaceQuery()
  const { breadcrumbMapIdList, breadcrumbMapNameList, tabMapIdList, tabMapNameList, frameId, frameIdList } = data || defaultUseOpenWorkspaceQueryState
  const frameIdPosition = frameIdList.indexOf(frameId)
  const prevFrameIdPosition = frameIdPosition > 0 ? frameIdPosition - 1 : 0
  const nextFrameIdPosition = frameIdPosition < frameIdList.length - 1 ? frameIdPosition + 1 : frameIdList.length - 1
  const prevFrameId = frameIdList[prevFrameIdPosition]
  const nextFrameId = frameIdList[nextFrameIdPosition]
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="fixed left-1/2 -translate-x-1/2 h-[40px] flex flex-row items-center gap-1 align-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="soft" color="gray">
            <ChevronDown/>
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {tabMapIdList.map((el: string, index) => (
            <DropdownMenu.Item key={index} onClick={() => dispatch(api.endpoints.selectMap.initiate({
              mapId: el,
              frameId: ''
            }))}>
              {tabMapNameList[index]?.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Button variant='solid' onClick={() => dispatch(api.endpoints.selectMap.initiate({
        mapId: breadcrumbMapIdList[0],
        frameId: ''
      }))}>
        {breadcrumbMapNameList[0].name}
      </Button>
      {breadcrumbMapNameList.slice(1).map((el, index) => (
        <Fragment key={index}>
          <ChevronRight/>
          <Button variant='solid' onClick={() => dispatch(api.endpoints.selectMap.initiate({
            mapId: breadcrumbMapIdList[index + 1],
            frameId: ''
          }))}>
            {el.name}
          </Button>
        </Fragment>
      ))}
      {frameId !== '' &&
        <>
          <ChevronRight/>
          <Button variant='solid' onClick={() => {
          }}>
            {`Frame ${frameIdList.indexOf(frameId) + 1}/${frameIdList.length}`}
          </Button>
          <IconButton
            variant="soft"
            color="gray"
            disabled={frameIdPosition === 0 || isFetching}
            onClick={() => dispatch(api.endpoints.selectMap.initiate({
              mapId: getMapId(),
              frameId: prevFrameId
            }))}>
            <CircleChevronLeft/>
          </IconButton>
          <IconButton
            variant="soft"
            color="gray"
            disabled={frameIdPosition === frameIdList.length - 1 || isFetching}
            onClick={() => dispatch(api.endpoints.selectMap.initiate({
              mapId: getMapId(),
              frameId: nextFrameId
            }))}>
            <CircleChevronRight/>
          </IconButton>
        </>
      }
      <MapActions/>
    </div>
  )
}
