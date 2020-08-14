export const eventLut = {
    shouldUseSelection: (cmd) => {

        let retVal = 0;

        let executeStateMachineDb = [
            ['cmd', 'usesS',],
            // open
            ['openMap', 0,],
            // select
            ['selectMeStruct', 1,],
            ['selectMeStructToo', 1,],
            ['selectForwardStruct', 1,],
            ['selectForwardMixed', 1,],
            ['selectBackwardStruct', 1,],
            ['selectBackwardMixed', 1,],
            ['selectNeighborMixed', 1,],
            ['selectDownMixed', 1,],
            ['selectRightMixed', 1,],
            ['selectNeighborNode', 1,],
            ['selectNeighborNodeToo', 1,],
            ['selectCellRowMixed', 1,],
            ['selectCellColMixed', 1,],
            ['selectFirstMixed', 1,],
            // insert
            ['newSiblingUp', 1,],
            ['newSiblingDown', 1,],
            ['newChild', 1,],
            ['newCellBlock', 1,],
            // delete
            ['deleteNode', 1,],
            ['deleteCellBlock', 1,],
            // move
            ['moveNodeSelection', 1,],
            ['copySelection', 1,],
            ['cutSelection', 1,],
            // paste
            ['insertMapFromClipboard', 1,],
            ['insertTextFromClipboardAsText', 1,],
            ['insertTextFromClipboardAsNode', 1,],
            ['insertElinkFromClipboardAsNode', 1,],
            ['insertEquationFromClipboardAsNode', 1,],
            ['insertImageFromLinkAsNode', 1,],
            ['insertIlinkFromMongo', 1,],
            // edit
            ['eraseContent', 1,],
            ['typeText', 1,],
            ['typeTextRendered', 1,],
            ['startEdit', 1,],
            ['finishEdit', 1,],
            // misc
            ['cellifyMulti', 1,],
            ['transpose', 1,],
            ['applyColor', 1,],
            ['prettyPrint', 1,],
            ['redo', 0,],
            ['undo', 0,],
            // server tx
            ['signIn', 0,],
            ['signOut', 0,],
            ['openAfterInit ', 0,],
            ['openAfterTabSelect', 0,],
            ['openAfterNodeSelect', 1,],
            ['openAfterHistory', 0,],
            ['save', 0,],
            ['createMapInTab', 0,],
            ['createMapInMap', 1,],
            // server fetch tx
            ['sendImage', 0,],
            // to components
            ['updateReactTabs', 0,],
        ];

        let executeStateMachine = {};
        for (let i = 0; i < executeStateMachineDb.length; i++) {
            for (let h = 0; h < executeStateMachineDb[0].length; h++) {
                executeStateMachine[executeStateMachineDb[0][h]] = executeStateMachineDb[i][h];
            }

            if (executeStateMachine.cmd === cmd &&
                executeStateMachine.usesS === 1) {
                retVal = 1;
            }
        }
        
        return retVal;
    }
};
