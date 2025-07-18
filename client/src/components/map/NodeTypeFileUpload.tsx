import { Box, Button, Flex, Spinner, Text } from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
import { N } from '../../../../shared/src/map/state/map-consts-and-types.ts';
import { api, useGetMapInfoQuery } from '../../data/api.ts';
import { shrinkString } from '../../utils/utils.ts';

export const NodeTypeFileUpload = ({ nodeId, ni }: { nodeId: string; ni: N }) => {
  const mapId = useGetMapInfoQuery().data?.mapInfo.id;
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [executeMapUploadFile, { isError, reset }] = api.useExecuteMapUploadFileMutation();

  useEffect(() => {
    if (isError) {
      reset();
    }
  }, [isError]);

  return (
    <React.Fragment>
      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="2" align="start" content="center">
          {ni.fileName && <Text size="2">{`File: ${shrinkString(ni.fileName, 16)}`}</Text>}

          <input
            type="file"
            onChange={e => {
              if (e.target.files) {
                const currFile = e.target.files[0];
                setFile(currFile);
              }
            }}
            ref={hiddenFileInput}
            style={{ display: 'none' }}
          />

          {!ni.isProcessing && !ni.fileHash && (
            <Button
              size="1"
              radius="full"
              color="gray"
              onClick={() => (hiddenFileInput.current as HTMLInputElement).click()}
            >
              {'Select File'}
            </Button>
          )}

          {mapId && file && !ni.isProcessing && !ni.fileHash && (
            <Button
              size="1"
              color="gray"
              onClick={() => {
                executeMapUploadFile({ file, mapId, nodeId });
              }}
            >
              {'Upload File'}
            </Button>
          )}

          {ni.isProcessing && <Spinner size="3" />}
        </Flex>
      </Box>
    </React.Fragment>
  );
};
