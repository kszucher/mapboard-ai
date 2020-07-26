import {mapMem} from "./Map";
import {genHash, getLatexString, copy, getBgc} from "../core/Utils";
import {hasCell} from "../node/Node";

export const mapDivVisualize = {
    start: () => {
        let cm = mapMem.data.s[0];
        mapDivVisualize.iterate(cm);
    },

    iterate: (cm) => {
        if (cm.type === 'struct' && ! hasCell(cm)) {
            let styleTransformData = {
                prevLeft:                   cm.isDivAssigned ? mapMem.divData[cm.divId].styleData.currLeft : 0,
                prevTop:                    cm.isDivAssigned ? mapMem.divData[cm.divId].styleData.currTop : 0,
                currLeft:                   cm.nodeStartX,
                currTop:                    cm.nodeStartY - cm.selfH / 2
            };
            
            let styleData = {
                minWidth:                   cm.content.length === 0 ? '14px' : cm.selfW - mapMem.padding - 2 + 'px',
                minHeight:                  cm.selfH - mapMem.padding - 2 + 'px',
                paddingLeft:                mapMem.padding - 2 + 'px',
                paddingTop:                 mapMem.padding - 2 + 'px',
                position:                   'absolute',
                borderLeft:                 cm.selected ?                   '1px solid black' : '1px solid' + getBgc(),
                borderTop:                  cm.selected ?                   '1px solid black' : '1px solid' + getBgc(),
                borderBottom:               cm.selected ?                   '1px solid black' : '1px solid' + getBgc(),
                borderRight:                cm.selected && !cm.isEditing ?  '1px solid black' : '1px solid' + getBgc(),
                borderTopLeftRadius:        '8px',
                borderBottomLeftRadius:     '8px',
                borderTopRightRadius:       cm.isEditing ? '0px' : '8px',
                borderBottomRightRadius:    cm.isEditing ? '0px' : '8px',
                fontSize:                   cm.sTextFontSize + 'px',
                fontFamily:                 'Roboto',
                textDecoration:             cm.linkType !== "" ? "underline" : "",
                cursor:                     'default',
                color:                      cm.sTextColor,
                backgroundColor:            cm.ellipseFill ? cm.ellipseFillColor : getBgc(),
                transition:                 '0.5s ease-out',
                transitionProperty:         'transform, background-color',
            };

            if (mapMem.density === 'small' && cm.contentType === 'text') {
                styleData.minWidth = parseInt(styleData.minWidth, 10) - 3 + 'px';
                styleData.paddingLeft = parseInt(styleData.paddingLeft, 10) + 3 + 'px';
            }

            let div;
            if (cm.isDivAssigned === 0) {
                cm.isDivAssigned = 1;

                cm.divId = 'div' + genHash(8);
                mapMem.divData[cm.divId] = {
                    styleData: {},
                    path: [],
                };

                div = document.createElement('div');
                div.id = cm.divId;
                div.contentEditable = false;
                div.spellcheck = false;

                div.appendChild(document.createTextNode(''));
                document.getElementById('mapDiv').appendChild(div);

                div.style.transform = 'translate(' + styleTransformData.currLeft + 'px,' + styleTransformData.currTop + 'px)';
                
                for (const styleName in styleData) {
                    div.style[styleName] = styleData[styleName];
                }
            } else {
                div = document.getElementById(cm.divId);

                for (const styleName in styleData) {
                    if (styleData[styleName] !== mapMem.divData[cm.divId].styleData[styleName]) {
                        div.style[styleName] = styleData[styleName];
                    }
                }

                if (styleTransformData.prevLeft !== styleTransformData.currLeft ||
                    styleTransformData.prevTop !== styleTransformData.currTop) {
                    div.style.transform = 'translate(' + styleTransformData.currLeft + 'px,' + styleTransformData.currTop + 'px)';
                }
            }

            mapMem.divData[cm.divId].styleData = copy(styleData);
            mapMem.divData[cm.divId].path = cm.path;

            if (cm.isContentAssigned === 0) {
                cm.isContentAssigned = 1;

                switch (cm.contentType) {
                    case 'text':        div.innerHTML = cm.content;                                                                 break;
                    case 'equation':    div.innerHTML = katex.renderToString(getLatexString(cm.content), {throwOnError: false});    break;
                    case 'image':       div.innerHTML = '<img src="' + 'http://localhost:8082/file/' + cm.content + '" alt="">';    break;
                    default:            console.log('unknown contentType');                                                         break;
                }
            }
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapDivVisualize.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapDivVisualize.iterate(cm.s[i]);
        }
    }
};
