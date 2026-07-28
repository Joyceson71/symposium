"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/just-debounce-it";
exports.ids = ["vendor-chunks/just-debounce-it"];
exports.modules = {

/***/ "(ssr)/./node_modules/just-debounce-it/index.mjs":
/*!*************************************************!*\
  !*** ./node_modules/just-debounce-it/index.mjs ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ functionDebounce)\n/* harmony export */ });\nvar functionDebounce = debounce;\n\nfunction debounce(fn, wait, callFirst) {\n  var timeout = null;\n  var debouncedFn = null;\n\n  var clear = function() {\n    if (timeout) {\n      clearTimeout(timeout);\n\n      debouncedFn = null;\n      timeout = null;\n    }\n  };\n\n  var flush = function() {\n    var call = debouncedFn;\n    clear();\n\n    if (call) {\n      call();\n    }\n  };\n\n  var debounceWrapper = function() {\n    if (!wait) {\n      return fn.apply(this, arguments);\n    }\n\n    var context = this;\n    var args = arguments;\n    var callNow = callFirst && !timeout;\n    clear();\n\n    debouncedFn = function() {\n      fn.apply(context, args);\n    };\n\n    timeout = setTimeout(function() {\n      timeout = null;\n\n      if (!callNow) {\n        var call = debouncedFn;\n        debouncedFn = null;\n\n        return call();\n      }\n    }, wait);\n\n    if (callNow) {\n      return debouncedFn();\n    }\n  };\n\n  debounceWrapper.cancel = clear;\n  debounceWrapper.flush = flush;\n\n  return debounceWrapper;\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvanVzdC1kZWJvdW5jZS1pdC9pbmRleC5tanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRXFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVjaG5va2luZ3MtMmsyNi8uL25vZGVfbW9kdWxlcy9qdXN0LWRlYm91bmNlLWl0L2luZGV4Lm1qcz8zNTg4Il0sInNvdXJjZXNDb250ZW50IjpbInZhciBmdW5jdGlvbkRlYm91bmNlID0gZGVib3VuY2U7XG5cbmZ1bmN0aW9uIGRlYm91bmNlKGZuLCB3YWl0LCBjYWxsRmlyc3QpIHtcbiAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICB2YXIgZGVib3VuY2VkRm4gPSBudWxsO1xuXG4gIHZhciBjbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG5cbiAgICAgIGRlYm91bmNlZEZuID0gbnVsbDtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FsbCA9IGRlYm91bmNlZEZuO1xuICAgIGNsZWFyKCk7XG5cbiAgICBpZiAoY2FsbCkge1xuICAgICAgY2FsbCgpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZGVib3VuY2VXcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF3YWl0KSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIGNhbGxOb3cgPSBjYWxsRmlyc3QgJiYgIXRpbWVvdXQ7XG4gICAgY2xlYXIoKTtcblxuICAgIGRlYm91bmNlZEZuID0gZnVuY3Rpb24oKSB7XG4gICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuXG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcblxuICAgICAgaWYgKCFjYWxsTm93KSB7XG4gICAgICAgIHZhciBjYWxsID0gZGVib3VuY2VkRm47XG4gICAgICAgIGRlYm91bmNlZEZuID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gY2FsbCgpO1xuICAgICAgfVxuICAgIH0sIHdhaXQpO1xuXG4gICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgIHJldHVybiBkZWJvdW5jZWRGbigpO1xuICAgIH1cbiAgfTtcblxuICBkZWJvdW5jZVdyYXBwZXIuY2FuY2VsID0gY2xlYXI7XG4gIGRlYm91bmNlV3JhcHBlci5mbHVzaCA9IGZsdXNoO1xuXG4gIHJldHVybiBkZWJvdW5jZVdyYXBwZXI7XG59XG5cbmV4cG9ydCB7ZnVuY3Rpb25EZWJvdW5jZSBhcyBkZWZhdWx0fTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/just-debounce-it/index.mjs\n");

/***/ })

};
;