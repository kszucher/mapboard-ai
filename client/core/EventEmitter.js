import {communication} from "./Communication";
import {currColorToPaint, eventRouter, lastEvent} from "./EventRouter";
import {mapMem, mapref, pathMerge, loadMap, saveMap} from "../map/Map";
import {structDeleteReselect, cellBlockDeleteReselect} from "../node/NodeDelete";
import {structInsert, cellInsert} from "../node/NodeInsert";
import {setClipboard, structMove} from "../node/NodeMove";
import {cellNavigate, structNavigate} from "../node/NodeNavigate";
import {clearCellSelectionContext, clearStructSelectionContext, getSelectionContext} from "../node/NodeSelect"
import {copy, genHash, setEndOfContenteditable, transposeArray} from "./Utils";
import {mapPrint} from "../map/MapPrint";
import {remoteDispatch, remoteGetState} from "./Store";

let mutationObserver;

export function eventEmitter(command) {
    // console.log('emit: ' + command);

    let keyStr;
    if (lastEvent.type === 'windowKeyDown') {
        keyStr = lastEvent.ref.code;
    }

    let sc;
    if (!['undo', 'redo', 'createMapInTab', 'save', 'sendImage', 'updateTabs'].includes(command)) {
        try {
            sc = getSelectionContext();
        }
        catch {
            console.log('selection context not available using command:' + command);
        }
    }

    switch (command) {
        // -------------------------------------------------------------------------------------------------------------
        // SELECT
        // -------------------------------------------------------------------------------------------------------------
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
            if (sc.lm.childType === 'cell') {
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
            for (let i = sc.lm.path.length - 2; i > 0; i--) {
                if (Number.isInteger(sc.lm.path[i]) &&
                    Number.isInteger(sc.lm.path[i + 1])) {
                    clearStructSelectionContext();
                    clearCellSelectionContext();
                    let toPath = sc.lm.path.slice(0, i + 2);
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
            mapref(mapref(mapref(sc.lm.parentPath).parentPath).path).selected = 1;
            break;
        }
        case 'selectNeighborMixed': {
            clearStructSelectionContext();
            clearCellSelectionContext();
            let toPath = cellNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), keyStr);
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
            if (keyStr === 'ArrowUp') fromPath = sc.geomHighPath;
            if (keyStr === 'ArrowDown') fromPath = sc.geomLowPath;
            let toPath = structNavigate(fromPath, keyStr);
            mapref(toPath).selected = 1;
            break;
        }
        case 'selectNeighborNodeToo': {
            mapref(structNavigate(sc.lastPath, keyStr)).selected = sc.maxSel + 1;
            break;
        }
        case 'selectCellRow': {
            clearStructSelectionContext();
            clearCellSelectionContext();
            let parentRef = mapref(sc.lm.parentPath);
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
            let parentRef = mapref(sc.lm.parentPath);
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
        // -------------------------------------------------------------------------------------------------------------
        // INSERT
        // -------------------------------------------------------------------------------------------------------------
        case 'newSiblingUp': {
            clearStructSelectionContext();
            structInsert(sc.lm, 'siblingUp');
            break;
        }
        case 'newSiblingDown': {
            clearStructSelectionContext();
            structInsert(sc.lm, 'siblingDown');
            break;
        }
        case 'newChild': {
            clearStructSelectionContext();
            structInsert(sc.lm, 'child');
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
            cellBlockDeleteReselect(sc);
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
            structDeleteReselect(sc);
            break;
        }
        case 'cellifyMulti': {
            structMove(sc, 'struct2cell', 'multiRow');
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
            clearStructSelectionContext();
            clearCellSelectionContext();
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
            const callback = function(mutationsList) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'characterData') {
                        eventRouter.processEvent({
                            type: 'typeTextEvent'
                        });
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
            break;
        }
        case 'typeText': {
            let holderElement = document.getElementById(sc.lm.divId);
            sc.lm.content = holderElement.innerHTML;
            sc.lm.isDimAssigned = 0;
            break;
        }
        case 'finishEdit' : {
            mutationObserver.disconnect();
            let holderElement = document.getElementById(sc.lm.divId);
            holderElement.contentEditable = 'false';
            sc.lm.isEditing = 0;
            eventRouter.isEditing = 0;
            if (sc.lm.content.substring(0, 2) === '\\[') {
                sc.lm.contentType = 'equation';
                sc.lm.isDimAssigned = 0;
            }
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // FORMAT
        // -------------------------------------------------------------------------------------------------------------
        case 'mapAttributeDensitySmall': {
            mapMem.density = 'small';
            break;
        }
        case 'mapAttributeDensityLarge': {
            mapMem.density = 'large';
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
        case 'transposeMe': {
            if (sc.lm.childType === 'cell') {
                sc.lm.c = transposeArray(sc.lm.c);
            }
            break;
        }
        case 'transpose': {
            sc.lm.c = transposeArray(sc.lm.c);
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // UNDO-REDO
        // -------------------------------------------------------------------------------------------------------------
        case 'undo': {
            if (mapMem.dataIndex > 0) {
                mapMem.dataIndex--;
            }
            break;
        }
        case 'redo': {
            if (mapMem.dataIndex < mapMem.data.length - 1) {
                mapMem.dataIndex++;
            }
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // EXPORT
        // -------------------------------------------------------------------------------------------------------------
        case 'prettyPrint': {
            mapPrint.start(sc.lm);
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // TO SERVER
        // -------------------------------------------------------------------------------------------------------------
        case 'openLink': {
            if(sc.lm.linkType === 'internal') {
                remoteDispatch({
                    type: 'SET_MAP_ID',
                    payload: {
                        mapId: sc.lm.link,
                        mapName: sc.lm.content,
                        pushHistory: true,
                        breadcrumbsOp: 'push'
                    }
                })
            } else if (sc.lm.linkType === 'external') {
                window.open(sc.lm.link, '_blank');
                window.focus();
            }
            break;
        }
        case 'openAfterHistory': {
            remoteDispatch({type: 'SET_MAP_ID', payload: {
                    mapId: lastEvent.ref.state.mapId,
                    mapName: mapMem.getData().r[0].content,
                    pushHistory: false,
                    breadcrumbsOp: 'x'}});
            break;
        }
        case 'createMapInTab': {
            communication.sender({
                'cmd': 'createMapInTabRequest',
                'cred': JSON.parse(localStorage.getItem('cred')),
                'newMap': {
                    data: [
                        {
                            path: ['r'],
                            content: 'New map ' + genHash(4),
                            selected: 1
                        },
                        {
                            path: ['r', 'd', 0],
                        },
                        {
                            path: ['r', 'd', 0, 's', 0],
                            content: 'x'
                        }
                    ],
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
                    data: [
                        {
                            path: ['r'],
                            content: sc.lm.content,
                            selected: 1
                        },
                        {
                            path: ['r', 'd', 0],
                        },
                        {
                            path: ['r', 'd', 0, 's', 0],
                            content: 'x'
                        }
                    ],
                    density: 'large',
                    task: 0
                }
            });
            break;
        }
        case 'save': {
            saveMap();
            remoteDispatch({type: 'SAVE_MAP'});
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // TO FETCH SERVER
        // -------------------------------------------------------------------------------------------------------------
        case 'sendImage': {
            var formData = new FormData();
            formData.append('upl', lastEvent.props.data, 'image.png');
            let address = process.env.NODE_ENV === 'development'?
                'http://127.0.0.1:8082/feta' :
                'https://mindboard.io/feta';
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
    }
}
