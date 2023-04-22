import {Dir} from "../core/Enums"
import {M, P} from "../state/MapPropTypes"
import {getNodeByPath, getParentPath, isC} from "../map/MapUtils"

export const structNavigate = (m: M, path: P, dir: Dir) => {
  let toPath = [] as P
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
      switch (dir) {
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
      toPath = [...path]
      for (let i = 0; i < sequence.length; i++) {
        let currDirection = sequence[i]
        let currRef = getNodeByPath(m, toPath)
        let currChildCount = currRef.sCount
        let pn = getNodeByPath(m, getParentPath(currRef.path))
        if (toPath.length === 2 && ['i','u','d'].includes(currDirection) ||
          isC(pn.path) && ['i'].includes(currDirection) ||
          currDirection === 'om' && currChildCount === 0) {
          toPath = [...path]
          break sequenceGenerator
        }
        if (currDirection === 'u' && currRef.path.at(-1) === 0 ||
          currDirection === 'd' && pn.sCount === currRef.path.at(-1) as number + 1 ||
          currDirection === 'ou' && currChildCount === 0 ||
          currDirection === 'od' && currChildCount === 0) {
          break
        }
        if (currDirection === 'i') {
          if (toPath.length === 6) {
            toPath = toPath.slice(0, -4)
          } else {
            toPath = toPath.slice(0, -2)
          }
          pn.lastSelectedChild = currRef.path.at(-1) as number
        }
        else if (currDirection === 'u') toPath[toPath.length - 1] = toPath.at(-1) as number - 1
        else if (currDirection === 'd') toPath[toPath.length - 1] = toPath.at(-1) as number + 1
        else if (currDirection === 'ou') toPath.push('s', 0)
        else if (currDirection === 'od') toPath.push('s', currChildCount - 1)
        else if (currDirection === 'om') {
          if (!(currRef.lastSelectedChild >= 0 && currRef.lastSelectedChild < currChildCount)) {
            currRef.lastSelectedChild = currChildCount % 2
              ? Math.floor(currChildCount / 2)
              : currChildCount / 2 - 1
          }
          toPath.push('s', currRef.lastSelectedChild)
        }
        sequenceOk[i] = true
      }
      if (sequenceOk[sequenceOk.length - 1] === true) {
        break sequenceGenerator
      }
    }
  }

  return toPath
}
