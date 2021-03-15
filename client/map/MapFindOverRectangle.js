let startX, startY, width, height = 0;

export const mapFindOverRectangle = {
    start: (r, x, y, w, h) => {
        startX = x;
        startY = y;
        width = w;
        height = h;
        mapFindOverRectangle.iterate(r);
    },

    iterate: (cm) => {
        if (cm.type === 'struct' && !cm.hasCell) {
            cm.selected = rectanglesIntersect(
                startX, startY, startX + width, startY + height,
                cm.nodeStartX, cm.nodeY, cm.nodeEndX, cm.nodeY
            )
        }

        cm.d.map(i => mapFindOverRectangle.iterate(i));
        cm.s.map(i => mapFindOverRectangle.iterate(i));
        cm.c.map(i => i.map(j => mapFindOverRectangle.iterate(j)));
    }
}

const rectanglesIntersect = (
    minAx, minAy, maxAx, maxAy,
    minBx, minBy, maxBx, maxBy) => {
    return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy
}
