import {mapMem}                                             from "./Map";
import {genHash, getLatexString, setEndOfContenteditable, copy, getBgc} from "./Utils";
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
                let nextStyle = {
                    left:                                   cm.nodeStartX                                                                           + 'px',
                    top:                                    cm.nodeStartY - cm.selfH/2 + (mapMem.defaultH - cm.sTextFontSize)/2 - mapMem.padding    + 'px',
                    width:                                  cm.selfW                                                            - mapMem.padding    + 'px',
                    height:                                 cm.selfH                                                            - mapMem.padding    + 'px',
                    color:                                  cm.sTextColor,
                    backgroundColor:                        cm.ellipseFill? cm.ellipseFillColor : getBgc(),
                    // borderColor: '#ff0000'

            };

                // console.log(cm.selfH)

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

                    for (let i = 0; i < Object.keys(nextStyle).length; i++) {
                        let styleName = Object.keys(nextStyle)[i];
                        if (nextStyle[styleName] !==        mapMem.divData[cm.divId].style[styleName]) {
                            div.style[styleName] =          nextStyle[styleName];
                        }
                    }
                }
                else {
                    div =                                   document.getElementById(cm.divId);

                    for (let i = 0; i < Object.keys(nextStyle).length; i++) {
                        let styleName = Object.keys(nextStyle)[i];
                        if (styleName !== 'left' && styleName !== 'top') {
                            if (nextStyle[styleName] !==    mapMem.divData[cm.divId].style[styleName]) {
                                div.style[styleName] =      nextStyle[styleName];
                            }
                        }
                    }

                    let leftDelta = (parseInt(div.style.left, 10) - parseInt(nextStyle.left));
                    let topDelta = (parseInt(div.style.top, 10) - parseInt(nextStyle.top));

                    if (leftDelta !== 0 || topDelta !== 0 ) {
                        div.style.transform =               "translate(" + leftDelta + ',' + topDelta + ")";
                        div.style.transition =              '0.5s ease-out';

                        div.style.left =                    nextStyle.left;
                        div.style.top =                     nextStyle.top;

                    }
                }

                mapMem.divData[cm.divId].style = copy(nextStyle);

                // content
                // if (cm.content.split('.').pop() === 'jpg' || cm.content.split('.').pop() === 'noun') {
                //     if (cm.isPicAssigned === 0) {
                //         cm.isPicAssigned = 1;
                //
                //         // if pic, call SCRIPT
                //
                //         let filename =                              '../../db/pic/user_a591e739/' + lastUserMap + '/' + cm.content;
                //         div.insertAdjacentHTML('beforeend',         '<img src="' + filename +  '">');
                //
                //     }
                // }
                // else

                if (cm.content.substring(0, 2) === '\\[') {
                    if (cm.isEquationAssigned === 0) {
                        cm.isEquationAssigned = 1;

                        div.style.paddingLeft =             mapMem.padding + 'px';
                        div.style.paddingTop =              mapMem.padding + 'px';
                        div.style.fontSize =                cm.sTextFontSize +  'px';
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
                        div.style.paddingLeft =             mapMem.padding          + 'px';
                        div.style.paddingTop =              mapMem.padding          + 'px';
                        div.style.fontFamily =              'Roboto';
                        div.style.fontSize =                cm.sTextFontSize        + 'px';
                        div.style.cursor =                  'default';
                        div.style.borderRadius =            '8px'

                        // TODO multiline
                        // https://stackoverflow.com/questions/11449161/multiline-string-in-div-using-javascript
                    }

                    if(cm.content !== mapMem.divData[cm.divId].innerHTML) {
                        mapMem.divData[cm.divId].innerHTML = cm.content;
                        div.innerHTML = cm.content;
                    }

                    if (cm.editTrigger === 1) {
                        cm.editTrigger = 0;

                        div.contentEditable = 'true';
                        setEndOfContenteditable(div);
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
