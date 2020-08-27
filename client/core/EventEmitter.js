import {communication} from "./Communication";
import {currColorToPaint, eventRouter, lastEvent} from "./EventRouter";
import {mapMem, mapref, pathMerge, loadMap, saveMap, mapStorageOut} from "../map/Map";
import {hasCell} from "../node/Node";
import {structDeleteReselect, cellBlockDeleteReselect} from "../node/NodeDelete";
import {structInsert, cellInsert} from "../node/NodeInsert";
import {setClipboard, structMove} from "../node/NodeMove";
import {cellNavigate, structNavigate} from "../node/NodeNavigate";
import {applyMixedSelection,  applyStructSelection, clearCellSelection, clearStructSelection, getSelectionContext} from "../node/NodeSelect"
import {copy, genHash, setEndOfContenteditable, transposeArray} from "./Utils";
import {mapPrint} from "../map/MapPrint";
import {eventLut} from "./EventLut";

// these will be part of state
let headerData = {};
let lastUserMap = '';
let shouldAddToHistory = 0;
let observer;

export function eventEmitter(command) {

    // console.log('eventEmitter: ' + command);

    let keyStr, sc;

    if (lastEvent.type === 'windowKeyDown') {
        keyStr = lastEvent.ref.code;
    }

    if (eventLut.shouldUseSelection(command)) {
        sc = getSelectionContext();
    }

    switch (command) {
        // -------------------------------------------------------------------------------------------------------------
        // OPEN
        // -------------------------------------------------------------------------------------------------------------
        case 'openMap': {
            let s2c = lastEvent.ref;
            lastUserMap = s2c.mapName;

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
            mapref(mapMem.deepestSelectablePath).selected = sc.maxSel + 1;
            break;
        }
        case 'selectForwardStruct': {
            if (hasCell(sc.lm)) {
                applyMixedSelection(pathMerge(sc.lastPath, ['c', 0, 0]));
            }
            break;
        }
        case 'selectForwardMixed': {
            clearCellSelection();
            break;
        }
        case 'selectBackwardStruct': {
            for (let i = sc.lm.path.length - 2; i > 0; i--) {
                if (Number.isInteger(sc.lm.path[i]) &&
                    Number.isInteger(sc.lm.path[i + 1])) {
                    applyMixedSelection(sc.lm.path.slice(0, i + 2));
                    break;
                }
            }
            break;
        }
        case 'selectBackwardMixed': {
            let parentRef = mapref(sc.lm.parentPath);
            let parentParentRef = mapref(parentRef.parentPath);
            applyStructSelection(parentParentRef.path);
            break;
        }
        case 'selectNeighborMixed': {
            applyMixedSelection(cellNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), keyStr));
            break;
        }
        case 'selectDownMixed': {
            applyMixedSelection(cellNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), 'ArrowDown'));
            break;
        }
        case 'selectRightMixed': {
            applyMixedSelection(cellNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), 'ArrowRight'));
            break;
        }
        case 'selectNeighborNode': {
            let toPath = [];
            if (keyStr === 'ArrowUp') {
                toPath = sc.geomHighPath
            } else if (keyStr === 'ArrowDown') {
                toPath = sc.geomLowPath
            } else {
                toPath = sc.lastPath
            }
            applyStructSelection(structNavigate(toPath, keyStr));
            break;
        }
        case 'selectNeighborNodeToo': {
            mapref(structNavigate(sc.lastPath, keyStr)).selected = sc.maxSel + 1;
            break;
        }
        case 'selectCellRowMixed': {
            clearStructSelection();
            clearCellSelection();
            let parentRef = mapref(sc.lm.parentPath);
            let parentParentRef = mapref(parentRef.parentPath);
            let currRow = parentRef.index[0];
            let colLen = parentParentRef.c[0].length;
            for (let i = 0; i < colLen; i++) {
                parentParentRef.c[currRow][i].selected = 1;
                parentParentRef.c[currRow][i].s[0].selected = 1;
            }
            break;
        }
        case 'selectCellColMixed': {
            clearStructSelection();
            clearCellSelection();
            let parentRef = mapref(sc.lm.parentPath);
            let parentParentRef = mapref(parentRef.parentPath);
            let currCol = parentRef.index[1];
            let rowLen = parentParentRef.c.length;
            for (let i = 0; i < rowLen; i++) {
                parentParentRef.c[i][currCol].selected = 1;
                parentParentRef.c[i][currCol].s[0].selected = 1;
            }
            break;
        }
        case 'selectFirstMixed': {
            let geomHighRefParentRef = mapref(sc.geomHighRef.parentPath);
            applyMixedSelection(geomHighRefParentRef.path);
            break;
        }
        case 'selectRoot': {
            clearStructSelection();
            clearCellSelection();
            mapMem.getData().s[0].selected = 1;
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // INSERT
        // -------------------------------------------------------------------------------------------------------------
        case 'newSiblingUp': {
            structInsert(sc.lm, 'up');
            break;
        }
        case 'newSiblingDown': {
            structInsert(sc.lm, 'down');
            break;
        }
        case 'newChild': {
            structInsert(sc.lm, 'right');
            break;
        }
        case 'newCellBlock': {
            cellInsert(sc.lastPath.slice(0, sc.lastPath.length - 2), keyStr);
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // DELETE
        // -------------------------------------------------------------------------------------------------------------
        case 'deleteNode': {
            structDeleteReselect(sc);
            break;
        }
        case 'deleteCellBlock': {
            cellBlockDeleteReselect(sc.lm);
            break;
        }
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
            sc.lm.contentType = 'text';
            sc.lm.content = lastEvent.props.data;
            sc.lm.isDimAssigned = 0;
            break;
        }
        case 'insertElinkFromClipboardAsNode': {
            sc.lm.contentType = 'text';
            sc.lm.content = lastEvent.props.data;
            sc.lm.linkType = 'external';
            sc.lm.link = lastEvent.props.data;
            sc.lm.isDimAssigned = 0;
            break;
        }
        case 'insertIlinkFromMongo': {
            let s2c = lastEvent.ref;
            sc.lm.linkType = 'internal';
            sc.lm.link = s2c.newMapId;
            sc.lm.isDimAssigned = 0;
            break;
        }
        case 'insertEquationFromClipboardAsNode': {
            sc.lm.contentType = 'equation';
            sc.lm.content = lastEvent.props.data;
            sc.lm.isDimAssigned = 0;
            break;
        }
        case 'insertImageFromLinkAsNode': {
            let sf2c = lastEvent.ref;
            sc.lm.contentType = 'image';
            sc.lm.content = sf2c.imageId;
            sc.lm.imageW = sf2c.imageSize.width;
            sc.lm.imageH = sf2c.imageSize.height;
            break;
        }
        case 'insertMapFromClipboard': {
            let text = lastEvent.props.data;
            setClipboard(JSON.parse(text));
            structMove(sc, 'clipboard2struct', 'PASTE');
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // EDIT
        // -------------------------------------------------------------------------------------------------------------
        case 'eraseContent': {
            sc.lm.content = '';
            let holderElement = document.getElementById(sc.lm.divId);
            holderElement.innerHTML = '';
            break;
        }
        case 'startEdit': {
            let holderElement = document.getElementById(sc.lm.divId);
            holderElement.contentEditable = 'true';
            setEndOfContenteditable(holderElement);
            eventRouter.isEditing = 1;
            sc.lm.isEditing = 1;

            const config = { attributes: false, childList: false, subtree:true, characterData:true };
            const callback = function(mutationsList, observer) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'characterData') {
                        eventRouter.processEvent({
                            type: 'typeTextEvent'
                        });
                    }
                }
            };
            observer = new MutationObserver(callback);
            observer.observe(holderElement, config);
            break;
        }
        case 'typeText': {
            let holderElement = document.getElementById(sc.lm.divId);
            sc.lm.content = holderElement.innerHTML;
            sc.lm.isDimAssigned = 0;
            break;
        }
        case 'finishEdit' : {
            observer.disconnect();
            let holderElement = document.getElementById(sc.lm.divId);
            holderElement.contentEditable = 'false';
            sc.lm.isEditing = 0;
            eventRouter.isEditing = 0;
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // MISC
        // -------------------------------------------------------------------------------------------------------------
        case 'cellifyMulti': {
            structMove(sc, 'struct2cell', 'multiRow');
            break;
        }
        case 'transposeMe': {
            if (hasCell(sc.lm)) {
                sc.lm.c = transposeArray(sc.lm.c);
            }
            break;
        }
        case 'transpose': {
            sc.lm.c = transposeArray(sc.lm.c);
            break;
        }
        case 'applyColor': {
            for (let i = 0; i < sc.structSelectedPathList.length; i++) {
                let cm = mapref(sc.structSelectedPathList[i]);
                switch (currColorToPaint) {
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
        case 'prettyPrint': {
            mapPrint.start(sc.lm);
            break;
        }

        case 'redo': {
            if (mapMem.dataIndex < mapMem.data.length - 1) {
                mapMem.dataIndex++;
            }
            break;
        }

        case 'undo': {
            if (mapMem.dataIndex > 0) {
                mapMem.dataIndex--;
            }
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // SERVER TX
        // -------------------------------------------------------------------------------------------------------------
        case 'signInAuto': {
            if (JSON.parse(localStorage.getItem('cred')) !== null) {
                console.log('sign in auto attempt');
                communication.sender({
                    'cmd': 'signInRequest',
                    'cred': JSON.parse(localStorage.getItem('cred')),
                });
            }
            break;
        }
        case 'signIn': {
            localStorage.setItem('cred', JSON.stringify({
                name: lastEvent.ref.user,
                pass: lastEvent.ref.pass,
            }));
            communication.sender({
                'cmd': 'signInRequest',
                'cred': JSON.parse(localStorage.getItem('cred')),
            });
            break;
        }
        case 'signOut': {
            localStorage.setItem('cred', null);
            communication.sender({
                'cmd': 'signOutRequest',
                'cred': JSON.parse(localStorage.getItem('cred')),
            });
            break;
        }
        case 'openAfterInit': {
            shouldAddToHistory = 1;
            communication.sender({
                'cmd': 'openMapRequest',
                'cred': JSON.parse(localStorage.getItem('cred')),
                'mapName': headerData.headerMapIdList[headerData.headerMapSelected]
            });
            break;
        }
        case 'openAfterTabSelect': {
            shouldAddToHistory = 1;
            communication.sender({
                'cmd': 'openMapRequest',
                'cred': JSON.parse(localStorage.getItem('cred')),
                'mapName': headerData.headerMapIdList[lastEvent.ref.tabId]
            });
            break;
        }
        case 'openAfterNodeSelect': {
            shouldAddToHistory = 1;
            if(sc.lm.linkType === 'internal') {
                communication.sender({
                    'cmd': 'openMapRequest',
                    'cred': JSON.parse(localStorage.getItem('cred')),
                    'mapName': sc.lm.link
                });
            } else if (sc.lm.linkType === 'external') {
                window.open(sc.lm.link, '_blank');
                window.focus();
            }
            break;
        }
        case 'openAfterHistory': {
            shouldAddToHistory = 0;
            communication.sender({
                'cmd': 'openMapRequest',
                'cred': JSON.parse(localStorage.getItem('cred')),
                'mapName': lastEvent.ref.state.lastUserMap
            });
            break;
        }
        case 'save': {
            saveMap();
            communication.sender({
                cmd: 'writeMapRequest',
                cred: JSON.parse(localStorage.getItem('cred')),
                mapName: lastUserMap,
                mapStorage: mapStorageOut
            });
            break;
        }
        case 'createMapInTab': {
            communication.sender({
                'cmd': 'createMapInTabRequest',
                'cred': JSON.parse(localStorage.getItem('cred')),
                'newMap': {
                    data: [{
                        path: ['s', 0],
                        content: 'New map ' + genHash(4),
                        selected: 1
                    }],
                    density: 'large',
                    task: lastEvent.ref.task
                }
            });
            break;
        }
        case 'createMapInMap': {
            communication.sender({
                'cmd': 'createMapInMapRequest',
                'cred': JSON.parse(localStorage.getItem('cred')),
                'newMap': {
                    data: [{
                        path: ['s', 0],
                        content: sc.lm.content,
                        selected: 1
                    }],
                    density: 'large',
                    task: 0
                }
            });
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // SERVER FETCH TX
        // -------------------------------------------------------------------------------------------------------------
        case 'sendImage': {
            var formData = new FormData();
            formData.append('upl', lastEvent.props.data, 'image.png');
            let address = process.env.NODE_ENV === 'development'? 'http://127.0.0.1:8082/feta' : 'https://mindboard.io/feta';
            fetch(address, {
                method:     'post',
                body:       formData
            }).then(function(response) {
                response.json().then(function(sf2c) {
                    eventRouter.processEvent({
                        type: 'serverFetchEvent',
                        ref: sf2c,
                    });
                });
            });
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // TO MATERIAL
        // -------------------------------------------------------------------------------------------------------------
        case 'updatePageToWorkspace': {
            document.dispatchEvent(new CustomEvent( 'toPage', {
                'detail': {
                    isLoggedIn: true
                }}));
            break;
        }
        case 'updatePageToSignIn': {
            document.dispatchEvent(new CustomEvent( 'toPage', {
                'detail': {
                    isLoggedIn: false
                }}));
            break;
        }
        case 'updateTabs': {
            headerData = copy(lastEvent.ref.headerData);
            document.dispatchEvent(new CustomEvent( 'toMaterial', {
                'detail': {
                    tabData: {
                        tabNames: lastEvent.ref.headerData.headerMapNameList,
                        tabId: lastEvent.ref.headerData.headerMapSelected,
                    }
                }}));
            break;
        }
    }
}
