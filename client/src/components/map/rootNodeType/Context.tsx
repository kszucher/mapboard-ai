import { Badge, Box, DropdownMenu, Flex, IconButton, TextArea } from '@radix-ui/themes';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isExistingLink } from '../../../../../shared/src/map/getters/map-queries.ts';
import { ControlType, L, R } from '../../../../../shared/src/map/state/map-types.ts';
import Dots from '../../../../assets/dots.svg?react';
import { actions } from '../../../data/reducer.ts';
import { AppDispatch, RootState } from '../../../data/store.ts';

export const Context = ({ nodeId, ri }: { nodeId: string; ri: R }) => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const dispatch = useDispatch<AppDispatch>();

  const insertL = (fromNodeId: string, toNodeId: string) => {
    const newLink: Partial<L> = {
      fromNodeId,
      fromNodeSideIndex: 0,
      toNodeId,
      toNodeSideIndex: 0,
    };
    if (!isExistingLink(m, newLink)) {
      dispatch(actions.insertL({ lPartial: newLink }));
    }
  };

  return (
    <React.Fragment>
      <Box position="absolute" top="0" right="0" pt="2" pr="7">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="soft" size="1" color="gray" style={{ pointerEvents: 'auto', background: 'none' }}>
              <Dots />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
            <DropdownMenu.Item
              onClick={() => {
                dispatch(actions.deleteLR({ nodeId }));
              }}
            >
              {'Delete'}
            </DropdownMenu.Item>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
                {'Connect To...'}
                <div className="RightSlot"></div>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                {Object.entries(m.r)
                  .filter(([, ri]) => ri.controlType === ControlType.VECTOR_DATABASE)
                  .map(([toNodeId, ri]) => (
                    <DropdownMenu.Item
                      key={toNodeId}
                      onClick={() => {
                        insertL(nodeId, toNodeId);
                      }}
                    >
                      {'Vector Database R' + ri.iid}
                    </DropdownMenu.Item>
                  ))}
                <DropdownMenu.Separator />
                {Object.entries(m.r)
                  .filter(([, ri]) => ri.controlType === ControlType.LLM)
                  .map(([toNodeId, ri]) => (
                    <DropdownMenu.Item
                      key={toNodeId}
                      onClick={() => {
                        insertL(nodeId, toNodeId);
                      }}
                    >
                      {'LLM R' + ri.iid}
                    </DropdownMenu.Item>
                  ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>
      <Box position="absolute" top="0" left="0" pt="2" pl="2">
        <Flex direction="row" gap="2" align="start" content="center">
          <Badge color="gray" size="2">
            {'R' + ri.iid}
          </Badge>
          <Badge color="violet" size="2">
            {'Context'}
          </Badge>
        </Flex>
      </Box>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="4" align="start" content="center">
          <TextArea
            placeholder="Type Here…"
            color="gray"
            variant="soft"
            style={{
              width: ri.selfW - 32,
              minHeight: 210,
              outline: 'none',
              pointerEvents: 'auto',
            }}
            value={ri.context}
            onChange={e => {
              dispatch(actions.setRAttributes({ nodeId, attributes: { context: e.target.value } }));
            }}
          />
        </Flex>
      </Box>
    </React.Fragment>
  );
};
