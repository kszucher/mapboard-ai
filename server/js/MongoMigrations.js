const fs = require("fs")

const sortablePath = (p) => p.map((pi) => isNaN(pi) ? pi: 1000 + pi).join('')
const sortPath = (a, b) => sortablePath(a.path) > sortablePath(b.path) ? 1 : -1
const filteredObject = (raw, allowed) => Object.fromEntries(Object.entries(raw).filter(([key, val]) => allowed.includes(key)))

const maps = JSON.parse(fs.readFileSync("../data/maps.json", "utf8"))

maps.forEach(map => {
  if (map.versions[0].some(el => el.path.filter(pi => pi === 'c').length > 1)) {
    console.log('found')
  }
})

maps.forEach(map => Object.assign(
  map.versions[0],
  [
    ...map.versions[0]
      .filter(node => node.path.at(0) === 'g')
      .map(el => filteredObject(el, [
        'path',
        'nodeId',
        'density',
        'flow'
      ])),
    ...map.versions[0]
      .filter(node => node.path.at(0) === 'l')
      .map(el => filteredObject(el, [
        'path',
        'nodeId',
        'fromNodeId',
        'fromNodeSide',
        'toNodeId',
        'toNodeSide',
        'lineColor',
        'lineWidth'
      ])),
    ...map.versions[0]
      .filter(node => node.path.at(0) === 'r')
      .filter(node => node.path.filter(pi => pi === 'c').length <= 1)
      .map(el => filteredObject(el, [
        'path',
        'nodeId',
        'controlType',
        'offsetW',
        'offsetH',
        'ingestionHash',
        'extractionHash',
        'note',
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

  ].sort(sortPath)
))

fs.writeFileSync('../data/mapsUpdated.json', JSON.stringify(maps))
