(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("dd", [], factory);
	else if(typeof exports === 'object')
		exports["dd"] = factory();
	else
		root["dd"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/diagram/tools/g2.js":
/*!************************************!*\
  !*** ./src/js/diagram/tools/g2.js ***!
  \************************************/
/*! exports provided: point, Point, line, Line, distance, minAngleDiff, deg, normAngle, Transform, TransformLimit, Rect, Translation, Scale, Rotation, spaceToSpaceTransform, getBoundingRect, linearPath, curvedPath, quadraticBezier, translationPath, polarToRect, rectToPolar, getDeltaAngle, normAngleTo90, threePointAngle, randomPoint, getMaxTimeFromVelocity, getMoveTime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "point", function() { return point; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Point", function() { return Point; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "line", function() { return line; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Line", function() { return Line; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distance", function() { return distance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "minAngleDiff", function() { return minAngleDiff; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deg", function() { return deg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normAngle", function() { return normAngle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transform", function() { return Transform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransformLimit", function() { return TransformLimit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Rect", function() { return Rect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Translation", function() { return Translation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Scale", function() { return Scale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Rotation", function() { return Rotation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spaceToSpaceTransform", function() { return spaceToSpaceTransform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBoundingRect", function() { return getBoundingRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "linearPath", function() { return linearPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "curvedPath", function() { return curvedPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quadraticBezier", function() { return _quadraticBezier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "translationPath", function() { return translationPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "polarToRect", function() { return polarToRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rectToPolar", function() { return rectToPolar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDeltaAngle", function() { return getDeltaAngle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normAngleTo90", function() { return normAngleTo90; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "threePointAngle", function() { return threePointAngle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomPoint", function() { return randomPoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMaxTimeFromVelocity", function() { return getMaxTimeFromVelocity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMoveTime", function() { return getMoveTime; });
/* harmony import */ var _mathtools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mathtools */ "./src/js/diagram/tools/mathtools.js");
/* harmony import */ var _m2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./m2 */ "./src/js/diagram/tools/m2.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 2D geometry functions including:
//  - Point
//  - Line
//  - minAngleDiff
//  - normAngle
 // import { Console } from '../../tools/tools';

 // function nullDefaultNum(input: number | null, defaultValue: number): number {
//   if (input === null) {
//     return defaultValue;
//   }
//   return input;
// }
// export type PointType = {
//   x: number;
//   y: number;
//   _dup(): PointType;
//   // sub(): PointType;
//   // add(): PointType;
//   // distance(): number;
//   // round(): PointType;
//   // rotate(): PointType;
//   // isEqualTo: boolean;
//   // isNotEqualTo: boolean;
//   // isOnLine: boolean;
//   // isOnUnboundLine: boolean;
//   // console: void;
//   // isInPolygon: boolean;
//   // isOnPolygon: boolean;
// };

function _quadraticBezier(P0, P1, P2, t) {
  return (1 - t) * ((1 - t) * P0 + t * P1) + t * ((1 - t) * P1 + t * P2);
}

var Rect =
/*#__PURE__*/
function () {
  function Rect(left, bottom, width, height) {
    _classCallCheck(this, Rect);

    this.left = left;
    this.width = width;
    this.height = height;
    this.bottom = bottom;
    this.top = bottom + height;
    this.right = left + width;
  }

  _createClass(Rect, [{
    key: "_dup",
    value: function _dup() {
      return new Rect(this.left, this.bottom, this.width, this.height);
    }
  }]);

  return Rect;
}();
/* eslint-disable comma-dangle */


var Point =
/*#__PURE__*/
function () {
  _createClass(Point, null, [{
    key: "zero",
    value: function zero() {
      return new Point(0, 0);
    }
  }, {
    key: "Unity",
    value: function Unity() {
      return new Point(1, 1);
    }
  }]);

  function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: "_dup",
    value: function _dup() {
      return new Point(this.x, this.y);
    }
  }, {
    key: "scale",
    value: function scale(scalar) {
      return new Point(this.x * scalar, this.y * scalar);
    }
  }, {
    key: "sub",
    value: function sub(qOrX) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (qOrX instanceof Point) {
        return new Point(this.x - qOrX.x, this.y - qOrX.y);
      }

      return new Point(this.x - qOrX, this.y - y);
    }
  }, {
    key: "add",
    value: function add(qOrX) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (qOrX instanceof Point) {
        return new Point(this.x + qOrX.x, this.y + qOrX.y);
      }

      return new Point(this.x + qOrX, this.y + y);
    }
  }, {
    key: "distance",
    value: function distance() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  }, {
    key: "round",
    value: function round() {
      var precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
      return new Point(Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(this.x, precision), Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(this.y, precision));
    }
  }, {
    key: "clip",
    value: function clip(min, max) {
      var minX;
      var minY;
      var maxX;
      var maxY;

      if (min instanceof Point) {
        minX = min.x;
        minY = min.y;
      } else {
        minX = min;
        minY = min;
      }

      if (max instanceof Point) {
        maxX = max.x;
        maxY = max.y;
      } else {
        maxX = max;
        maxY = max;
      }

      var x = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipValue"])(this.x, minX, maxX);
      var y = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipValue"])(this.y, minY, maxY);
      return new Point(x, y);
    }
  }, {
    key: "transformBy",
    value: function transformBy(matrix) {
      var transformedPoint = _m2__WEBPACK_IMPORTED_MODULE_1__["transform"](matrix, this.x, this.y);
      return new Point(transformedPoint[0], transformedPoint[1]);
    }
  }, {
    key: "quadraticBezier",
    value: function quadraticBezier(p1, p2, t) {
      var bx = _quadraticBezier(this.x, p1.x, p2.x, t);

      var by = _quadraticBezier(this.y, p1.y, p2.y, t);

      return new Point(bx, by);
    }
  }, {
    key: "rotate",
    value: function rotate(angle, center) {
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      var matrix = [c, -s, s, c]; // eslint-disable-line indent

      var centerPoint = center || new Point(0, 0);
      var pt = this.sub(centerPoint);
      return new Point(matrix[0] * pt.x + matrix[1] * pt.y + centerPoint.x, matrix[2] * pt.x + matrix[3] * pt.y + centerPoint.y);
    }
    /* eslint-enable comma-dangle */

  }, {
    key: "isEqualTo",
    value: function isEqualTo(q, precision) {
      var pr = this;
      var qr = q;

      if (typeof precision === 'number') {
        pr = this.round(precision);
        qr = qr.round(precision);
      }

      if (pr.x === qr.x && pr.y === qr.y) {
        return true;
      }

      return false;
    }
  }, {
    key: "isNotEqualTo",
    value: function isNotEqualTo(q, precision) {
      return !this.isEqualTo(q, precision);
    }
    /* eslint-disable no-use-before-define */

  }, {
    key: "isOnLine",
    value: function isOnLine(l, precision) {
      return l.hasPointOn(this, precision);
    }
  }, {
    key: "getShaddowOnLine",
    value: function getShaddowOnLine(l) {
      var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
      var shaddow = new Line(this, 1, l.angle() + Math.PI / 2);

      var _shaddow$intersectsWi = shaddow.intersectsWith(l),
          intersect = _shaddow$intersectsWi.intersect; // console.log(intersect, inLine, onLine, )


      if (intersect != null && intersect.isOnLine(l, precision)) {
        return intersect;
      }

      return null;
    }
  }, {
    key: "shaddowIsOnLine",
    value: function shaddowIsOnLine(l) {
      var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
      var intersect = this.getShaddowOnLine(l, precision);

      if (intersect != null) {
        return true;
      }

      return false;
    }
  }, {
    key: "isOnUnboundLine",
    value: function isOnUnboundLine(l, precision) {
      return l.hasPointAlong(this, precision);
    }
    /* eslint-enable no-use-before-define */
    // console(text?: string) {
    //   Console(`${text || ''} + ${this.x}, ${this.y}`);
    // }

  }, {
    key: "isInPolygon",
    value: function isInPolygon(polygonVertices) {
      var windingNumber = 0;
      var n = polygonVertices.length - 1;
      var v = polygonVertices.slice();
      var p = this;
      var popLastPoint = false; // polygonVertices needs to have the last vertex the same as the first vertex

      if (v[0].isNotEqualTo(v[n])) {
        v.push(v[0]);
        popLastPoint = true;
        n += 1;
      }

      for (var i = 0; i < n; i += 1) {
        if (v[i].y <= p.y) {
          if (v[i + 1].y > p.y) {
            // an upward crossing
            if (Point.isLeft(v[i], v[i + 1], p) > 0) {
              // P left of  edge
              windingNumber += 1; // have  a valid up intersect
            }
          }
        } else if (v[i + 1].y <= p.y) {
          // start y > P.y (no test needed)
          // a downward crossing
          if (Point.isLeft(v[i], v[i + 1], p) < 0) {
            // P right of  edge
            windingNumber -= 1; // have  a valid down intersect
          }
        }
      }

      if (popLastPoint) {
        v.pop();
      }

      if (windingNumber === 0) {
        return false;
      }

      return true;
    }
  }, {
    key: "isOnPolygon",
    value: function isOnPolygon(polygonVertices) {
      var popLastPoint = false;
      var p = this;
      var n = polygonVertices.length - 1; // Number of sides

      var v = polygonVertices.slice(); // polygonVertices needs to have the last vertex the same as the first vertex

      if (v[0].isNotEqualTo(v[n])) {
        v.push(v[0]);
        popLastPoint = true;
        n += 1;
      }

      for (var i = 0; i < n; i += 1) {
        // if(p.isEqualTo(v[i])) {
        //   return true;
        // }

        /* eslint-disable-next-line  no-use-before-define */
        var l = line(v[i], v[i + 1]);

        if (p.isOnLine(l)) {
          if (popLastPoint) {
            v.pop();
          }

          return true;
        }
      }

      if (p.isInPolygon(polygonVertices)) {
        if (popLastPoint) {
          v.pop();
        }

        return true;
      }

      if (popLastPoint) {
        v.pop();
      }

      return false;
    }
  }, {
    key: "toPolar",
    value: function toPolar() {
      return {
        mag: Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)),
        angle: Math.atan2(this.y, this.x)
      };
    }
  }], [{
    key: "isLeft",
    value: function isLeft(p0, p1, p2) {
      return (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
    }
  }]);

  return Point;
}();

