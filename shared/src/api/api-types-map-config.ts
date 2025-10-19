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

export const MapNodeFieldType = {
  TEXT: 'TEXT',
  SELECT: 'SELECT',
};

export type MapNodeFieldType = (typeof MapNodeFieldType)[keyof typeof MapNodeFieldType];

export type MapNodeFieldConfig = {
  id: number;
  type: MapNodeFieldType;
  label: string;
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
  mapNodeFields: MapNodeFieldConfig[];
}

export type MapEdgeConfig = {
  id: number;
  fromNodeConfigId: number;
  FromNodeConfig: Partial<MapNodeConfig>;
  toNodeConfigId: number;
  ToNodeConfig: Partial<MapNodeConfig>;
}

export type GetMapConfigInfoQueryResponseDto = {
  mapNodeConfigs: Partial<MapNodeConfig>[],
  mapEdgeConfigs: Partial<MapEdgeConfig>[]
}

export type CreateMapEdgeConfigRequestDto = {
  fromNodeConfigId: number;
  toNodeConfigId: number;
}

export const defaultMapConfig: GetMapConfigInfoQueryResponseDto = {
  mapNodeConfigs: [],
  mapEdgeConfigs: [],
};
