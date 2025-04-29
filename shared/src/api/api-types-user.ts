export const ColorMode = {
  DARK: 'DARK',
  LIGHT: 'LIGHT',
} as const;

export type ColorMode = (typeof ColorMode)[keyof typeof ColorMode];

export type UserInfo = {
  name: string
  colorMode: ColorMode
}

export type GetUserInfoQueryResponseDto = {
  userInfo: UserInfo;
};