function point(x, y) {
  return new Point(x, y);
}

function pointinRect(q, p1, p2, precision) {
  if (precision === undefined || precision === null) {
    if (q.x >= Math.min(p1.x, p2.x) && q.x <= Math.max(p1.x, p2.x) && q.y >= Math.min(p1.y, p2.y) && q.y <= Math.max(p1.y, p2.y)) {
      return true;
    }
  } else if (Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(q.x, precision) >= Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(Math.min(p1.x, p2.x), precision) && Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(q.x, precision) <= Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(Math.max(p1.x, p2.x), precision) && Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(q.y, precision) >= Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(Math.min(p1.y, p2.y), precision) && Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(q.y, precision) <= Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(Math.max(p1.y, p2.y), precision)) {
    return true;
  }

  return false;
}

function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function deg(angle) {
  return angle * 180 / Math.PI;
}

function minAngleDiff(angle1, angle2) {
  if (angle1 === angle2) {
    return 0;
  }

  return Math.atan2(Math.sin(angle1 - angle2), Math.cos(angle1 - angle2));
}

function normAngle(angle) {
  var newAngle = angle;

  while (newAngle >= Math.PI * 2.0) {
    newAngle -= Math.PI * 2.0;
  }

  while (newAngle < 0) {
    newAngle += Math.PI * 2.0;
  }

  return newAngle;
}

function normAngleTo90(angle) {
  var newAngle = normAngle(angle);

  if (newAngle > Math.PI / 2 && newAngle < Math.PI) {
    newAngle += Math.PI;
  }

  if (newAngle === Math.PI) {
    newAngle = 0;
  }

  if (newAngle > Math.PI && newAngle < Math.PI * 3 / 2) {
    newAngle -= Math.PI;
  }

  return newAngle;
}

function getDeltaAngle(startAngle, targetAngle) {
  var rotDirection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var start = normAngle(startAngle);
  var target = normAngle(targetAngle);
  var dir = rotDirection;

  if (start === target) {
    return 0;
  }

  if (dir === 2) {
    if (start > target) {
      dir = -1;
    } else {
      dir = 1;
    }
  }

  if (rotDirection === 0) {
    return minAngleDiff(target, start);
  }

  if (rotDirection === 1) {
    if (start > target) {
      return Math.PI * 2 - start + target;
    }
  }

  if (rotDirection === -1) {
    if (target > start) {
      return -start - (Math.PI * 2 - target);
    }
  }

  return target - start; // if (rotDirection === 2) {
  //   if (target > start) {
  //     return target - start;
  //   }
  // }
  // if (rotDirection === 2) {
  //   if (start + rotDiff < 0) {
  //     rotDiff = Math.PI * 2 + rotDiff;
  //   } else if (start + rotDiff > Math.PI * 2) {
  //     rotDiff = -(Math.PI * 2 - rotDiff);
  //   }
  // } else if (rotDiff * rotDirection < 0) {
  //   rotDiff = rotDirection * Math.PI * 2.0 + rotDiff;
  // }
  // return rotDiff;
}

