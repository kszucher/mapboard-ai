import { ColorMode } from '../schema/schema';

export type UserInfo = {
  id: number
  name: string
  colorMode: ColorMode
}

export type GetUserInfoQueryResponseDto = {
  userInfo: UserInfo;
};
