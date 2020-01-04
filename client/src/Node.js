import {getBgc}                                 from './Utils'

export let props = {
    saveOptional: {
        path:                                   [],

        contentType:                            'text',
        content:                                '',

        linkType:                               '',
        link:                                   '',

        imageW:                                 0,
        imageH:                                 0,

        s:                                      [],
        sTextColor:                             '#222222',
        sTextFontSize:                          14,

        c:                                      [[]],
        cBorderColor:                           '#50dfff',

        selected:                               0,
        lastSelectedChild:                      -1, // -1 means not selected ever

        lineColor:                              '#bbbbbb',

        polygonFill:                            0,
        polygonBorderColor:                     '#50dfff',
        polygonFillColor:                       getBgc(),
        polygonLineWidth:                       1,

        ellipseFill:                            0,
        ellipseBorderColor:                     '#ffffff',
        ellipseFillColor:                       getBgc(),
        ellipseLineWidth:                       1,

        taskStatus:                             -1,
    },
    saveNever: {
        initOnce: {
            // mapMeasure
            isDimAssigned:                      0,
            contentW:                           0,
            contentH:                           0,

            // mapTaskCalc
            taskStatusInherited:                0,

            // mapDivVisualize
            isDivAssigned:                      0,
            isContentAssigned:                  0,
        },
        initAlways: {
            // mapChain
            isRoot:                             0,
            parentPath:                         [],
            type:                               '', // struct or cell
            parentType:                         '',
            subType:                            '',
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
            parentNodeEndX:                     0,
            parentNodeEndY:                     0,
            lineDeltaX:                         0,
            lineDeltaY:                         0,
            nodeStartX:                         0,
            nodeStartY:                         0,
            nodeEndX:                           0,
            nodeEndY:                           0,
            centerX:                            0,
            centerY:                            0,
        }
    }
};

export function hasCell(cm) { // beware: it returns logical
    return !(cm.c.length === 1 && cm.c[0].length === 0);
}

export function getDefaultNode(attributes) {
    let defaultNode = {
        ...{
            c: [[]],
            s: [],
            content: ''
        },
        ...attributes
    };
    return JSON.parse(JSON.stringify(defaultNode));
}
