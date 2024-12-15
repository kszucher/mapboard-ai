import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { api, AppDispatch } from '../rootComponent/RootComponent.tsx';

export const UserAccountDelete: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <AlertDialog.Content style={{ maxWidth: 450 }}>
      <AlertDialog.Title>{'Delete Account'}</AlertDialog.Title>
      <AlertDialog.Description size="2">
        Are you sure? This application will no longer be accessible and any existing sessions will be expired.
      </AlertDialog.Description>
      <Flex gap="3" mt="4" justify="end">
        <AlertDialog.Cancel>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <Button variant="solid" color="red" onClick={() => dispatch(api.endpoints.deleteAccount.initiate())}>
            {'Delete Account'}
          </Button>
        </AlertDialog.Action>
      </Flex>
    </AlertDialog.Content>
  );
};
