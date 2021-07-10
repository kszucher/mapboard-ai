import {genHash, getLatexString} from "../core/Utils";
import {mapState, redraw} from "../core/MapFlow";
import {mapDivData, keepHash} from "../core/DomFlow";

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

export const mapVisualizeDiv = {
    start: (m, r) => {
        let mapDiv = document.getElementById('mapDiv');
        mapDiv.style.width = "" + m.mapWidth + "px";
        mapDiv.style.height = "" + m.mapHeight + "px";
        let mapHolderDiv = document.getElementById('mapHolderDiv');
        let currScrollLeft = (window.innerWidth + m.mapWidth) / 2;
        if (mapState.isLoading) {
            mapState.isLoading = false;
            mapHolderDiv.scrollLeft = currScrollLeft;
            mapHolderDiv.scrollTop = window.innerHeight - 48 * 2;
        }
        if (mapState.isResizing) {
            mapState.isResizing = false;
            mapHolderDiv.scrollLeft = currScrollLeft;
        }
        if (m.shouldCenter) {
            m.shouldCenter = false;
            scrollTo(currScrollLeft, 500);
        }
        mapVisualizeDiv.iterate(m, r);
    },

    iterate: (m, cm) => {
        if (cm.type === 'struct' && !cm.hasCell) {
            let styleData = {
                left:                   1 + cm.nodeStartX + 'px',
                top:                    1 + cm.nodeY - cm.selfH / 2 + 'px',
                minWidth:               (m.density === 'large'?  0 : -3) + cm.selfW - m.padding - 2  + 'px',
                minHeight:              (m.density === 'large'? -2 : -1) + cm.selfH - m.padding      + 'px',
                paddingLeft:            (m.density === 'large'?  0 :  3) +            m.padding - 2  + 'px',
                paddingTop:             (m.density === 'large'?  0 :  0) +            m.padding - 2  + 'px',
                position:               'absolute',
                fontSize:               cm.sTextFontSize + 'px',
                fontFamily:             'Roboto',
                textDecoration:         cm.linkType !== "" ? "underline" : "",
                cursor:                 'default',
                color:                  cm.sTextColor,
                transition: 'all 0.5s',
                transitionTimingFunction:             'cubic-bezier(0.0,0.0,0.58,1.0)',
                // transitionProperty:     'left, top, background-color',
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
            let {contentType, content, path} = cm;
            Object.assign(mapDivData[cm.divId], {keepHash, styleData, contentType, content, path})
        }
        cm.d.map(i => mapVisualizeDiv.iterate(m, i));
        cm.s.map(i => mapVisualizeDiv.iterate(m, i));
        cm.c.map(i => i.map(j => mapVisualizeDiv.iterate(m, j)));
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
