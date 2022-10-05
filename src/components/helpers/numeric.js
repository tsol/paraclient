// eslint-disable-next-line
export function isNumeric(val) {
// eslint-disable-next-line prefer-template
  return /^-?\d+(\.\d+)?$/.test(val + '');
}
