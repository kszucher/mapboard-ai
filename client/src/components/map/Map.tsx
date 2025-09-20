import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ColorMode } from '../../../../shared/src/api/api-types-user.ts';
import { getMapSelfH, getMapSelfW } from '../../../../shared/src/map/map-getters.ts';
import { useGetMapInfoQuery, useGetUserInfoQuery } from '../../data/api.ts';
import { actions } from '../../data/reducer.ts';
import { MidMouseMode } from '../../data/state-types.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { LinkBezier } from './LinkBezier.tsx';
import { LinkConnectorTo } from './LinkConnectorTo.tsx';
import { LinkConnectorFrom } from './LinkConnectorFrom.tsx';
import { LinkDelete } from './LinkDelete.tsx';
import { Node } from './Node.tsx';
import { MapBackground } from './MapBackground.tsx';
import { MapFrame } from './MapFrame.tsx';
import { NodeMovePreview } from './NodeMovePreview.tsx';
import { NodeSeparator } from './NodeSeparator.tsx';

export const Map: FC = () => {
  const midMouseMode = useSelector((state: RootState) => state.slice.midMouseMode);
  const zoomInfo = useSelector((state: RootState) => state.slice.zoomInfo);
  const colorMode = useGetUserInfoQuery().data?.userInfo.colorMode;
  const mapId = useGetMapInfoQuery().data?.id!;
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const mapSelfW = getMapSelfW(m);
  const mapSelfH = getMapSelfH(m);

  const dispatch = useDispatch<AppDispatch>();

  const resetView = () => {
    dispatch(
      actions.setZoomInfo({
        scale: 1,
        prevMapX: 0,
        prevMapY: 0,
        translateX: 0,
        translateY: 0,
        originX: 0,
        originY: 0,
      })
    );
    setScrollLeft((window.innerWidth + mapSelfW) / 2);
    setScrollTop(window.innerHeight - 40 * 2);
  };

  const mainMapDiv = useRef<HTMLDivElement>(null);
  const setScrollLeft = (x: number) => (mainMapDiv.current!.scrollLeft = x);
  const setScrollTop = (y: number) => window.scrollTo(0, y);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    window.addEventListener(
      'resize',
      () => {
        setScrollLeft((window.innerWidth + mapSelfW) / 2);
      },
      { signal }
    );
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (mainMapDiv.current) {
      resetView();
    }
  }, [mapId]);

  return (
    <div
      style={{
        overflow: 'auto',
        display: 'grid',
        backgroundColor: colorMode === ColorMode.DARK ? '#404040' : '#dddddd',
        gridTemplateRows: `100vh ${mapSelfH}px 100vh`,
        gridTemplateColumns: `100vw ${mapSelfW}px 100vw`,
        outline: 'none',
      }}
      ref={mainMapDiv}
      id={'mainMapDiv'}
      onMouseDown={e => {
        if (e.button === 1 && e.buttons === 4) {
          e.preventDefault();
        }
        const abortController = new AbortController();
        const { signal } = abortController;
        window.addEventListener(
          'mousemove',
          e => {
            e.preventDefault();
            if (e.button === 0 && e.buttons === 1) {
              setScrollLeft(mainMapDiv.current!.scrollLeft - e.movementX);
              setScrollTop(document.documentElement.scrollTop - e.movementY);
            }
          },
          { signal }
        );
        window.addEventListener(
          'mouseup',
          e => {
            e.preventDefault();
            abortController.abort();
          },
          { signal }
        );
      }}
      onDoubleClick={() => {
        if (mainMapDiv.current) {
          resetView();
        }
      }}
      onWheel={e => {
        if (midMouseMode === MidMouseMode.ZOOM) {
          dispatch(actions.saveView({ e }));
        }
      }}
    >
      <div />
      <div />
      <div />
      <div />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          transform: `scale(${zoomInfo.scale}) translate(${zoomInfo.translateX}px, ${zoomInfo.translateY}px)`,
          transformOrigin: `${zoomInfo.originX}px ${zoomInfo.originY}px`,
        }}
      >
        <svg width={mapSelfW} height={mapSelfH}>
          <MapBackground />
          <MapFrame />
          <LinkBezier />
          <NodeSeparator />
          <NodeMovePreview />
          <LinkConnectorFrom />
          <LinkConnectorTo />
        </svg>
        <Node />
        <LinkDelete />
      </div>
      <div />
      <div />
      <div />
    </div>
  );
};
