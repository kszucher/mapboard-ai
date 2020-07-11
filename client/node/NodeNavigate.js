import {mapref} from "../map/Map";

export function structNavigate (lastPath, direction) {

    let leftDepth = - 1;
    let currPath = [];

    // sequenceGenerator
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
        leftDepth++;
        if (leftDepth > 10) {console.log('recursion error'); break}
        for (let rightDepth = leftDepth; rightDepth > - 1; rightDepth--) {

            // sequence string based on depths nums
            let sequence = [];
            switch (direction) {
                case 'ArrowDown':     sequence = Array(leftDepth).fill('l').concat('d').concat(Array(rightDepth).fill('ru')); break;
                case 'ArrowUp':       sequence = Array(leftDepth).fill('l').concat('u').concat(Array(rightDepth).fill('rd')); break;
                case 'ArrowLeft':     sequence = ['l']; break;
                case 'ArrowRight':    sequence = ['rm']; break;
                default:            console.log('sequence_err');
            }

            // sequence acceptance
            let sequenceOk = Array(sequence.length).fill(false);

            // currPath init
            currPath = lastPath.slice();

            // sequenceProcessor
            for (let i = 0; i < sequence.length; i++) {
                // naming ease
                let currDirection = sequence[i];
                let currRef = mapref(currPath);
                let currChildCount = currRef.s.length;
                let parentRef = mapref(currRef.parentPath);

                // stop sequenceGenerator - no solution
                if (currRef.isRoot === 1 && ['l','u','d'].includes(currDirection) || // left edge
                    parentRef.type === 'cell' && ['l'].includes(currDirection) || // left edge
                    currDirection === 'rm' && currChildCount === 0) { // right edge
                    currPath = lastPath.slice(); // reinit
                    break sequenceGenerator;
                }

                // stop sequenceProcessor
                if (currDirection === 'u' && currRef.index === 0 ||
                    currDirection === 'd' && parentRef.s.length === currRef.index + 1 ||
                    currDirection === 'ru' && currChildCount === 0 ||
                    currDirection === 'rd' && currChildCount === 0) {
                    break;
                }

                // currPath loop
                if (currDirection === 'l') {
                    currPath = currPath.slice(0, currPath.length - 2);
                    parentRef.lastSelectedChild = currRef.index;
                }
                else if (currDirection === 'u') currPath[currPath.length - 1] -= 1;
                else if (currDirection === 'd') currPath[currPath.length - 1] += 1;
                else if (currDirection === 'ru') currPath.push('s', 0);
                else if (currDirection === 'rd') currPath.push('s', currChildCount - 1);
                else if (currDirection === 'rm') {
                    if (currRef.lastSelectedChild >= 0 && currRef.lastSelectedChild < currChildCount) { // if valid
                        // keep it
                    } else {
                        currRef.lastSelectedChild = currChildCount % 2 ? Math.floor(currChildCount / 2) : currChildCount / 2 - 1
                    }
                    currPath.push('s', currRef.lastSelectedChild);
                }

                sequenceOk[i] = true;
            }

            // stop sequenceGenerator - solution
            if (sequenceOk[sequenceOk.length - 1] === true) {
                break sequenceGenerator;
            }
        }
    }
    return currPath;
}

export function cellNavigate (lastPath, direction) {

    let currPath =          lastPath;
    let currRef =           mapref(lastPath);
    let parentRef =         mapref(currRef.parentPath);

    let rowLen =            parentRef.c.length;
    let colLen =            parentRef.c[0].length;
    let currRow =           currRef.index[0];
    let currCol =           currRef.index[1];
    let nextRow =           0;
    let nextCol =           0;

    switch (direction) {
        case 'ArrowDown':    nextRow =    currRow + 1 < rowLen ?    currRow + 1   : currRow;        nextCol = currCol; break;
        case 'ArrowUp':      nextRow =    currRow - 1 < 0 ?         0             : currRow - 1;    nextCol = currCol; break;
        case 'ArrowRight':   nextCol =    currCol + 1 < colLen ?    currCol + 1   : currCol;        nextRow = currRow; break;
        case 'ArrowLeft':    nextCol =    currCol - 1 < 0 ?         0             : currCol - 1;    nextRow = currRow; break;
    }

    currPath[currPath.length - 2] = nextRow;
    currPath[currPath.length - 1] = nextCol;

    return currPath;
}