var Line =
/*#__PURE__*/
function () {
  function Line(p1, p2OrMag) {
    var angle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, Line);

    this.p1 = p1._dup();

    if (p2OrMag instanceof Point) {
      this.p2 = p2OrMag._dup();
      this.ang = Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x);
    } else {
      this.p2 = this.p1.add(p2OrMag * Math.cos(angle), p2OrMag * Math.sin(angle));
      this.ang = angle;
    }

    this.A = this.p2.y - this.p1.y;
    this.B = this.p1.x - this.p2.x;
    this.C = this.A * this.p1.x + this.B * this.p1.y;
    this.distance = distance(this.p1, this.p2);
  }

  _createClass(Line, [{
    key: "getPoint",
    value: function getPoint() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (index === 2) {
        return this.p2;
      }

      return this.p1;
    }
  }, {
    key: "getYFromX",
    value: function getYFromX(x) {
      if (this.B !== 0) {
        return (this.C - this.A * x) / this.B;
      }

      return null;
    }
  }, {
    key: "getXFromY",
    value: function getXFromY(y) {
      if (this.A !== 0) {
        return (this.C - this.B * y) / this.A;
      }

      return null;
    }
  }, {
    key: "angle",
    value: function angle() {
      return this.ang;
    }
  }, {
    key: "round",
    value: function round() {
      var precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
      var lineRounded = new Line(this.p1, this.p2);
      lineRounded.A = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(lineRounded.A, precision);
      lineRounded.B = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(lineRounded.B, precision);
      lineRounded.C = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(lineRounded.C, precision);
      lineRounded.ang = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(lineRounded.ang, precision);
      lineRounded.distance = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(lineRounded.distance, precision);
      return lineRounded;
    }
  }, {
    key: "length",
    value: function length() {
      // return this.p1.sub(this.p2).distance();
      return this.distance;
    }
    /* eslint-disable comma-dangle */

  }, {
    key: "midpoint",
    value: function midpoint() {
      var length = this.length();
      var direction = this.p2.sub(this.p1);
      var angle = Math.atan2(direction.y, direction.x);
      var midpoint = point(this.p1.x + length / 2 * Math.cos(angle), this.p1.y + length / 2 * Math.sin(angle));
      return midpoint;
    }
    /* eslint-enable comma-dangle */

  }, {
    key: "hasPointAlong",
    value: function hasPointAlong(p, precision) {
      if (precision === undefined || precision === null) {
        if (this.C === this.A * p.x + this.B * p.y) {
          return true;
        }
      } else if (Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(this.C, precision) === Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(this.A * p.x + this.B * p.y, precision)) {
        return true;
      }

      return false;
    } // perpendicular distance of line to point

  }, {
    key: "distanceToPoint",
    value: function distanceToPoint(p, precision) {
      return Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(Math.abs(this.A * p.x + this.B * p.y - this.C) / Math.sqrt(Math.pow(this.A, 2) + Math.pow(this.B, 2)), precision);
    }
  }, {
    key: "hasPointOn",
    value: function hasPointOn(p, precision) {
      if (this.hasPointAlong(p, precision)) {
        if (pointinRect(p, this.p1, this.p2, precision)) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "isEqualTo",
    value: function isEqualTo(line2, precision) {
      var l1 = this;
      var l2 = line2;

      if (typeof precision === 'number') {
        l1 = l1.round(precision);
        l2 = l2.round(precision);
        l1.p1 = l1.p1.round(precision);
        l1.p2 = l1.p2.round(precision);
        l2.p1 = l2.p1.round(precision);
        l2.p2 = l2.p2.round(precision);
      }

      if (l1.A !== l2.A) {
        return false;
      }

      if (l1.B !== l2.B) {
        return false;
      }

      if (l1.C !== l2.C) {
        return false;
      }

      if (l1.p1.isNotEqualTo(l2.p1) && l1.p1.isNotEqualTo(l2.p2)) {
        return false;
      }

      if (l1.p2.isNotEqualTo(l2.p1) && l1.p2.isNotEqualTo(l2.p2)) {
        return false;
      }

      return true;
    }
  }, {
    key: "isOnSameLineAs",
    value: function isOnSameLineAs(line2) {
      var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
      var l1 = this.round(precision);
      var l2 = line2.round(precision); // If A and B are zero, then this is not a line

      if (l1.A === 0 && l1.B === 0 || l2.A === 0 && l2.B === 0) {
        return false;
      } // If A is 0, then it must be 0 on the other line. Similar with B


      if (l1.A !== 0) {
        var scale = l2.A / l1.A;

        if (l1.B * scale !== l2.B) {
          return false;
        }

        if (l1.C * scale !== l2.C) {
          return false;
        }

        return true;
      }

      if (l2.A !== 0) {
        var _scale = l1.A / l2.A;

        if (l2.B * _scale !== l1.B) {
          return false;
        }

        if (l2.C * _scale !== l1.C) {
          return false;
        }

        return true;
      }

      if (l1.B !== 0) {
        var _scale2 = l2.B / l1.B;

        if (l1.A * _scale2 !== l2.A) {
          return false;
        }

        if (l1.C * _scale2 !== l2.C) {
          return false;
        }

        return true;
      }

      if (l2.B !== 0) {
        var _scale3 = l1.B / l2.B;

        if (l2.A * _scale3 !== l1.A) {
          return false;
        }

        if (l2.C * _scale3 !== l1.C) {
          return false;
        }

        return true;
      }

      return true;
    }
  }, {
    key: "intersectsWith",
    value: function intersectsWith(line2) {
      var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
      var l2 = line2; // line2.round(precision);

      var l1 = this; // this.round(precision);

      var det = l1.A * l2.B - l2.A * l1.B;

      if (Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(det, precision) !== 0) {
        var i = point(0, 0);
        i.x = (l2.B * l1.C - l1.B * l2.C) / det;
        i.y = (l1.A * l2.C - l2.A * l1.C) / det;

        if (pointinRect(i, l1.p1, l1.p2, precision) && pointinRect(i, l2.p1, l2.p2, precision)) {
          return {
            onLine: true,
            inLine: true,
            intersect: i
          };
        }

        return {
          onLine: true,
          inLine: false,
          intersect: i
        };
      }

      if (det === 0 && l1.isOnSameLineAs(l2, precision)) {
        // if the lines are colliner then:
        //   - if overlapping,
        //   - if partially overlapping: the intersect point is halfway between
        //     overlapping ends
        //   - if one line is within the other line, the intersect point is
        //     halfway between the midpoints
        //   - if not overlapping, the intersect point is halfway between the nearest ends
        // let l1 = this;
        if (!l1.p1.isOnLine(l2, precision) && !l1.p2.isOnLine(l2, precision) && !l2.p1.isOnLine(l1, precision) && !l2.p2.isOnLine(l1, precision)) {
          var line11 = new Line(l1.p1, l2.p1);
          var line12 = new Line(l1.p1, l2.p2);
          var line21 = new Line(l1.p2, l2.p1);
          var line22 = new Line(l1.p2, l2.p2);

          var _i2 = line11.midpoint();

          var len = line11.length();

          if (line12.length() < len) {
            _i2 = line12.midpoint();
            len = line12.length();
          }

          if (line21.length() < len) {
            _i2 = line21.midpoint();
            len = line21.length();
          }

          if (line22.length() < len) {
            _i2 = line22.midpoint();
            len = line22.length();
          }

          return {
            onLine: true,
            inLine: false,
            intersect: _i2
          };
        }

        if (l1.p1.isOnLine(l2, precision) && l1.p2.isOnLine(l2, precision) && (!l2.p1.isOnLine(l1, precision) || !l2.p2.isOnLine(l1, precision)) || l2.p1.isOnLine(l1, precision) && l2.p2.isOnLine(l1, precision) && (!l1.p1.isOnLine(l2, precision) || !l1.p2.isOnLine(l2, precision))) {
          var _midLine = new Line(l1.midpoint(), l2.midpoint());

          return {
            onLine: true,
            inLine: true,
            intersect: _midLine.midpoint()
          };
        }

        var midLine;

        if (l1.p1.isOnLine(l2, precision) && !l1.p2.isOnLine(l2, precision) && l2.p1.isOnLine(l1, precision) && !l2.p2.isOnLine(l1, precision)) {
          midLine = new Line(l1.p1, l2.p1);
        }

        if (l1.p1.isOnLine(l2, precision) && !l1.p2.isOnLine(l2, precision) && !l2.p1.isOnLine(l1, precision) && l2.p2.isOnLine(l1, precision)) {
          midLine = new Line(l1.p1, l2.p2);
        }

        if (!l1.p1.isOnLine(l2, precision) && l1.p2.isOnLine(l2, precision) && l2.p1.isOnLine(l1, precision) && !l2.p2.isOnLine(l1, precision)) {
          midLine = new Line(l1.p2, l2.p1);
        }

        if (!l1.p1.isOnLine(l2, precision) && l1.p2.isOnLine(l2, precision) && !l2.p1.isOnLine(l1, precision) && l2.p2.isOnLine(l1, precision)) {
          midLine = new Line(l1.p2, l2.p2);
        }

        var _i;

        if (midLine instanceof Line) {
          _i = midLine.midpoint();
        }

        return {
          onLine: true,
          inLine: true,
          intersect: _i
        };
      }

      return {
        onLine: false,
        inLine: false,
        intersect: undefined
      };
    }
  }]);

  return Line;
}();

function line(p1, p2) {
  return new Line(p1, p2);
}

var Rotation =
/*#__PURE__*/
function () {
  function Rotation(angle) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, Rotation);

    this.r = angle;
    this.name = name;
  }

  _createClass(Rotation, [{
    key: "matrix",
    value: function matrix() {
      return _m2__WEBPACK_IMPORTED_MODULE_1__["rotationMatrix"](this.r);
    }
  }, {
    key: "sub",
    value: function sub() {
      var rotToSub = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Rotation(0, this.name);
      return new Rotation(this.r - rotToSub.r, this.name);
    }
  }, {
    key: "round",
    value: function round() {
      var precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
      return new Rotation(Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(this.r, precision), this.name);
    }
  }, {
    key: "add",
    value: function add() {
      var rotToAdd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Rotation(0, this.name);
      return new Rotation(this.r + rotToAdd.r, this.name);
    }
  }, {
    key: "mul",
    value: function mul() {
      var rotToMul = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Rotation(1, this.name);
      return new Rotation(this.r * rotToMul.r, this.name);
    }
  }, {
    key: "_dup",
    value: function _dup() {
      return new Rotation(this.r, this.name);
    }
  }]);

  return Rotation;
}();

var Translation =
/*#__PURE__*/
function (_Point) {
  _inherits(Translation, _Point);

  function Translation(tx) {
    var _this;

    var ty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    _classCallCheck(this, Translation);

    if (tx instanceof Point) {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Translation).call(this, tx.x, tx.y)); // this.x = tx.x;
      // this.y = tx.y;
    } else {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Translation).call(this, tx, ty)); // this.x = tx;
      // this.y = ty;
    }

    _this.name = name;
    return _possibleConstructorReturn(_this);
  }

  _createClass(Translation, [{
    key: "matrix",
    value: function matrix() {
      return _m2__WEBPACK_IMPORTED_MODULE_1__["translationMatrix"](this.x, this.y);
    }
  }, {
    key: "sub",
    value: function sub() {
      var translationToSub = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Translation(0, 0);
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var t = new Point(0, 0);

      if (typeof translationToSub === 'number') {
        t = new Translation(translationToSub, y);
      } else {
        t = translationToSub;
      }

      return new Translation(this.x - t.x, this.y - t.y, this.name);
    }
  }, {
    key: "add",
    value: function add() {
      var translationToAdd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Translation(0, 0);
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var t = new Point(0, 0);

      if (typeof translationToAdd === 'number') {
        t = new Translation(translationToAdd, y);
      } else {
        t = translationToAdd;
      }

      return new Translation(this.x + t.x, this.y + t.y, this.name);
    }
  }, {
    key: "mul",
    value: function mul() {
      var translationToMul = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Translation(1, 1);
      return new Translation(this.x * translationToMul.x, this.y * translationToMul.y, this.name);
    }
  }, {
    key: "round",
    value: function round() {
      var precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
      return new Translation(Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(this.x, precision), Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(this.y, precision), this.name);
    }
  }, {
    key: "_dup",
    value: function _dup() {
      return new Translation(this.x, this.y, this.name);
    }
  }]);

  return Translation;
}(Point);

