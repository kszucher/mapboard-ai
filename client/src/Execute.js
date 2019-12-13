import {initDim}                                                                                from "./Dim";
import {communication}                                                                          from "./Communication";
import {lastEvent}                                                                              from "./EventListener"
import {eventRouter}                                                                            from "./EventRouter";
import {mapMem, mapref, pathMerge, rebuild, redraw, loadMap, saveMap, mapStorageOut}            from "./Map";
import {hasCell}                                                                                from "./Node";
import {cellNavigate, structNavigate}                                                           from "./NodeNavigate";
import {applyMixedSelection, applyStructSelection, clearCellSelection, getSelectionContext}     from "./NodeSelect"
import {structInsert, cellInsert}                                                               from "./NodeInsert";
import {structDeleteReselect, cellBlockDeleteReselect}                                          from "./NodeDelete";
import {setClipboard, structMove}                                                               from "./NodeMove";
import {copy, isOdd, setEndOfContenteditable, transposeArray} from "./Utils";

let headerData = {};
let lastUserMap = '';

export function execute(command) {

    let keyStr, sc, maxSel, lastPath, lm, geomHighPath, geomHighRef, geomLowPath;

    if (lastEvent.type === 'windowKeyDown') {
        keyStr = lastEvent.ref.code;
    }

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
        'pasteAsMap',
        'pasteAsText',
        'cellifyMulti',
        'transposeMe',
        'transpose',
        'makeGrid',
        'pasteAsEquation',
        'openAfterMapSelect',
        'createMapInMap',
        'createMapInMapSuccess',
        'imageSaveSuccess',
        'insertImage'
    ].includes(command)) {
        sc = getSelectionContext();
        maxSel = sc.maxSel;
        lastPath = sc.lastPath;
        lm = sc.lm;
        geomHighPath = sc.geomHighPath;
        geomHighRef = sc.geomHighRef;
        geomLowPath = sc.geomLowPath;
        // geomLowRef = sc.geomLowRef;
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
            if (hasCell(lm)) {
                applyMixedSelection(pathMerge(lastPath, ['c', 0, 0]));
            }
            break;
        }
        case 'selectForwardMixed': {
            clearCellSelection();
            break;
        }
        case 'selectBackwardStruct': {
            for (let i = lm.path.length - 2; i > 0; i--) {
                if (Number.isInteger(lm.path[i]) &&
                    Number.isInteger(lm.path[i+1])) {
                    applyMixedSelection(lm.path.slice(0, i + 2));
                    break;
                }
            }
            break;
        }
        case 'selectBackwardMixed': {
            let parentRef = mapref(lm.parentPath);
            let parentParentRef = mapref(parentRef.parentPath);
            applyStructSelection(parentParentRef.path);
            break;
        }
        case 'selectNeighborMixed': {
            applyMixedSelection(cellNavigate(lastPath.slice(0, lastPath.length - 2), keyStr));
            break;
        }
        case 'selectDownMixed': {
            applyMixedSelection(cellNavigate(lastPath.slice(0, lastPath.length - 2), 'ArrowDown'));
            break;
        }
        case 'selectRightMixed': {
            applyMixedSelection(cellNavigate(lastPath.slice(0, lastPath.length - 2), 'ArrowRight'));
            break;
        }
        case 'selectNeighborNode': {
            let toPath = [];
            if (        keyStr === 'ArrowUp') {       toPath = geomHighPath   }
            else if (   keyStr === 'ArrowDown') {     toPath = geomLowPath    }
            else {                                    toPath = lastPath       }
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
            let parentRef = mapref(lm.parentPath);
            let currRow = lm.index[0];
            let colLen = parentRef.c[0].length;

            for (let i = 0; i < colLen; i++) {
                parentRef.c[currRow][i].selected = 1;
            }

            break;
        }
        case 'selectCellCol': {
            clearStructSelection();
            clearCellSelection();

            let parentRef = mapref(lm.parentPath);
            let currCol = lm.index[1];
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
            lm.content = '';
            let holderElement = document.getElementById(lm.divId);
            holderElement.innerHTML = '';
            break;
        }
        case 'typeText': {
            let holderElement = document.getElementById(lm.divId);
            holderElement.style.width = 1000 + 'px'; // long enough
            break;
        }
        case 'startEdit': {
            eventRouter.isEditing = 1;
            let holderElement = document.getElementById(lm.divId);
            holderElement.contentEditable = 'true';
            setEndOfContenteditable(holderElement);
            break;
        }
        case 'finishEdit' : {

            let holderElement = document.getElementById(lm.divId);
            holderElement.contentEditable = 'false';

            lm.content = holderElement.textContent;
            lm.sTextWidthCalculated = 0;

            eventRouter.isEditing = 0;
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // INSERT
        // -------------------------------------------------------------------------------------------------------------
        case 'newSiblingUp':                        structInsert(lm, 'up');                                break;
        case 'newSiblingDown':                      structInsert(lm, 'down');                              break;
        case 'newChild':                            structInsert(lm, 'right');                             break;
        case 'newCellBlock':                        cellInsert(lastPath.slice(0, lastPath.length -2), keyStr);  break;
        // -------------------------------------------------------------------------------------------------------------
        // DELETE
        // -------------------------------------------------------------------------------------------------------------
        case 'deleteNode':                          structDeleteReselect(sc);                                   break;
        case 'deleteCellBlock':                     cellBlockDeleteReselect(lm);                           break;
        // -------------------------------------------------------------------------------------------------------------
        // MOVE
        // -------------------------------------------------------------------------------------------------------------
        case 'moveNodeSelection': {
            structMove(sc, 'struct2struct', keyStr);
            break;
        }
        case 'copySelection': {
            structMove(sc, 'struct2clipboard', 'COPY');
            break;
        }
        case 'cutSelection': {
            structMove(sc, 'struct2clipboard', 'CUT');
            break;
        }
        case 'pasteAsMap': {
            let text = lastEvent.props.data;
            setClipboard(JSON.parse(text));
            structMove(sc, 'clipboard2struct', 'PASTE');
            break;
        }
        case 'pasteAsEquation': { // this shouldnt be here...
            let text = lastEvent.props.data;
            // connect new and old

            if (lm.content.substring(0, 2) === '\\[' && lm.isEquationAssigned === 0) {

                let tmpDiv;

                tmpDiv = document.createElement('div');

                tmpDiv.style.paddingLeft =          mapMem.padding + 'px';
                tmpDiv.style.paddingTop =           mapMem.padding + 'px';
                tmpDiv.style.fontSize =             14 + 'px';
                tmpDiv.style.lineHeight =           14 + 'px';

                document.getElementById('dm').appendChild(tmpDiv);

                katex.render(getLatexString(lm.content), tmpDiv, {
                    throwOnError: false
                });

                lm.selfWidthOverride =         tmpDiv.childNodes[0].offsetWidth + 8;
                lm.selfHeightOverride =        tmpDiv.childNodes[0].offsetHeight + 8;

                if (isOdd(lm.selfHeightOverride)) {
                    lm.selfHeightOverride += 1;
                }

                tmpDiv.parentNode.removeChild(tmpDiv);
            }
            break;
        }
        case 'pasteAsText': {
            // TODO: remove all formatting
            // https://stackoverflow.com/questions/12027137/javascript-trick-for-paste-as-plain-item-in-execcommand
            let holderElement = document.getElementById(sc.lm.divId);
            holderElement.style.width = 1000 + 'px'; // long enough
            break;
        }
        case 'cellifyMulti': {
            structMove(sc, 'struct2cell', 'multiRow');
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // MISC
        // -------------------------------------------------------------------------------------------------------------
        case 'transposeMe': {
            if (hasCell(lm)) {
                lm.c = transposeArray(lm.c);
            }
            break;
        }
        case 'transpose': {
            lm.c = transposeArray(lm.c);
            break;
        }
        case 'makeGrid': {
            makeGrid();
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // SERVER RELATED - TX
        // -------------------------------------------------------------------------------------------------------------
        case 'signIn': {
            initDim();
            let r2c =                               lastEvent.ref;
            localStorage.setItem('cred', JSON.stringify({
                name:                               r2c.user,
                pass:                               r2c.pass,
            }));
            let c2s = {
                'cmd':                              'signInRequest',
                'cred':                             JSON.parse(localStorage.getItem('cred')),
            };
            communication.sender(c2s);
            break;
        }
        case 'signOut': {
            let c2s = {
                'cmd':                              'signOutRequest',
                'cred':                             JSON.parse(localStorage.getItem('cred')),
            };
            localStorage.setItem('cred', {});
            communication.sender(c2s);
            break;
        }
        case 'openAfterInit': {
            headerData =                            copy(lastEvent.ref.headerData);
            let c2s = {
                'cmd':                              'openMapRequest',
                'cred':                             JSON.parse(localStorage.getItem('cred')),
                'mapName':                          headerData.headerMapIdList[headerData.headerMapSelected]
            };
            communication.sender(c2s);
            break;
        }
        case 'openAfterTabSelect': {
            let r2c = lastEvent.ref;
            let c2s = {
                'cmd':                              'openMapRequest',
                'cred':                             JSON.parse(localStorage.getItem('cred')),
                'mapName':                          headerData.headerMapIdList[r2c.tabId]
            };
            communication.sender(c2s);
            break;
        }
        case 'openAfterMapSelect': {
            if(lm.ilink !== '') {
                let c2s = {
                    'cmd':                          'openMapRequest',
                    'cred':                         JSON.parse(localStorage.getItem('cred')),
                    'mapName':                      lm.ilink
                };
                communication.sender(c2s);
            }
            break;
        }
        case 'save': {
            saveMap();
            let c2s = {
                cmd:                                'writeMapRequest',
                cred:                               JSON.parse(localStorage.getItem('cred')),
                mapName:                            lastUserMap,
                mapStorage:                         mapStorageOut
            };
            communication.sender(c2s);
            break;
        }
        case 'createMapInTab': {
            break;
        }
        case 'createMapInMap': {
            let newMap = {
                data: [
                    {
                        path:                       ['s', 0],
                        content:                    lm.content,
                        selected:                   1
                    }
                ],
                density: 'small',
                task: 0
            };

            let c2s = {
                'cmd':                              'createMapInMapRequest',
                'cred':                             JSON.parse(localStorage.getItem('cred')),
                'newMap':                           newMap
            };
            communication.sender(c2s);
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // SERVER RELATED - RX
        // -------------------------------------------------------------------------------------------------------------
        case 'signInSuccess': {
            console.log('sign in success');
            let s2c =                               lastEvent.ref;
            var event = new CustomEvent(            // c2a communication is based on a hook which is triggered by an event
                "event",
                {
                    "detail": {
                        tabData: {
                            tabNames:               s2c.headerData.headerMapNameList,
                            tabId:                  s2c.headerData.headerMapSelected,
                        },
                    }
                });
            document.dispatchEvent(event);
            execute('openAfterInit');
            break;
        }
        case 'signInFail': {
            console.log('sign in fail');
            console.log(localStorage);
            break;
        }
        case 'signOutSuccess': {
            localStorage.clear();
            break;
        }
        case 'openMapSuccess': {
            let s2c =                               lastEvent.ref;
            lastUserMap =                           s2c.mapName;
            loadMap(s2c.mapStorage);
            rebuild();
            redraw();
            break;
        }
        case 'writeMapRequestSuccess': {
            console.log('file saved');
            break;
        }
        case 'createMapInMapSuccess': {
            let s2c =                               lastEvent.ref;
            lm.ilink =                         s2c.newMapId;
            break;
        }
        case 'imageSaveSuccess': {
            execute('newChild');
            rebuild();
            redraw();
            execute('insertImage');
            break;
        }
        case 'insertImage': {

            let sf2c =                              lastEvent.ref;

            lm.content =                       '_pic';
            lm.plink =                         sf2c.imageId;
            lm.selfWidthOverride =             sf2c.imageSize.width + 8;
            lm.selfHeightOverride =            sf2c.imageSize.height + 8;

            rebuild();
            redraw();
            break;
        }
    }
}
