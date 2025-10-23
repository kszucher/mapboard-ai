export type NodeType = {
  id: number;
  w: number;
  h: number;
  color: Color;
  label: string;
}

export type AttributeType = {
  id: number;
  label: AttributeTypeLabel;
  defaultString: string | null;
  defaultNumber: number | null;
  defaultEnum: string[] | null;
  nodeTypeId: number | null;
}

export const AttributeTypeLabel = {
  INPUT_STRING: 'INPUT_STRING',
  INPUT_NUMBER: 'INPUT_NUMBER',
  INPUT_ENUM: 'INPUT_ENUM',
  OUTPUT_STRING: 'OUTPUT_STRING',
  OUTPUT_NUMBER: 'OUTPUT_NUMBER',
};

export type AttributeTypeLabel = (typeof AttributeTypeLabel)[keyof typeof AttributeTypeLabel];

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

export type GetNodeTypeQueryResponseDto = Partial<NodeType>[]

export type CreateNodeTypeRequestDto = {}
