const getCoordsInLine = (a, b, dt) => {
    const [x0, y0] = a
    const [x1, y1] = b
    const d = Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2))
    const t = dt / d
    const xt = (1 - t) * x0 + t * x1
    const yt = (1 - t) * y0 + t * y1
    return [xt, yt]
}

export const getBezierPath = (c, [x1, y1, c1x, c1y, c2x, c2y, x2, y2]) => {
    return `${c}${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`
}

const getEdgePath = (c, [x1, y1, m1x, m1y, m2x, m2y, x2, y2]) => {
    return `${c}${x1},${y1}, L${m1x},${m1y}, L${m2x},${m2y}, L${x2},${y2}`
}

export const getLinePath = (lineType, sx, sy, dx, dy, ex, ey, dir) => {
    let path
    if (lineType === 'b') {
        const c1x = sx + dir * dx / 4
        const c1y = sy
        const c2x = sx + dir * dx / 4
        const c2y = sy + dy
        path = getBezierPath('M', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
    } else if (lineType === 'e') {
        const m1x = sx + dir * dx / 2
        const m1y = sy
        const m2x = sx + dir * dx / 2
        const m2y = sy + dy
        path = getEdgePath('M', [sx, sy, m1x, m1y, m2x, m2y, ex, ey])
    }
    return path
}

export const getPolygonPath = (params, selection, dir, margin) => {
    let { ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd } = params
    ax -= margin
    bx -= dir * margin
    cx += margin
    ayu -= margin
    ayd += margin
    byu -= margin
    byd += margin
    cyu -= margin
    cyd += margin
    const points = [[ax, ayu], [bx, byu], [cx, cyu], [cx, cyd], [bx, byd], [ax, ayd]]
    const radius = 12
    let path = ''
    for (let i = 0; i < points.length; i++) {
        const prevPoint = i === 0 ? points[points.length - 1] : points[i - 1]
        const currPoint = points[i]
        const nextPoint = i === points.length - 1 ? points[0] : points[i + 1]
        const [sx, sy] = getCoordsInLine(currPoint, prevPoint, radius)
        const [c1x, c1y] = currPoint
        const [c2x, c2y] = currPoint
        const [ex, ey] = getCoordsInLine(currPoint, nextPoint, radius)
        if (selection === 's' && i === (dir === 1 ? 1 : 4)) {
            path += getBezierPath('L', [sx, sy, sx, sy, sx, sy, ex - dir * 24, ey])
        } else if (selection === 's' && i === (dir === 1 ? 4 : 1)) {
            path += getBezierPath('L', [sx - dir * 24, sy, ex, ey, ex, ey, ex, ey])
        } else {
            path += getBezierPath(i === 0 ? 'M' : 'L', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
        }
    }
    return path + 'z'
}

export const getArcPath = (sx, sy, w, h, r, dir, margin, closed) => {
    const x1 = sx - margin * dir
    const y1 = sy + r - margin
    const horz = w - 2 * r + 2 * margin
    const vert = h - 2 * r + 2 * margin
    if (dir === 1) {
        return `M${x1},${y1} 
        a${+r},${+r} 0 0 1 ${+r},${-r} h${+horz}
        a${+r},${+r} 0 0 1 ${+r},${+r} v${+vert}
        a${+r},${+r} 0 0 1 ${-r},${+r} h${-horz}
        a${+r},${+r} 0 0 1 ${-r},${-r}
        ${closed? 'Z' : ''}`
    } else {
        return `M${x1},${y1} 
        a${+r},${+r} 0 0 0 ${-r},${-r} h${-horz} 
        a${+r},${+r} 0 0 0 ${-r},${+r} v${+vert} 
        a${+r},${+r} 0 0 0 ${+r},${+r} h${+horz} 
        a${+r},${+r} 0 0 0 ${+r},${-r}
        ${closed ? 'Z' : ''}`
    }
}
