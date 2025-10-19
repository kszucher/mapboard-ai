export const Color = {
  gray: 'gray',
  gold: 'gold',
  bronze: 'bronze',
  brown: 'brown',
  yellow: 'yellow',
  amber: 'amber',
  orange: 'orange',
  tomato: 'tomato',
  red: 'red',
  ruby: 'ruby',
  crimson: 'crimson',
  pink: 'pink',
  plum: 'plum',
  purple: 'purple',
  violet: 'violet',
  iris: 'iris',
  indigo: 'indigo',
  blue: 'blue',
  cyan: 'cyan',
  teal: 'teal',
  jade: 'jade',
  green: 'green',
  grass: 'grass',
  lime: 'lime',
  mint: 'mint',
  sky: 'sky',
} as const;

export type Color = (typeof Color)[keyof typeof Color];

export const MapNodeInputType = {
  TEXT: 'TEXT',
  SELECT: 'SELECT',
};

export type MapNodeInputType = (typeof MapNodeInputType)[keyof typeof MapNodeInputType];

export type MapNodeField = {
  id: number;
  inputType: MapNodeInputType;
  selectOptions: string[];
  mapNodeTypeId: number | null;
}

export type MapNodeConfig = {
  id: number;
  w: number;
  h: number;
  type: string;
  color: Color;
  label: string;
  mapNodeFields: MapNodeField[];
}

export type MapLinkConfig = {
  id: number;
  fromNodeConfigId: number;
  FromNodeConfig: Partial<MapNodeConfig>;
  toNodeConfigId: number;
  ToNodeConfig: Partial<MapNodeConfig>;
}

export type GetMapConfigInfoQueryResponseDto = {
  mapNodeConfigs: Partial<MapNodeConfig>[],
  mapLinkConfigs: Partial<MapLinkConfig>[]
}

export type CreateMapLinkConfigRequestDto = {
  fromNodeConfigId: number;
  toNodeConfigId: number;
}

export const defaultMapConfig: GetMapConfigInfoQueryResponseDto = {
  mapNodeConfigs: [],
  mapLinkConfigs: [],
};
