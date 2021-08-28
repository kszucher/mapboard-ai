import {filteredObj} from "./Utils";

export let mapProps = {
    saveAlways: {
        path: [],
    },
    saveOptional: {
        alignment: 'adaptive',
        density: 'large',
        taskConfigN: 4,
        taskConfigGap: 4,
        margin: 32,
    },
    saveNeverInitOnce: {
        mapWidth: 0,
        mapHeight: 0,
        taskLeft: 0,
        taskRight: 0,
        sLineDeltaXDefault: 0,
        padding: 0,
        defaultH: 0,
        taskConfigD: 0,
        taskConfigWidth: 0,

        isLoading: true,
        isResizing: false,
    },
    saveNeverInitAlways: {

    }
};

export let nodeProps = {
    saveAlways: {
        path: [],
        d: [],
        s: [],
        c: [[]],
        // mapVisualizeDiv
        divId: '',
        // mapVisualizeSvg
        svgId: ''
    },
    saveOptional: {
        contentType: 'text',
        content: '',
        linkType: '',
        link: '',
        imageW: 0,
        imageH: 0,
        sTextColor: '#222222',
        sTextFontSize: 14,
        cBorderColor: '#eac6fb',
        selected: 0,
        task: 0,
        lastSelectedChild: -1, // -1 means not selected ever
        lineWidth: 1,
        lineType: 'b',
        lineColor: '#bbbbbb',
        ellipseBranchFillColor: '',
        ellipseNodeFillColor: '',
        ellipseBranchBorderColor: '',
        ellipseBranchBorderWidth: 1,
        ellipseNodeBorderColor: '',
        ellipseNodeBorderWidth: 1,
        taskStatus: -1,
    },
    saveNeverInitOnce: {
        // UNSORTED
        isEditing: 0,
        parentNodeEndXFrom: 0,
        parentNodeStartXFrom: 0,
        parentNodeYFrom: 0,
        lineAnimationRequested: 0,
        moveData: [],
        selectionRect: [],
        selection: 's',
        // mapAlgo
        contentCalc: '',
        // mapMeasure
        isDimAssigned: 0,
        contentW: 0,
        contentH: 0,
        // mapTaskCalc
        taskStatusInherited: 0,
    },
    saveNeverInitAlways: {
        // mapChain
        isRoot: 0,
        isRootChild: 0,
        parentPath: [],
        type: '',
        parentType: '',
        parentParentType: '',
        hasDir: 0,
        hasStruct: 0,
        hasCell: 0,
        index: [],
        // mapMeasure
        selfW: 0,
        selfH: 0,
        familyW: 0,
        familyH: 0,
        maxColWidth: [],
        maxRowHeight: [],
        sumMaxColWidth: [0],
        sumMaxRowHeight: [0],
        maxW: 0,
        maxH: 0,
        spacing: 10,
        spacingActivated: 0,
        // mapPlace
        parentNodeStartX: 0,
        parentNodeEndX: 0,
        parentNodeY: 0,
        lineDeltaX: 0,
        lineDeltaY: 0,
        nodeStartX: 0,
        nodeEndX: 0,
        nodeY: 0,
        isTop: 0,
        isBottom: 0,
    }
};

const formatParams =  {
    line: ['lineWidth', 'lineType', 'lineColor'],
    border_s: ['cBorderColor', 'ellipseNodeBorderColor', 'ellipseNodeBorderWidth'],
    border_f: ['ellipseBranchBorderColor', 'ellipseBranchBorderWidth'],
    fill_s: ['ellipseNodeFillColor'],
    fill_f: ['ellipseBranchFillColor'],
    text: ['sTextColor', 'sTextFontSize'],
}

export const getFormatDefault = (type) => {
    return filteredObj(nodeProps.saveOptional, formatParams[type]);
}

export const getAllFormatDefault = () => {
    return filteredObj(nodeProps.saveOptional, [].concat(...Object.values(formatParams)));
}

export const resolveConditions = (cm) => {
    return {
        struct:
            cm.type === 'struct' &&
            !cm.hasCell,
        text:
            cm.contentType === 'text',
        backgroundRect: cm.isRoot,
        branchFill: cm.ellipseBranchFillColor !== '' && cm.s.length,
        nodeFill: cm.ellipseNodeFillColor !== '',
        branchBorder: cm.ellipseBranchBorderColor !== '' && cm.s.length,
        nodeBorder: cm.ellipseNodeBorderColor !== '',
        selectionBorder: cm.selected && !cm.hasCell && cm.type !== 'cell' && !cm.isEditing,
        selectionBorderTable: cm.selected && cm.hasCell && cm.type !== 'cell' && !cm.isEditing,
        line:
            !cm.isRoot &&
            !cm.isRootChild &&
            cm.parentType !== 'cell' &&
            (cm.type === 'struct' && !cm.hasCell || cm.type === 'cell' && cm.parentParentType !== 'cell' && cm.index[0] > - 1 && cm.index[1] === 0),
        table:
            cm.type === "struct" &&
            cm.hasCell,
        task:
            cm.task &&
            !cm.path.includes('c') &&
            !cm.hasDir &&
            !cm.hasStruct &&
            !cm.hasCell &&
            cm.parentType !== 'cell' &&
            cm.contentType !== 'image' &&
            !cm.isRoot &&
            !cm.isRootChild
    }
}

export function getDefaultNode(attributes) {
    return Object.assign({d: [], s: [],  c: [[]], content: ''}, attributes);
}
