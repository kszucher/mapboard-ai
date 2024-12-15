import { IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackUp from '../../assets/arrow-back-up.svg?react';
import ArrowForwardUp from '../../assets/arrow-forward-up.svg?react';
import { sharesInfoDefaultState } from '../apiState/ApiState.ts';
import { actions } from '../editorMutations/EditorMutations.ts';
import { AccessType } from '../editorState/EditorStateTypesEnums.ts';
import { api, AppDispatch, RootState } from '../rootComponent/RootComponent.tsx';
import { MouseConfig } from './MouseConfig.tsx';
import { NodeActions } from './NodeActions.tsx';
import { NodeActionsSelectModeConfig } from './NodeActionsSelectModeConfig.tsx';
import { UserAccount } from './UserAccount.tsx';
import { UserSettings } from './UserSettings.tsx';

export const EditorAppBarRight: FC = () => {
  const mapId = useSelector((state: RootState) => state.editor.mapId);
  const commitList = useSelector((state: RootState) => state.editor.commitList);
  const commitIndex = useSelector((state: RootState) => state.editor.commitIndex);
  const { sharesWithUser } = api.useGetSharesInfoQuery().data || sharesInfoDefaultState;
  const access = sharesWithUser.find(el => el.id === mapId)?.access || AccessType.EDIT;
  const undoDisabled = access !== AccessType.EDIT || commitIndex === 0;
  const redoDisabled = access !== AccessType.EDIT || commitIndex === commitList.length - 1;
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="fixed flex right-1 gap-6 h-[40px]">
      <div className="flex items-center gap-1">
        <NodeActionsSelectModeConfig />
        <NodeActions />
      </div>
      <div className="flex items-center gap-1">
        <MouseConfig />
      </div>
      <div className="flex flex-row items-center gap-1">
        <IconButton variant="solid" color="gray" disabled={undoDisabled} onClick={() => dispatch(actions.undo())}>
          <ArrowBackUp />
        </IconButton>
        <IconButton variant="solid" color="gray" disabled={redoDisabled} onClick={() => dispatch(actions.redo())}>
          <ArrowForwardUp />
        </IconButton>
      </div>
      <div className="flex flex-row items-center gap-1">
        <UserSettings />
        <UserAccount />
      </div>
    </div>
  );
};
