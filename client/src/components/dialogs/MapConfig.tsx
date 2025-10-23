import { Box, Button, Dialog, Flex, Tabs } from '@radix-ui/themes';
import { useSelector } from 'react-redux';
import { DialogState } from '../../data/state-types.ts';
import { RootState } from '../../data/store.ts';
import { EdgeEdit } from '../tables/EdgeEdit.tsx';
import { NodeEdit } from '../tables/NodeEdit.tsx';

export const MapConfig = () => {
  const dialogState = useSelector((state: RootState) => state.slice.dialogState);
  const dialogMode = {
    [DialogState.NODE_CONFIG]: 'nodes',
    [DialogState.EDGE_CONFIG]: 'edges',
  }[dialogState];

  return (
    <Dialog.Content
      style={{
        animation: 'none',
        maxWidth: 800,
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <Dialog.Title>{'Map Config'}</Dialog.Title>
      <Dialog.Description>Configure map nodes and edges below.</Dialog.Description>
      <Tabs.Root defaultValue={dialogMode} mt="4">
        <Tabs.List>
          <Tabs.Trigger value="nodes">Nodes</Tabs.Trigger>
          <Tabs.Trigger value="edges">Edges</Tabs.Trigger>
        </Tabs.List>
        <Box pt="3">
          <Tabs.Content value="nodes" style={{ outline: 'none' }}>
            <NodeEdit />
          </Tabs.Content>
          <Tabs.Content value="edges" style={{ outline: 'none' }}>
            <EdgeEdit />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            {'Close'}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  );
};
