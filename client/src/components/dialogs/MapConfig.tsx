import { Box, Button, Dialog, Flex, Tabs } from '@radix-ui/themes';
import { EdgeConfig } from '../tables/EdgeConfig.tsx';
import { NodeConfig } from '../tables/NodeConfig.tsx';

export const MapConfig = () => {
  return (
    <Dialog.Content
      style={{
        animation: 'none',
        maxWidth: 800,
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)', // center horizontally only
      }}
    >
      <Dialog.Title>{'Map Config'}</Dialog.Title>
      <Dialog.Description>Configure map nodes and edges below.</Dialog.Description>
      <Tabs.Root defaultValue="nodes">
        <Tabs.List>
          <Tabs.Trigger value="nodes">Nodes</Tabs.Trigger>
          <Tabs.Trigger value="edges">Edges</Tabs.Trigger>
        </Tabs.List>
        <Box pt="3">
          <Tabs.Content value="nodes">
            <NodeConfig />
          </Tabs.Content>
          <Tabs.Content value="edges">
            <EdgeConfig />
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
