import {Button, Dialog, Flex, Text, TextField} from "@radix-ui/themes"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {api, useOpenWorkspaceQuery} from "../../api/Api.ts"
import {AppDispatch} from "../../reducers/EditorReducer.ts"
import {defaultUseOpenWorkspaceQueryState, getMapId} from "../../state/NodeApiState.ts"

export const MapActionsRename = () => {
  const { data } = useOpenWorkspaceQuery()
  const { breadcrumbMapNameList } = data || defaultUseOpenWorkspaceQueryState
  const [mapName, setMapName] = useState(breadcrumbMapNameList.at(-1)!.name)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Rename Map'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Rename map'}
      </Dialog.Description>
      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            {'Name'}
          </Text>
          <TextField.Root
            radius="large"
            value={mapName}
            placeholder="Map name"
            onChange={(e) => setMapName(e.target.value)}
          />
        </label>
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            {'Cancel'}
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button onClick={() => dispatch(api.endpoints.renameMap.initiate({mapId: getMapId(), name: mapName}))}>
            {'Save'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}
