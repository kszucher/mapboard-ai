import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MidMouseMode } from '../../data/clientSide/EditorStateTypes.ts';
import { api } from '../../data/serverSide/Api.ts';
import { mapInfoDefaultState, userInfoDefaultState } from '../../data/serverSide/ApiState.ts';
import { actions } from '../../data/clientSide/Reducer.ts';
import { getG } from '../../data/clientSide/mapGetters/MapQueries.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { getColors } from './Colors.ts';
import { LinkNodeBezier } from './LinkNodeBezier.tsx';
import { LinkNodeConnectorIn } from './LinkNodeConnectorIn.tsx';
import { LinkNodeConnectorOut } from './LinkNodeConnectorOut.tsx';
import { LinkNodeDelete } from './LinkNodeDelete.tsx';
import { RootNodeFrame } from './RootNodeFrame.tsx';
import { RootNode } from './RootNode.tsx';
import { RootNodeMovePreview } from './RootNodeMovePreview.tsx';
import { RootNodeSeparator } from './RootNodeSeparator.tsx';

export const Map: FC = () => {
  const midMouseMode = useSelector((state: RootState) => state.editor.midMouseMode);
  const zoomInfo = useSelector((state: RootState) => state.editor.zoomInfo);
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const g = getG(m);
  const { colorMode } = api.useGetUserInfoQuery().data || userInfoDefaultState;
  const { mapId } = api.useGetMapInfoQuery().data || mapInfoDefaultState;
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
    setScrollLeft((window.innerWidth + g.selfW) / 2);
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
        setScrollLeft((window.innerWidth + g.selfW) / 2);
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
        backgroundColor: getColors(colorMode).PAGE_BACKGROUND,
        gridTemplateRows: `100vh ${g.selfH}px 100vh`,
        gridTemplateColumns: `100vw ${g.selfW}px 100vw`,
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
        <RootNode />
        <LinkNodeDelete />
        <svg
          key={g.nodeId}
          width={g.selfW}
          height={g.selfH}
          style={{ transition: '0.3s ease-out', zIndex: 10, pointerEvents: 'none' }}
        >
          <RootNodeFrame />
          <LinkNodeBezier />
          <RootNodeSeparator />
          <RootNodeMovePreview />
          <LinkNodeConnectorOut />
          <LinkNodeConnectorIn />
        </svg>
      </div>
      <div />
      <div />
      <div />
    </div>
  );
};
