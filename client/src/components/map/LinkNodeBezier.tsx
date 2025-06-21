import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { getBezierLinePath, getRootLinePath, pathCommonProps } from './UtilsSvg.ts';

export const LinkNodeBezier: FC = () => {
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
          d={getBezierLinePath('M', getRootLinePath(m, li))}
          strokeWidth={1}
          stroke="#ffffff"
          fill="none"
          {...pathCommonProps}
          style={mergedStyle}
        />
      </g>
    );
  });
};
