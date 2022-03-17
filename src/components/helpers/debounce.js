export function debounce (fn, delay, fnBefore) {
    var timeoutID = null
    return function () {
      clearTimeout(timeoutID)
      var args = arguments
      var that = this
      if (fnBefore) { fnBefore.apply(that,args); }
      timeoutID = setTimeout(function () {
        fn.apply(that, args)
      }, delay)
    }
  }
