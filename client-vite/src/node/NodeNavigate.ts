import {getMapData} from '../core/MapFlow'
import {Dir} from "../core/Enums"
import {M} from "../types/DefaultProps"

export const structNavigate = (m: M, truePath: any[], direction: Dir) => {
  let newPath = []
  let inDepth = - 1
  //       v
  //     l v r
  //     l v
  //   l l v r r
  //   l l v r
  //   l l v
  // l l l v r r r
  // l l l v r r
  // l l l v r
  // l l l v
  sequenceGenerator: while (true) {
    inDepth++
    if (inDepth > 10) {
      console.log('recursion error')
      break
    }
    for (let outDepth = inDepth; outDepth > - 1; outDepth--) {
      let sequence = []
      switch (direction) {
        case Dir.I: sequence = ['i']; break
        case Dir.IR: sequence = ['i']; break
        case Dir.IL: sequence = ['i']; break
        case Dir.O: sequence = ['om']; break
        case Dir.OR: sequence = ['om']; break
        case Dir.OL: sequence = ['om']; break
        case Dir.U: sequence = Array(inDepth).fill('i').concat('u').concat(Array(outDepth).fill('od')); break
        case Dir.D: sequence = Array(inDepth).fill('i').concat('d').concat(Array(outDepth).fill('ou')); break
        default: console.log('sequence error')
      }
      let sequenceOk = Array(sequence.length).fill(false)
      newPath = [...truePath]
      for (let i = 0; i < sequence.length; i++) {
        let currDirection = sequence[i]
        let currRef = getMapData(m, newPath)
        let currChildCount = currRef.s.length
        let pn = getMapData(m, currRef.parentPath)
        if (currRef.isRoot === 1 && ['i','u','d'].includes(currDirection) ||
          pn.type === 'cell' && ['i'].includes(currDirection) ||
          currDirection === 'om' && currChildCount === 0) {
          newPath = [...truePath]
          break sequenceGenerator
        }
        if (currDirection === 'u' && currRef.index === 0 ||
          currDirection === 'd' && pn.s.length === currRef.index + 1 ||
          currDirection === 'ou' && currChildCount === 0 ||
          currDirection === 'od' && currChildCount === 0) {
          break
        }
        if (currDirection === 'i') {
          if (newPath.length === 6) {
            newPath = newPath.slice(0, -4)
          } else {
            newPath = newPath.slice(0, -2)
          }
          pn.lastSelectedChild = currRef.index
        }
        else if (currDirection === 'u') newPath[newPath.length - 1] -= 1
        else if (currDirection === 'd') newPath[newPath.length - 1] += 1
        else if (currDirection === 'ou') newPath.push('s', 0)
        else if (currDirection === 'od') newPath.push('s', currChildCount - 1)
        else if (currDirection === 'om') {
          if (!(currRef.lastSelectedChild >= 0 && currRef.lastSelectedChild < currChildCount)) {
            currRef.lastSelectedChild = currChildCount % 2
              ? Math.floor(currChildCount / 2)
              : currChildCount / 2 - 1
          }
          newPath.push('s', currRef.lastSelectedChild)
        }
        sequenceOk[i] = true
      }
      if (sequenceOk[sequenceOk.length - 1] === true) {
        break sequenceGenerator
      }
    }
  }

  return newPath
}

export const cellNavigate = (m: M, truePath: any[], direction: Dir) => {
  const newPath = truePath
  const currRef = getMapData(m, truePath)
  const pn = getMapData(m, currRef.parentPath)
  const rowLen = pn.c.length
  const colLen = pn.c[0].length
  const currRow = currRef.index[0]
  const currCol = currRef.index[1]
  let nextRow = 0
  let nextCol = 0
  switch (direction) {
    case Dir.D:
      nextRow = currRow + 1 < rowLen ? currRow + 1 : currRow
      nextCol = currCol
      break
    case Dir.U:
      nextRow = currRow - 1 < 0 ? 0 : currRow - 1
      nextCol = currCol
      break
    case Dir.O:
      nextCol = currCol + 1 < colLen ? currCol + 1 : currCol
      nextRow = currRow
      break
    case Dir.I:
      nextCol = currCol - 1 < 0 ? 0 : currCol - 1
      nextRow = currRow
      break
  }
  newPath[newPath.length - 2] = nextRow
  newPath[newPath.length - 1] = nextCol
  return newPath
}