var Scale =
/*#__PURE__*/
function (_Point2) {
  _inherits(Scale, _Point2);

  function Scale(sx, sy) {
    var _this2;

    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    _classCallCheck(this, Scale);

    if (sx instanceof Point) {
      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Scale).call(this, sx.x, sx.y)); // this.x = sx.x;
      // this.y = sx.y;
    } else {
      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Scale).call(this, sx, sy)); // this.x = sx;
      // this.y = sy;
    }

    _this2.name = name;
    return _possibleConstructorReturn(_this2);
  }

  _createClass(Scale, [{
    key: "matrix",
    value: function matrix() {
      return _m2__WEBPACK_IMPORTED_MODULE_1__["scaleMatrix"](this.x, this.y);
    }
  }, {
    key: "sub",
    value: function sub() {
      var scaleToSub = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Scale(0, 0);
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var s = new Point(0, 0);

      if (typeof scaleToSub === 'number') {
        s = new Scale(scaleToSub, y);
      } else {
        s = scaleToSub;
      }

      return new Scale(this.x - s.x, this.y - s.y, this.name);
    }
  }, {
    key: "round",
    value: function round() {
      var precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
      return new Scale(Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(this.x, precision), Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["roundNum"])(this.y, precision), this.name);
    }
  }, {
    key: "add",
    value: function add() {
      var scaleToAdd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Scale(0, 0);
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var s = new Point(0, 0);

      if (typeof scaleToAdd === 'number') {
        s = new Scale(scaleToAdd, y);
      } else {
        s = scaleToAdd;
      }

      return new Scale(this.x + s.x, this.y + s.y, this.name);
    }
  }, {
    key: "mul",
    value: function mul() {
      var scaleToMul = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Scale(1, 1);

      if (scaleToMul instanceof Scale || scaleToMul instanceof Point) {
        return new Scale(this.x * scaleToMul.x, this.y * scaleToMul.y);
      }

      return new Scale(this.x * scaleToMul, this.y * scaleToMul, this.name);
    }
  }, {
    key: "_dup",
    value: function _dup() {
      return new Scale(this.x, this.y, this.name);
    }
  }]);

  return Scale;
}(Point);

function linearPath(start, delta, percent) {
  return start.add(delta.x * percent, delta.y * percent);
}

function curvedPath(start, delta, percent, options) {
  var o = options;
  var angle = Math.atan2(delta.y, delta.x);
  var midPoint = start.add(new Point(delta.x * o.offset, delta.y * o.offset));
  var dist = delta.toPolar().mag * o.magnitude;
  var controlPoint = options.controlPoint;

  if (controlPoint == null) {
    var direction = options.direction;
    var xDelta = Math.cos(angle + o.rot * Math.PI / 2);
    var yDelta = Math.sin(angle + o.rot * Math.PI / 2);

    if (direction === 'up') {
      if (yDelta < 0) {
        yDelta = Math.sin(angle + o.rot * Math.PI / 2 + Math.PI);
      }
    } else if (direction === 'down') {
      if (yDelta > 0) {
        yDelta = Math.sin(angle + o.rot * Math.PI / 2 + Math.PI);
      }
    } else if (direction === 'left') {
      if (xDelta > 0) {
        xDelta = Math.cos(angle + o.rot * Math.PI / 2 + Math.PI);
      }
    } else if (direction === 'right') {
      if (xDelta < 0) {
        xDelta = Math.cos(angle + o.rot * Math.PI / 2 + Math.PI);
      }
    }

    controlPoint = new Point(midPoint.x + dist * xDelta, midPoint.y + dist * yDelta);
  }

  var p0 = start;
  var p1 = controlPoint;
  var p2 = start.add(delta);
  var t = percent;

  var bx = _quadraticBezier(p0.x, p1.x, p2.x, t);

  var by = _quadraticBezier(p0.y, p1.y, p2.y, t);

  return new Point(bx, by);
}

function translationPath() {
  var pathType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'linear';
  var start = arguments.length > 1 ? arguments[1] : undefined;
  var delta = arguments.length > 2 ? arguments[2] : undefined;
  var percent = arguments.length > 3 ? arguments[3] : undefined;
  var options = arguments.length > 4 ? arguments[4] : undefined;

  if (pathType === 'linear') {
    return linearPath(start, delta, percent);
  }

  if (pathType === 'curved') {
    return curvedPath(start, delta, percent, options);
  }

  return new Point(0, 0);
}

var TransformLimit =
/*#__PURE__*/
function () {
  function TransformLimit(scale, rotation, translation) {
    _classCallCheck(this, TransformLimit);

    this.scale = scale;
    this.rotation = rotation;
    this.translation = translation;
  }

  _createClass(TransformLimit, [{
    key: "_dup",
    value: function _dup() {
      return new TransformLimit(this.scale, this.rotation, this.translation);
    }
  }]);

  return TransformLimit;
}();

