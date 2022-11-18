/* eslint-disable import/prefer-default-export */
export function debounce(fn, delay, fnBefore) {
  let timeoutID = null;
  // eslint-disable-next-line func-names
  return function () {
    clearTimeout(timeoutID);
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const that = this;
    if (fnBefore) {
      fnBefore.apply(that, args);
    }
    timeoutID = setTimeout(() => {
      fn.apply(that, args);
    }, delay);
  };
}
