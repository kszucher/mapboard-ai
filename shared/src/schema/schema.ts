export type Map = {
  n: Node[]
  e: Edge[],
};

export type Node = {
  id: number;
  workspaceId: number | null;
  iid: number;
  offsetX: number;
  offsetY: number;
  isProcessing: boolean;
  nodeTypeId: number;
  updatedAt: Date;
};

export type NodeType = {
  id: number;
  w: number;
  h: number;
  color: Color;
  label: string;
}

export type Attribute = {}

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

export type Edge = {
  id: number;
  workspaceId: number | null;
  fromNodeId: number;
  toNodeId: number;
  lineColor: string;
  lineWidth: number;
  FromNode: {
    id: number;
    offsetX: number;
    offsetY: number;
    NodeType: {
      id: number;
    }
  },
  ToNode: {
    id: number;
    offsetX: number;
    offsetY: number;
    NodeType: {
      id: number;
    }
  }
  updatedAt: Date;
}

export type EdgeType = {
  id: number;
  fromNodeTypeId: number;
  toNodeTypeId: number;
}

export const ShareStatus = {
  WAITING: 'WAITING',
  ACCEPTED: 'ACCEPTED',
} as const;

export type ShareStatus = (typeof ShareStatus)[keyof typeof ShareStatus];

export const ShareAccess = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
} as const;

export type ShareAccess = (typeof ShareAccess)[keyof typeof ShareAccess];

export const ColorMode = {
  DARK: 'DARK',
  LIGHT: 'LIGHT',
} as const;

export type ColorMode = (typeof ColorMode)[keyof typeof ColorMode];

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