var Transform =
/*#__PURE__*/
function () {
  function Transform() {
    var orderOrName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, Transform);

    if (typeof orderOrName === 'string') {
      this.order = [];
      this.name = orderOrName;
    } else {
      this.order = orderOrName.map(function (t) {
        return t._dup();
      });
      this.name = name;
    } // this.order = order.slice();


    this.index = this.order.length;
    this.calcMatrix();
  }

  _createClass(Transform, [{
    key: "translate",
    value: function translate(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var translation = new Translation(x, y, this.name);
      var order = this.order.slice();

      if (this.index === this.order.length) {
        order.push(translation);
      } else {
        this.order[this.index] = translation;
        this.index += 1;
        this.calcMatrix();
        return this;
      }

      return new Transform(order, this.name);
    }
  }, {
    key: "rotate",
    value: function rotate(r) {
      var rotation = new Rotation(r, this.name);
      rotation.name = this.name;
      var order = this.order.slice();

      if (this.index === this.order.length) {
        order.push(rotation);
      } else {
        this.order[this.index] = rotation;
        this.index += 1;
        this.calcMatrix();
        return this;
      } // this.order.push(new Rotation(r));
      // this.calcMatrix();


      return new Transform(order, this.name);
    }
  }, {
    key: "scale",
    value: function scale(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var scale = new Scale(x, y, this.name);
      var order = this.order.slice();

      if (this.index === this.order.length) {
        order.push(scale);
      } else {
        this.order[this.index] = scale;
        this.index += 1;
        this.calcMatrix();
        return this;
      }

      return new Transform(order, this.name);
    }
  }, {
    key: "calcMatrix",
    value: function calcMatrix() {
      var m = _m2__WEBPACK_IMPORTED_MODULE_1__["identity"]();

      for (var i = this.order.length - 1; i >= 0; i -= 1) {
        m = _m2__WEBPACK_IMPORTED_MODULE_1__["mul"](m, this.order[i].matrix());
      } // this.mat = m2.copy(m);
      // return m;


      this.mat = m;
    }
  }, {
    key: "update",
    value: function update(index) {
      if (index < this.order.length) {
        this.index = index;
      }

      return this;
    }
  }, {
    key: "t",
    value: function t() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var count = 0;

      for (var i = 0; i < this.order.length; i += 1) {
        var t = this.order[i];

        if (t instanceof Translation) {
          if (count === index) {
            return new Point(t.x, t.y);
          }

          count += 1;
        }
      }

      return null;
    }
  }, {
    key: "updateTranslation",
    value: function updateTranslation(x) {
      var yOrIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var count = 0;
      var actualIndex = index;

      if (x instanceof Point) {
        actualIndex = yOrIndex;
      }

      for (var i = 0; i < this.order.length; i += 1) {
        var t = this.order[i];

        if (t instanceof Translation) {
          if (count === actualIndex) {
            this.order[i] = new Translation(x, yOrIndex, this.name);
            this.calcMatrix();
            return;
          }

          count += 1;
        }
      }
    }
  }, {
    key: "s",
    value: function s() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var count = 0;

      for (var i = 0; i < this.order.length; i += 1) {
        var t = this.order[i];

        if (t instanceof Scale) {
          if (count === index) {
            return new Point(t.x, t.y);
          }

          count += 1;
        }
      }

      return null;
    }
  }, {
    key: "toDelta",
    value: function toDelta(delta, percent, translationStyle, translationOptions) // translationPath: (Point, Point, number, ?number, ?number) => Point,
    // direction: number = 1,
    // mag: number = 0.5,
    // offset: number = 0.5,
    {
      var calcTransform = this._dup();

      for (var i = 0; i < this.order.length; i += 1) {
        var stepStart = this.order[i];
        var stepDelta = delta.order[i];

        if (stepStart instanceof Scale && stepDelta instanceof Scale) {
          calcTransform.order[i] = stepStart.add(stepDelta.mul(percent));
        }

        if (stepStart instanceof Rotation && stepDelta instanceof Rotation) {
          calcTransform.order[i] = new Rotation(stepStart.r + stepDelta.r * percent);
        }

        if (stepStart instanceof Translation && stepDelta instanceof Translation) {
          calcTransform.order[i] = new Translation(translationPath(translationStyle, stepStart, stepDelta, percent, translationOptions));
        }
      }

      return calcTransform;
    }
  }, {
    key: "updateScale",
    value: function updateScale(x) {
      var yOrIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var count = 0;
      var actualIndex = index;

      if (x instanceof Point) {
        actualIndex = yOrIndex;
      }

      for (var i = 0; i < this.order.length; i += 1) {
        var t = this.order[i];

        if (t instanceof Scale) {
          if (count === actualIndex) {
            this.order[i] = new Scale(x, yOrIndex, this.name);
            this.calcMatrix();
            return;
          }

          count += 1;
        }
      }
    }
  }, {
    key: "r",
    value: function r() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var count = 0;

      for (var i = 0; i < this.order.length; i += 1) {
        var t = this.order[i];

        if (t instanceof Rotation) {
          if (count === index) {
            return t.r;
          }

          count += 1;
        }
      }

      return null;
    }
  }, {
    key: "updateRotation",
    value: function updateRotation(r) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var count = 0;

      for (var i = 0; i < this.order.length; i += 1) {
        var t = this.order[i];

        if (t instanceof Rotation) {
          if (count === index) {
            this.order[i] = new Rotation(r, this.name);
            this.calcMatrix();
            return;
          }

          count += 1;
        }
      }
    }
  }, {
    key: "m",
    value: function m() {
      return this.mat;
    }
  }, {
    key: "matrix",
    value: function matrix() {
      return this.mat;
    }
  }, {
    key: "isSimilarTo",
    value: function isSimilarTo(transformToCompare) {
      if (transformToCompare.order.length !== this.order.length) {
        return false;
      }

      for (var i = 0; i < this.order.length; i += 1) {
        if (this.order[i].constructor.name !== transformToCompare.order[i].constructor.name) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "isEqualTo",
    value: function isEqualTo(transformToCompare) {
      var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

      // if (transformToCompare.order.length !== this.order.length) {
      //   return false;
      // }
      if (!this.isSimilarTo(transformToCompare)) {
        return false;
      }

      for (var i = 0; i < this.order.length; i += 1) {
        var compare = transformToCompare.order[i];
        var thisTrans = this.order[i];

        if (thisTrans.constructor.name !== compare.constructor.name) {
          return false;
        }

        if (thisTrans instanceof Translation && compare instanceof Translation || thisTrans instanceof Scale && compare instanceof Scale) {
          if (compare.isNotEqualTo(thisTrans, precision)) {
            return false;
          }
        }

        if (thisTrans instanceof Rotation) {
          if (compare.r !== thisTrans.r) {
            return false;
          }
        }
      }

      return true;
    } // Subtract a transform from the current one.
    // If the two transforms have different order types, then just return
    // the current transform.

  }, {
    key: "sub",
    value: function sub() {
      var transformToSubtract = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Transform();

      if (!this.isSimilarTo(transformToSubtract)) {
        return new Transform(this.order, this.name);
      }

      var order = [];

      for (var i = 0; i < this.order.length; i += 1) {
        // $FlowFixMe (this is already fixed in isSimilarTo check above)
        order.push(this.order[i].sub(transformToSubtract.order[i]));
      }

      return new Transform(order, this.name);
    } // Add a transform to the current one.
    // If the two transforms have different order types, then just return
    // the current transform.

  }, {
    key: "add",
    value: function add() {
      var transformToAdd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Transform();

      if (!this.isSimilarTo(transformToAdd)) {
        return new Transform(this.order, this.name);
      }

      var order = [];

      for (var i = 0; i < this.order.length; i += 1) {
        // $FlowFixMe (this is already fixed in isSimilarTo check above)
        order.push(this.order[i].add(transformToAdd.order[i]));
      }

      return new Transform(order, this.name);
    } // transform step wise multiplication

  }, {
    key: "mul",
    value: function mul() {
      var transformToMul = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Transform();

      if (!this.isSimilarTo(transformToMul)) {
        return new Transform(this.order, this.name);
      }

      var order = [];

      for (var i = 0; i < this.order.length; i += 1) {
        // $FlowFixMe (this is already fixed in isSimilarTo check above)
        order.push(this.order[i].mul(transformToMul.order[i]));
      }

      return new Transform(order, this.name);
    }
  }, {
    key: "transform",
    value: function transform(_transform) {
      var t = new Transform([], this.name);
      t.order = _transform.order.concat(this.order);
      t.mat = _m2__WEBPACK_IMPORTED_MODULE_1__["mul"](this.matrix(), _transform.matrix());
      return t;
    }
  }, {
    key: "transformBy",
    value: function transformBy(transform) {
      var t = new Transform([], this.name);
      t.order = this.order.concat(transform.order);
      t.mat = _m2__WEBPACK_IMPORTED_MODULE_1__["mul"](transform.matrix(), this.matrix());
      return t;
    }
  }, {
    key: "round",
    value: function round() {
      var precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
      var order = [];

      for (var i = 0; i < this.order.length; i += 1) {
        order.push(this.order[i].round(precision));
      }

      return new Transform(order, this.name);
    }
  }, {
    key: "clip",
    value: function clip(minTransform, maxTransform, limitLine) {
      if (!this.isSimilarTo(minTransform) || !this.isSimilarTo(maxTransform)) {
        return this._dup();
      }

      var order = [];

      for (var i = 0; i < this.order.length; i += 1) {
        var t = this.order[i];
        var min = minTransform.order[i];
        var max = maxTransform.order[i];

        if (t instanceof Translation && min instanceof Translation && max instanceof Translation) {
          var x = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipValue"])(t.x, min.x, max.x);
          var y = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipValue"])(t.y, min.y, max.y);
          order.push(new Translation(x, y, this.name));
        } else if (t instanceof Rotation && min instanceof Rotation && max instanceof Rotation) {
          order.push(new Rotation(Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipValue"])(t.r, min.r, max.r), this.name));
        } else if (t instanceof Scale && min instanceof Scale && max instanceof Scale) {
          var _x = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipValue"])(t.x, min.x, max.x);

          var _y = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipValue"])(t.y, min.y, max.y);

          order.push(new Scale(_x, _y, this.name));
        }
      }

      var clippedTransform = new Transform(order, this.name);

      if (limitLine != null) {
        var _t = clippedTransform.t();

        if (_t != null) {
          var perpLine = new Line(_t, 1, limitLine.angle() + Math.PI / 2);

          var _perpLine$intersectsW = perpLine.intersectsWith(limitLine),
              intersect = _perpLine$intersectsW.intersect;

          if (intersect) {
            if (intersect.isOnLine(limitLine, 4)) {
              clippedTransform.updateTranslation(intersect);
            } else {
              var p1Dist = distance(intersect, limitLine.p1);
              var p2Dist = distance(intersect, limitLine.p2);

              if (p1Dist < p2Dist) {
                clippedTransform.updateTranslation(limitLine.p1);
              } else {
                clippedTransform.updateTranslation(limitLine.p2);
              }
            }
          }
        }
      }

      return clippedTransform;
    }
  }, {
    key: "clipMag",
    value: function clipMag(zeroThresholdTransform, maxTransform) {
      var vector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      // const min = 0.00001;
      // const max = 1 / min;
      // const zeroS = zeroThresholdTransform.s() || new Point(min, min);
      // const zeroR = zeroThresholdTransform.r() || min;
      // const zeroT = zeroThresholdTransform.t() || new Point(min, min);
      // const maxS = maxTransform.s() || new Point(max, max);
      // const maxR = maxTransform.r() || max;
      // const maxT = maxTransform.t() || new Point(max, max);
      // if (!this.isSimilarTo(zeroThresholdTransform) ||
      //     !this.isSimilarTo(maxTransform)) {
      //   return new Transform(this.order);
      // }
      var order = [];
      var z = zeroThresholdTransform;
      var max = maxTransform;

      for (var i = 0; i < this.order.length; i += 1) {
        var t = this.order[i];

        if (t instanceof Translation) {
          if (vector) {
            var _t$toPolar = t.toPolar(),
                mag = _t$toPolar.mag,
                angle = _t$toPolar.angle;

            var clipM = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipMag"])(mag, z.translation, max.translation);

            order.push(new Translation(clipM * Math.cos(angle), clipM * Math.sin(angle), this.name));
          } else {
            var x = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipMag"])(t.x, z.translation, max.translation);

            var y = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipMag"])(t.y, z.translation, max.translation);

            order.push(new Translation(x, y, this.name));
          }
        } else if (t instanceof Rotation) {
          var r = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipMag"])(t.r, z.rotation, max.rotation);

          order.push(new Rotation(r, this.name));
        } else if (t instanceof Scale) {
          if (vector) {
            var _t$toPolar2 = t.toPolar(),
                _mag = _t$toPolar2.mag,
                _angle = _t$toPolar2.angle;

            var _clipM = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipMag"])(_mag, z.scale, max.scale);

            order.push(new Scale(_clipM * Math.cos(_angle), _clipM * Math.sin(_angle), this.name));
          } else {
            var _x2 = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipMag"])(t.x, z.scale, max.scale);

            var _y2 = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["clipMag"])(t.y, z.scale, max.scale);

            order.push(new Scale(_x2, _y2, this.name));
          }
        }
      }

      return new Transform(order, this.name);
    }
  }, {
    key: "constant",
    value: function constant() {
      var _constant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var order = [];

      for (var i = 0; i < this.order.length; i += 1) {
        var t = this.order[i];

        if (t instanceof Translation) {
          order.push(new Translation(_constant, _constant, this.name));
        } else if (t instanceof Rotation) {
          order.push(new Rotation(_constant, this.name));
        } else if (t instanceof Scale) {
          order.push(new Scale(_constant, _constant, this.name));
        }
      }

      return new Transform(order, this.name);
    }
  }, {
    key: "zero",
    value: function zero() {
      return this.constant(0);
    }
  }, {
    key: "isZero",
    value: function isZero() {
      for (var i = 0; i < this.order.length; i += 1) {
        var t = this.order[i];

        if (t instanceof Translation || t instanceof Scale) {
          if (t.x !== 0 || t.y !== 0) {
            return false;
          }
        } else if (t instanceof Rotation) {
          if (t.r !== 0) {
            return false;
          }
        }
      }

      return true;
    }
  }, {
    key: "_dup",
    value: function _dup() {
      var t = new Transform(this.order, this.name);
      t.index = this.index;
      return t;
    }
  }, {
    key: "decelerate",
    value: function decelerate(velocity, deceleration, deltaTime, zeroThreshold) {
      var nextV = new Transform();
      var nextT = new Transform();
      var z = zeroThreshold;
      var d = deceleration;

      for (var i = 0; i < this.order.length; i += 1) {
        var t = this.order[i];
        var v = velocity.order[i]; // const z = zeroThreshold.order[i];

        if (t instanceof Translation && v instanceof Translation) {
          var _v$toPolar = v.toPolar(),
              mag = _v$toPolar.mag,
              angle = _v$toPolar.angle;

          var next = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["decelerate"])(0, mag, d.translation, deltaTime, z.translation);

          nextV = nextV.translate(next.v * Math.cos(angle), next.v * Math.sin(angle));
          nextT = nextT.translate(t.x + next.p * Math.cos(angle), t.y + next.p * Math.sin(angle));
        } else if (t instanceof Rotation && v instanceof Rotation) {
          var r = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["decelerate"])(t.r, v.r, d.rotation, deltaTime, z.rotation);

          nextV = nextV.rotate(r.v);
          nextT = nextT.rotate(r.p);
        } else if (t instanceof Scale && v instanceof Scale) {
          var _v$toPolar2 = v.toPolar(),
              _mag2 = _v$toPolar2.mag,
              _angle2 = _v$toPolar2.angle;

          var _next = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["decelerate"])(0, _mag2, d.scale, deltaTime, z.scale);

          nextV = nextV.scale(_next.v * Math.cos(_angle2), _next.v * Math.sin(_angle2));
          nextT = nextT.scale(t.x + _next.p * Math.cos(_angle2), t.y + _next.p * Math.sin(_angle2));
        } else {
          return {
            v: new Transform(),
            t: new Transform()
          };
        }
      }

      return {
        v: nextV,
        t: nextT
      };
    } // Return the velocity of each element in the transform
    // If the current and previous transforms are inconsistent in type order,
    // then a transform of value 0, but with the same type order as "this" will
    // be returned.

  }, {
    key: "velocity",
    value: function velocity(previousTransform, deltaTime, zeroThreshold, maxTransform) {
      var order = [];

      if (!this.isSimilarTo(previousTransform)) {
        return this.zero();
      }

      var deltaTransform = this.sub(previousTransform);

      for (var i = 0; i < deltaTransform.order.length; i += 1) {
        var t = deltaTransform.order[i];

        if (t instanceof Translation) {
          order.push(new Translation(t.x / deltaTime, t.y / deltaTime));
        } else if (t instanceof Rotation) {
          order.push(new Rotation(t.r / deltaTime));
        } else if (t instanceof Scale) {
          order.push(new Scale(t.x / deltaTime, t.y / deltaTime));
        }
      }

      var v = new Transform(order); // let z = zeroThreshold;
      // let m = maxTransform;
      // if (!this.isSimilarTo(zeroThreshold)) {
      //   z = this.constant(0);
      // }
      // if (!this.isSimilarTo(maxTransform)) {
      //   m = v._dup();
      // }

      return v.clipMag(zeroThreshold, maxTransform);
    }
  }]);

  return Transform;
}();

