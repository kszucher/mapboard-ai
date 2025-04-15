// export enum ColorMode {
//   DARK = 'DARK',
//   LIGHT = 'LIGHT',
// }

import { $Enums } from '../../server/generated/prisma';
import ColorMode = $Enums.ColorMode;

export interface UserInfoDefaultState {
  userName: string;
  colorMode: ColorMode;
  tabMapIdList: string[];
  tabMapNameList: string[];
}

export interface MapInfoDefaultState {
  mapId: string;
  mapName: string;
  mapData: object;
}

export interface SharesInfoDefaultState {
  sharesWithUser: {
    id: string;
    sharedMapName: string;
    ownerUserEmail: string;
    access: string;
    status: string;
  }[];
  sharesByUser: {
    id: string;
    sharedMapName: string;
    shareUserEmail: string;
    access: string;
    status: string;
  }[];
}

export interface ExtractionRawPromptDefaultState {
  rawPrompt: string;
}
