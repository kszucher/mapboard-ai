import {initDim}                                                                                from "./Dim";
import {communication}                                                                          from "./Communication";
import {eventListener, lastEvent}                                                               from "./EventListener"
import {eventRouter}                                                                            from "./EventRouter";
import {mapMem, mapref, pathMerge, loadMap, saveMap, mapStorageOut}                             from "./Map";
import {hasCell}                                                                                from "./Node";
import {cellNavigate, structNavigate}                                                           from "./NodeNavigate";
import {applyMixedSelection, applyStructSelection, clearCellSelection, getSelectionContext}     from "./NodeSelect"
import {structInsert, cellInsert}                                                               from "./NodeInsert";
import {structDeleteReselect, cellBlockDeleteReselect}                                          from "./NodeDelete";
import {setClipboard, structMove}                                                               from "./NodeMove";
import {copy, setEndOfContenteditable, transposeArray}                                          from "./Utils";

// these will be part of state
let headerData = {};
let lastUserMap = '';
let shouldAddToHistory = 0;

export function execute(command) {

    // console.log('execute: ' + command);

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
        'insertMapFromClipboard',
        'insertTextFromClipboardAsText',
        'insertTextFromClipboardAsNode',
        'insertElinkFromClipboardAsNode',
        'insertEquationFromClipboardAsNode',
        'insertImageFromLinkAsNode',
        'insertIlinkFromMongo',
        'cellifyMulti',
        'transposeMe',
        'transpose',
        'makeGrid',
        'openAfterNodeSelect',
        'polygonFill',
        'createMapInMap',
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
        // OPEN
        // -------------------------------------------------------------------------------------------------------------
        case 'openMap': {
            let s2c =                               lastEvent.ref;
            lastUserMap =                           s2c.mapName;

            if (shouldAddToHistory === 1) {
                let stateObj = {lastUserMap: lastUserMap};
                history.pushState(stateObj, lastUserMap, '');
            }
            loadMap(s2c.mapStorage);
            break;
        }
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
            lm.isDimAssigned = 0;

            eventRouter.isEditing = 0;
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // INSERT
        // -------------------------------------------------------------------------------------------------------------
        case 'newSiblingUp':                        structInsert(lm, 'up');                                     break;
        case 'newSiblingDown':                      structInsert(lm, 'down');                                   break;
        case 'newChild':                            structInsert(lm, 'right');                                  break;
        case 'newCellBlock':                        cellInsert(lastPath.slice(0, lastPath.length -2), keyStr);  break;
        // -------------------------------------------------------------------------------------------------------------
        // DELETE
        // -------------------------------------------------------------------------------------------------------------
        case 'deleteNode':                          structDeleteReselect(sc);                                   break;
        case 'deleteCellBlock':                     cellBlockDeleteReselect(lm);                                break;
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
        // -------------------------------------------------------------------------------------------------------------
        // PASTE
        // -------------------------------------------------------------------------------------------------------------
        case 'insertTextFromClipboardAsText': {
            document.execCommand("insertHTML", false, lastEvent.props.data);
            break;
        }
        case 'insertTextFromClipboardAsNode': {
            lm.contentType =                        'text';
            lm.content =                            lastEvent.props.data;
            lm.isDimAssigned =                      0;
            lm.isContentAssigned =                  0;
            break;
        }
        case 'insertElinkFromClipboardAsNode': {
            lm.contentType =                        'text';
            lm.content =                            lastEvent.props.data;
            lm.linkType =                           'external';
            lm.link =                               lastEvent.props.data;
            lm.isDimAssigned =                      0;
            lm.isContentAssigned =                  0;
            break;
        }
        case 'insertIlinkFromMongo': {
            let s2c =                               lastEvent.ref;
            lm.linkType =                           'internal';
            lm.link =                               s2c.newMapId;
            lm.isDimAssigned =                      0;
            lm.isContentAssigned =                  0;
            break;
        }
        case 'insertEquationFromClipboardAsNode': {
            lm.contentType =                        'equation';
            lm.content =                            lastEvent.props.data;
            lm.isDimAssigned =                      0;
            lm.isContentAssigned =                  0;
            break;
        }
        case 'insertImageFromLinkAsNode': {
            let sf2c =                              lastEvent.ref;
            lm.contentType =                        'image';
            lm.content =                            sf2c.imageId;
            lm.imageW =                             sf2c.imageSize.width;
            lm.imageH =                             sf2c.imageSize.height;
            break;
        }
        case 'insertMapFromClipboard': {
            let text = lastEvent.props.data;
            setClipboard(JSON.parse(text));
            structMove(sc, 'clipboard2struct', 'PASTE');
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
        case 'polygonFill': {
            lm.polygonFill = 1;
            lm.polygonLineWidth = 1;
            lm.polygonBorderColor = '#00ffff';
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // REACT TX
        // -------------------------------------------------------------------------------------------------------------
        case 'updateReactTabs': {
            let s2c =                               lastEvent.ref;
            let c2r = {
                tabData: {
                    tabNames:                       s2c.headerData.headerMapNameList,
                    tabId:                          s2c.headerData.headerMapSelected,
                }
            };
            document.dispatchEvent(new CustomEvent( "event", {"detail": c2r}));
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // SERVER TX
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
            shouldAddToHistory = 1;
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
            shouldAddToHistory = 1;
            let c2s = {
                'cmd':                              'openMapRequest',
                'cred':                             JSON.parse(localStorage.getItem('cred')),
                'mapName':                          headerData.headerMapIdList[lastEvent.ref.tabId]
            };
            communication.sender(c2s);
            break;
        }
        case 'openAfterNodeSelect': {
            shouldAddToHistory = 1;
            if(lm.linkType === 'internal') {
                let c2s = {
                    'cmd':                          'openMapRequest',
                    'cred':                         JSON.parse(localStorage.getItem('cred')),
                    'mapName':                      lm.link
                };
                communication.sender(c2s);
            }
            else if (lm.linkType === 'external') {
                window.open(lm.link, '_blank');
                window.focus();
            }
            break;
        }
        case 'openAfterHistory': {
            shouldAddToHistory = 0;
            let c2s = {
                'cmd':                              'openMapRequest',
                'cred':                             JSON.parse(localStorage.getItem('cred')),
                'mapName':                          lastEvent.ref.state.lastUserMap
            };
            communication.sender(c2s);
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
        // SERVER FETCH TX
        // -------------------------------------------------------------------------------------------------------------
        case 'sendImage': {
            var formData = new FormData();
            formData.append('upl', lastEvent.props.data, 'image.png');

            fetch('http://127.0.0.1:8082/feta', {
                method:     'post',
                body:       formData
            }).then(function(response) {
                response.json().then(function(sf2c) {
                    eventListener.receiveFromServerFetch(sf2c)
                });
            });
            break;
        }
    }
}
