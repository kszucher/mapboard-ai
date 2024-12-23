import { AlertDialog, Dialog, Spinner, Theme } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mapInfoDefaultState, userInfoDefaultState } from '../apiState/ApiState.ts';
import { actions } from '../editorMutations/EditorMutations.ts';
import { AlertDialogState, DialogState } from '../editorState/EditorStateTypesEnums.ts';
import { Map } from '../mapComponents/Map.tsx';
import { api, AppDispatch, RootState } from '../rootComponent/RootComponent.tsx';
import { EditorAppBarLeft } from './EditorAppBarLeft.tsx';
import { EditorAppBarMid } from './EditorAppBarMid.tsx';
import { EditorAppBarRight } from './EditorAppBarRight.tsx';
import { MapActionsRename } from './MapActionsRename.tsx';
import { Share } from './Share.tsx';
import { SharedByMe } from './SharedByMe.tsx';
import { SharedWithMe } from './SharedWithMe.tsx';
import { UserAccountDelete } from './UserAccountDelete.tsx';
import { Window } from './Window.tsx';

export const Editor: FC = () => {
  const { mapId } = api.useGetMapInfoQuery().data || mapInfoDefaultState;

  const isLoading = useSelector((state: RootState) => state.editor.isLoading);
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const mExists = mapId && m && Object.keys(m).length;
  const { colorMode } = api.useGetUserInfoQuery().data || userInfoDefaultState;
  const dialogState = useSelector((state: RootState) => state.editor.dialogState);
  const alertDialogState = useSelector((state: RootState) => state.editor.alertDialogState);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Theme
      appearance={colorMode === 'DARK' ? 'dark' : 'light'}
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
            <div className="dark:bg-zinc-800 bg-zinc-50 dark:border-neutral-700 fixed top-0 left-0 w-screen h-[40px] z-50">
              <EditorAppBarLeft />
              <EditorAppBarMid />
              <EditorAppBarRight />
            </div>
            <Window />
            {alertDialogState === AlertDialogState.DELETE_ACCOUNT && <UserAccountDelete />}
          </AlertDialog.Root>
          {dialogState === DialogState.RENAME_MAP && <MapActionsRename />}
          {dialogState === DialogState.SHARE_THIS_MAP && <Share />}
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
