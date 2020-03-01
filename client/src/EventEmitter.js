import {communication} from "./Communication";
import {initDim} from "./Dim";
import {currColorToPaint, eventRouter, lastEvent} from "./EventRouter";
import {mapMem, mapref, pathMerge, loadMap, saveMap, mapStorageOut} from "../map/Map";
import {hasCell} from "../node/Node";
import {structDeleteReselect, cellBlockDeleteReselect} from "../node/NodeDelete";
import {structInsert, cellInsert} from "../node/NodeInsert";
import {setClipboard, structMove} from "../node/NodeMove";
import {cellNavigate, structNavigate} from "../node/NodeNavigate";
import {applyMixedSelection,  applyStructSelection, clearCellSelection, clearStructSelection, getSelectionContext} from "../node/NodeSelect"
import {copy, setEndOfContenteditable, transposeArray} from "./Utils";
import {mapPrint} from "../map/MapPrint";

// these will be part of state
let headerData = {};
let lastUserMap = '';
let shouldAddToHistory = 0;

export function eventEmitter(command) {

    // console.log('eventEmitter: ' + command);

    let keyStr, sc, maxSel, lastPath, lm, geomHighPath, geomHighRef, geomLowPath, structSelectedPathList;

    if (lastEvent.type === 'windowKeyDown') {
        keyStr = lastEvent.ref.code;
    }

    let executeStateMachineDb = [
        ['cmd',                                        'usesS',                                 ],
        // open --------------------------------------------------------------------------------------------------------
        ['openMap',                                     0,                                      ],
        // select ------------------------------------------------------------------------------------------------------
        ['selectMeStruct',                              1,                                      ],
        ['selectMeStructToo',                           1,                                      ],
        ['selectForwardStruct',                         1,                                      ],
        ['selectForwardMixed',                          1,                                      ],
        ['selectBackwardStruct',                        1,                                      ],
        ['selectBackwardMixed',                         1,                                      ],
        ['selectNeighborMixed',                         1,                                      ],
        ['selectDownMixed',                             1,                                      ],
        ['selectRightMixed',                            1,                                      ],
        ['selectNeighborNode',                          1,                                      ],
        ['selectNeighborNodeToo',                       1,                                      ],
        ['selectCellRowMixed',                          1,                                      ],
        ['selectCellColMixed',                          1,                                      ],
        ['selectFirstMixed',                            1,                                      ],
        // insert ------------------------------------------------------------------------------------------------------
        ['newSiblingUp',                                1,                                      ],
        ['newSiblingDown',                              1,                                      ],
        ['newChild',                                    1,                                      ],
        ['newCellBlock',                                1,                                      ],
        // delete ------------------------------------------------------------------------------------------------------
        ['deleteNode',                                  1,                                      ],
        ['deleteCellBlock',                             1,                                      ],
        // move --------------------------------------------------------------------------------------------------------
        ['moveNodeSelection',                           1,                                      ],
        ['copySelection',                               1,                                      ],
        ['cutSelection',                                1,                                      ],
        // paste -------------------------------------------------------------------------------------------------------
        ['insertMapFromClipboard',                      1,                                      ],
        ['insertTextFromClipboardAsText',               1,                                      ],
        ['insertTextFromClipboardAsNode',               1,                                      ],
        ['insertElinkFromClipboardAsNode',              1,                                      ],
        ['insertEquationFromClipboardAsNode',           1,                                      ],
        ['insertImageFromLinkAsNode',                   1,                                      ],
        ['insertIlinkFromMongo',                        1,                                      ],
        // edit --------------------------------------------------------------------------------------------------------
        ['eraseContent',                                1,                                      ],
        ['typeText',                                    1,                                      ],
        ['startEdit',                                   1,                                      ],
        ['finishEdit',                                  1,                                      ],
        // misc --------------------------------------------------------------------------------------------------------
        ['cellifyMulti',                                1,                                      ],
        ['transpose',                                   1,                                      ],
        ['makeGrid',                                    1,                                      ],
        ['applyColor',                                  1,                                      ],
        ['applyParameter',                              1,                                      ],
        ['prettyPrint',                                 1,                                      ],
        // server tx ---------------------------------------------------------------------------------------------------
        ['signIn',                                      0,                                      ],
        ['signOut',                                     0,                                      ],
        ['openAfterInit ',                              0,                                      ],
        ['openAfterTabSelect',                          0,                                      ],
        ['openAfterNodeSelect',                         1,                                      ],
        ['openAfterHistory',                            0,                                      ],
        ['save',                                        0,                                      ],
        ['createMapInTab',                              0,                                      ],
        ['createMapInMap',                              1,                                      ],
        // server fetch tx ---------------------------------------------------------------------------------------------
        ['sendImage',                                   0,                                      ],
        // to material -------------------------------------------------------------------------------------------------
        ['updateReactTabs',                             0,                                      ],
    ];

    let executeStateMachine = {};
    for (let i = 0; i < executeStateMachineDb.length; i++) {
        for (let h = 0; h < executeStateMachineDb[0].length; h++) {
            executeStateMachine[executeStateMachineDb[0][h]] = executeStateMachineDb[i][h];
        }

        if (executeStateMachine.cmd === command &&
            executeStateMachine.usesS === 1) {

            sc = getSelectionContext();
            maxSel = sc.maxSel;
            lastPath = sc.lastPath;
            lm = sc.lm;
            geomHighPath = sc.geomHighPath;
            geomHighRef = sc.geomHighRef;
            geomLowPath = sc.geomLowPath;
            // geomLowRef = sc.geomLowRef;
            structSelectedPathList = sc.structSelectedPathList;
        }
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
        case 'selectCellRowMixed': {
            clearStructSelection();
            clearCellSelection();
            let parentRef =                         mapref(lm.parentPath);
            let parentParentRef =                   mapref(parentRef.parentPath);
            let currRow =                           parentRef.index[0];
            let colLen =                            parentParentRef.c[0].length;
            for (let i = 0; i < colLen; i++) {
                parentParentRef.c[currRow][i].selected = 1;
                parentParentRef.c[currRow][i].s[0].selected = 1;
            }
            break;
        }
        case 'selectCellColMixed': {
            clearStructSelection();
            clearCellSelection();
            let parentRef =                         mapref(lm.parentPath);
            let parentParentRef =                   mapref(parentRef.parentPath);
            let currCol =                           parentRef.index[1];
            let rowLen =                            parentParentRef.c.length;
            for (let i = 0; i < rowLen; i++) {
                parentParentRef.c[i][currCol].selected = 1;
                parentParentRef.c[i][currCol].s[0].selected = 1;
            }
            break;
        }
        case 'selectFirstMixed': {
            let geomHighRefParentRef = mapref(geomHighRef.parentPath);
            applyMixedSelection(geomHighRefParentRef.path);
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
        // MISC
        // -------------------------------------------------------------------------------------------------------------
        case 'cellifyMulti': {
            structMove(sc, 'struct2cell', 'multiRow');
            break;
        }
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
        case 'applyColor': {
            for (let i = 0; i < structSelectedPathList.length; i++) {
                let cm = mapref(structSelectedPathList[i]);
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
        case 'applyParameter': {
            lm.sTextColor = '#8e1c8e';
            break;
        }
        case 'prettyPrint': {
            mapPrint.start(lm);
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
                    eventRouter.processEvent({
                        type:                       'serverFetchEvent',
                        ref:                        sf2c,
                    });
                });
            });
            break;
        }
        // -------------------------------------------------------------------------------------------------------------
        // TO MATERIAL
        // -------------------------------------------------------------------------------------------------------------
        case 'updateReactTabs': {
            let s2c =                               lastEvent.ref;
            document.dispatchEvent(new CustomEvent( 'toMaterial', {
                'detail': {
                    tabData: {
                        tabNames:                       s2c.headerData.headerMapNameList,
                        tabId:                          s2c.headerData.headerMapSelected,
                    }
                }}));
            break;
        }
    }
}
