export const jsonMerge = (orig: any, delta: any): any => {
  const result: Record<string, any> = {};

  const keys = new Set([...Object.keys(orig || {}), ...Object.keys(delta || {})]);

  for (const key of keys) {
    const valOrig = orig?.[key];
    const valDelta = delta?.[key];

    if (
      typeof valOrig === 'object' && valOrig !== null && !Array.isArray(valOrig) &&
      typeof valDelta === 'object' && valDelta !== null && !Array.isArray(valDelta)
    ) {
      result[key] = jsonMerge(valOrig, valDelta);
    } else if (valDelta !== undefined) {
      result[key] = valDelta;
    } else {
      result[key] = valOrig;
    }
  }

  // Strip nulls
  for (const key in result) {
    if (result[key] === null) {
      delete result[key];
    }
  }

  return result;
};