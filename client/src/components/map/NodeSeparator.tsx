import { FC } from 'react';
import { useSelector } from 'react-redux';
import { defaultMapConfig } from '../../../../shared/src/api/api-types-map-config.ts';
import { getNodeLeft, getNodeWidth, getNodeTop } from '../../../../shared/src/map/map-getters.ts';
import { useGetMapConfigInfoQuery } from '../../data/api.ts';
import { RootState } from '../../data/store.ts';
import { adjust } from '../../utils/utils.ts';
import { getLinearLinePath, pathCommonProps } from './UtilsSvg.ts';

export const NodeSeparator: FC = () => {
  const { mapNodeConfigs } = useGetMapConfigInfoQuery().data || defaultMapConfig;
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);

  return m.n.map(ni => (
    <path
      key={`${ni.id}_separator`}
      d={getLinearLinePath({
        x1: adjust(getNodeLeft(ni.offsetX)),
        x2: adjust(getNodeLeft(ni.offsetX) + getNodeWidth(mapNodeConfigs, ni.MapNodeConfig.type)),
        y1: adjust(getNodeTop(ni.offsetY) + 40),
        y2: adjust(getNodeTop(ni.offsetY) + 40),
      })}
      stroke={'#444'}
      {...pathCommonProps}
    />
  ));
};
