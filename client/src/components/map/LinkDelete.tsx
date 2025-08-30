import { IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLineCoords } from '../../../../shared/src/map/getters/map-queries.ts';
import Trash from '../../../assets/trash.svg?react';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { getBezierLineCoords, getBezierLineCoordsMid } from './UtilsSvg.ts';

export const LinkDelete: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const linkHelpersVisible = useSelector((state: RootState) => state.slice.linkHelpersVisible);
  const dispatch = useDispatch<AppDispatch>();
  return (
    linkHelpersVisible &&
    Object.entries(m.l).map(([linkId, li]) => (
      <IconButton
        key={`${linkId}_inter_node_bezier_trash`}
        variant="solid"
        color="gray"
        size="1"
        radius="medium"
        style={{
          position: 'absolute',
          left: getBezierLineCoordsMid(getBezierLineCoords(getLineCoords(m, li))).x - 12,
          top: getBezierLineCoordsMid(getBezierLineCoords(getLineCoords(m, li))).y - 12,
          transition: 'all 0.3s',
          transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
        }}
        onMouseDown={e => {
          e.stopPropagation();
        }}
        onClick={() => {
          dispatch(actions.deleteLink({ linkId }));
        }}
      >
        <Trash />
      </IconButton>
    ))
  );
};
