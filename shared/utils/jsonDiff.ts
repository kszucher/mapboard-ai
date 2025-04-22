export const jsonDiff = (val1: any, val2: any): any => {
  if (typeof val1 !== 'object' || val1 === null || typeof val2 !== 'object' || val2 === null) {
    return val1 === val2 ? undefined : val2;
  }

  const result: any = Array.isArray(val1) ? [...val1] : { ...val1 };

  for (const key of Object.keys(val2)) {
    const value1 = val1[key];
    const value2 = val2[key];

    if (value1 !== undefined) {
      if (typeof value2 === 'object' && value2 !== null && typeof value1 === 'object' && value1 !== null) {
        const diff = jsonDiff(value1, value2);
        if (diff === undefined || (typeof diff === 'object' && Object.keys(diff).length === 0)) {
          delete result[key];
        } else {
          result[key] = diff;
        }
      } else {
        if (JSON.stringify(value1) === JSON.stringify(value2)) {
          delete result[key];
        }
      }
    } else {
      result[key] = null;
    }
  }

  return result;
};
