import { ColorMode, MapInfoDefaultState, SharesInfoDefaultState, UserInfoDefaultState } from './ApiStateTypes.ts';

export const userInfoDefaultState: UserInfoDefaultState = {
  userName: '',
  colorMode: ColorMode.DARK,
  tabMapIdList: [],
  tabMapNameList: [],
};

export const mapInfoDefaultState: MapInfoDefaultState = {
  mapId: '',
  mapName: '',
  mapData: {},
};

export const sharesInfoDefaultState: SharesInfoDefaultState = {
  sharesWithUser: [],
  sharesByUser: [],
};
