import { FC } from 'react';
import { useSelector } from 'react-redux';
import { defaultMapConfig } from '../../../../shared/src/api/api-types-map-config.ts';
import { getLineCoords, getOutputNodeOfLink } from '../../../../shared/src/map/map-getters.ts';
import { useGetMapConfigInfoQuery } from '../../data/api.ts';
import { RootState } from '../../data/store.ts';
import { getBezierLineCoords, getBezierLinePath, pathCommonProps } from './UtilsSvg.ts';

export const LinkBezier: FC = () => {
  const { mapNodeConfigs, mapLinkConfigs } = useGetMapConfigInfoQuery().data || defaultMapConfig;
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  const dashLength = 6;
  const gapLength = 6;
  const dashCycle = dashLength + gapLength;

  return m.l.map(li => {
    const animated = getOutputNodeOfLink(m, li).isProcessing;

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
      <g key={li.id}>
        <style>{`@keyframes dashMove { to { stroke-dashoffset: -${dashCycle} } } `}</style>
        <path
          d={getBezierLinePath(getBezierLineCoords(getLineCoords(mapNodeConfigs, mapLinkConfigs, m, li)))}
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
