import { Button, Dialog, Flex } from '@radix-ui/themes';
import { SharedByMe } from '../tables/SharedByMe.tsx';

export const SharedByMeDialog = () => {
  return (
    <Dialog.Content style={{ maxWidth: 800 }}>
      <Dialog.Title>{'Maps Shared By Me'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Maps Shared By Me'}
      </Dialog.Description>
      <SharedByMe />
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
