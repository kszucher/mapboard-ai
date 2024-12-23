import { Button, Dialog, Flex, Grid, Select, Spinner, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { AccessType } from '../editorState/EditorStateTypesEnums.ts';
import { api, RootState } from '../rootComponent/RootComponent.tsx';

export const Share = () => {
  const mapId = useSelector((state: RootState) => state.editor.mapId);
  const [createShare, { error, isUninitialized, isLoading, isSuccess, isError, reset }] = api.useCreateShareMutation();
  const errorMessage = error && (error as { data: { detail: string } }).data.detail;
  const [shareEmail, setShareEmail] = useState('');
  const [shareAccess, setShareAccess] = useState<AccessType>(AccessType.VIEW);
  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>{'Share This Map'}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        {'Share This Map'}
      </Dialog.Description>
      <Grid columns="1" gap="3" width="auto" align="center">
        <Text as="div" size="2" weight="bold">
          {'Access'}
        </Text>
        <Select.Root
          disabled={isLoading || isSuccess}
          value={shareAccess}
          onValueChange={value => {
            reset();
            setShareAccess(value as AccessType);
          }}
        >
          <Select.Trigger radius="large" />
          <Select.Content>
            {[AccessType.VIEW, AccessType.EDIT].map((el, index) => (
              <Select.Item key={index} value={el}>
                {el}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Text as="div" size="2" weight="bold">
          {'Email'}
        </Text>
        <TextField.Root
          disabled={isLoading || isSuccess}
          radius="large"
          value={shareEmail}
          placeholder="User email"
          color={isError ? 'red' : 'gray'}
          onChange={e => {
            reset();
            setShareEmail(e.target.value);
          }}
        />
      </Grid>
      <Flex direction="column" gap="3">
        {isUninitialized && (
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                {'Cancel'}
              </Button>
            </Dialog.Close>
            <Button disabled={shareEmail === ''} onClick={() => createShare({ mapId, shareEmail, shareAccess })}>
              {'Share'}
            </Button>
          </Flex>
        )}
        {isError && (
          <Text as="div" size="2" mt="4" color="crimson">
            {errorMessage as string}
          </Text>
        )}
        {isSuccess && (
          <Text as="div" size="2" mt="4" color="grass">
            {'Successfully shared'}
          </Text>
        )}
        {(isError || isSuccess) && (
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                {'Close'}
              </Button>
            </Dialog.Close>
          </Flex>
        )}
        {isLoading && <Spinner size="3" />}
      </Flex>
    </Dialog.Content>
  );
};
