const fs = require("fs")

const isEqual = (obj1, obj2) =>  JSON.stringify(obj1) === JSON.stringify(obj2)
const sortablePath = (p) => p.map((pi) => isNaN(pi) ? pi: 1000 + pi).join('')
const sortPath = (a, b) => sortablePath(a.path) > sortablePath(b.path) ? 1 : -1
const filteredObject = (raw, allowed) => Object.fromEntries(Object.entries(raw).filter(([key, val]) => allowed.includes(key)))
const genHash = () => {
    const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyz'
    const randomAlphanumeric = () => ( alphanumeric[ Math.round( Math.random() * ( alphanumeric.length -  1 )) ] )
    const randomAlphanumeric8digit = new Array(8).fill('').map(el => randomAlphanumeric())
    return randomAlphanumeric8digit.join('')
}

const maps = JSON.parse(fs.readFileSync("../data/maps.json", "utf8"))

// console.log(maps[0])

maps.forEach(map => Object.assign(
  map.versions[0],
  [
    ...map.versions[0]
      .filter(node => node.path.length === 1),
    ...map.versions[0]
      .filter(node => node.path.length === 2 && node.path.at(0) === 'l'),
    ...map.versions[0]
      .filter(node => node.path.length === 2 && node.path.at(0) === 'r')
      .map(el => filteredObject(el, [
        'path',
        'nodeId',
        'controlType',
        'offsetW',
        'offsetH',
        'llmDataType',
        'llmDataId',
        'note',
      ])),
    ...map.versions[0]
      .filter(node => node.path.length === 2 && node.path.at(0) === 'r')
      .map(node => ({...node, path: [...node.path.slice(0, 2), 's', 0], nodeId: 'node' + genHash(8)}))
      .map(el => filteredObject(el, [
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
    ...map.versions[0]
      .filter(node => node.path.length > 2)
      .map(node => ({...node, path: [...node.path.slice(0, 2), 's', 0, ...node.path.slice(2)]}))
  ].sort(sortPath)
))

console.log(maps[0].versions[0])

fs.writeFileSync('../data/mapsUpdated.json', JSON.stringify(maps))
