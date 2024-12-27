import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getG } from '../../data/clientSide/mapGetters/MapQueries.ts';
import { RootState } from '../../data/store.ts';

export const RootNodeFrame: FC = () => {
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const g = getG(m);
  const rootFrameVisible = useSelector((state: RootState) => state.editor.rootFrameVisible);
  return (
    rootFrameVisible && (
      <rect
        key={`${g.nodeId}_svg_map_background`}
        x={0}
        y={0}
        width={g.selfW}
        height={g.selfH}
        rx={0}
        ry={0}
        fill={'none'}
        stroke={'#aaaaaa'}
        strokeWidth={0.5}
        style={{ transition: '0.3s ease-out' }}
      />
    )
  );
};