function spaceToSpaceTransform(s1, s2) {
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var xScale = s2.x.width / s1.x.width;
  var yScale = s2.y.height / s1.y.height;
  var t = new Transform(name).scale(xScale, yScale).translate(s2.x.bottomLeft - s1.x.bottomLeft * xScale, s2.y.bottomLeft - s1.y.bottomLeft * yScale);
  return t;
}

function comparePoints(p, currentMin, currentMax, firstPoint) {
  var min = new Point(0, 0);
  var max = new Point(0, 0);

  if (firstPoint) {
    min.x = p.x;
    min.y = p.y;
    max.x = p.x;
    max.y = p.y;
  } else {
    min.x = p.x < currentMin.x ? p.x : currentMin.x;
    min.y = p.y < currentMin.y ? p.y : currentMin.y;
    max.x = p.x > currentMax.x ? p.x : currentMax.x;
    max.y = p.y > currentMax.y ? p.y : currentMax.y;
  }

  return {
    min: min,
    max: max
  };
}

function polarToRect(mag, angle) {
  return new Point(mag * Math.cos(angle), mag * Math.sin(angle));
}

function rectToPolar(x) {
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var rect;

  if (typeof x === 'number') {
    rect = new Point(x, y);
  } else {
    rect = x;
  }

  var mag = rect.distance();
  var angle = Math.atan2(rect.y, rect.x);

  if (angle < 0) {
    angle += Math.PI * 2;
  }

  return {
    mag: mag,
    angle: angle
  };
} // $FlowFixMe


