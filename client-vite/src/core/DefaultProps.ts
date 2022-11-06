import {LineTypes} from "./Types";

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
    // indicators
    shouldLoad: false,
    shouldResize: false,
    shouldCenter: false,
    shouldScroll: false,
    //
    scrollX: 0,
    scrollY: 0,
    //
    selectionRect: [],
    moveTargetPath: [],
    moveData: [],
    moveTargetIndex: 0,
    // animation
    animationRequested: 0,
  },
  saveNeverInitAlways: {
    // selection
    sc: {
      structSelectedPathList: [],
      cellSelectedPathList: [],
      maxSel: 0,
      maxSelIndex: 0,
      scope: '',
      lastPath: [],
      geomHighPath: [],
      geomLowPath: [],
      cellRowSelected: 0,
      cellRow: 0,
      cellColSelected: 0,
      cellCol: 0,
      haveSameParent: 0,
      sameParentPath: [],
    },
  },
  saveNeverResetAlways: {
    // indicators
    shouldLoad: false,
  }
}

export let nodeProps = {
  saveAlways: {
    path: [],
    d: [],
    s: [],
    c: [[]],
    nodeId: undefined,
  },
  saveOptional: {
    contentType: 'text',
    content: '',
    linkType: '',
    link: '',
    imageW: 0,
    imageH: 0,
    selected: 0,
    selection: 's',
    lastSelectedChild: -1, // -1 means not selected ever
    lineWidth: 1,
    lineType: LineTypes.bezier,
    lineColor: '#bbbbbb',
    sBorderWidth: 1,
    fBorderWidth: 1,
    sBorderColor: '',
    fBorderColor: '',
    sFillColor: '',
    fFillColor: '',
    textFontSize: 14,
    textColor: 'default',
    taskStatus: -1,
    // subMapStartX: 0, // only applies for root <-- calculate (how?)
    // subMapStartY: 0,  // only applies for root <-- calculate (how?)
  },
  saveNeverInitOnce: {
    // UNSORTED
    isEditing: 0,
    parentNodeEndXFrom: 0,
    parentNodeStartXFrom: 0,
    parentNodeYFrom: 0,
    // mapAlgo
    contentCalc: '',
    // mapMeasure
    isDimAssigned: 0,
    contentW: 0,
    contentH: 0,
    // subMapWidth: 0, // only applies for root <-- channel mapWidth here
    // subMapHeight: 0, // only applies for root <-- channel mapHeight here
    // animation
    animationRequested: 0,
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
}

export const resolveScope = (cm: any) => {
  return {
    struct:
      cm.type === 'struct' &&
      !cm.hasCell,
    text:
      cm.contentType === 'text',
    branchFill: cm.fFillColor !== '' && cm.s.length,
    nodeFill: cm.sFillColor !== '' || cm.taskStatus !== -1,
    branchBorder: cm.fBorderColor !== '' && cm.s.length,
    nodeBorder: cm.sBorderColor !== '' && !cm.hasCell,
    selectionBorder: cm.selected && cm.type !== 'cell' && !cm.isEditing,
    line:
      !cm.isRoot &&
      !cm.isRootChild &&
      cm.parentType !== 'cell' &&
      (cm.type === 'struct' && !cm.hasCell || cm.type === 'cell' && cm.parentParentType !== 'cell' && cm.index[0] > - 1 && cm.index[1] === 0),
    table:
      cm.type === "struct" &&
      cm.hasCell,
    task:
      cm.taskStatus !== -1 &&
      // !cm.path.includes('c') &&
      !cm.hasDir &&
      !cm.hasStruct &&
      !cm.hasCell &&
      // cm.parentType !== 'cell' &&
      cm.contentType !== 'image' &&
      !cm.isRoot &&
      !cm.isRootChild
  }
}

export const getDefaultNode = (attributes: any) => ({d: [], s: [], c: [[]], content: '', ...attributes})
