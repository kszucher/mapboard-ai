import { Badge, Button, Flex, IconButton, Spinner, Text } from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
import { R_PADDING } from '../mapConsts/MapConsts.ts';
import { R } from '../mapState/MapStateTypes.ts';
import { api } from '../rootComponent/RootComponent.tsx';
import { shrinkString } from '../utils/Utils.ts';

export const MapDivRFile = ({ ri }: { ri: R }) => {
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
          <Badge color="blue" size="2">
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
                setFile(e.target.files[0]);
              }
            }}
            ref={hiddenFileInput}
            style={{ display: 'none' }}
          />
          {!isUploading && (
            <Button
              size="1"
              radius="full"
              color="gray"
              onClick={() => (hiddenFileInput.current as HTMLInputElement).click()}
            >
              Select File
            </Button>
          )}
          {<Text size="2">{`${!isUploading && file ? shrinkString(file.name, 24) : 'No File Selected'}`}</Text>}

          <Button
            disabled={isUploading || !file}
            size="1"
            color="gray"
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
