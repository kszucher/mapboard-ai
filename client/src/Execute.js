import {initDim}                                                                                from "./Dim";
import {communication}                                                                          from "./Communication";
import {lastEvent}                                                                              from "./EventListener"
import {eventRouter}                                                                            from "./EventRouter";
import {mapMem, mapref, pathMerge, rebuild, redraw, loadMap, saveMap, mapStorageOut} from "./Map";
import {cellNavigate, structNavigate}                                                           from "./NodeNavigate";
import {applyMixedSelection, applyStructSelection, clearCellSelection, getSelectionContext}     from "./NodeSelect"
import {structInsert, cellInsert}                                                               from "./NodeInsert";
import {structDeleteReselect, cellBlockDeleteReselect}                                          from "./NodeDelete";
import {structMove}                                                                             from "./NodeMove";
import {copy, transposeArray} from "./Utils";
import {hasCell}                                                                                from "./Node";

let headerData = {};
let lastUserMap = '';

export function execute(command) {

    // console.log('COMMAND: ' + command);

    let keyStr, sc, maxSel, lastPath, lastRef, geomHighPath, geomHighRef, geomLowPath, geomLowRef;

    if (lastEvent.inputType === 'keyboardEvent') {
        keyStr = lastEvent.inputProps.keyStr;
    }

    // this will be a table at some point, I am telling you...
    if ([
        'selectMeStruct',
        'selectMeStructToo',
        'selectForwardStruct',
        'selectForwardMixed',
        'selectBackwardStruct',
        'selectBackwardMixed',
        'selectNeighborMixed',
        'selectDownMixed',
        'selectRightMixed',
        'selectNeighborNode',
        'selectNeighborNodeToo',
        'selectCellRow',
        'selectCellCol',
        'selectFirstMixed',
        'eraseContent',
        'typeText',
        'startEdit',
        'finishEdit',
        'newSiblingUp',
        'newSiblingDown',
        'newChild',
        'newCellBlock',
        'deleteNode',
        'deleteCellBlock',
        'moveNodeSelection',
        'copySelection',
        'cutSelection',
        'pasteSelection',
        'pasteFree',
        'cellifyMulti',
        'transposeMe',
        'transpose',
        'makeGrid',
        'renderEquation',

        'openAfterMapSelect'

    ].includes(command)) {
        sc = getSelectionContext();
        maxSel = sc.maxSel;
        lastPath = sc.lastPath;
        lastRef = sc.lastRef;
        geomHighPath = sc.geomHighPath;
        geomHighRef = sc.geomHighRef;
        geomLowPath = sc.geomLowPath;
        geomLowRef = sc.geomLowRef;
    }

    switch (command) {
        // -------------------------------------------------------------------------------------------------------------
        // SELECT
        // -------------------------------------------------------------------------------------------------------------
        case 'selectMeStruct': {
            applyStructSelection(mapMem.deepestSelectablePath);
            break;
        }
        case 'selectMeStructToo': {
            mapMem.deepestSelectableRef.selected = maxSel + 1;
            break;
        }
        case 'selectForwardStruct': {
            if (hasCell(lastRef)) {
                applyMixedSelection(pathMerge(lastPath, ['c', 0, 0]));
            }
            break;
        }
        case 'selectForwardMixed': {
            clearCellSelection();
            break;
        }
        case 'selectBackwardStruct': {
            for (let i = lastRef.path.length - 2; i > 0; i--) {
                if (Number.isInteger(lastRef.path[i]) &&
                    Number.isInteger(lastRef.path[i+1])) {
                    applyMixedSelection(lastRef.path.slice(0, i + 2));
                    break;
                }
            }
            break;
        }
        case 'selectBackwardMixed': {
            let parentRef = mapref(lastRef.parentPath);
            let parentParentRef = mapref(parentRef.parentPath);
            applyStructSelection(parentParentRef.path);
            break;
        }
        case 'selectNeighborMixed': {
            applyMixedSelection(cellNavigate(lastPath.slice(0, lastPath.length - 2), keyStr));
            break;
        }
        case 'selectDownMixed': {
            applyMixedSelection(cellNavigate(lastPath.slice(0, lastPath.length - 2), 'VK_DOWN'));
            break;
        }
        case 'selectRightMixed': {
            applyMixedSelection(cellNavigate(lastPath.slice(0, lastPath.length - 2), 'VK_RIGHT'));
            break;
        }
        case 'selectNeighborNode': {
            let toPath = [];
            if (        keyStr === 'VK_UP') {       toPath = geomHighPath   }
            else if (   keyStr === 'VK_DOWN') {     toPath = geomLowPath    }
            else {                                  toPath = lastPath       }
            applyStructSelection(structNavigate(toPath, keyStr));
            break;
        }
        case 'selectNeighborNodeToo': {
            mapref(structNavigate(lastPath, keyStr)).selected = maxSel + 1;
            break;
        }
        case 'selectCellRow': {
            clearStructSelection();
            clearCellSelection();
            let parentRef = mapref(lastRef.parentPath);
            let currRow = lastRef.index[0];
            let colLen = parentRef.c[0].length;

            for (let i = 0; i < colLen; i++) {
                parentRef.c[currRow][i].selected = 1;
            }

            break;
        }
        case 'selectCellCol': {
            clearStructSelection();
            clearCellSelection();

            let parentRef = mapref(lastRef.parentPath);
            let currCol = lastRef.index[1];
            let rowLen = parentRef.c.length;

            for (let i = 0; i < rowLen; i++) {
                parentRef.c[i][currCol].selected = 1;
            }

            break;
        }
        case 'selectFirstMixed': {
            let geomHighRefParentRef = mapref(geomHighRef.parentPath);
            applyMixedSelection(geomHighRefParentRef.path);
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // EDIT
        // -------------------------------------------------------------------------------------------------------------
        case 'eraseContent': {
            lastRef.content = '';
            let holderElement = document.getElementById(lastRef.divId);
            holderElement.innerHTML = '';
            break;
        }
        case 'typeText': {
            let holderElement = document.getElementById(lastRef.divId);
            holderElement.style.width = 1000 + 'px'; // long enough
            break;
        }
        case 'startEdit': {
            eventRouter.isEditing = 1;
            lastRef.editTrigger = 1;
            break;
        }
        case 'finishEdit' : {

            let holderElement = document.getElementById(lastRef.divId);
            holderElement.contentEditable = 'false';

            lastRef.content = holderElement.textContent;
            lastRef.sTextWidthShouldCalculate = 1;


            eventRouter.isEditing = 0;
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // INSERT
        // -------------------------------------------------------------------------------------------------------------
        case 'newSiblingUp':                structInsert(lastRef, 'UP');                                                        break;
        case 'newSiblingDown':              structInsert(lastRef, 'DOWN');                                                      break;
        case 'newChild':                    structInsert(lastRef, 'RIGHT');                                                     break;
        case 'newCellBlock':                cellInsert(lastPath.slice(0, lastPath.length -2), keyStr);                          break;
        // -------------------------------------------------------------------------------------------------------------
        // DELETE
        // -------------------------------------------------------------------------------------------------------------
        case 'deleteNode':                  structDeleteReselect(sc);                                                           break;
        case 'deleteCellBlock':             cellBlockDeleteReselect(lastRef);                                                   break;
        // -------------------------------------------------------------------------------------------------------------
        // MOVE
        // -------------------------------------------------------------------------------------------------------------
        case 'moveNodeSelection':           structMove(sc, 'struct2struct',       keyStr);                                      break;
        case 'copySelection':               structMove(sc, 'struct2clipboard',    'COPY');                                      break;
        case 'cutSelection':                structMove(sc, 'struct2clipboard',    'CUT');                                       break;
        case 'pasteSelection':              structMove(sc, 'clipboard2struct',    'PASTE');                                     break;
        case 'pasteFree': {
            let holderElement = document.getElementById(sc.lastRef.divId);
            holderElement.style.width = 1000 + 'px'; // long enough
            break;
        }
        case 'cellifyMulti': {
            structMove(sc, 'struct2cell', 'multiRow');
            break;
        }
        case 'transposeMe': {
            if (hasCell(lastRef)) {
                lastRef.c = transposeArray(lastRef.c);
            }
            break;
        }
        case 'transpose': {
            lastRef.c = transposeArray(lastRef.c);
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // UNSORTED
        // -------------------------------------------------------------------------------------------------------------
        case 'makeGrid': {
            makeGrid();
            break;
        }
        case 'renderEquation': { // this shouldnt be here...
            if (lastRef.content.substring(0, 2) === '\\[' && lastRef.isEquationAssigned === 0) {

                let tmpDiv;

                tmpDiv = document.createElement('div');

                tmpDiv.style.paddingLeft =              mapMem.padding + 'px';
                tmpDiv.style.paddingTop =               mapMem.padding + 'px';
                tmpDiv.style.fontSize =                 14 + 'px';
                tmpDiv.style.lineHeight =               14 + 'px';

                document.getElementById('dm').appendChild(tmpDiv);

                katex.render(getLatexString(lastRef.content), tmpDiv, {
                    throwOnError: false
                });

                lastRef.selfWidthOverride = tmpDiv.childNodes[0].offsetWidth + 8;
                lastRef.selfHeightOverride = tmpDiv.childNodes[0].offsetHeight + 8;

                if (isOdd(lastRef.selfHeightOverride)) {
                    lastRef.selfHeightOverride += 1;
                }

                tmpDiv.parentNode.removeChild(tmpDiv);

            }
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // SERVER RELATED
        // -------------------------------------------------------------------------------------------------------------
        case 'signIn': {
            initDim();
            let a2c =                           lastEvent.eventRef;
            localStorage.setItem('cred', JSON.stringify({
                name:                           a2c.user,
                pass:                           a2c.pass,
            }));
            let c2s = {
                'cmd':                          'signInRequest',
                'cred':                         JSON.parse(localStorage.getItem('cred')),
            };
            communication.sender(c2s);
            break;
        }
        case 'signOut': {
            let c2s = {
                'cmd':                          'signOutRequest',
                'cred':                         JSON.parse(localStorage.getItem('cred')),
            };
            localStorage.setItem('cred', {});
            communication.sender(c2s);
            break;
        }
        case 'openAfterInit': {
            let s2c =                           lastEvent.eventRef;
            headerData =                        copy(lastEvent.eventRef.headerData);
            let c2s = {
                'cmd':                          'openMapRequest',
                'cred':                         JSON.parse(localStorage.getItem('cred')),
                'mapName':                      headerData.headerMapList[headerData.headerMapSelected]
            };
            communication.sender(c2s);
            break;
        }
        case 'openAfterTabSelect': {
            let a2c = lastEvent.eventRef;
            let c2s = {
                'cmd':                          'openMapRequest',
                'cred':                         JSON.parse(localStorage.getItem('cred')),
                'mapName':                      headerData.headerMapList[a2c.tabId]
            };
            communication.sender(c2s);
            break;
        }
        case 'openAfterMapSelect': {
            if(lastRef.ilink !== '') {
                let c2s = {
                    'cmd':                      'openMapRequest',
                    'cred':                     JSON.parse(localStorage.getItem('cred')),
                    'mapName':                  lastRef.ilink
                };
                communication.sender(c2s);
            }
            break;
        }
        case 'openMapSuccess': {
            let s2c =                           lastEvent.eventRef;
            lastUserMap =                       s2c.mapName;
            loadMap(s2c.mapStorage);
            rebuild();
            redraw();
            break;
        }
        case 'save': {
            saveMap();
            let c2s = {
                cmd:                            'writeMapRequest',
                cred:                           JSON.parse(localStorage.getItem('cred')),
                mapName:                        lastUserMap,
                mapStorage:                     mapStorageOut
            };
            communication.sender(c2s);
            break;
        }
    }
}
