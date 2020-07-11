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
            let divStyle = {
                left:               cm.nodeStartX + 'px',
                top:                cm.nodeStartY - cm.selfH / 2 + 'px',
                width:              cm.selfW - mapMem.padding - 2 + 'px',
                height:             cm.selfH - mapMem.padding - 2 + 'px',
                paddingLeft:        mapMem.padding - 2 + 'px',
                paddingTop:         mapMem.padding - 2 + 'px',
                position:           'absolute',
                border:             cm.selected ? '1px solid black' : '1px solid' + getBgc(),
                borderRadius:       8 + 'px',
                fontSize:           cm.sTextFontSize + 'px',
                fontFamily:         'Roboto',
                textDecoration:     cm.linkType !== "" ? "underline" : "",
                cursor:             'default',
                color:              cm.sTextColor,
                backgroundColor:    cm.ellipseFill ? cm.ellipseFillColor : getBgc(),
                transition:         '0.5s ease-out',
                transitionProperty: 'left, top, background-color',
            };

            if (mapMem.density === 'small' && cm.contentType === 'text') {
                divStyle.width = parseInt(divStyle.width, 10) - 3 + 'px';
                divStyle.paddingLeft = parseInt(divStyle.paddingLeft, 10) + 3 + 'px';
            }

            let div;
            if (cm.isDivAssigned === 0) {
                cm.isDivAssigned = 1;

                cm.divId = 'div' + genHash(8);
                mapMem.divData[cm.divId] = {
                    divStyle: {},
                    path: [],
                };

                div = document.createElement('div');
                div.id = cm.divId;
                div.contentEditable = false;
                div.spellcheck = false;

                div.appendChild(document.createTextNode(''));
                document.getElementById('mapDiv').appendChild(div);

                for (const styleName in divStyle) {
                    div.style[styleName] = divStyle[styleName];
                }
            }
            else {
                div = document.getElementById(cm.divId);

                for (const styleName in divStyle) {
                    if (styleName !== 'left' && styleName !== 'top') {
                        if (divStyle[styleName] !== mapMem.divData[cm.divId].divStyle[styleName]) {
                            div.style[styleName] = divStyle[styleName];
                        }
                    }
                }

                let leftDelta = parseInt(div.style.left, 10) - parseInt(divStyle.left);
                let topDelta = parseInt(div.style.top, 10) - parseInt(divStyle.top);
                if (leftDelta !== 0 || topDelta !== 0) {
                    div.style.left = divStyle.left;
                    div.style.top = divStyle.top;
                }
            }

            mapMem.divData[cm.divId].divStyle = copy(divStyle);
            mapMem.divData[cm.divId].path = cm.path;

            if (cm.isContentAssigned === 0) {
                cm.isContentAssigned = 1;

                switch (cm.contentType) {
                    case 'text':        div.innerHTML = cm.content;                                                                 break;
                    case 'image':       div.innerHTML = '<img src="' + 'http://localhost:8082/file/' + cm.content + '" alt="">';    break;
                    case 'equation':    div.innerHTML = katex.renderToString(getLatexString(cm.content), {throwOnError: false});    break;
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
