import { IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Trash from '../../../assets/trash.svg?react';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { adjustIcon } from '../../utils/utils.ts';
import { getCoordsMidBezier, getRootLinePath } from './UtilsSvg.ts';

export const LinkNodeDelete: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const linkHelpersVisible = useSelector((state: RootState) => state.slice.linkHelpersVisible);
  const dispatch = useDispatch<AppDispatch>();
  return (
    linkHelpersVisible &&
    Object.entries(m.l).map(([nodeId, li]) => (
      <IconButton
        key={`${nodeId}_inter_root_bezier_trash`}
        variant="solid"
        color="gray"
        size="1"
        radius="medium"
        style={{
          position: 'absolute',
          left: adjustIcon(getCoordsMidBezier(getRootLinePath(m, li)).x) - 12,
          top: adjustIcon(getCoordsMidBezier(getRootLinePath(m, li)).y) - 12,
          transition: 'all 0.3s',
          transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
        }}
        onMouseDown={e => {
          e.stopPropagation();
        }}
        onClick={() => {
          dispatch(actions.deleteL({ nodeId }));
        }}
      >
        <Trash />
      </IconButton>
    ))
  );
};
