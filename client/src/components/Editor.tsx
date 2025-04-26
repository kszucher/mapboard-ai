import { AlertDialog, Dialog, Spinner, Theme } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertDialogState, DialogState } from '../data/state-types.ts';
import { actions } from '../data/reducer.ts';
import { ColorMode } from '../../../shared/src/api/api-types.ts';
import { AppDispatch, RootState } from '../data/store.ts';
import { UserAccountDelete } from './alertDialogs/UserAccountDelete.tsx';
import { AppBar } from './appBar/AppBar.tsx';
import { MapActionsRename } from './dialogs/MapActionsRename.tsx';
import { MapActionsShare } from './dialogs/MapActionsShare.tsx';
import { SharedByMe } from './dialogs/SharedByMe.tsx';
import { SharedWithMe } from './dialogs/SharedWithMe.tsx';
import { Map } from './map/Map.tsx';
import { Window } from './window/Window.tsx';

export const Editor: FC = () => {
  const isLoading = useSelector((state: RootState) => state.slice.isLoading);
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const mapId = useSelector((state: RootState) => state.slice.mapInfo.id);
  const mExists = mapId && m && Object.keys(m).length;
  const colorMode = useSelector((state: RootState) => state.slice.userInfo.colorMode);
  const dialogState = useSelector((state: RootState) => state.slice.dialogState);
  const alertDialogState = useSelector((state: RootState) => state.slice.alertDialogState);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Theme
      appearance={colorMode === ColorMode.DARK ? 'dark' : 'light'}
      accentColor="iris"
      panelBackground="solid"
      scaling="100%"
      radius="full"
    >
      {mExists && (
        <Dialog.Root onOpenChange={isOpen => !isOpen && dispatch(actions.setDialogState(DialogState.NONE))}>
          <AlertDialog.Root
            onOpenChange={isOpen => !isOpen && dispatch(actions.setAlertDialogState(AlertDialogState.NONE))}
          >
            <Map />
            <AppBar />
            <Window />
            {alertDialogState === AlertDialogState.DELETE_ACCOUNT && <UserAccountDelete />}
          </AlertDialog.Root>
          {dialogState === DialogState.RENAME_MAP && <MapActionsRename />}
          {dialogState === DialogState.SHARE_THIS_MAP && <MapActionsShare />}
          {dialogState === DialogState.SHARED_BY_ME && <SharedByMe />}
          {dialogState === DialogState.SHARED_WITH_ME && <SharedWithMe />}
        </Dialog.Root>
      )}
      <div
        style={
          isLoading
            ? {
                opacity: 0.5,
                transition: 'opacity 0.3s ease-out',
                pointerEvents: 'auto',
              }
            : {
                opacity: 0,
                transition: 'opacity 0.3s ease-in',
                pointerEvents: 'none',
              }
        }
        className="fixed top-0 left-0 w-screen h-screen bg-zinc-900  flex items-center justify-center z-50"
      >
        <Spinner size="3" />
      </div>
    </Theme>
  );
};
