import { Button, Flex, Popover, Text } from '@radix-ui/themes';
import { MapNodeConfig } from '../../../../shared/src/api/api-types-map-config.ts';
import { NodeFieldConfig } from '../tables/NodeFieldConfig.tsx';

export const MapNodeFieldConfig = ({ nodeConfig }: { nodeConfig: Partial<MapNodeConfig> }) => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button size={'1'} variant="soft">
          Edit Fields
        </Button>
      </Popover.Trigger>
      <Popover.Content width="600px">
        <Flex direction="column" gap="2" align="start" content="center">
          <Text size="3">{nodeConfig.label + ' Fields'}</Text>
          <NodeFieldConfig nodeConfig={nodeConfig} />
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
