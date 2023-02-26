import React, {FC} from "react";
import {RootStateOrAny, useSelector} from "react-redux";
import {isChrome} from "../core/Utils";
import {Layers} from "./Layers";

export const Map: FC = () => {

  const m = useSelector((state: RootStateOrAny) => state.editor.mapStackData[state.editor.mapStackDataIndex])

  return (
    <div id='mapHolderDiv' style={{overflowY: 'scroll', overflowX: 'scroll'}}>
      <div
        style={{position: 'relative', paddingTop: '100vh', paddingLeft: '100vw'}}>
        <svg
          id="mapSvgOuter"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 'calc(200vw + ' + m.g.mapWidth + 'px)',
            height: 'calc(200vh + ' + m.g.mapHeight + 'px)'
          }}>
          {isChrome
            ?
            <svg id="mapSvgInner" style={{overflow: 'visible'}} x='calc(100vw)' y='calc(100vh)'>
              <Layers/>
            </svg>
            :
            <svg id="mapSvgInner" style={{overflow: 'visible', transform: 'translate(calc(100vw), calc(100vh))'}}>
              <Layers/>
            </svg>
          }
        </svg>
        <div id='mapDiv' style={{
          position: 'absolute',
          transitionProperty: 'width, height',
          display: 'flex',
          pointerEvents: 'none'
        }}/>
      </div>
    </div>
  )
}
