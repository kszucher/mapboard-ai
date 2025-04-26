export const includeEntries = (obj: object, keys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));

export const excludeEntries = (obj: object, keys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)));

export const getNonDefaultEntries = (obj: object, defaultObj: object) =>
  Object.keys(obj).filter(key => obj[key as keyof typeof obj] !== defaultObj[key as keyof typeof defaultObj]);
