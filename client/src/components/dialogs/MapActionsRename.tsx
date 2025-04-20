import { Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../data/serverSide/Api.ts';
import { AppDispatch, RootState } from '../../data/store.ts';

export const MapActionsRename = () => {
  const mapId = useSelector((state: RootState) => state.editor.mapInfo.id);
  const mapName = useSelector((state: RootState) => state.editor.mapInfo.name);
  const [newMapName, setNewMapName] = useState(mapName);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Rename Map'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Rename componentsMap'}
      </Dialog.Description>
      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            {'Name'}
          </Text>
          <TextField.Root
            radius="large"
            value={newMapName}
            placeholder="Map name"
            onChange={e => setNewMapName(e.target.value)}
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
          <Button onClick={() => dispatch(api.endpoints.renameMap.initiate({ mapId, mapName: newMapName }))}>
            {'Save'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  );
};
