import { Button, Flex, Spinner, Text } from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
import { NodeMode } from '../editorState/EditorStateTypesEnums.ts';
import { R_PADDING } from '../mapConsts/MapConsts.ts';
import { R } from '../mapState/MapStateTypes.ts';
import { api } from '../rootComponent/RootComponent.tsx';

export const MapDivRIngestion = ({ ri, nodeMode }: { ri: R; nodeMode: NodeMode }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, { isSuccess, reset }] = api.useUploadFileMutation();
  // const { data } = useGetIngestionQuery()
  // const { ingestionResult } = data || defaultGetIngestionQueryState
  // no such fancy state here,
  // instead we will state custom state loading, and server will kill it merge it push it

  useEffect(() => {
    if (isSuccess) {
      reset();
      setIsUploading(false);
    }
  }, [isSuccess]);

  return (
    <React.Fragment>
      <div
        style={{
          position: 'relative',
          top: R_PADDING,
          marginLeft: 10,
          marginTop: 10,
          paddingTop: 10,
          paddingLeft: 10,
          background: '#333333',
          width: ri.selfW - 30,
          height: ri.selfH - R_PADDING - 30,
          borderRadius: 8,
          pointerEvents: nodeMode === NodeMode.EDIT_ROOT ? 'none' : 'auto',
        }}
      >
        <Flex direction="column" gap="2" align="start" content="center">
          <div>{ri.path}</div>
          <input
            type="file"
            onChange={e => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
            ref={hiddenFileInput}
            style={{ display: 'none' }}
          />
          {!isUploading && (
            <Button
              size="2"
              radius="full"
              color="gray"
              onClick={() => (hiddenFileInput.current as HTMLInputElement).click()}
            >
              Select File
            </Button>
          )}
          {!isUploading && file && (
            <Flex direction="column">
              <Text size="2">File Details:</Text>
              <Text size="2">Name: {file.name}</Text>
              <Text size="2">Type: {file.type}</Text>
              <Text size="2">Size: {file.size} bytes</Text>
            </Flex>
          )}
          {!isUploading && file && (
            <Button
              onClick={() => {
                if (file) {
                  setIsUploading(true);
                  const formData = new FormData();
                  formData.append('file', file);
                  uploadFile({ bodyFormData: formData });
                }
              }}
            >
              Upload file
            </Button>
          )}
          {isUploading && <Spinner size="3" />}
          {/*{ingestionResult &&*/}
          {/*  <div>*/}
          {/*    {ingestionResult}*/}
          {/*  </div>*/}
          {/*}*/}
        </Flex>
      </div>
    </React.Fragment>
  );
};
