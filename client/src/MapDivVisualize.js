import {mapMem}                                             from "./Map";
import {genHash, getLatexString, copy, getBgc}              from "./Utils";
import {hasCell}                                            from "./Node";

class MapDivVisualize {
    start() {
        let cm =                                            mapMem.data.s[0];
        this.iterate(cm);
    }

    iterate(cm) {
        if (cm.type === 'struct') {
            if (hasCell(cm)) {

            }
            else {
                let divStyle = {
                    left:                                   cm.nodeStartX +                                 'px',
                    top:                                    cm.nodeStartY - cm.selfH/2  +                   'px',
                    width :                                 cm.selfW - mapMem.padding - 2 +                 'px',
                    height :                                cm.selfH - mapMem.padding - 2 +                 'px',
                    paddingLeft :                           mapMem.padding - 2 +                            'px',
                    paddingTop :                            mapMem.padding - 2 +                            'px',
                    position:                               'absolute',
                    border:             cm.selected?        '1px solid black'       : '1px solid' + getBgc(),
                    borderRadius:                           8 +                                             'px',
                    fontSize:                               cm.sTextFontSize +                              'px',
                    fontFamily:                             'Roboto',
                    textDecoration:     cm.linkType !== ""? "underline"              : "",
                    cursor:                                 'default',
                    color:                                  cm.sTextColor,
                    backgroundColor:    cm.ellipseFill?     cm.ellipseFillColor     : getBgc(),
                };

                if (mapMem.density === 'small' && cm.contentType === 'text') {
                    divStyle.width =                        parseInt(divStyle.width, 10)       - 3 + 'px';
                    divStyle.paddingLeft =                  parseInt(divStyle.paddingLeft, 10) + 3 + 'px';
                }

                let div;
                if (cm.isDivAssigned === 0) {
                    cm.isDivAssigned =                      1;

                    cm.divId = 'div' + genHash(8);
                    mapMem.divData[cm.divId] =              {divStyle:{}};

                    div =                                   document.createElement('div');
                    div.id =                                cm.divId;
                    div.contentEditable =                   false;
                    div.spellcheck =                        false;

                    div.appendChild(document.createTextNode(''));
                    document.getElementById('mapDiv').appendChild(div);

                    for (let i = 0; i < Object.keys(divStyle).length; i++) {
                        let styleName = Object.keys(divStyle)[i];
                        if (divStyle[styleName] !== mapMem.divData[cm.divId].divStyle[styleName]) {
                            div.style[styleName] =          divStyle[styleName];
                        }
                    }
                }
                else {
                    div = document.getElementById(cm.divId);

                    for (let i = 0; i < Object.keys(divStyle).length; i++) {
                        let styleName = Object.keys(divStyle)[i];
                        if (styleName !== 'left' && styleName !== 'top') {
                            if (divStyle[styleName] !== mapMem.divData[cm.divId].divStyle[styleName]) {
                                div.style[styleName] =      divStyle[styleName];
                            }
                        }
                    }

                    let leftDelta =                         parseInt(div.style.left, 10) -     parseInt(divStyle.left);
                    let topDelta =                          parseInt(div.style.top, 10) -      parseInt(divStyle.top);

                    if (leftDelta !== 0 || topDelta !== 0) {
                        div.style.transform =               "translate(" + leftDelta + ',' + topDelta + ")";
                        div.style.transition =              '0.5s ease-out';

                        div.style.left =                    divStyle.left;
                        div.style.top =                     divStyle.top;
                    } else {
                        div.style.transform =               '';
                        div.style.transition =              '';
                    }
                }

                mapMem.divData[cm.divId].divStyle =         copy(divStyle);

                if (cm.isContentAssigned === 0) {
                    cm.isContentAssigned = 1;

                    if (cm.contentType === 'text') {
                        div.innerHTML =                     cm.content;
                    }
                    else if (cm.contentType === 'image') {
                        div.innerHTML =                     '<img src="' + 'http://localhost:8082/file/' + cm.content + '">';
                    }
                    else if (cm.contentType === 'equation') {
                        // div.innerHTML = katex.renderToString(getLatexString(cm.content), {throwOnError: false});
                        katex.render(getLatexString(cm.content), div, {throwOnError: false});
                    }
                }
            }
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                this.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            this.iterate(cm.s[i]);
        }
    }
}

export let mapDivVisualize = new MapDivVisualize();
