import {mapMem, mapref, mapSvgData, pathMerge, recalc, redraw} from "../map/Map";
import {structDeleteReselect, cellBlockDeleteReselect} from "../node/NodeDelete";
import {structInsert, cellInsert} from "../node/NodeInsert";
import {setClipboard, structMove} from "../node/NodeMove";
import {cellNavigate, structNavigate} from "../node/NodeNavigate";
import {clearCellSelectionContext, clearStructSelectionContext, getSelectionContext} from "../node/NodeSelect"
import {setEndOfContenteditable, transposeArray} from "./Utils";

let mutationObserver;
export let isEditing = 0;

export function nodeDispatch(action, payload) {
    console.log('NODEDISPATCH: ' + action);
    nodeReducer(action, payload);
    recalc();
}

export function nodeReducer(action, payload) {
    let sc = getSelectionContext();
    let {lm} = sc;
    switch (action) {
        // SELECT ------------------------------------------------------------------------------------------------------
        case 'selectMeStruct': {
            clearStructSelectionContext();
            clearCellSelectionContext();
            mapref(mapMem.deepestSelectablePath).selected = 1;
            break;
        }
        case 'selectMeStructToo': {
            mapref(mapMem.deepestSelectablePath).selected = sc.maxSel + 1;
            break;
        }
        case 'selectForwardStruct': {
            if (lm.hasCell) {
                clearStructSelectionContext();
                clearCellSelectionContext();
                let toPath = pathMerge(sc.lastPath, ['c', 0, 0]);
                mapref(toPath).selected = 1;
                mapref(toPath).s[0].selected = 1;
            }
            break;
        }
        case 'selectForwardMixed': {
            clearCellSelectionContext();
            break;
        }
        case 'selectBackwardStruct': {
            for (let i = lm.path.length - 2; i > 0; i--) {
                if (Number.isInteger(lm.path[i]) &&
                    Number.isInteger(lm.path[i + 1])) {
                    clearStructSelectionContext();
                    clearCellSelectionContext();
                    let toPath = lm.path.slice(0, i + 2);
                    mapref(toPath).selected = 1;
                    mapref(toPath).s[0].selected = 1;
                    break;
                }
            }
            break;
        }
        case 'selectBackwardMixed': {
            clearStructSelectionContext();
            clearCellSelectionContext();
            mapref(mapref(mapref(lm.parentPath).parentPath).path).selected = 1;
            break;
        }
        case 'selectNeighborMixed': {
            clearStructSelectionContext();
            clearCellSelectionContext();
            let toPath = cellNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), payload.keyCode);
            mapref(toPath).selected = 1;
            mapref(toPath).s[0].selected = 1;
            break;
        }
        case 'selectDownMixed': {
            clearStructSelectionContext();
            clearCellSelectionContext();
            let toPath = cellNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), 'ArrowDown');
            mapref(toPath).selected = 1;
            mapref(toPath).s[0].selected = 1;
            break;
        }
        case 'selectRightMixed': {
            clearStructSelectionContext();
            clearCellSelectionContext();
            let toPath = cellNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), 'ArrowRight');
            mapref(toPath).selected = 1;
            mapref(toPath).s[0].selected = 1;
            break;
        }
        case 'selectNeighborNode': {
            clearStructSelectionContext();
            clearCellSelectionContext();
            let fromPath = sc.lastPath;
            if (payload.keyCode === 'ArrowUp') fromPath = sc.geomHighPath;
            if (payload.keyCode === 'ArrowDown') fromPath = sc.geomLowPath;
            let toPath = structNavigate(fromPath, payload.keyCode);
            mapref(toPath).selected = 1;
            break;
        }
        case 'selectNeighborNodeToo': {
            mapref(structNavigate(sc.lastPath, payload.keyCode)).selected = sc.maxSel + 1;
            break;
        }
        case 'selectCellRow': {
            clearStructSelectionContext();
            clearCellSelectionContext();
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
            clearStructSelectionContext();
            clearCellSelectionContext();
            let parentRef = mapref(lm.parentPath);
            let parentParentRef = mapref(parentRef.parentPath);
            let currCol = parentRef.index[1];
            let rowLen = parentParentRef.c.length;
            for (let i = 0; i < rowLen; i++) {
                parentParentRef.c[i][currCol].selected = 1;
            }
            break;
        }
        case 'selectFirstMixed': {
            clearStructSelectionContext();
            clearCellSelectionContext();
            let toPath = mapref(sc.geomHighRef.parentPath).path;
            mapref(toPath).selected = 1;
            mapref(toPath).s[0].selected = 1;
            break;
        }
        case 'selectRoot': {
            clearStructSelectionContext();
            clearCellSelectionContext();
            mapMem.getData().r.selected = 1;
            break;
        }
        // INSERT ------------------------------------------------------------------------------------------------------
        case 'newSiblingUp': {
            clearStructSelectionContext();
            structInsert(lm, 'siblingUp');
            break;
        }
        case 'newSiblingDown': {
            clearStructSelectionContext();
            structInsert(lm, 'siblingDown');
            break;
        }
        case 'newChild': {
            clearStructSelectionContext();
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
            structMove(sc, 'struct2struct', payload.keyCode);
            break;
        }
        case 'copySelection': {
            structMove(sc, 'struct2clipboard', 'COPY');
            break;
        }
        case 'cutSelection': {
            structMove(sc, 'struct2clipboard', 'CUT');
            structDeleteReselect(sc);
            break;
        }
        case 'cellifyMulti': {
            structMove(sc, 'struct2cell', 'multiRow');
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
            clearStructSelectionContext();
            clearCellSelectionContext();
            setClipboard(JSON.parse(payload));
            structMove(sc, 'clipboard2struct', 'PASTE');
            break;
        }
        // FORMAT ------------------------------------------------------------------------------------------------------
        case 'applyColor': {
            for (let i = 0; i < sc.structSelectedPathList.length; i++) {
                let cm = mapref(sc.structSelectedPathList[i]);
                switch (payload.currColor) {
                    case 0: cm.sTextColor = '#000000'; break;
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
        case 'transposeMe': {
            if (lm.hasCell) {
                lm.c = transposeArray(lm.c);
            }
            break;
        }
        case 'transpose': {
            lm.c = transposeArray(lm.c);
            break;
        }
        case 'setTaskStatus': {
            let cm = mapref(mapSvgData[payload.svgId].path);
            cm.taskStatus = payload.taskStatus;
            cm.taskStatusInherited = -1;
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
        case 'finishEdit' : {
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
        // FIND --------------------------------------------------------------------------------------------------------
    }
}
