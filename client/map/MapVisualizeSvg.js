import { genHash } from '../core/Utils'
import { keepHash, mapSvgData, updateSvgDom } from '../core/DomFlow'
import { createMapSvgElementData } from './MapVisualizeSvgM'
import { createNodeSvgElementData } from './MapVisualizeSvgR'

export const mapVisualizeSvg = {
    start: (m, cr) => {
        let mapSvgOuter = document.getElementById('mapSvgOuter');
        mapSvgOuter.style.width = 'calc(200vw + ' + m.mapWidth + 'px)';
        mapSvgOuter.style.height = 'calc(200vh + ' + m.mapHeight + 'px)';
        mapVisualizeSvg.iterate(m, cr);
    },

    iterate: (m, cm) => {
        let svgElementData = [{},{},{},{},{},{}];
        createMapSvgElementData(m, cm, svgElementData)
        createNodeSvgElementData(m, cm, svgElementData)
        let svgGroupList = [];
        if (!mapSvgData.hasOwnProperty(cm.svgId) ||
            ((mapSvgData.hasOwnProperty(cm.svgId) && mapSvgData[cm.svgId].keepHash === keepHash))) {
            if (cm.svgId === '') {
                cm.svgId = 'svg' + genHash(8);
            }
            for (const i of [0,1,2,3,4,5]) {
                mapSvgData[cm.svgId] = {
                    svgElementData: [{},{},{},{},{},{}],
                    path: [],
                };
                svgGroupList.push(document.createElementNS("http://www.w3.org/2000/svg", "g"));
                svgGroupList[i].setAttribute("id", cm.svgId + i);
                let parentG = document.getElementById('layer' + i);
                parentG.appendChild(svgGroupList[i]);
            }
        } else {
            for (const i of [0,1,2,3,4,5]) {
                svgGroupList.push(document.getElementById(cm.svgId + i));
            }
        }
        updateSvgDom(cm.svgId, svgElementData, svgGroupList)
        let {path} = cm;
        Object.assign(mapSvgData[cm.svgId], {keepHash, svgElementData, path})
        cm.d.map(i => mapVisualizeSvg.iterate(m, i));
        cm.s.map(i => mapVisualizeSvg.iterate(m, i));
        cm.c.map(i => i.map(j => mapVisualizeSvg.iterate(m, j)));
    }
};
