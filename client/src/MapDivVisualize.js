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
                let newStyle = {
                    left:                                   cm.nodeStartX                                                                           + 'px',
                    top:                                    cm.nodeStartY - cm.selfH/2 + (mapMem.defaultH - cm.sTextFontSize)/2 - mapMem.padding    + 'px',
                    width:                                  cm.selfW                                                            - mapMem.padding    + 'px',
                    height:                                 cm.selfH                                                            - mapMem.padding    + 'px',
                    color:                                  cm.sTextColor,
                    textDecoration:     cm.ilink === ""?    ""                      : "underline",
                    backgroundColor:    cm.ellipseFill?     cm.ellipseFillColor     : getBgc(),
                    border:             cm.selected?        '1px solid black'       : '1px solid' + getBgc()
                };

                let div;
                if (cm.isDivAssigned === 0) {
                    cm.isDivAssigned =                      1;

                    cm.divId =                              'div' + genHash(8);
                    mapMem.divData[cm.divId] = {
                        innerHTML:                          '',
                        style:                              {}
                    };

                    div =                                   document.createElement('div');
                    div.id =                                cm.divId;
                    div.style.position =                    "absolute";

                    div.appendChild(document.createTextNode(''));
                    document.getElementById('mapDiv').appendChild(div);

                    for (let i = 0; i < Object.keys(newStyle).length; i++) {
                        let styleName = Object.keys(newStyle)[i];
                        if (newStyle[styleName] !==         mapMem.divData[cm.divId].style[styleName]) {
                            div.style[styleName] =          newStyle[styleName];
                        }
                    }
                }
                else {
                    div =                                   document.getElementById(cm.divId);

                    for (let i = 0; i < Object.keys(newStyle).length; i++) {
                        let styleName = Object.keys(newStyle)[i];
                        if (styleName !== 'left' && styleName !== 'top') {
                            if (newStyle[styleName] !==     mapMem.divData[cm.divId].style[styleName]) {
                                div.style[styleName] =      newStyle[styleName];
                            }
                        }
                    }

                    let leftDelta = (parseInt(div.style.left, 10) - parseInt(newStyle.left));
                    let topDelta = (parseInt(div.style.top, 10) - parseInt(newStyle.top));

                    if (leftDelta !== 0 || topDelta !== 0 ) {
                        div.style.transform =               "translate(" + leftDelta + ',' + topDelta + ")";
                        div.style.transition =              '0.5s ease-out';

                        div.style.left =                    newStyle.left;
                        div.style.top =                     newStyle.top;
                    }
                    else {
                        div.style.transform =               '';
                        div.style.transition =              '';
                    }
                }

                mapMem.divData[cm.divId].style = copy(newStyle);

                if (cm.content === '_pic') {
                    if (cm.isPicAssigned === 0) {
                        cm.isPicAssigned = 1;

                        let filename =                      'http://localhost:8082/file/' + cm.plink;

                        div.innerHTML = '';
                        div.style.paddingLeft =             '0px';
                        div.style.paddingTop =              '0px';
                        div.style.borderRadius =            '8px';

                        div.insertAdjacentHTML('beforeend', '<img src="' + filename +  '">');
                    }
                }
                else if (cm.content.substring(0, 2) === '\\[') {
                    if (cm.isEquationAssigned === 0) {
                        cm.isEquationAssigned = 1;

                        div.style.paddingLeft =             4                       + 'px';
                        div.style.paddingTop =              mapMem.padding          + 'px';
                        div.style.fontSize =                cm.sTextFontSize        + 'px';
                        div.style.cursor =                  'default';

                        katex.render(getLatexString(cm.content), div, {
                            throwOnError: false
                        });
                    }
                }
                else {
                    if (cm.isTextAssigned === 0) {
                        cm.isTextAssigned =                 1;

                        if (cm.polygonFill === 1) {
                            cm.sTextColor =                 '#ffffff';
                        }

                        div.innerHTML =                     cm.content;
                        div.contentEditable =               false;
                        div.spellcheck =                    false;
                        div.style.paddingLeft =             mapMem.padding -2       + 'px';
                        div.style.paddingTop =              mapMem.padding -2       + 'px'; // because of the border
                        div.style.fontFamily =              'Roboto';
                        div.style.fontSize =                cm.sTextFontSize        + 'px';
                        div.style.cursor =                  'default';
                        div.style.borderRadius =            '8px';
                    }

                    if(cm.content !== mapMem.divData[cm.divId].innerHTML) {
                        mapMem.divData[cm.divId].innerHTML = cm.content;
                        div.innerHTML = cm.content;
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
