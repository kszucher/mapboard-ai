import { IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ArrowForwardUp from '../../../assets/arrow-forward-up.svg?react';
import { AccessType } from '../../data/state-types.ts';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';

export const NodeRedo: FC = () => {
  const mapId = useSelector((state: RootState) => state.slice.mapInfo.id);
  const commitList = useSelector((state: RootState) => state.slice.commitList);
  const commitIndex = useSelector((state: RootState) => state.slice.commitIndex);
  const sharesWithUser = useSelector((state: RootState) => state.slice.shareInfo.SharesWithMe);
  const access = sharesWithUser.find(el => el.id === mapId)?.access || AccessType.EDIT;
  const redoDisabled = access !== AccessType.EDIT || commitIndex === commitList.length - 1;
  const dispatch = useDispatch<AppDispatch>();
  return (
    <IconButton variant="solid" color="gray" disabled={redoDisabled} onClick={() => dispatch(actions.redo())}>
      <ArrowForwardUp />
    </IconButton>
  );
};
