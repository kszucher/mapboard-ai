import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getMapSelfH, getMapSelfW } from '../../../../shared/src/map/getters/map-queries.ts';
import { RootState } from '../../data/store.ts';

export const RootNodeFrame: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const rootFrameVisible = useSelector((state: RootState) => state.slice.rootFrameVisible);
  return (
    rootFrameVisible && (
      <rect
        key={'svg_map_background'}
        x={0}
        y={0}
        width={getMapSelfW(m)}
        height={getMapSelfH(m)}
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
