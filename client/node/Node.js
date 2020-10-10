import {getBgc} from '../core/Utils'

export let props = {
    saveAlways: {
        path:                                   [],
        d:                                      [],
        s:                                      [],
        c:                                      [[]],
    },
    saveOptional: {
        contentType:                            'text',
        content:                                '',
        linkType:                               '',
        link:                                   '',
        imageW:                                 0,
        imageH:                                 0,
        sTextColor:                             '#222222',
        sTextFontSize:                          14,
        cBorderColor:                           '#50dfff',
        selected:                               0,
        lastSelectedChild:                      -1, // -1 means not selected ever
        lineColor:                              '#bbbbbb',
        ellipseFill:                            0,
        ellipseBorderColor:                     '#ffffff',
        ellipseFillColor:                       getBgc(),
        ellipseLineWidth:                       1,
        taskStatus:                             -1,
    },
    saveNever: {
        initOnce: {
            // UNSORTED
            isEditing:                          0,
            parentNodeEndXFrom:                 0,
            parentNodeEndYFrom:                 0,
            parentNodeStartXFrom:               0,
            parentNodeStartYFrom:               0,
            twoStepAnimationRequested:          0,
            // mapMeasure
            isDimAssigned:                      0,
            contentW:                           0,
            contentH:                           0,
            // mapTaskCalc
            taskStatusInherited:                0,
            // mapDivVisualize
            divId:                              '',
            // mapSvgVisualize
            svgId:                              '',
        },
        initAlways: {
            // mapChain
            isRoot:                             0,
            isRootChild:                        0,
            parentPath:                         [],
            type:                               '',
            parentType:                         '',
            parentParentType:                   '',
            childType:                          '',
            index:                              [],
            // mapMeasure
            selfW:                              0,
            selfH:                              0,
            familyW:                            0,
            familyH:                            0,
            maxColWidth:                        [],
            maxRowHeight:                       [],
            sumMaxColWidth:                     [0],
            sumMaxRowHeight:                    [0],
            maxW:                               0,
            maxH:                               0,
            spacing:                            10,
            spacingActivated:                   0,
            // mapPlace
            parentNodeStartX:                   0,
            parentNodeStartY:                   0,
            parentNodeEndX:                     0,
            parentNodeEndY:                     0,
            lineDeltaX:                         0,
            lineDeltaY:                         0,
            nodeStartX:                         0,
            nodeStartY:                         0,
            nodeEndX:                           0,
            nodeEndY:                           0,
        }
    }
};

export function getDefaultNode(attributes) {
    let defaultNode = { ...{c: [[]], s: [], d:[], content: ''}, ...attributes}; // simply return this as it copies already
    return JSON.parse(JSON.stringify(defaultNode));
}
