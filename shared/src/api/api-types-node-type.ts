export type NodeType = {
  id: number;
  w: number;
  h: number;
  type: string;
  color: Color;
  label: string;
  NodeConfigTypes: NodeConfigType[];
}

export type NodeConfigType = {
  id: number;
  type: NodeConfigTypeLabel;
  label: string;
  selectOptions: string[];
  nodeTypeId: number | null;
}

export const NodeConfigTypeLabel = {
  TEXT: 'TEXT',
  SELECT: 'SELECT',
};

export type NodeConfigTypeLabel = (typeof NodeConfigTypeLabel)[keyof typeof NodeConfigTypeLabel];

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
