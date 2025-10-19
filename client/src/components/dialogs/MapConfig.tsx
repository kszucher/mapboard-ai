import { Button, Dialog, Flex } from '@radix-ui/themes';
import { MapConfigLink } from './MapConfigLink.tsx';
import { MapConfigNode } from './MapConfigNode.tsx';

export const MapConfig = () => {
  return (
    <Dialog.Content style={{ maxWidth: 800 }}>
      <Dialog.Title>{'Map Config'}</Dialog.Title>
      <Dialog.Description>Configure map nodes and links below.</Dialog.Description>
      <Flex direction="column" gap="6" mt="4" justify="between">
        <MapConfigNode />
        <MapConfigLink />
      </Flex>

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
