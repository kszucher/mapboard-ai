import { Badge, Box, Flex, IconButton, TextArea } from '@radix-ui/themes';
import React from 'react';
import { R } from '../mapState/MapStateTypes.ts';

export const MapDivRExtraction = ({ ri }: { ri: R }) => {
  return (
    <React.Fragment>
      <Box position="absolute" top="0" left="0" pt="2" pl="2">
        <Flex direction="row" gap="2" align="start" content="center">
          <Badge color="gray" size="2">
            {ri.path.join('').toUpperCase()}
          </Badge>
          <Badge color="jade" size="2">
            Extraction
          </Badge>
        </Flex>
      </Box>
      <Box position="absolute" top="0" right="0" pt="2" pr="2">
        <IconButton variant="solid" size="1" color="gray"></IconButton>
      </Box>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <TextArea
          placeholder="Your Prompt…"
          color="gray"
          variant="soft"
          style={{
            width: ri.selfW - 32,
            minHeight: 100,
            outline: 'none',
            pointerEvents: 'auto',
          }}
        />
        {/*</div>*/}
        {/*<div*/}
        {/*  style={{*/}
        {/*    position: 'absolute',*/}
        {/*    top: 110,*/}
        {/*    marginLeft: 10,*/}
        {/*    marginTop: 10,*/}
        {/*    paddingTop: 10,*/}
        {/*    paddingLeft: 10,*/}
        {/*    background: '#333333',*/}
        {/*    width: ri.selfW - 30,*/}
        {/*    height: ri.selfH - 120,*/}
        {/*    borderRadius: 8,*/}
        {/*    pointerEvents: 'auto',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Flex direction="column" gap="2" align="start" content="center"></Flex>*/}
        {/*</div>*/}
      </Box>
    </React.Fragment>
  );
};
