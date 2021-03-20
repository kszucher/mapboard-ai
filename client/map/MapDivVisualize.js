import {genHash, getLatexString, copy, getBgc} from "../core/Utils";
import {mapState} from "../core/MapReducer";
import {mapDivData, keepHash} from "../core/DomReducer";

const scrollTo = function(to, duration) {
    const
        element = document.getElementById('mapHolderDiv'),
        start = element.scrollLeft,
        change = to - start,
        startDate = +new Date(),
        // t = current time
        // b = start value
        // c = change in value
        // d = duration
        easeOut = function(t, b, c, d) {
            //https://www.gizma.com/easing/
            // https://easings.net/
            // https://css-tricks.com/ease-out-in-ease-in-out/
            // TODO: trying to set if for everything
            t /= d;
            t--;
            return c*(t*t*t + 1) + b;
        },
        animateScroll = function() {
            const currentDate = +new Date();
            const currentTime = currentDate - startDate;
            element.scrollLeft = parseInt(easeOut(currentTime, start, change, duration));
            if(currentTime < duration) {
                requestAnimationFrame(animateScroll);
            }
            else {
                element.scrollLeft = to;
            }
        };
    animateScroll();
};

export const mapDivVisualize = {
    start: (r) => {
        let mapDiv = document.getElementById('mapDiv');
        mapDiv.style.width = "" + mapState.mapWidth + "px";
        mapDiv.style.height = "" + mapState.mapHeight + "px";
        let currScrollLeft = (window.innerWidth + mapState.mapWidth) / 2;
        if (mapState.isLoading) {
            mapState.isLoading = false;
            let mapHolderDiv = document.getElementById('mapHolderDiv');
            mapHolderDiv.scrollLeft = currScrollLeft;
            let mapDiv = document.getElementById('mapDiv');
            mapDiv.style.transition = 'none';
        }
        if (mapState.shouldCenter) {
            mapState.shouldCenter = false;
            scrollTo(currScrollLeft, 500);
        }
        mapDivVisualize.iterate(r);
    },

    iterate: (cm) => {
        if (cm.type === 'struct' && !cm.hasCell) {
            let styleData = {
                left:                   cm.nodeStartX + 'px',
                top:                    cm.nodeY - cm.selfH / 2 + 'px',
                minWidth:               (mapState.density === 'large'?  0 : -3) + cm.selfW - mapState.padding - 2  + 'px',
                minHeight:              (mapState.density === 'large'? -2 : -1) + cm.selfH - mapState.padding      + 'px',
                paddingLeft:            (mapState.density === 'large'?  0 :  3) +            mapState.padding - 2  + 'px',
                paddingTop:             (mapState.density === 'large'?  0 :  0) +            mapState.padding - 2  + 'px',
                position:               'absolute',
                border:                 cm.selected ? '1px solid black' : '1px solid' + getBgc(),
                borderRadius:           '8px',
                borderColor:            cm.selected? (cm.isEditing? cm.ellipseBorderColor : '#000000' ) : cm.ellipseBorderColor,
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

            if (!mapDivData.hasOwnProperty(cm.divId) ||
                (mapDivData.hasOwnProperty(cm.divId) && mapDivData[cm.divId].keepHash === keepHash)) {
                cm.divId = 'div' + genHash(8);
                mapDivData[cm.divId] = {
                    keepHash: '',
                    styleData: {},
                    contentType: '',
                    content: '',
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
                    if (styleData[styleName] !== mapDivData[cm.divId].styleData[styleName]) {
                        div.style[styleName] = styleData[styleName];
                    }
                }

                if (!cm.isEditing) {
                    if ((cm.contentType !== mapDivData[cm.divId].contentType) ||
                        (cm.content !== mapDivData[cm.divId].content)) {
                        div.innerHTML = renderContent(cm.contentType, cm.content);
                    }
                }
            }

            mapDivData[cm.divId].keepHash = keepHash;
            mapDivData[cm.divId].styleData = copy(styleData);
            mapDivData[cm.divId].contentType = copy(cm.contentType);
            mapDivData[cm.divId].content = copy(cm.content);
            mapDivData[cm.divId].path = cm.path;
        }

        cm.d.map(i => mapDivVisualize.iterate(i));
        cm.s.map(i => mapDivVisualize.iterate(i));
        cm.c.map(i => i.map(j => mapDivVisualize.iterate(j)));
    }
};

function renderContent (contentType, content) {
    switch (contentType) {
        case 'text':
            return content;
        case 'equation':
            return katex.renderToString(getLatexString(content), {throwOnError: false});
        case 'image':
            let imageLink = 'https://mindboard.io/file/';
            return '<img src="' + imageLink + content + '" alt="" id="img">';
    }
}