function getBoundingRect(pointArrays) {
  var firstPoint = true;
  var result = {
    min: new Point(0, 0),
    max: new Point(0, 0)
  };
  pointArrays.forEach(function (pointOrArray) {
    if (Array.isArray(pointOrArray)) {
      pointOrArray.forEach(function (p) {
        result = comparePoints(p, result.min, result.max, firstPoint);
        firstPoint = false;
      });
    } else {
      result = comparePoints(pointOrArray, result.min, result.max, firstPoint);
    }

    firstPoint = false;
  });
  return new Rect(result.min.x, result.min.y, result.max.x - result.min.x, result.max.y - result.min.y);
}

function threePointAngle(p2, p1, p3) {
  var p12 = distance(p1, p2);
  var p13 = distance(p1, p3);
  var p23 = distance(p2, p3);
  return Math.acos((Math.pow(p12, 2) + Math.pow(p13, 2) - Math.pow(p23, 2)) / (2 * p12 * p13));
}

function randomPoint(withinRect) {
  var randPoint = Object(_mathtools__WEBPACK_IMPORTED_MODULE_0__["rand2D"])(withinRect.left, withinRect.bottom, withinRect.right, withinRect.top);
  return new Point(randPoint.x, randPoint.y);
}

function getMaxTimeFromVelocity(startTransform, stopTransform, velocityTransform, rotDirection) {
  var deltaTransform = stopTransform.sub(startTransform);
  var time = 0;
  deltaTransform.order.forEach(function (delta, index) {
    if (delta instanceof Translation || delta instanceof Scale) {
      var v = velocityTransform.order[index];

      if ((v instanceof Translation || v instanceof Scale) && v.x !== 0 && v.y !== 0) {
        var xTime = Math.abs(delta.x) / v.x;
        var yTime = Math.abs(delta.y) / v.y;
        time = xTime > time ? xTime : time;
        time = yTime > time ? yTime : time;
      }
    }

    var start = startTransform.order[index];
    var target = stopTransform.order[index];

    if (delta instanceof Rotation && start instanceof Rotation && target instanceof Rotation) {
      var rotDiff = getDeltaAngle(start.r, target.r, rotDirection); // eslint-disable-next-line no-param-reassign

      delta.r = rotDiff;
      var _v = velocityTransform.order[index];

      if (_v instanceof Rotation && _v !== 0) {
        var rTime = Math.abs(delta.r / _v.r);
        time = rTime > time ? rTime : time;
      }
    }
  });
  return time;
}

function getMoveTime(startTransform, stopTransform) // 100%/s
{
  var rotDirection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var translationVelocity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Point(0.25, 0.25);
  var rotationVelocity = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 2 * Math.PI / 6;
  var scaleVelocity = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new Point(1, 1);
  var startTransforms;

  if (startTransform instanceof Transform) {
    startTransforms = [startTransform];
  } else {
    startTransforms = startTransform;
  }

  var stopTransforms;

  if (stopTransform instanceof Transform) {
    stopTransforms = [stopTransform];
  } else {
    stopTransforms = stopTransform;
  }

  if (stopTransforms.length !== startTransforms.length) {
    return 0;
  }

  var maxTime = 0;
  startTransforms.forEach(function (startT, index) {
    var stopT = stopTransforms[index];

    var velocity = startT._dup();

    for (var i = 0; i < velocity.order.length; i += 1) {
      var v = velocity.order[i];

      if (v instanceof Translation) {
        v.x = translationVelocity.x;
        v.y = translationVelocity.y;
      } else if (v instanceof Rotation) {
        v.r = rotationVelocity;
      } else {
        v.x = scaleVelocity.x;
        v.y = scaleVelocity.y;
      }
    }

    var time = getMaxTimeFromVelocity(startT, stopT, velocity, rotDirection);

    if (time > maxTime) {
      maxTime = time;
    }
  });
  return maxTime;
}



/***/ }),

/***/ "./src/js/diagram/tools/m2.js":
/*!************************************!*\
  !*** ./src/js/diagram/tools/m2.js ***!
  \************************************/
/*! exports provided: mul, identity, t, copy, translate, rotate, transform, scale, inverse, rotationMatrix, translationMatrix, scaleMatrix */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mul", function() { return mul; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "identity", function() { return identity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return t; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "copy", function() { return copy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "translate", function() { return translate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rotate", function() { return rotate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transform", function() { return transform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scale", function() { return scale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rotationMatrix", function() { return rotationMatrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "translationMatrix", function() { return translationMatrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scaleMatrix", function() { return scaleMatrix; });
// 2D Matrix functions
function mul(a, b) {
  return [a[0] * b[0] + a[1] * b[3] + a[2] * b[6], a[0] * b[1] + a[1] * b[4] + a[2] * b[7], a[0] * b[2] + a[1] * b[5] + a[2] * b[8], a[3] * b[0] + a[4] * b[3] + a[5] * b[6], a[3] * b[1] + a[4] * b[4] + a[5] * b[7], a[3] * b[2] + a[4] * b[5] + a[5] * b[8], a[6] * b[0] + a[7] * b[3] + a[8] * b[6], a[6] * b[1] + a[7] * b[4] + a[8] * b[7], a[6] * b[2] + a[7] * b[5] + a[8] * b[8]];
}

function t(a) {
  return [a[0], a[3], a[6], a[1], a[4], a[7], a[2], a[5], a[8]];
}

function identity() {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

function copy(a) {
  return [a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]];
}

function translationMatrix(tx, ty) {
  return [1, 0, tx, 0, 1, ty, 0, 0, 1];
}

function translate(m, tx, ty) {
  return mul(m, translationMatrix(tx, ty));
}

function rotationMatrix(angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  return [c, -s, 0, s, c, 0, 0, 0, 1];
}

function rotate(m, angle) {
  return mul(m, rotationMatrix(angle));
}

function scaleMatrix(sx, sy) {
  return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
}

function scale(m, sx, sy) {
  return mul(m, scaleMatrix(sx, sy));
}

function transform(m, px, py) {
  return [m[0] * px + m[1] * py + m[2], m[3] * px + m[4] * py + m[5]];
}

function inverse(m) {
  var det = m[0] * (m[4] * m[8] - m[7] * m[5]) - // eslint-disable-line
  m[1] * (m[3] * m[8] - m[5] * m[6]) + // eslint-disable-line
  m[2] * (m[3] * m[7] - m[4] * m[6]);
  var invdet = 1 / det;
  var minv00 = (m[4] * m[8] - m[7] * m[5]) * invdet;
  var minv01 = (m[2] * m[7] - m[1] * m[8]) * invdet;
  var minv02 = (m[1] * m[5] - m[2] * m[4]) * invdet;
  var minv10 = (m[5] * m[6] - m[3] * m[8]) * invdet;
  var minv11 = (m[0] * m[8] - m[2] * m[6]) * invdet;
  var minv12 = (m[3] * m[2] - m[0] * m[5]) * invdet;
  var minv20 = (m[3] * m[7] - m[6] * m[4]) * invdet;
  var minv21 = (m[6] * m[1] - m[0] * m[7]) * invdet;
  var minv22 = (m[0] * m[4] - m[3] * m[1]) * invdet;
  return [minv00, minv01, minv02, minv10, minv11, minv12, minv20, minv21, minv22];
}



/***/ }),

/***/ "./src/js/diagram/tools/mathtools.js":
/*!*******************************************!*\
  !*** ./src/js/diagram/tools/mathtools.js ***!
  \*******************************************/
