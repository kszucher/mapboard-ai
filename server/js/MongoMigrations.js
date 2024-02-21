const fs = require("fs")

const sortablePath = (p) => p.map((pi) => isNaN(pi) ? pi: 1000 + pi).join('')
const sortPath = (a, b) => sortablePath(a.path) > sortablePath(b.path) ? 1 : -1
const filteredObject = (raw, allowed) => Object.fromEntries(Object.entries(raw).filter(([key, val]) => allowed.includes(key)))
const getPathPattern = (p) => p.filter(pi => isNaN(pi)).join('')
export const isG = (p) => p.at(0) === 'g'
export const isL = (p) => p.at(0) === 'l'
export const isR = (p) => getPathPattern(p).endsWith('r')
export const isS = (p) => getPathPattern(p).endsWith('s')
export const isC = (p) => getPathPattern(p).endsWith('c')

const maps = JSON.parse(fs.readFileSync("../data/maps.json", "utf8"))

maps.forEach(map => Object.assign(map.versions[0], [
      ...map.versions[0].filter(node => isG(node.path)).map(el => filteredObject(el, [
          'path',
          'nodeId',
          'density',
          'flow'
      ])),
      ...map.versions[0].filter(node => isL(node.path)).map(el => filteredObject(el, [
          'path',
          'nodeId',
          'fromNodeId',
          'fromNodeSide',
          'toNodeId',
          'toNodeSide',
          'lineColor',
          'lineWidth'
      ])),
      ...map.versions[0].filter(node => isR(node.path)).map(el => filteredObject(el, [
          'path',
          'nodeId',
          'controlType',
          'offsetW',
          'offsetH',
          'note',
          'ingestionHash',
          'extractionHash',
          'selected',
          'lastSelectedChild',
      ])),
      ...map.versions[0].filter(node => isS(node.path)).map(el => filteredObject(el, [
          'path',
          'nodeId',
          'contentType',
          'content',
          'linkType',
          'link',
          'imageW',
          'imageH',
          'dimW',
          'dimH',
          'selected',
          'selection',
          'lastSelectedChild',
          'lineWidth',
          'lineType',
          'lineColor',
          'sBorderWidth',
          'fBorderWidth',
          'sBorderColor',
          'fBorderColor',
          'sFillColor',
          'fFillColor',
          'textFontSize',
          'textColor',
          'taskStatus',
          'blur',
      ])),
      ...map.versions[0].filter(node => isC(node.path)).map(el => filteredObject(el, [
          'path',
          'nodeId',
          'dimW',
          'dimH',
          'selected',
          'lastSelectedChild',
          'lineWidth',
          'lineType',
          'lineColor',
      ])),
  ].sort(sortPath)
))

fs.writeFileSync('../data/mapsUpdated.json', JSON.stringify(maps))
