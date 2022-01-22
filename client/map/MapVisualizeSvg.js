import { createMapSvgElementData } from './MapVisualizeSvgM'
import { createNodeSvgElementData } from './MapVisualizeSvgN'

export const mapVisualizeSvg = {
    start: (m, cr) => {
        let mapSvgOuter = document.getElementById('mapSvgOuter');
        mapSvgOuter.style.width = 'calc(200vw + ' + m.mapWidth + 'px)';
        mapSvgOuter.style.height = 'calc(200vh + ' + m.mapHeight + 'px)';
        createMapSvgElementData(m)
        mapVisualizeSvg.iterate(m, cr);
    },

    iterate: (m, cm) => {
        createNodeSvgElementData(m, cm)
        cm.d.map(i => mapVisualizeSvg.iterate(m, i));
        cm.s.map(i => mapVisualizeSvg.iterate(m, i));
        cm.c.map(i => i.map(j => mapVisualizeSvg.iterate(m, j)));
    }
}