/*! exports provided: round, roundNum, decelerate, easeinout, easeout, easein, sinusoid, linear, clipMag, clipValue, range, randInt, rand, randElement, removeRandElement, randElements, rand2D */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "round", function() { return round; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "roundNum", function() { return roundNum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decelerate", function() { return decelerate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "easeinout", function() { return easeinout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "easeout", function() { return easeout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "easein", function() { return easein; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sinusoid", function() { return sinusoid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "linear", function() { return linear; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clipMag", function() { return clipMag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clipValue", function() { return clipValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "range", function() { return range; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randInt", function() { return randInt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rand", function() { return rand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randElement", function() { return randElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeRandElement", function() { return removeRandElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randElements", function() { return randElements; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rand2D", function() { return rand2D; });
var roundNum = function roundNum(value) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  var multiplier = Math.pow(10, precision);
  var result = Math.round(value * multiplier) / multiplier;

  if (Object.is(result, -0)) {
    result = 0;
  }

  return result;
};

function round(arrayOrValue) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  var result = 0;

  if (Array.isArray(arrayOrValue)) {
    result = arrayOrValue.map(function (elem) {
      return round(elem, precision);
    });
  }

  if (typeof arrayOrValue === 'number') {
    result = roundNum(arrayOrValue, precision);
  } // $FlowFixMe


  return result;
} // // clipValue clips a value to either 0 if it's small enough, or to a max value
// // Value, and maxValue are sign independent. e.g.
// //    * value, maxValue = 2, 1 => clips to 1
// //    * value, maxValue = -2, -1 => clips to -1
// //    * value, maxValue = -2, 1 => clips to -1
// //    * value, maxValue = 2, -1 => clips to 1
// function clipValue(
//   value: number,
//   zeroThreshold: number,
//   maxValue: number = 0,
// ) {
//   let result = value;
//   let zero = zeroThreshold;
//   if (zero < 0) {
//     zero = -zero;
//   }
//   if (value > -zero && value < zero) {
//     return 0;
//   }
//   let max = maxValue;
//   if (max < 0) {
//     max = -max;
//   }
//   if (value > max) {
//     result = max;
//   }
//   if (value < -max) {
//     result = -max;
//   }
//   return result;
// }
// Clip a value to either max velocity, or 0 once under the minimum
// threashold.
//  * velocity: can be positive or negative
//  * maxVelocity will clip velocity to:
//      * |maxVelocity| if velocity > 0
//      * -|maxVelocity| if velcity < 0
//  * zeroThreshold will clip velocity to:
//       * 0 if velocity is larger than -|zeroThreshold| and smaller than
//         |zeroThreshold|.


function clipMag(value, zeroThreshold, maxValue) {
  var result = value;
  var zeroT = zeroThreshold;
  var maxV = maxValue;

  if (zeroT === null) {
    zeroT = 0;
  }

  if (zeroT < 0) {
    zeroT = -zeroT;
  }

  if (maxV === null) {
    return result;
  }

  if (maxV < 0) {
    maxV = -maxV;
  }

  if (value >= -zeroT && value <= zeroT) {
    result = 0;
  }

  if (value > maxV) {
    result = maxV;
  }

  if (value < -maxV) {
    result = -maxV;
  }

  return result;
}

function clipValue(value, minValue, maxValue) {
  var clipped = value;

  if (minValue !== null) {
    if (value < minValue) {
      clipped = minValue;
    }
  }

  if (maxValue !== null) {
    if (value > maxValue) {
      clipped = maxValue;
    }
  }

  return clipped;
}

var decelerate = function getPositionVelocityFromDecAndTime(position, velocity, magDeceleration, time, zeroThreshold) {
  var zeroT = 0;

  if (zeroThreshold !== null) {
    zeroT = zeroThreshold;
  }

  var decel = 0;

  if (magDeceleration !== null) {
    decel = magDeceleration;
  } // If the velocity is currently 0, then no further deceleration can occur, so
  // return the current velocity and position


  var v = clipMag(velocity, zeroT, velocity);

  if (v === 0) {
    return {
      p: position,
      v: 0
    };
  }

  var d = decel;

  if (decel < 0) {
    d = -d;
  } // If there is some initial velocity, then calc its sign and


  var sign = velocity / Math.abs(velocity);
  var newVelocity = velocity - sign * d * time; // if the new velocity changes sign, then it should go to 0. If it doesn't
  // change sign, then clip incase it should go to 0 because it is below
  // the zero velocity threshold.

  var newSign = newVelocity / Math.abs(newVelocity);

  if (newSign !== sign) {
    newVelocity = 0;
  } else {
    newVelocity = clipMag(newVelocity, zeroT, newVelocity);
  } // If the new velocity is clipped, then we need to use the time to where the
  // velocity crosses the clipping point.
  // v_new = v_init + a*t
  // Therefore, if v_new = zeroT: t = (zeroT - vi)/a


  var t = time;

  if (newVelocity === 0) {
    var z = zeroT;
    var zSign = z / Math.abs(z);

    if (zSign !== sign) {
      z = -z;
    }

    t = Math.abs((z - velocity) / d);
  } // Now can calculate the new position


  var newPosition = position + velocity * t - sign * 0.5 * d * t * t;
  return {
    p: newPosition,
    v: newVelocity
  };
};

var linear = function linear(percentTime) {
  var invert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (invert) {
    return percentTime;
  }

  return percentTime;
};

var easeinout = function easeinout(percentTime) {
  var invert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (invert) {
    var a = percentTime;
    return (2 * a - Math.sqrt(-4 * a * a + 4 * a)) / (4 * a - 2);
  }

  var x = percentTime;
  var percentDistance = Math.pow(x, 2) / (Math.pow(x, 2) + Math.pow(1 - x, 2));
  return percentDistance;
}; // TODO fix invert


function easeout(percentTime) {
  var invert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (invert) {
    var a = percentTime;
    var b = (2 * a - Math.sqrt(-4 * a * a + 4 * a)) / (4 * a - 2); // return (b - 0.5) * 2;

    return b;
  }

  var x = 0.5 + percentTime / 2;
  var power = 2;
  var percentDistance = Math.pow(x, power) / (Math.pow(x, power) + Math.pow(1 - x, power));
  return (percentDistance - 0.5) * 2;
} // TODO fix invert


function easein(percentTime) {
  var invert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (invert) {
    var a = percentTime;
    var b = (2 * a - Math.sqrt(-4 * a * a + 4 * a)) / (4 * a - 2); // return (b - 0.5) * 2;

    return b;
  }

  var x = percentTime / 2;
  var power = 2;
  var percentDistance = Math.pow(x, power) / (Math.pow(x, power) + Math.pow(1 - x, power));
  return percentDistance * 2;
}

function sinusoid() {
  var deltaTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var frequency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var mag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var phaseOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  return bias + mag * Math.sin(deltaTime * frequency * 2.0 * Math.PI + phaseOffset);
} // const animationPhase = (transform, time, rotDirection = 0, animationStyle = easeinout) => {
//     return {
//         transform: transform._dup(),
//         time: time,
//         rotDirection: rotDirection,
//         animationStyle: animationStyle,
//     }
// }


function range(start, stop) {
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var out = [];

  for (var i = start; i <= stop + step * 0.5; i += step) {
    out.push(i);
  }

  return out;
}

function randInt(minOrMax) {
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (max != null) {
    var min = minOrMax;
    return Math.floor(Math.random() * Math.floor(max - min) + Math.floor(min));
  }

  return Math.floor(Math.random() * Math.floor(minOrMax));
}

function rand(minOrMax) {
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (max != null) {
    var min = minOrMax;
    return Math.random() * (max - min) + min;
  }

  return Math.random() * minOrMax;
}

function randElement(inputArray) {
  var index = randInt(inputArray.length);
  return inputArray[index];
}

function removeRandElement(inputArray) {
  var index = rand(inputArray.length);
  return inputArray.splice(index, 1)[0];
}

function randElements(num, inputArray) {
  var possibleIndeces = range(0, inputArray.length - 1, 1);
  var elements = [];

  for (var i = 0; i < num; i += 1) {
    var index = removeRandElement(possibleIndeces);
    elements.push(inputArray[index]);
  }

  return elements;
}

function rand2D(minX, minY, maxX, maxY) {
  return {
    x: rand(minX, maxX),
    y: rand(minY, maxY)
  };
}



/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/*! exports provided: mathTools, d2Tools */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _diagram_tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./diagram/tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "d2Tools", function() { return _diagram_tools_g2__WEBPACK_IMPORTED_MODULE_0__; });
/* harmony import */ var _diagram_tools_mathtools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./diagram/tools/mathtools */ "./src/js/diagram/tools/mathtools.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mathTools", function() { return _diagram_tools_mathtools__WEBPACK_IMPORTED_MODULE_1__; });
// import homePage from './views/home/home';
// // import aboutPage from './views/about/about';
// // import introPage from './views/introduction/introduction';
// // import lessonSinglePage from './views/lessonSinglePage/lessonSinglePage';
// // import lessonMultiPage from './views/lessonMultiPage/lessonMultiPage';
// homePage();
// // introPage();
// // aboutPage();


 // module.exports = {
//   mathTools, d2Tools,
// };

/***/ })

/******/ });
});
//# sourceMappingURL=dd.js.map