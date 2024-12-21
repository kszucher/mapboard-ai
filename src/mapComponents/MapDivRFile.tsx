import { Badge, Button, Flex, IconButton, Spinner, Text } from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../editorMutations/EditorMutations.ts';
import { R_PADDING } from '../mapConsts/MapConsts.ts';
import { R } from '../mapState/MapStateTypes.ts';
import { api, AppDispatch, RootState } from '../rootComponent/RootComponent.tsx';
import { shrinkString } from '../utils/Utils.ts';

export const MapDivRFile = ({ ri }: { ri: R }) => {
  const mapId = useSelector((state: RootState) => state.editor.mapId);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadFile, { isError, reset }] = api.useUploadFileMutation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isError) {
      reset();
      dispatch(actions.setIsProcessing({ nodeId: ri.nodeId, value: false }));
    }
  }, [isError]);

  return (
    <React.Fragment>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          paddingTop: 8,
          paddingLeft: 10,
        }}
      >
        <Flex direction="row" gap="2" align="start" content="center">
          <Badge color="gray" size="2">
            {ri.path.join('').toUpperCase()}
          </Badge>
          <Badge color="yellow" size="2">
            File Upload
          </Badge>
        </Flex>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          paddingTop: 8,
          paddingRight: 10,
        }}
      >
        <IconButton variant="solid" size="1" color="gray"></IconButton>
      </div>
      <div
        style={{
          position: 'absolute',
          top: R_PADDING,
          marginLeft: 10,
          marginTop: 10,
          paddingTop: 10,
          paddingLeft: 10,
          background: '#333333',
          width: ri.selfW - 30,
          height: ri.selfH - R_PADDING - 30,
          borderRadius: 8,
          pointerEvents: 'auto',
        }}
      >
        <Flex direction="column" gap="2" align="start" content="center">
          <input
            type="file"
            onChange={e => {
              if (e.target.files) {
                const currFile = e.target.files[0];
                setFile(currFile);
                dispatch(actions.setFileName({ nodeId: ri.nodeId, fileName: currFile.name }));
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

          {ri.fileName && <Text size="2">{`File: ${shrinkString(ri.fileName, 24)}`}</Text>}

          {file && !ri.isProcessing && !ri.fileHash && (
            <Button
              size="1"
              color="gray"
              onClick={() => {
                dispatch(actions.setIsProcessing({ nodeId: ri.nodeId, value: true }));
                uploadFile({ file, mapId, nodeId: ri.nodeId });
              }}
            >
              {'Upload File'}
            </Button>
          )}

          {ri.isProcessing && !ri.fileHash && <Spinner size="3" />}

          {ri.fileHash && (
            <Button
              size="1"
              radius="full"
              color="gray"
              onClick={() => {
                console.log('Show File');
              }}
            >
              {'Show File'}
            </Button>
          )}
        </Flex>
      </div>
    </React.Fragment>
  );
};
