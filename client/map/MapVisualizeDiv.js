import { updateMapDivData } from '../core/DomFlow'

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
}

export const mapVisualizeDiv = {
    start: (m, cr) => {
        let mapDiv = document.getElementById('mapDiv');
        mapDiv.style.width = "" + m.mapWidth + "px";
        mapDiv.style.height = "" + m.mapHeight + "px";
        let mapHolderDiv = document.getElementById('mapHolderDiv');
        let currScrollLeft = (window.innerWidth + m.mapWidth) / 2;
        if (m.isLoading) {
            m.isLoading = false;
            mapHolderDiv.scrollLeft = currScrollLeft;
            mapHolderDiv.scrollTop = window.innerHeight - 48 * 2;
        }
        if (m.isResizing) {
            m.isResizing = false;
            mapHolderDiv.scrollLeft = currScrollLeft;
        }
        if (m.shouldCenter) {
            m.shouldCenter = false;
            scrollTo(currScrollLeft, 500);
        }
        mapVisualizeDiv.iterate(m, cr);
    },

    iterate: (m, cm) => {
        if (cm.type === 'struct' && !cm.hasCell) {
            const { nodeId, contentType, content, path, isEditing } = cm
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
            }
            let params = { styleData, contentType, content, path, isEditing }
            updateMapDivData(nodeId, params)
        }
        cm.d.map(i => mapVisualizeDiv.iterate(m, i));
        cm.s.map(i => mapVisualizeDiv.iterate(m, i));
        cm.c.map(i => i.map(j => mapVisualizeDiv.iterate(m, j)));
    }
}
