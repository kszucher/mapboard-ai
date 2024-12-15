import { M } from '../mapState/MapStateTypes.ts';
import { Side } from '../mapState/MapStateTypesEnums.ts';
import { AlertDialogState, DialogState, LeftMouseMode, MidMouseMode, PageState } from './EditorStateTypesEnums.ts';

export interface EditorState {
  token: string;
  workspaceId: string;
  isLoading: boolean;
  leftMouseMode: LeftMouseMode;
  midMouseMode: MidMouseMode;
  pageState: PageState;
  dialogState: DialogState;
  alertDialogState: AlertDialogState;
  mapId: string;
  commitList: M[];
  commitIndex: number;
  latestMapData: M;
  editedNodeId: string;
  editType: '' | 'append' | 'replace';
  editStartMapListIndex: number;
  formatterVisible: boolean;
  rOffsetCoords: number[];
  sMoveCoords: number[];
  insertLocation: {
    sl: string;
    su: string;
    sd: string;
  };
  selectionRectCoords: number[];
  intersectingNodes: string[];
  zoomInfo: {
    fromX: number;
    fromY: number;
    scale: number;
    prevMapX: number;
    prevMapY: number;
    translateX: number;
    translateY: number;
    originX: number;
    originY: number;
  };
  connectionHelpersVisible: boolean;
  connectionStart: {
    fromNodeId: string;
    fromNodeSide: Side;
  };
}
