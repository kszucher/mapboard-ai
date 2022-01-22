function getCoordsInLine (a, b, dt) {
    let [x0, y0] = a
    let [x1, y1] = b
    let xt, yt
    let d = Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2))
    let t = dt / d
    xt = (1 - t) * x0 + t * x1
    yt = (1 - t) * y0 + t * y1
    return [xt, yt]
}

export function getBezierPath (c, [x1, y1, c1x, c1y, c2x, c2y, x2, y2]) {
    return `${c}${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`
}

function getEdgePath (c, [x1, y1, m1x, m1y, m2x, m2y, x2, y2]) {
    return `${c}${x1},${y1}, L${m1x},${m1y}, L${m2x},${m2y}, L${x2},${y2}`
}

export function getLinePath (lineType, sx, sy, dx, dy, ex, ey, dir) {
    let path
    if (lineType === 'b') {
        let c1x = sx + dir * dx / 4
        let c1y = sy
        let c2x = sx + dir * dx / 4
        let c2y = sy + dy
        path = getBezierPath('M', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
    } else if (lineType === 'e') {
        let m1x = sx + dir * dx / 2
        let m1y = sy
        let m2x = sx + dir * dx / 2
        let m2y = sy + dy
        path = getEdgePath('M', [sx, sy, m1x, m1y, m2x, m2y, ex, ey])
    }
    return path
}

export function getPolygonPath (params, selection, dir, margin) {
    let { ax, bx, cx, ayu, ayd, bcyu, bcyd } = params
    ax -= dir * margin
    bx -= dir * margin
    cx += dir * margin
    ayu -= margin
    ayd += margin
    bcyu -= margin
    bcyd += margin
    let points = [[ax, ayu], [bx, bcyu], [cx, bcyu], [cx, bcyd], [bx, bcyd], [ax, ayd]]
    let path = ''
    let radius = 12
    for (let i = 0; i < points.length; i++) {
        let prevPoint = i === 0 ? points[points.length - 1] : points[i - 1]
        let currPoint = points[i]
        let nextPoint = i === points.length - 1 ? points[0] : points[i + 1]
        let [sx, sy] = getCoordsInLine(currPoint, prevPoint, radius)
        let [c1x, c1y] = currPoint
        let [c2x, c2y] = currPoint
        let [ex, ey] = getCoordsInLine(currPoint, nextPoint, radius)
        if (selection === 's' && i === 1) {
            path += getBezierPath('L', [sx, sy, sx, sy, sx, sy, ex - dir * 24, ey])
        } else if (selection === 's' && i === 4) {
            path += getBezierPath('L', [sx - dir * 24, sy, ex, ey, ex, ey, ex, ey])
        } else {
            path += getBezierPath(i === 0 ? 'M' : 'L', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
        }
    }
    return path + 'z'
}

export function getArcPath(sx, sy, w, h, r, dir, margin) {
    let x1 = sx - margin*dir;
    let y1 = sy + r - margin;
    let horz = w - 2*r + 2*margin;
    let vert = h - 2*r + 2*margin;
    if (dir === 1) {
        return `M${x1},${y1} 
        a${+r},${+r} 0 0 1 ${+r},${-r} h${+horz}
        a${+r},${+r} 0 0 1 ${+r},${+r} v${+vert}
        a${+r},${+r} 0 0 1 ${-r},${+r} h${-horz}
        a${+r},${+r} 0 0 1 ${-r},${-r}`
    } else {
        return `M${x1},${y1} 
        a${+r},${+r} 0 0 0 ${-r},${-r} h${-horz} 
        a${+r},${+r} 0 0 0 ${-r},${+r} v${+vert} 
        a${+r},${+r} 0 0 0 ${+r},${+r} h${+horz} 
        a${+r},${+r} 0 0 0 ${+r},${-r}`
    }
}
