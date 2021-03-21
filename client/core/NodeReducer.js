import {structDeleteReselect, cellBlockDeleteReselect} from "../node/NodeDelete";
import {structInsert, cellInsert} from "../node/NodeInsert";
import {setClipboard, nodeMove, nodeMoveMouse} from "../node/NodeMove";
import {nodeNavigate} from "../node/NodeNavigate";
import {setEndOfContenteditable, transposeArray} from "./Utils";
import {mapChangeProp} from "../map/MapChangeProp";
import {props} from "../node/Node";
import {clearSelectionContext, getSelectionContext} from "./SelectionReducer";
import {mapref, mapState, pathMerge, recalc, redraw} from "./MapReducer";
import {mapSvgData} from "./DomReducer";

let mutationObserver;
export let isEditing = 0;

export function nodeDispatch(action, payload) {
    console.log('NODEDISPATCH: ' + action);
    nodeReducer(action, payload);
    recalc();
}

function nodeReducer(action, payload) {
    let sc = getSelectionContext();
    let lm = mapref(sc.lastPath);
    switch (action) {
        // SELECT ------------------------------------------------------------------------------------------------------
        case 'selectStruct': {
            clearSelectionContext();
            mapref(mapState.deepestSelectablePath).selected = 1;
            break;
        }
        case 'selectStructToo': {
            mapref(mapState.deepestSelectablePath).selected = sc.maxSel + 1;
            break;
        }
        case 'selectDescendantsOut': {
            if (lm.path[2] === 1 && payload.keyCode === 'ArrowLeft' ||
                lm.path[2] === 0 && payload.keyCode === 'ArrowRight') {
                mapChangeProp.start(lm, 'selected', 1);
            }
            break;
        }
        case 'selectForwardMixed': {
            if (lm.hasCell) {
                clearSelectionContext();
                let toPath = pathMerge(sc.lastPath, ['c', 0, 0]);
                mapref(toPath).selected = 1;
                mapref(toPath).s[0].selected = 1;
            }
            break;
        }
        case 'selectBackwardStruct': {
            clearSelectionContext();
            mapref(mapref(lm.parentPath).path).selected = 1;
            break;
        }
        case 'selectBackwardBackwardStruct': {
            clearSelectionContext();
            mapref(mapref(mapref(lm.parentPath).parentPath).path).selected = 1;
            break;
        }
        case 'selectForwardStruct': {
            clearSelectionContext();
            lm.selected = 1;
            break;
        }
        case 'selectBackwardMixed': {
            for (let i = lm.path.length - 2; i > 0; i--) {
                if (Number.isInteger(lm.path[i]) &&
                    Number.isInteger(lm.path[i + 1])) {
                    clearSelectionContext();
                    let toPath = lm.path.slice(0, i + 2);
                    mapref(toPath).selected = 1;
                    mapref(toPath).s[0].selected = 1;
                    break;
                }
            }
            break;
        }
        case 'selectFirstMixed': {
            clearSelectionContext();
            let toPath = mapref(mapref(sc.geomHighPath).parentPath).path;
            mapref(toPath).selected = 1;
            mapref(toPath).s[0].selected = 1;
            break;
        }
        case 'selectDownMixed': {
            clearSelectionContext();
            let toPath = nodeNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), 'cell2cell', 'ArrowDown');
            mapref(toPath).selected = 1;
            mapref(toPath).s[0].selected = 1;
            break;
        }
        case 'selectOutMixed': {
            clearSelectionContext();
            let toPath = nodeNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), 'cell2cell', lm.path[2] === 0 ? 'ArrowRight' : 'ArrowLeft');
            mapref(toPath).selected = 1;
            mapref(toPath).s[0].selected = 1;
            break;
        }
        case 'selectNeighborStruct': {
            clearSelectionContext();
            let fromPath = sc.lastPath;
            if (payload.keyCode === 'ArrowUp') fromPath = sc.geomHighPath;
            if (payload.keyCode === 'ArrowDown') fromPath = sc.geomLowPath;
            let toPath = nodeNavigate(fromPath, 'struct2struct', payload.keyCode);
            mapref(toPath).selected = 1;
            break;
        }
        case 'selectNeighborStructToo': {
            let toPath = nodeNavigate(sc.lastPath, 'struct2struct', payload.keyCode);
            mapref(toPath).selected = sc.maxSel + 1;
            break;
        }
        case 'selectNeighborMixed': {
            clearSelectionContext();
            let toPath = nodeNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), 'cell2cell', payload.keyCode);
            mapref(toPath).selected = 1;
            mapref(toPath).s[0].selected = 1;
            break;
        }
        case 'selectCellRow': {
            clearSelectionContext();
            let parentRef = mapref(lm.parentPath);
            let parentParentRef = mapref(parentRef.parentPath);
            let currRow = parentRef.index[0];
            let colLen = parentParentRef.c[0].length;
            for (let i = 0; i < colLen; i++) {
                parentParentRef.c[currRow][i].selected = 1;
            }
            break;
        }
        case 'selectCellCol': {
            clearSelectionContext();
            let parentRef = mapref(lm.parentPath);
            let parentParentRef = mapref(parentRef.parentPath);
            let currCol = parentRef.index[1];
            let rowLen = parentParentRef.c.length;
            for (let i = 0; i < rowLen; i++) {
                parentParentRef.c[i][currCol].selected = 1;
            }
            break;
        }
        case 'selectCellBlock': {
            if (payload.keyCode === 'ArrowLeft' && sc.cellColSelected ||
                payload.keyCode === 'ArrowRight' && sc.cellColSelected ||
                payload.keyCode === 'ArrowUp' && sc.cellRowSelected ||
                payload.keyCode === 'ArrowDown' && sc.cellRowSelected) {
                clearSelectionContext();
                for (let i = 0; i < sc.cellSelectedPathList.length; i++) {
                    let currPath = sc.cellSelectedPathList[i];
                    let toPath = nodeNavigate(currPath, 'cell2cell', payload.keyCode);
                    mapref(toPath).selected = 1;
                }
            }
            break;
        }
        case 'selectRoot': {
            clearSelectionContext();
            mapref(['r']).selected = 1;
            break;
        }
        // INSERT ------------------------------------------------------------------------------------------------------
        case 'newSiblingUp': {
            if (!lm.isRoot) {
                clearSelectionContext();
                structInsert(lm, 'siblingUp');
            }
            break;
        }
        case 'newSiblingDown': {
            if (!lm.isRoot) {
                clearSelectionContext();
                structInsert(lm, 'siblingDown');
            }
            break;
        }
        case 'newChild': {
            clearSelectionContext();
            structInsert(lm, 'child');
            break;
        }
        case 'newCellBlock': {
            cellInsert(sc.lastPath.slice(0, sc.lastPath.length - 2), payload.keyCode);
            break;
        }
        // DELETE ------------------------------------------------------------------------------------------------------
        case 'deleteNode': {
            structDeleteReselect(sc);
            break;
        }
        case 'deleteCellBlock': {
            cellBlockDeleteReselect(sc);
            break;
        }
        // MOVE --------------------------------------------------------------------------------------------------------
        case 'moveNodeSelection': {
            nodeMove(sc, 'struct2struct', payload.keyCode);
            break;
        }
        case 'moveCellBlock': {
            console.log(sc)
            nodeMove(sc, 'cellBlock2CellBlock', payload.keyCode);
            break;
        }
        case 'transpose': {
            if (lm.hasCell) {
                lm.c = transposeArray(lm.c);
            }
            break;
        }
        case 'copySelection': {
            nodeMove(sc, 'struct2clipboard', '', 'COPY');
            break;
        }
        case 'cutSelection': {
            nodeMove(sc, 'struct2clipboard', '', 'CUT');
            structDeleteReselect(sc);
            break;
        }
        case 'moveSelection': {
            nodeMoveMouse(sc);
            break;
        }
        case 'cellifyMulti': {
            nodeMove(sc, 'struct2cell', '', 'multiRow');
            break;
        }
        case 'insertTextFromClipboardAsText': {
            document.execCommand("insertHTML", false, payload);
            break;
        }
        case 'insertTextFromClipboardAsNode': {
            lm.contentType = 'text';
            lm.content = payload;
            lm.isDimAssigned = 0;
            break;
        }
        case 'insertElinkFromClipboardAsNode': {
            lm.contentType = 'text';
            lm.content = payload;
            lm.linkType = 'external';
            lm.link = payload;
            lm.isDimAssigned = 0;
            break;
        }
        case 'insertIlinkFromMongo': {
            lm.linkType = 'internal';
            lm.link = payload;
            lm.isDimAssigned = 0;
            break;
        }
        case 'insertEquationFromClipboardAsNode': {
            lm.contentType = 'equation';
            lm.content = payload;
            lm.isDimAssigned = 0;
            break;
        }
        case 'insertImageFromLinkAsNode': {
            lm.contentType = 'image';
            lm.content = payload.imageId;
            lm.imageW = payload.imageSize.width;
            lm.imageH = payload.imageSize.height;
            break;
        }
        case 'insertMapFromClipboard': {
            clearSelectionContext();
            setClipboard(JSON.parse(payload));
            nodeMove(sc, 'clipboard2struct', '', 'PASTE');
            break;
        }
        // FORMAT ------------------------------------------------------------------------------------------------------
        case 'applyColor': {
            for (let i = 0; i < sc.structSelectedPathList.length; i++) {
                let cm = mapref(sc.structSelectedPathList[i]);
                switch (payload.currColor) {
                    case 0: cm.sTextColor = '#222222'; break;
                    case 1: cm.sTextColor = '#999999'; break;
                    case 2: cm.sTextColor = '#bbbbbb'; break;
                    case 3: cm.sTextColor = '#dddddd'; break;
                    case 4: cm.sTextColor = '#d5802a'; break;
                    case 5: cm.sTextColor = '#1c8e1c'; break;
                    case 6: cm.sTextColor = '#8e1c8e'; break;
                    case 7: cm.sTextColor = '#990000'; break;
                    case 8: cm.sTextColor = '#000099'; break;
                    case 9: cm.sTextColor = '#ffffff'; break;
                }
            }
            break;
        }
        case 'applyColorFromPalette': {
            for (let i = 0; i < sc.structSelectedPathList.length; i++) {
                let cm = mapref(sc.structSelectedPathList[i]);
                switch (payload.colorMode) {
                    case 'text':
                        cm.sTextColor = payload.color;
                        break;
                    case 'border':
                        cm.ellipseFill = 1;
                        cm.ellipseBorderColor = payload.color;
                        break;
                    case 'highlight':
                        cm.ellipseFill = 1;
                        cm.ellipseFillColor = payload.color;
                        break;
                    case 'line': cm.lineColor = payload.color;
                    break;
                }
            }
            break;
        }
        case 'formatColorReset': {
            mapChangeProp.start(lm, 'sTextColor', props.saveOptional.sTextColor);
            mapChangeProp.start(lm, 'cBorderColor', props.saveOptional.cBorderColor);
            mapChangeProp.start(lm, 'ellipseFill', props.saveOptional.ellipseFill);
            mapChangeProp.start(lm, 'ellipseFillColor', props.saveOptional.ellipseFillColor);
            mapChangeProp.start(lm, 'ellipseBorderColor', props.saveOptional.ellipseBorderColor);
            mapChangeProp.start(lm, 'lineColor', props.saveOptional.lineColor);
            break;
        }
        case 'applyFontSize': {
            let fontMapping = {
                h1: 54,
                h2: 36,
                h3: 24,
                h4: 18,
                h5: 16,
                h6: 14
            };
            for (let i = 0; i < sc.structSelectedPathList.length; i++) {
                let cm = mapref(sc.structSelectedPathList[i]);
                cm.sTextFontSize = fontMapping[payload];
                cm.isDimAssigned = 0;
            }
            break;
        }
        case 'applyTaskStatus': {
            for (let i = 0; i < sc.structSelectedPathList.length; i++) {
                let cm = mapref(sc.structSelectedPathList[i]);
                cm.taskStatus = 2;
                cm.taskStatusInherited = -1;
                switch (payload.currTaskStatus) {
                    case 0: cm.taskStatus = 0; break;
                    case 1: cm.taskStatus = 1; break;
                    case 2: cm.taskStatus = 2; break;
                    case 3: cm.taskStatus = 3; break;
                }
            }
            break;
        }
        case 'setTaskStatus': {
            let cm = mapref(mapSvgData[payload.svgId].path);
            cm.taskStatus = payload.taskStatus;
            cm.taskStatusInherited = -1;
            break;
        }
        case 'taskCheckReset': {
            if (lm.task) {
                mapChangeProp.start(lm, 'taskStatus', -1);
            }
            break;
        }
        case 'taskSwitch': {
            mapChangeProp.start(lm, 'task', !lm.task);
            break;
        }
        case 'resetDim': {
            mapChangeProp.start(mapref(['r']), 'isDimAssigned', 0);
            break;
        }
        // EDIT -------------------------------------------------------------------------------------------------------------
        case 'eraseContent': {
            if (!lm.hasCell) {
                lm.content = '';
                let holderElement = document.getElementById(lm.divId);
                holderElement.innerHTML = '';
            }
            break;
        }
        case 'startEdit': {
            if (!lm.hasCell) {
                if (lm.contentType === 'equation') {
                    lm.contentType = 'text';
                    lm.isDimAssigned = 0;
                    redraw();
                }
                let holderElement = document.getElementById(lm.divId);
                holderElement.contentEditable = 'true';
                setEndOfContenteditable(holderElement);
                isEditing = 1;
                lm.isEditing = 1;
                const callback = function (mutationsList) {
                    for (let mutation of mutationsList) {
                        if (mutation.type === 'characterData') {
                            nodeDispatch('typeText');
                            redraw();
                        }
                    }
                };
                mutationObserver = new MutationObserver(callback);
                mutationObserver.observe(holderElement, {
                    attributes: false,
                    childList: false,
                    subtree: true,
                    characterData: true
                });
            }
            break;
        }
        case 'typeText': {
            let holderElement = document.getElementById(lm.divId);
            lm.content = holderElement.innerHTML;
            lm.isDimAssigned = 0;
            break;
        }
        case 'finishEdit': {
            mutationObserver.disconnect();
            let holderElement = document.getElementById(lm.divId);
            holderElement.contentEditable = 'false';
            lm.isEditing = 0;
            isEditing = 0;
            if (lm.content.substring(0, 2) === '\\[') {
                lm.contentType = 'equation';
                lm.isDimAssigned = 0;
            }
            break;
        }
    }
}
