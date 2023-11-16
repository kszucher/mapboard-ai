import {Button, Dialog, Flex, Text, TextField} from "@radix-ui/themes"
import React, {useState} from "react"
import {useDispatch} from "react-redux";
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {AppDispatch} from "../../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState, getMapId} from "../../state/NodeApiState"

export const EditorMapSharesThis = () => {
  const { data } = useOpenWorkspaceQuery()
  const { tabMapNameList, tabId } = data || defaultUseOpenWorkspaceQueryState
  const [mapName, setMapName] = useState(tabMapNameList[tabId].name)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Share This Map'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Shares'}
      </Dialog.Description>
      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Name
          </Text>
          <TextField.Input
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
          <Button onClick={() => dispatch(nodeApi.endpoints.renameMap.initiate({mapId: getMapId(), name: mapName}))}>
            {'Save'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}
