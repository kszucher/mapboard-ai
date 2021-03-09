import {mapMem} from "./Map";

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

export const mapPlace = {
    start: (r) => {
        let {alignment, taskConfig, taskLeft, taskRight, margin, sLineDeltaXDefault} = mapMem;

        let leftMarginWidth = margin;
        let leftTaskWidth =     r.d[1].s.length > 0 && taskLeft ? taskConfig.width: 0;
        let leftMapWidth =      r.d[1].s.length > 0 ? r.d[1].selfW + sLineDeltaXDefault + r.d[1].familyW : 0;
        let rightMapWidth =     r.d[0].s.length > 0 ? r.d[0].selfW + sLineDeltaXDefault + r.d[0].familyW : 0;
        let rightTaskWidth =    r.d[0].s.length > 0 && taskRight ? taskConfig.width : 0;
        let rightMarginWidth = margin;
        
        let leftWidth = leftMarginWidth + leftTaskWidth + leftMapWidth;
        let rightWidth = rightMapWidth + rightTaskWidth + rightMarginWidth;

        let minWidth = Math.max(...[leftWidth, rightWidth]);

        let flow = r.d[1].s.length > 0 ? 'center' : 'right';

        let sumWidth = 0;
        if (alignment === 'adaptive') {
            sumWidth = leftWidth + r.selfW + rightWidth;
        } else if (alignment === 'symmetrical') {
            if (flow === 'right') {
                sumWidth = leftMarginWidth + r.selfW + rightWidth;
            } else if (flow === 'center') {
                sumWidth = minWidth + r.selfW + minWidth;
            }
        }

        let divMinWidth = 1366;
        let mapWidth = sumWidth > divMinWidth ? sumWidth : divMinWidth;

        let mapStartCenterX = 0;
        if (flow === 'right') {
            mapStartCenterX = leftMarginWidth + r.selfW / 2;
        } else if (flow === 'center') {
            if (alignment === 'adaptive') {
                let leftSpace = sumWidth < divMinWidth ? (divMinWidth - sumWidth) / 2 : 0;
                mapStartCenterX = leftMarginWidth + leftTaskWidth + leftSpace + leftMapWidth + r.selfW / 2;
            } else if (alignment === 'symmetrical') {
                mapStartCenterX = mapWidth / 2;
            }
        }

        let rightMapHeight =    r.d.length > 0? r.d[0].familyH > r.d[0].selfH ? r.d[0].familyH : r.d[0].selfH : 0;
        let leftMapHeight =     r.d.length > 1? r.d[1].familyH > r.d[1].selfH ? r.d[1].familyH : r.d[1].selfH : 0;
        let minHeight = Math.max(...[rightMapHeight, leftMapHeight]);
        let mapHeight = minHeight + 60;

        let mapDiv = document.getElementById('mapDiv');
        mapDiv.style.width = "" + mapWidth + "px";
        mapDiv.style.height = "" + mapHeight + "px";

        let mapSvgOuter = document.getElementById('mapSvgOuter');
        mapSvgOuter.style.width = 'calc(200vw + ' + mapWidth + 'px)';
        mapSvgOuter.style.height = 'calc(200vh + ' + mapHeight + 'px)';

        let currScrollLeft = (window.innerWidth + mapWidth) / 2;

        if (mapMem.isLoading) {
            mapMem.isLoading = false;
            let mapHolderDiv = document.getElementById('mapHolderDiv');
            mapHolderDiv.scrollLeft = currScrollLeft;
            let mapDiv = document.getElementById('mapDiv');
            mapDiv.style.transition = 'none';
        } else {
            if (!mapMem.isMouseDown) {
                scrollTo(currScrollLeft, 500);
            }
        }

        mapMem.mapWidth = mapWidth;
        mapMem.mapHeight = mapHeight;

        r.parentNodeStartX = mapStartCenterX - r.selfW/2 + 2;
        r.parentNodeStartY = 0;
        r.parentNodeEndX = mapStartCenterX + r.selfW/2;
        r.parentNodeEndY = 0;
        r.lineDeltaX = 0;
        r.lineDeltaY = minHeight / 2 + 30 - 0.5;
        mapPlace.iterate(r);
    },

    iterate: (cm) => {
        if (cm.isRoot) {
            cm.nodeStartX = cm.parentNodeStartX;
            cm.nodeEndX = cm.parentNodeEndX;
        } else {
            if (cm.type === 'cell' && cm.parentParentType === 'cell' || cm.parentType === 'cell') {
                if (cm.path[2] === 0) {
                    cm.nodeStartX = cm.parentNodeStartX + 2;
                    cm.nodeEndX = cm.nodeStartX + cm.selfW;
                } else {
                    cm.nodeEndX = cm.parentNodeEndX;
                    cm.nodeStartX = cm.nodeEndX - cm.selfW;
                }
            }

            if (cm.parentType === 'struct' || cm.parentType === 'dir') {
                if (cm.type === 'struct' || cm.type === 'dir') {
                    if (cm.path[2] === 0) {
                        cm.nodeStartX = cm.parentNodeEndX + cm.lineDeltaX;
                        cm.nodeEndX = cm.nodeStartX + cm.selfW;
                    } else {
                        cm.nodeEndX = cm.parentNodeStartX - cm.lineDeltaX;
                        cm.nodeStartX = cm.nodeEndX - cm.selfW;
                    }
                } else if (cm.type === 'cell') {
                    if (cm.parentParentType === 'struct' || cm.parentParentType === 'dir') {
                        let diff = mapMem.sLineDeltaXDefault - 20;
                        if (cm.path[2] === 0) {
                            cm.nodeStartX = cm.parentNodeEndX + cm.lineDeltaX + diff;
                            cm.nodeEndX = cm.nodeStartX + cm.selfW;
                        } else {
                            cm.nodeEndX = cm.parentNodeStartX - cm.lineDeltaX - diff;
                            cm.nodeStartX = cm.nodeEndX - cm.selfW;
                        }
                    }
                }
            }
        }

        cm.nodeStartY = cm.parentNodeEndY + cm.lineDeltaY;
        cm.nodeEndY = cm.nodeStartY;

        if (Number.isInteger(cm.nodeStartY)) {
            cm.nodeStartY += 0.5;
            cm.nodeEndY += 0.5;
        }

        if (Number.isInteger(cm.nodeStartX)) {
            if (cm.path[2] === 0) {
                cm.nodeStartX += 0.5;
                cm.nodeEndX += 0.5;
            } else {
                cm.nodeStartX -= 0.5;
                cm.nodeEndX -= 0.5;
            }
        }

        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            cm.d[i].parentNodeStartX = cm.nodeStartX;
            cm.d[i].parentNodeStartY = cm.nodeStartY;
            cm.d[i].parentNodeEndX = cm.nodeEndX;
            cm.d[i].parentNodeEndY = cm.nodeEndY;
            cm.d[i].lineDeltaX = 0;
            cm.d[i].lineDeltaY = 0;

            cm.d[i].isTop = 1;
            cm.d[i].isBottom = 1;

            mapPlace.iterate(cm.d[i]);
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                cm.c[i][j].parentNodeStartX = cm.parentNodeStartX;
                cm.c[i][j].parentNodeStartY = cm.parentNodeStartY;
                cm.c[i][j].parentNodeEndX = cm.parentNodeEndX;
                cm.c[i][j].parentNodeEndY = cm.parentNodeEndY;
                cm.c[i][j].lineDeltaX = cm.sumMaxColWidth[j] + 20;
                cm.c[i][j].lineDeltaY = cm.nodeStartY + cm.sumMaxRowHeight[i] + cm.maxRowHeight[i]/2 - cm.selfH/2 - cm.parentNodeEndY;
                mapPlace.iterate(cm.c[i][j]);
            }
        }

        let elapsedY = 0;
        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            cm.s[i].parentNodeStartX = cm.nodeStartX;
            cm.s[i].parentNodeStartY = cm.nodeStartY;
            cm.s[i].parentNodeEndX = cm.nodeEndX;
            cm.s[i].parentNodeEndY = cm.nodeEndY;
            cm.s[i].lineDeltaX = mapMem.sLineDeltaXDefault;
            cm.s[i].lineDeltaY = cm.familyH*(-1/2) + elapsedY + cm.s[i].maxH/2;

            if (i === 0 && cm.isTop) cm.s[i].isTop = 1;
            if (i === sCount - 1 && cm.isBottom === 1) cm.s[i].isBottom = 1;

            mapPlace.iterate(cm.s[i]);
            elapsedY += cm.s[i].maxH + cm.spacingActivated*cm.spacing;
        }
    }
};
