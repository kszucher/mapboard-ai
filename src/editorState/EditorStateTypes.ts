import { M } from '../mapState/MapStateTypes.ts';
import { Side } from '../mapState/MapStateTypesEnums.ts';
import { AlertDialogState, DialogState, MidMouseMode, PageState } from './EditorStateTypesEnums.ts';

export interface EditorState {
  token: string;
  workspaceId: string;
  isLoading: boolean;
  midMouseMode: MidMouseMode;
  pageState: PageState;
  dialogState: DialogState;
  alertDialogState: AlertDialogState;
  mapId: string;
  commitList: M[];
  commitIndex: number;
  formatterVisible: boolean;
  rOffsetCoords: number[];
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
