import {keepHash, mapMem} from "./Map";
import {genHash, getLatexString, copy, getBgc, setEndOfContenteditable} from "../core/Utils";
import {hasCell} from "../node/Node";

export const mapDivVisualize = {
    start: () => {
        let cm = mapMem.getData().s[0];
        mapDivVisualize.iterate(cm);
    },

    iterate: (cm) => {
        if (cm.type === 'struct' && ! hasCell(cm)) {
            let styleData = {
                left:                   cm.nodeStartX + 'px',
                top:                    cm.nodeStartY - cm.selfH / 2 + 'px',
                minWidth:               (mapMem.density === 'large'?   0 : - 3) + (cm.content.length === 0 ? '14px' : cm.selfW - mapMem.padding - 2) + 'px',
                minHeight:              (mapMem.density === 'large'? - 2 : - 1) + cm.selfH - mapMem.padding + 'px',
                paddingLeft:            (mapMem.density === 'large'?   0 : + 3) + mapMem.padding - 2 + 'px',
                paddingTop:             mapMem.padding - 2 + 'px',
                position:               'absolute',
                border:                 cm.selected ? '1px solid black' : '1px solid' + getBgc(),
                borderRadius:           '8px',
                borderColor:            cm.selected? (cm.isEditing? getBgc() : '#000000' ) : 'none',
                fontSize:               cm.sTextFontSize + 'px',
                fontFamily:             'Roboto',
                textDecoration:         cm.linkType !== "" ? "underline" : "",
                cursor:                 'default',
                color:                  cm.sTextColor,
                backgroundColor:        cm.ellipseFill ? cm.ellipseFillColor : getBgc(),
                transition:             '0.5s ease-out',
                transitionProperty:     'left, top, background-color',
            };

            let div;

            if (!mapMem.divData.hasOwnProperty(cm.divId) ||
                (mapMem.divData.hasOwnProperty(cm.divId) && mapMem.divData[cm.divId].keepHash === keepHash)) {
                cm.divId = 'div' + genHash(8);
                mapMem.divData[cm.divId] = {
                    keepHash: '',
                    styleData: {},
                    textContent: '',
                    path: [],
                };

                div = document.createElement('div');
                div.id = cm.divId;
                div.contentEditable = false;
                div.spellcheck = false;

                div.appendChild(document.createTextNode(''));
                document.getElementById('mapDiv').appendChild(div);

                for (const styleName in styleData) {
                    div.style[styleName] = styleData[styleName];
                }

                div.innerHTML = renderContent(cm.contentType, cm.content);
            }
            else {
                div = document.getElementById(cm.divId);
                for (const styleName in styleData) {
                    if (styleData[styleName] !== mapMem.divData[cm.divId].styleData[styleName]) {
                        div.style[styleName] = styleData[styleName];
                    }
                }

                if (div.textContent !== mapMem.divData[cm.divId].textContent) {
                    div.innerHTML = renderContent(cm.contentType, cm.content);
                    if (cm.contentType === 'text') {
                        setEndOfContenteditable(div); // todo: investigate why duplication is needed
                    }
                }
            }

            mapMem.divData[cm.divId].keepHash = keepHash;
            mapMem.divData[cm.divId].styleData = copy(styleData);
            mapMem.divData[cm.divId].textContent = copy(div.textContent);
            mapMem.divData[cm.divId].path = cm.path;
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

function renderContent (contentType, content) {
    switch (contentType) {
        case 'text':            return content;
        case 'equation':        return katex.renderToString(getLatexString(content), {throwOnError: false});
        case 'image':           return '<img src="' + 'http://localhost:8082/file/' + content + '" alt="">';
    }
}
