export const hasTrues = (array: any[]): boolean => array.length > 0 && array.every(el => el === true);

export const genId = () => crypto.randomUUID().slice(-8);

export const adjust = (x: number) => (Number.isInteger(x) ? x + 0.5 : Math.ceil(x) - 0.5);

export const adjustIcon = (x: number) => (!Number.isInteger(x) ? x + 0.5 : Math.ceil(x) - 0.5);

export const shrinkString = (original: string, maxLength: number) => {
  if (original.length <= maxLength) return original;

  const [base, extension] = original.split(/(\.[^.]+)$/); // Split into base and extension
  const maxBaseLength = maxLength - 3; // Adjust for "..."

  return base.length > maxBaseLength ? base.slice(0, maxBaseLength) + '... ' + extension : original; // Return original if it fits
};
