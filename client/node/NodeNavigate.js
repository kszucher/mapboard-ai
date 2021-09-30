import {mapref} from "../core/MapFlow";

export function nodeNavigate (lastPath, target, key) {
    let direction = '';
    let currPath = [];
    let truePath = lastPath;
    if (key === 'ArrowRight') {
        if (lastPath.length === 1 && lastPath[0] === 'r') {
            truePath = ['r', 'd', 0];
            direction = 'out';
        } else {
            direction = lastPath[2] === 0 ? 'out' : 'in';
        }
    } else if (key === 'ArrowLeft') {
        if (lastPath.length === 1 && lastPath[0] === 'r') {
            truePath = ['r', 'd', 1];
            direction = 'out';
        } else {
            direction = lastPath[2] === 0 ? 'in' : 'out';
        }
    } else if (key === 'ArrowUp') {
        direction = 'up';
    } else if (key === 'ArrowDown') {
        direction = 'down';
    }
    if (direction === 'out' && truePath.length === 3 && mapref(truePath).s.length === 0) {
        return ['r'];
    }
    if (target === 'struct2struct') {
        let inDepth = - 1;
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
            inDepth++;
            if (inDepth > 10) {console.log('recursion error'); break}
            for (let outDepth = inDepth; outDepth > - 1; outDepth--) {
                let sequence = [];
                switch (direction) {
                    case 'down': sequence = Array(inDepth)
                        .fill('i')
                        .concat('d')
                        .concat(Array(outDepth).fill('ou'));
                        break;
                    case 'up': sequence = Array(inDepth)
                        .fill('i')
                        .concat('u')
                        .concat(Array(outDepth).fill('od'));
                    break;
                    case 'in': sequence = ['i']; break;
                    case 'out': sequence = ['om']; break;
                    default: console.log('sequence error');
                }
                let sequenceOk = Array(sequence.length).fill(false);
                currPath = truePath.slice();
                for (let i = 0; i < sequence.length; i++) {
                    let currDirection = sequence[i];
                    let currRef = mapref(currPath);
                    let currChildCount = currRef.s.length;
                    let parentRef = mapref(currRef.parentPath);
                    if (currRef.isRoot === 1 && ['i','u','d'].includes(currDirection) ||
                        parentRef.type === 'cell' && ['i'].includes(currDirection) ||
                        currDirection === 'om' && currChildCount === 0) {
                        currPath = truePath.slice();
                        break sequenceGenerator;
                    }
                    if (currDirection === 'u' && currRef.index === 0 ||
                        currDirection === 'd' && parentRef.s.length === currRef.index + 1 ||
                        currDirection === 'ou' && currChildCount === 0 ||
                        currDirection === 'od' && currChildCount === 0) {
                        break;
                    }
                    if (currDirection === 'i') {
                        if (currPath.length === 5) {
                            currPath = currPath.slice(0, currPath.length - 4);
                        } else {
                            currPath = currPath.slice(0, currPath.length - 2);
                        }
                        parentRef.lastSelectedChild = currRef.index;
                    }
                    else if (currDirection === 'u') currPath[currPath.length - 1] -= 1;
                    else if (currDirection === 'd') currPath[currPath.length - 1] += 1;
                    else if (currDirection === 'ou') currPath.push('s', 0);
                    else if (currDirection === 'od') currPath.push('s', currChildCount - 1);
                    else if (currDirection === 'om') {
                        if (!(currRef.lastSelectedChild >= 0 && currRef.lastSelectedChild < currChildCount)) {
                            currRef.lastSelectedChild = currChildCount % 2
                                ? Math.floor(currChildCount / 2)
                                : currChildCount / 2 - 1
                        }
                        currPath.push('s', currRef.lastSelectedChild);
                    }
                    sequenceOk[i] = true;
                }
                if (sequenceOk[sequenceOk.length - 1] === true) {
                    break sequenceGenerator;
                }
            }
        }
    } else if (target === 'cell2cell') {
        currPath = truePath;
        let currRef = mapref(truePath);
        let parentRef = mapref(currRef.parentPath);
        let rowLen = parentRef.c.length;
        let colLen = parentRef.c[0].length;
        let currRow = currRef.index[0];
        let currCol = currRef.index[1];
        let nextRow = 0;
        let nextCol = 0;
        switch (direction) {
            case 'down': nextRow = currRow + 1 < rowLen ? currRow + 1 : currRow;     nextCol = currCol; break;
            case 'up':   nextRow = currRow - 1 < 0 ?      0           : currRow - 1; nextCol = currCol; break;
            case 'out':  nextCol = currCol + 1 < colLen ? currCol + 1 : currCol;     nextRow = currRow; break;
            case 'in':   nextCol = currCol - 1 < 0 ?      0           : currCol - 1; nextRow = currRow; break;
        }
        currPath[currPath.length - 2] = nextRow;
        currPath[currPath.length - 1] = nextCol;
    }
    return currPath;
}
