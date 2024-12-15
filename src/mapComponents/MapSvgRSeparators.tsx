import { FC } from 'react';
import { useSelector } from 'react-redux';
import { mSelector } from '../editorQueries/EditorQueries.ts';
import { mR } from '../mapQueries/MapQueries.ts';
import { Side } from '../mapState/MapStateTypesEnums.ts';
import { RootState } from '../rootComponent/RootComponent.tsx';
import { adjust } from '../utils/Utils.ts';
import { getLinearLinePath, pathCommonProps } from './MapSvgUtils.ts';

export const MapSvgRSeparators: FC = () => {
  const m = useSelector((state: RootState) => mSelector(state));
  return mR(m).map(ri =>
    [
      {
        side: Side.T,
        x1: adjust(ri.nodeStartX),
        x2: adjust(ri.nodeStartX + ri.selfW),
        y1: adjust(ri.nodeStartY + 40),
        y2: adjust(ri.nodeStartY + 40),
      },
      {
        side: Side.B,
        x1: adjust(ri.nodeStartX),
        x2: adjust(ri.nodeStartX + ri.selfW),
        y1: adjust(ri.nodeStartY + ri.selfH - 40),
        y2: adjust(ri.nodeStartY + ri.selfH - 40),
      },
    ].flatMap(el => (
      <path
        key={`${ri.nodeId}_${el.side}_rs`}
        d={getLinearLinePath({ x1: el.x1, x2: el.x2, y1: el.y1, y2: el.y2 })}
        stroke={'#444'}
        {...pathCommonProps}
      />
    ))
  );
};
