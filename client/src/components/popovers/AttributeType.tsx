import { Button, Flex, Popover, Text } from '@radix-ui/themes';

import { NodeType } from '../../../../shared/src/schema/schema.ts';
import { AttributeTypeTable } from '../tables/AttributeTypeTable.tsx';

export const AttributeType = ({ nodeType }: { nodeType: Partial<NodeType> }) => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button size={'1'} variant="soft">
          Edit
        </Button>
      </Popover.Trigger>
      <Popover.Content width="800px">
        <Flex direction="column" gap="2" align="start" content="center">
          <Text size="3">{nodeType.label + ' Attributes'}</Text>
          <AttributeTypeTable nodeType={nodeType} />
        </Flex>
        <Flex gap="3" mt="4" justify="end">
          <Popover.Close>
            <Button variant="soft" color="gray">
              {'Close'}
            </Button>
          </Popover.Close>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};
