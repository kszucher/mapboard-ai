import { IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Trash from '../../assets/trash.svg?react';
import { actions } from '../editorMutations/EditorMutations.ts';
import { mSelector } from '../editorQueries/EditorQueries.ts';
import { mL } from '../mapQueries/MapQueries.ts';
import { AppDispatch, RootState } from '../rootComponent/RootComponent.tsx';
import { adjustIcon } from '../utils/Utils.ts';
import { getCoordsMidBezier, getRootLinePath } from './MapSvgUtils.ts';

export const MapDivL: FC = () => {
  const m = useSelector((state: RootState) => mSelector(state));
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible);
  const dispatch = useDispatch<AppDispatch>();
  return (
    connectionHelpersVisible &&
    mL(m).map(li => (
      <IconButton
        key={`${li.nodeId}_inter_root_bezier_trash`}
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
          dispatch(actions.deleteL(li.nodeId));
        }}
      >
        <Trash />
      </IconButton>
    ))
  );
};
