import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getLineCoords } from '../../../../shared/src/map/getters/map-queries.ts';
import { RootState } from '../../data/store.ts';
import { getBezierLineCoords, getBezierLinePath, pathCommonProps } from './UtilsSvg.ts';

export const LinkBezier: FC = () => {
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  const dashLength = 6;
  const gapLength = 6;
  const dashCycle = dashLength + gapLength;

  return Object.entries(m.l).map(([nodeId, li]) => {
    const animated = li.isProcessing;

    const animationStyle = animated
      ? {
          strokeDasharray: `${dashLength}, ${gapLength}`,
          strokeDashoffset: 0,
          animation: `dashMove ${dashCycle / 12}s linear infinite`,
        }
      : {
          strokeDasharray: 'none',
          strokeDashoffset: 0,
          animation: 'none',
        };

    const mergedStyle = {
      ...(pathCommonProps.style || {}),
      ...animationStyle,
    };

    return (
      <g key={nodeId}>
        <style>{`@keyframes dashMove { to { stroke-dashoffset: -${dashCycle} } } `}</style>
        <path
          d={getBezierLinePath(getBezierLineCoords(getLineCoords(m, li)))}
          strokeWidth={1}
          stroke="#dddddd"
          fill="none"
          {...pathCommonProps}
          style={mergedStyle}
        />
      </g>
    );
  });
};
