import { AccessType } from '../editorState/EditorStateTypesEnums.ts';

export interface DefaultUseOpenWorkspaceQueryState {
  userName: string;
  colorMode: string;
  tabMapIdList: string[];
  tabMapNameList: string[];
  sharedMapIdList: string[];
  sharedMapNameList: string[];
  mapId: string;
  mapName: string;
  mapData: object;
  access: AccessType;
}

export interface DefaultGetSharesQueryState {
  shareDataImport: {
    _id: string;
    sharedMapName: string;
    ownerUserEmail: string;
    access: string;
    status: string;
  }[];
  shareDataExport: {
    _id: string;
    sharedMapName: string;
    shareUserEmail: string;
    access: string;
    status: string;
  }[];
}

export interface DefaultGetIngestionQueryState {
  ingestionResult: any[];
}
