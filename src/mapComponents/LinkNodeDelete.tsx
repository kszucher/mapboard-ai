import { IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Trash from '../../assets/trash.svg?react';
import { actions } from '../editorMutations/EditorMutations.ts';
import { mL } from '../mapQueries/MapQueries.ts';
import { AppDispatch, RootState } from '../rootComponent/RootComponent.tsx';
import { adjustIcon } from '../utils/Utils.ts';
import { getCoordsMidBezier, getRootLinePath } from './UtilsSvg.ts';

export const LinkNodeDelete: FC = () => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
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
          zIndex: 11,
        }}
        onMouseDown={e => {
          e.stopPropagation();
        }}
        onClick={() => {
          dispatch(actions.deleteL({ nodeId: li.nodeId }));
        }}
      >
        <Trash />
      </IconButton>
    ))
  );
};
