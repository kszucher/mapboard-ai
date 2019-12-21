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
                    position:                               'absolute',
                    left:                                   cm.nodeStartX +                                                                         'px',
                    top:                                    cm.nodeStartY - cm.selfH/2 + (mapMem.defaultH - cm.sTextFontSize)/2 - mapMem.padding +  'px',
                    width:                                  cm.selfW                                                            - mapMem.padding +  'px',
                    height:                                 cm.selfH                                                            - mapMem.padding +  'px',
                    color:                                  cm.sTextColor,
                    backgroundColor:    cm.ellipseFill?     cm.ellipseFillColor     : getBgc(),
                    border:             cm.selected?        '1px solid black'       : '1px solid' + getBgc(),
                    borderRadius:                           8 +                                                                                     'px',
                    fontSize:                               cm.sTextFontSize +                                                                      'px',
                    fontFamily:                             'Roboto',
                    textDecoration:     cm.ilink !== ""?    "underline"              : "",
                    cursor:                                 'default',
                };

                if (cm.contentType === 'text' ||
                    cm.contentType === 'ilink' ||
                    cm.contentType === 'elink') {
                    divStyle.paddingLeft =                  mapMem.paddingTextLeft +        'px';
                    divStyle.paddingTop =                   mapMem.paddingTextTop +         'px';
                }
                else if (cm.contentType === 'image') {
                    divStyle.paddingLeft =                  0 +                             'px';
                    divStyle.paddingTop =                   0 +                             'px';
                }
                else if (cm.contentType === 'equation') {
                    divStyle.paddingLeft =                  4 +                             'px';
                    divStyle.paddingTop =                   mapMem.padding +                'px';
                }

                let div;
                if (cm.isDivAssigned === 0) {
                    cm.isDivAssigned =                      1;

                    cm.divId = 'div' + genHash(8);
                    mapMem.divData[cm.divId] = {
                        innerHTML:                          '',
                        style:                              {}
                    };

                    div =                                   document.createElement('div');
                    div.id =                                cm.divId;
                    div.contentEditable =                   false;
                    div.spellcheck =                        false;

                    div.appendChild(document.createTextNode(''));
                    document.getElementById('mapDiv').appendChild(div);

                    for (let i = 0; i < Object.keys(divStyle).length; i++) {
                        let styleName = Object.keys(divStyle)[i];
                        if (divStyle[styleName] !== mapMem.divData[cm.divId].style[styleName]) {
                            div.style[styleName] =          divStyle[styleName];
                        }
                    }
                }
                else {
                    div = document.getElementById(cm.divId);

                    for (let i = 0; i < Object.keys(divStyle).length; i++) {
                        let styleName = Object.keys(divStyle)[i];
                        if (styleName !== 'left' && styleName !== 'top') {
                            if (divStyle[styleName] !== mapMem.divData[cm.divId].style[styleName]) {
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

                mapMem.divData[cm.divId].style =            copy(divStyle);

                let divInnerHtml = '';
                if (cm.contentType === 'text' ||
                    cm.contentType === 'ilink' ||
                    cm.contentType === 'elink') {
                    divInnerHtml =                          cm.content;
                }
                else if (cm.contentType === 'image') {
                    divInnerHtml =                          '<img src="' + 'http://localhost:8082/file/' + cm.content + '">';
                }
                else if (cm.contentType === 'equation') {
                    divInnerHtml =                          katex.renderToString(getLatexString(cm.content), {throwOnError: false});
                }

                if (divInnerHtml !== mapMem.divData[cm.divId].innerHTML) {
                    div.innerHTML =                         divInnerHtml;
                }

                mapMem.divData[cm.divId].innerHTML =        copy(divInnerHtml);
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
