import { Box, Button, Dialog, Flex, ScrollArea } from '@radix-ui/themes';
import { useSelector } from 'react-redux';
import { api } from '../../data/serverSide/Api.ts';
import { extractionRawPromptDefaultState } from '../../data/serverSide/ApiState.ts';
import { RootState } from '../../data/store.ts';

export const NodeActionsExtractionShowRawPrompt = () => {
  const mapId = useSelector((state: RootState) => state.editor.mapId);
  const nodeId = useSelector((state: RootState) => state.editor.nodeId);

  const { rawPrompt } = api.useGetExtractionRawPromptQuery({ mapId, nodeId }).data || extractionRawPromptDefaultState;

  return (
    <Dialog.Content style={{ maxWidth: 800 }}>
      <Dialog.Title>{'Raw Prompt'}</Dialog.Title>

      <Dialog.Description size="2" mb="4">
        {'Raw Prompt'}
      </Dialog.Description>

      <ScrollArea type="always" scrollbars="vertical" style={{ height: 180 }}>
        <Box p="2" pr="8">
          <Flex direction="column" gap="4">
            <div>{rawPrompt}</div>
          </Flex>
        </Box>
      </ScrollArea>

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
