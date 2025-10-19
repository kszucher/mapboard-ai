import { Box, Button, Dialog, Flex, Tabs } from '@radix-ui/themes';
import { SharedByMe } from '../tables/SharedByMe.tsx';
import { SharedWithMe } from '../tables/SharedWithMe.tsx';

export const MapShares = () => {
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
      <Dialog.Title>{'Map Shares'}</Dialog.Title>
      <Dialog.Description>Configure map shares below.</Dialog.Description>
      <Tabs.Root defaultValue="byMe" mt="4">
        <Tabs.List>
          <Tabs.Trigger value="byMe">Shared By Me</Tabs.Trigger>
          <Tabs.Trigger value="withMe">Shared With Me</Tabs.Trigger>
        </Tabs.List>
        <Box pt="3">
          <Tabs.Content value="byMe">
            <SharedByMe />
          </Tabs.Content>
          <Tabs.Content value="withMe">
            <SharedWithMe />
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
