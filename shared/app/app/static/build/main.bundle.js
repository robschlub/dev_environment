!function(n){var e={};function o(t){if(e[t])return e[t].exports;var r=e[t]={i:t,l:!1,exports:{}};return n[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=n,o.c=e,o.d=function(n,e,t){o.o(n,e)||Object.defineProperty(n,e,{configurable:!1,enumerable:!0,get:t})},o.r=function(n){Object.defineProperty(n,"__esModule",{value:!0})},o.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return o.d(e,"a",e),e},o.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},o.p="",o(o.s="./shared/app/app/static/src/main.js")}({"./shared/app/app/static/src/main.js":function(module,exports,__webpack_require__){"use strict";eval("\n\nvar _tools = __webpack_require__(/*! ./tools/tools */ \"./shared/app/app/static/src/tools/tools.js\");\n\nvar tools = _interopRequireWildcard(_tools);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\ntools.Console(tools.add(2, 10).toString());\n\ntools.Console(tools.mulToString(2, 5).toString());\n\nvar myId = document.getElementById('intro');\n\nif (myId instanceof HTMLElement) {\n  myId.innerHTML = '<p>Hello from JS!</p>';\n}\n\n//# sourceURL=webpack:///./shared/app/app/static/src/main.js?")},"./shared/app/app/static/src/tools/tools.js":function(module,exports,__webpack_require__){"use strict";eval('\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nvar Console = function Console(text) {\n  console.log(text); // eslint-disable-line no-console\n};\n\nfunction add(a, b) {\n  return a + b;\n}\n\nfunction mulToString(a, b) {\n  return (a * b).toString();\n}\n\nvar divide = function divide(a, b) {\n  return a / b;\n};\n\nexports.divide = divide;\nexports.mulToString = mulToString;\nexports.add = add;\nexports.Console = Console;\n// export dividedBy;\n// export dividedBy;\n// export { Console as default };\n\n//# sourceURL=webpack:///./shared/app/app/static/src/tools/tools.js?')}});