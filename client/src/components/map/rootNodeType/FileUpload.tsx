import { Box, Button, DropdownMenu, Flex, IconButton, Spinner, Text } from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { R } from '../../../../../shared/src/map/state/map-types.ts';
import Dots from '../../../../assets/dots.svg?react';
import { api, useGetMapInfoQuery } from '../../../data/api.ts';
import { actions } from '../../../data/reducer.ts';
import { AppDispatch } from '../../../data/store.ts';
import { shrinkString } from '../../../utils/utils.ts';

export const FileUpload = ({ nodeId, ri }: { nodeId: string; ri: R }) => {
  const mapId = useGetMapInfoQuery().data?.mapInfo.id;
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [executeMapUploadFile, { isError, reset }] = api.useExecuteMapUploadFileMutation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isError) {
      reset();
    }
  }, [isError]);

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
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>

      <Box position="absolute" top="7" mt="2" ml="2" pt="2" pl="2" className="pointer-events-auto">
        <Flex direction="column" gap="2" align="start" content="center">
          {ri.fileName && <Text size="2">{`File: ${shrinkString(ri.fileName, 24)}`}</Text>}

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

          {!ri.isProcessing && !ri.fileHash && (
            <Button
              size="1"
              radius="full"
              color="gray"
              onClick={() => (hiddenFileInput.current as HTMLInputElement).click()}
            >
              {'Select File'}
            </Button>
          )}

          {mapId && file && !ri.isProcessing && !ri.fileHash && (
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

          {ri.isProcessing && <Spinner size="3" />}
        </Flex>
      </Box>
    </React.Fragment>
  );
};
