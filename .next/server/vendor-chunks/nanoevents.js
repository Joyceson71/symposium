"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/nanoevents";
exports.ids = ["vendor-chunks/nanoevents"];
exports.modules = {

/***/ "(ssr)/./node_modules/nanoevents/index.js":
/*!******************************************!*\
  !*** ./node_modules/nanoevents/index.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createNanoEvents: () => (/* binding */ createNanoEvents)\n/* harmony export */ });\nlet createNanoEvents = () => ({\n  emit(event, ...args) {\n    for (\n      let callbacks = this.events[event] || [],\n        i = 0,\n        length = callbacks.length;\n      i < length;\n      i++\n    ) {\n      callbacks[i](...args)\n    }\n  },\n  events: {},\n  on(event, cb) {\n    ;(this.events[event] ||= []).push(cb)\n    return () => {\n      this.events[event] = this.events[event]?.filter(i => cb !== i)\n    }\n  }\n})\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbmFub2V2ZW50cy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxZQUFZO0FBQ1o7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVjaG5va2luZ3MtMmsyNi8uL25vZGVfbW9kdWxlcy9uYW5vZXZlbnRzL2luZGV4LmpzPzQ1ZWEiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGxldCBjcmVhdGVOYW5vRXZlbnRzID0gKCkgPT4gKHtcbiAgZW1pdChldmVudCwgLi4uYXJncykge1xuICAgIGZvciAoXG4gICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5ldmVudHNbZXZlbnRdIHx8IFtdLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gY2FsbGJhY2tzLmxlbmd0aDtcbiAgICAgIGkgPCBsZW5ndGg7XG4gICAgICBpKytcbiAgICApIHtcbiAgICAgIGNhbGxiYWNrc1tpXSguLi5hcmdzKVxuICAgIH1cbiAgfSxcbiAgZXZlbnRzOiB7fSxcbiAgb24oZXZlbnQsIGNiKSB7XG4gICAgOyh0aGlzLmV2ZW50c1tldmVudF0gfHw9IFtdKS5wdXNoKGNiKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLmV2ZW50c1tldmVudF0gPSB0aGlzLmV2ZW50c1tldmVudF0/LmZpbHRlcihpID0+IGNiICE9PSBpKVxuICAgIH1cbiAgfVxufSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/nanoevents/index.js\n");

/***/ })

};
;