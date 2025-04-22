const jsonMerge = (orig: any, delta: any): any => {
  const result: Record<string, any> = {};

  const keys = new Set([...Object.keys(orig || {}), ...Object.keys(delta || {})]);

  for (const key of keys) {
    const valOrig = orig?.[key];
    const valDelta = delta?.[key];

    if (valOrig === undefined || valOrig === null) {
      result[key] = valDelta;
    } else if (valDelta === undefined || valDelta === null) {
      result[key] = valOrig;
    } else if (
      typeof valOrig === 'object' && !Array.isArray(valOrig) &&
      typeof valDelta === 'object' && !Array.isArray(valDelta)
    ) {
      result[key] = jsonMerge(valOrig, valDelta);
    } else {
      result[key] = valDelta;
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
