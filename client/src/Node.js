import {getBgc} from './Utils'

export let props = {
    saveOptional: {
        path:                                   [],

        content:                                '',

        ilink:                                  '',
        elink:                                  '',

        s:                                      [],
        sTextWidthShouldCalculate:              1,
        sTextWidth:                             0,
        sTextColor:                             '#222222',
        sTextFontSize:                          14,

        c:                                      [[]],
        cBorderColor:                           '#50dfff',

        nodeStartXOverride:                     0,
        nodeStartYOverride:                     0,
        selfWidthOverride:                      0,
        selfHeightOverride:                     0,

        selected:                               0,
        lastSelectedChild:                      -1, // -1 means not selected ever

        lineColor:                              '#bbbbbb',

        polygonFill:                            0,
        polygonBorderColor:                     '#ffffff',
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
            // mapDivVisualize
            isDivAssigned:                      0,
            isTextAssigned:                     0,
            isLinkAssigned:                     0,
            isPicAssigned:                      0,
            isEquationAssigned:                 0,
            isSvgAssigned:                      0,
            editTrigger:                        0,

            // mapTaskCalc
            taskStatusInherited:                0,
        },
        initAlways: {
            // mapChain
            isRoot:                             0,
            parentPath:                         [],
            type:                               '', // struct or cell
            parentType:                         '',
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
