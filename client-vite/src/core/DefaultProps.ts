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
  saveNeverInitOnce: { // this means reCalc does not change this, but the issue is that it is not reset
    selectionRect: [],
    moveData: [],
    animationRequested: 0, // will be a mapGetProp of parentNodeXYZ (enough to have that as single source of truth)
  },
  saveNeverInitAlways: {
    mapWidth: 0,
    mapHeight: 0,
    taskLeft: 0,
    taskRight: 0,
    sLineDeltaXDefault: 0,
    padding: 0,
    defaultH: 0,
    taskConfigD: 0,
    taskConfigWidth: 0,
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
    }
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
  },
  saveNeverInitOnce: { // this means reCalc does not change this, but the issue is that it is not reset
    // UNSORTED
    isEditing: 0,
    parentNodeEndXFrom: 0, // mapDiff updates this
    parentNodeStartXFrom: 0, // mapDiff updates this
    parentNodeYFrom: 0, // mapDiff updates this
    // mapAlgo
    contentCalc: '',
    // mapMeasure
    isDimAssigned: 0, // mapDiff updates this, rename to shouldMeasure
    contentW: 0, // move to be local
    contentH: 0, // move to be local
    // animation
    animationRequested: 0, // once only m will know about this by MapGetProp of parent_XYZ this becomes obsolete
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
