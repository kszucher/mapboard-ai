import {Button, Dialog, Flex, Text, TextField} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {api} from "../../api/Api.ts"
import {AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {getXS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import {getMapId} from "../../state/ApiState.ts"

export const NodeEditCreateSubMap = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Create Sub Map'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Create Sub Map'}
      </Dialog.Description>
      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            {'New Map Name'}
          </Text>
          <TextField.Root
            disabled={true}
            radius="large"
            value={getXS(m).content}
            placeholder="Map name"
            onChange={(e) => console.log(e.target.value)}
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
          <Button onClick={() => dispatch(api.endpoints.createMapInMap.initiate({mapId: getMapId(), nodeId: getXS(m).nodeId, content: getXS(m).content}))}>
            {'OK'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  )
}
