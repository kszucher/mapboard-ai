import { ControlType } from './map-types';

export const M_PADDING = 40;
export const R_PADDING = 40;

export const getControlTypeDimensions = (controlType: ControlType): { w: number, h: number } => {
  let w;
  let h;
  switch (controlType) {
    case ControlType.FILE:
      w = 160;
      h = 90;
      break;
    case ControlType.INGESTION:
      w = 160;
      h = 90;
      break;
    case ControlType.CONTEXT:
      w = 200;
      h = 200;
      break;
    case ControlType.QUESTION:
      w = 200;
      h = 200;
      break;
    case ControlType.VECTOR_DATABASE:
      w = 180;
      h = 60;
      break;
    case ControlType.LLM:
      w = 200;
      h = 210;
      break;
  }
  w += 2 * R_PADDING;
  h += 2 * R_PADDING;
  return { w, h };
};

export const controlColors = {
  [ControlType.FILE]: 'yellow',
  [ControlType.INGESTION]: 'cyan',
  [ControlType.CONTEXT]: 'violet',
  [ControlType.QUESTION]: 'lime',
  [ControlType.VECTOR_DATABASE]: 'brown',
  [ControlType.LLM]: 'jade',
} as const;

export const controlTexts = {
  [ControlType.FILE]: 'File Upload',
  [ControlType.INGESTION]: 'RootNodeTypeIngestion',
  [ControlType.CONTEXT]: 'Context',
  [ControlType.QUESTION]: 'RootNodeTypeQuestion',
  [ControlType.VECTOR_DATABASE]: 'Vector Database',
  [ControlType.LLM]: 'LLM',
} as const;

export const allowedTargetControls = {
  [ControlType.FILE]: [ControlType.INGESTION],
  [ControlType.INGESTION]: [ControlType.VECTOR_DATABASE],
  [ControlType.CONTEXT]: [ControlType.VECTOR_DATABASE, ControlType.LLM],
  [ControlType.QUESTION]: [ControlType.VECTOR_DATABASE, ControlType.LLM],
  [ControlType.VECTOR_DATABASE]: [ControlType.LLM],
  [ControlType.LLM]: [],
} as const;

export const allowedSourceControls = {
  [ControlType.FILE]: [],
  [ControlType.INGESTION]: [ControlType.FILE],
  [ControlType.CONTEXT]: [],
  [ControlType.QUESTION]: [],
  [ControlType.VECTOR_DATABASE]: [ControlType.INGESTION, ControlType.CONTEXT, ControlType.QUESTION],
  [ControlType.LLM]: [ControlType.VECTOR_DATABASE, ControlType.CONTEXT, ControlType.QUESTION],
};
