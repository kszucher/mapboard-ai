import {LineTypes} from "./Types";

export let mapProps = {
  saveAlways: {
    path: ['g'],
    nodeId: undefined,
  },
  saveOptional: {
    alignment: 'adaptive',
    density: 'large',
    taskConfigN: 4,
    taskConfigGap: 4,
    margin: 32,
  },
  saveNeverInitAlways: {
    mapWidth: 0,
    mapHeight: 0,
    sLineDeltaXDefault: 0,
    padding: 0,
    defaultH: 0,
    taskConfigD: 0,
    taskConfigWidth: 0,
    sc: {
      structSelectedPathList: [],
      cellSelectedPathList: [],
      isRootIncluded: false,
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
    nc: {
      selection: null,
      lineWidth: null,
      lineType: null,
      lineColor: null,
      borderWidth: null,
      borderColor: null,
      fillColor: null,
      textFontSize: null,
      textColor: null,
      taskStatus: null,
    },
    animationRequested: 0,
    taskLeft: 0,
    taskRight: 0,
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
    dimW: 0,
    dimH: 0,
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
    taskStatus: 0,
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
    // mapDiff
    dimChange: 0,
    parentNodeEndXFrom: 0,
    parentNodeStartXFrom: 0,
    parentNodeYFrom: 0,
    animationRequested: 0, // we can just use parentNodeXY instead so this is redundant
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

export const resolveScope = (cn: any) => {
  return {
    struct:
      cn.type === 'struct' &&
      !cn.hasCell,
    text:
      cn.contentType === 'text',
    branchFill: cn.fFillColor !== '' && cn.s.length,
    nodeFill: cn.sFillColor !== '' || cn.taskStatus !== 0,
    branchBorder: cn.fBorderColor !== '' && cn.s.length,
    nodeBorder: cn.sBorderColor !== '' && !cn.hasCell,
    selectionBorder: cn.selected && cn.type !== 'cell' && !cn.isEditing,
    line:
      !cn.isRoot &&
      !cn.isRootChild &&
      cn.parentType !== 'cell' &&
      (cn.type === 'struct' && !cn.hasCell || cn.type === 'cell' && cn.parentParentType !== 'cell' && cn.index[0] > - 1 && cn.index[1] === 0),
    table:
      cn.type === "struct" &&
      cn.hasCell,
    task:
      cn.taskStatus !== 0 &&
      // !cn.path.includes('c') &&
      !cn.hasDir &&
      !cn.hasStruct &&
      !cn.hasCell &&
      // cn.parentType !== 'cell' &&
      cn.contentType !== 'image' &&
      !cn.isRoot &&
      !cn.isRootChild
  }
}

export const getDefaultNode = (attributes?: any) => ({d: [], s: [], c: [[]], content: '', ...attributes})
