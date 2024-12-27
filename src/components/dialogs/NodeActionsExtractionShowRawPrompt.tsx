import { Button, Dialog, Flex } from '@radix-ui/themes';

export const NodeActionsExtractionShowRawPrompt = () => {
  return (
    <Dialog.Content style={{ maxWidth: 800 }}>
      <Dialog.Title>{'Raw Propmpt'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Raw Prompt'}
      </Dialog.Description>

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
