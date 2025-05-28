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
    case ControlType.EXTRACTION:
      w = 200;
      h = 210;
      break;
    case ControlType.VECTOR_DATABASE:
      w = 180;
      h = 60;
      break;
    case ControlType.TEXT_INPUT:
      w = 200;
      h = 200;
      break;
    case ControlType.TEXT_OUTPUT:
      w = 200;
      h = 200;
      break;
  }
  w += 2 * R_PADDING;
  h += 2 * R_PADDING;
  return { w, h };
};
