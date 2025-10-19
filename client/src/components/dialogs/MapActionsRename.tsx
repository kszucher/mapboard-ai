import { Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { api, useGetMapInfoQuery } from '../../data/api.ts';
import { AppDispatch } from '../../data/store.ts';

export const MapActionsRename = () => {
  const mapId = useGetMapInfoQuery().data?.id!;
  const mapName = useGetMapInfoQuery().data?.name;
  const [newMapName, setNewMapName] = useState(mapName ?? '');
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Rename Map'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Rename Map'}
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
