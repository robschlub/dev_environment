(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("diagramLib", [], factory);
	else if(typeof exports === 'object')
		exports["diagramLib"] = factory();
	else
		root["diagramLib"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/diagramLib.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/diagram/AnimationPhase.js":
/*!******************************************!*\
  !*** ./src/js/diagram/AnimationPhase.js ***!
  \******************************************/
/*! exports provided: AnimationPhase, ColorAnimationPhase, CustomAnimationPhase */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimationPhase", function() { return AnimationPhase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColorAnimationPhase", function() { return ColorAnimationPhase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomAnimationPhase", function() { return CustomAnimationPhase; });
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _tools_mathtools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tools/mathtools */ "./src/js/diagram/tools/mathtools.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Element */ "./src/js/diagram/Element.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



// eslint-disable-next-line import/no-cycle
 // Planned Animation

var AnimationPhase =
/*#__PURE__*/
function () {
  // The target transform to animate to
  // animation time or velocity.
  // If velocity=0, it is disregarded.
  // Time for all transform operations will be equal to the time of the longest
  // operation.
  // animation time
  // Direction of rotation
  // Animation style
  // Time when phase started
  // Transform at start of phase
  // Transform delta from start to target
  function AnimationPhase() {
    var startTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var targetTransform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
    var timeOrVelocity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var rotDirection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var finishOnCancel = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
    var animationStyle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_1__["easeinout"];
    var translationStyle = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'linear';
    var translationOptions = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : {
      rot: 1,
      magnitude: 0.5,
      offset: 0.5,
      controlPoint: null,
      direction: ''
    };

    _classCallCheck(this, AnimationPhase);

    if (startTransform == null) {
      this.startTransform = null;
    } else {
      this.startTransform = startTransform._dup();
    }

    this.targetTransform = targetTransform._dup();
    this.timeOrVelocity = timeOrVelocity;
    this.rotDirection = rotDirection;
    this.animationStyle = animationStyle;
    this.translationStyle = translationStyle;
    this.translationOptions = translationOptions;
    this.callback = callback;
    this.finishOnCancel = finishOnCancel;
    this.startTime = -1; // this.startTransform = new Transform();

    this.deltaTransform = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
  }

  _createClass(AnimationPhase, [{
    key: "_dup",
    value: function _dup() {
      var c = new AnimationPhase(this.startTransform, this.targetTransform, this.timeOrVelocity, this.rotDirection, this.callback, this.finishOnCancel, this.animationStyle, this.translationStyle, Object.assign({}, this.translationOptions));
      c.startTime = this.startTime; // this.startTransform = this.startTransform._dup();

      c.deltaTransform = this.deltaTransform._dup();
      return c;
    }
  }, {
    key: "start",
    value: function start(currentTransform) {
      var _this = this;

      if (this.startTransform == null) {
        this.startTransform = currentTransform._dup();
      }

      var startTransform = this.startTransform;

      if (startTransform != null) {
        this.deltaTransform = this.targetTransform.sub(startTransform);
        var time = 0;

        if (typeof this.timeOrVelocity === 'number') {
          time = this.timeOrVelocity;
        } else {
          time = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["getMaxTimeFromVelocity"])(startTransform, this.targetTransform, this.timeOrVelocity, this.rotDirection);
        }

        if (time === 0) {
          this.time = 1;
        } else {
          this.time = time;
        }

        this.deltaTransform.order.forEach(function (delta, index) {
          var start = startTransform.order[index];
          var target = _this.targetTransform.order[index];

          if (delta instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rotation"] && start instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rotation"] && target instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rotation"]) {
            var rotDiff = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["getDeltaAngle"])(start.r, target.r, _this.rotDirection); // eslint-disable-next-line no-param-reassign

            delta.r = rotDiff;
          }
        });
        this.startTime = -1;
      }
    }
  }, {
    key: "finish",
    value: function finish( // eslint-disable-next-line no-use-before-define
    element) {
      var _this2 = this;

      var cancelled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var forceSetToEnd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      // console.log('finished', this.callback)
      var setToEnd = function setToEnd() {
        element.setTransform(_this2.targetTransform);
      };

      if (forceSetToEnd === null) {
        if (!cancelled || this.finishOnCancel) {
          setToEnd();
        }
      }

      if (forceSetToEnd === true) {
        setToEnd();
      }

      if (this.callback != null) {
        this.callback(cancelled);
      }
    }
  }]);

  return AnimationPhase;
}(); // Planned Animation

var ColorAnimationPhase =
/*#__PURE__*/
function () {
  // The target transform to animate to
  // animation time
  // Animation style
  // Time when phase started
  // callbackOnCancel: boolean;
  function ColorAnimationPhase() {
    var startColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var targetColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0, 1];
    var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var disolve = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var finishOnCancel = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
    var animationStyle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_1__["linear"];

    _classCallCheck(this, ColorAnimationPhase);

    this.targetColor = targetColor.slice();
    this.endColor = targetColor.slice();

    if (disolve === 'out') {
      this.targetColor[3] = 0.01;
    }

    this.time = time;
    this.animationStyle = animationStyle;
    this.disolve = disolve;
    this.finishOnCancel = finishOnCancel; // this.callbackOnCancel = callbackOnCancel;

    this.startTime = -1;
    this.startColor = startColor;
    this.deltaColor = [0, 0, 0, 1];
    this.callback = callback;
  }

  _createClass(ColorAnimationPhase, [{
    key: "_dup",
    value: function _dup() {
      var c = new ColorAnimationPhase(this.startColor, this.targetColor, this.time, this.disolve, this.callback, this.finishOnCancel, // this.callbackOnCancel,
      this.animationStyle);
      c.startTime = this.startTime; // this.startColor = this.startColor.slice();

      c.deltaColor = this.deltaColor.slice();
      return c;
    } // eslint-disable-next-line no-use-before-define

  }, {
    key: "start",
    value: function start(element) {
      if (this.startColor == null) {
        this.startColor = element.color.slice();
      }

      var startColor = this.startColor;

      if (startColor != null) {
        if (this.disolve === 'in') {
          this.startColor[3] = 0.01;
          element.setColor(startColor.slice());
          element.showAll();
        }

        this.deltaColor = this.targetColor.map(function (c, index) {
          return c - startColor[index];
        });
      }

      this.startTime = -1;
    }
  }, {
    key: "finish",
    value: function finish( // eslint-disable-next-line no-use-before-define
    element) {
      var _this3 = this;

      var cancelled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var forceSetToEnd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var setToEnd = function setToEnd() {
        element.setColor(_this3.endColor);

        if (_this3.disolve === 'out') {
          element.hide();
        }
      };

      if (forceSetToEnd === null) {
        if (!cancelled || this.finishOnCancel) {
          setToEnd();
        }
      }

      if (forceSetToEnd === true) {
        setToEnd();
      }

      if (this.callback != null) {
        this.callback(cancelled);
      }
    }
  }]);

  return ColorAnimationPhase;
}(); // Planned Animation

var CustomAnimationPhase =
/*#__PURE__*/
function () {
  // animation time
  // Time when phase started
  function CustomAnimationPhase(animationCallback) {
    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var startPercent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var finishOnCancel = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var animationStyle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_1__["easeinout"];

    _classCallCheck(this, CustomAnimationPhase);

    this.time = time;
    this.startPercent = startPercent;
    this.animationCallback = animationCallback;
    this.startTime = -1;
    this.animationStyle = animationStyle;
    this.plannedStartTime = animationStyle(startPercent, true) * time;
    this.callback = callback;
    this.finishOnCancel = finishOnCancel;
  }

  _createClass(CustomAnimationPhase, [{
    key: "_dup",
    value: function _dup() {
      var c = new CustomAnimationPhase(this.animationCallback, this.time, this.startPercent, this.callback, this.finishOnCancel, this.animationStyle);
      c.startTime = this.startTime;
      return c;
    }
  }, {
    key: "start",
    value: function start() {
      // this.startColor = currentColor.slice();
      // this.deltaColor = this.targetColor.map((c, index) => c - this.startColor[index]);
      this.startTime = -1;
    }
  }, {
    key: "finish",
    value: function finish() {
      var _this4 = this;

      var cancelled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var forceSetToEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var setToEnd = function setToEnd() {
        _this4.animationCallback(1);
      };

      if (forceSetToEnd === null) {
        if (!cancelled || this.finishOnCancel) {
          setToEnd();
        }
      }

      if (forceSetToEnd === true) {
        setToEnd();
      }

      if (this.callback != null) {
        this.callback(cancelled);
      }
    }
  }]);

  return CustomAnimationPhase;
}();

/***/ }),

/***/ "./src/js/diagram/Diagram.js":
/*!***********************************!*\
  !*** ./src/js/diagram/Diagram.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _webgl_shaders__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./webgl/shaders */ "./src/js/diagram/webgl/shaders.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _tools_tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../tools/tools */ "./src/js/tools/tools.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _webgl_GlobalAnimation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./webgl/GlobalAnimation */ "./src/js/diagram/webgl/GlobalAnimation.js");
/* harmony import */ var _Gesture__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Gesture */ "./src/js/diagram/Gesture.js");
/* harmony import */ var _DrawContext2D__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DrawContext2D */ "./src/js/diagram/DrawContext2D.js");
/* harmony import */ var _DiagramPrimatives_DiagramPrimatives__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DiagramPrimatives/DiagramPrimatives */ "./src/js/diagram/DiagramPrimatives/DiagramPrimatives.js");
/* harmony import */ var _DiagramEquation_DiagramEquation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./DiagramEquation/DiagramEquation */ "./src/js/diagram/DiagramEquation/DiagramEquation.js");
/* harmony import */ var _DiagramObjects_DiagramObjects__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./DiagramObjects/DiagramObjects */ "./src/js/diagram/DiagramObjects/DiagramObjects.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }






 // eslint-disable-next-line import/no-cycle





 // There are several coordinate spaces that need to be considered for a
// diagram.
//
// In the simplest diagram, there will be in hierarchy:
//  - GL Canvas
//    - Diagram
//      - Element Collection
//        - Element Primative
//          - Drawing Object (e.g. shape, text) from primative vertices
//
// A shape is defined in Drawing Object space.
// It is then transformed by the element primative
// It is then transformed by the element colleciton
// It is then transformed by the diagram
// it is then transformed into GL Space

var Diagram =
/*#__PURE__*/
function () {
  // gestureElement: HTMLElement;
  function Diagram() {
    var containerIdOrWebGLContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'DiagramContainer';
    var limitsOrxMin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Rect"](-1, -1, 2, 2);
    var yMin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
    var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 2;
    var backgroundColor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [1, 1, 1, 1];
    var layout = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
    var vertexShader = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'simple';
    var fragmentShader = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 'simple';

    _classCallCheck(this, Diagram);

    this.layout = layout;

    if (typeof containerIdOrWebGLContext === 'string') {
      var container = document.getElementById(containerIdOrWebGLContext);

      if (container instanceof HTMLElement) {
        var children = container.children;

        for (var i = 0; i < children.length; i += 1) {
          var child = children[i];

          if (child instanceof HTMLCanvasElement && child.classList.contains('diagram__gl')) {
            if (child.id === 'id_diagram__gl__low') {
              this.canvasLow = child;
            }

            if (child.id === 'id_diagram__gl__high') {
              this.canvasHigh = child;
            }
          }

          if (child instanceof HTMLCanvasElement && child.classList.contains('diagram__text')) {
            if (child.id === 'id_diagram__text__low') {
              this.textCanvasLow = child;
            }

            if (child.id === 'id_diagram__text__high') {
              this.textCanvasHigh = child;
            }
          }

          if (child.classList.contains('diagram__html')) {
            this.htmlCanvas = child;
          } // if (child.classList.contains('diagram__gesture')) {
          //   this.gestureElement = child;
          // }

        }

        this.backgroundColor = backgroundColor;
        var shaders = Object(_webgl_shaders__WEBPACK_IMPORTED_MODULE_1__["default"])(vertexShader, fragmentShader);
        var webglLow = new _webgl_webgl__WEBPACK_IMPORTED_MODULE_0__["default"](this.canvasLow, shaders.vertexSource, shaders.fragmentSource, shaders.varNames, this.backgroundColor);
        var webglHigh = new _webgl_webgl__WEBPACK_IMPORTED_MODULE_0__["default"](this.canvasHigh, shaders.vertexSource, shaders.fragmentSource, shaders.varNames, this.backgroundColor);
        this.webglLow = webglLow;
        this.webglHigh = webglHigh; // const draw2D = this.textCanvas.getContext('2d');

        this.draw2DLow = new _DrawContext2D__WEBPACK_IMPORTED_MODULE_7__["default"](this.textCanvasLow);
        this.draw2DHigh = new _DrawContext2D__WEBPACK_IMPORTED_MODULE_7__["default"](this.textCanvasHigh);
      }
    }

    if (containerIdOrWebGLContext instanceof _webgl_webgl__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      this.webglLow = containerIdOrWebGLContext;
    } // if (this.textCanvas instanceof HTMLCanvasElement) {
    //   this.draw2D = new DrawContext2D(this.textCanvas);
    // }


    if (this instanceof Diagram) {
      this.gesture = new _Gesture__WEBPACK_IMPORTED_MODULE_6__["default"](this);
    }

    this.fontScale = 1;
    var limits;

    if (limitsOrxMin instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Rect"]) {
      var r = limitsOrxMin;
      limits = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Rect"](r.left, r.bottom, r.width, r.height);
    } else {
      limits = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Rect"](limitsOrxMin, yMin, width, height);
    }

    this.updateLimits(limits);
    this.drawQueued = false;
    this.inTransition = false; // console.log(this.limits)

    this.beingMovedElements = [];
    this.beingTouchedElements = [];
    this.moveTopElementOnly = true;
    this.globalAnimation = new _webgl_GlobalAnimation__WEBPACK_IMPORTED_MODULE_5__["default"]();
    this.shapesLow = this.getShapes(false);
    this.shapesHigh = this.getShapes(true);
    this.shapes = this.shapesLow;
    this.equationLow = this.getEquations(false);
    this.equationHigh = this.getEquations(true);
    this.equation = this.equationLow;
    this.objectsLow = this.getObjects(false);
    this.objectsHigh = this.getObjects(true);
    this.objects = this.objectsLow;
    this.createDiagramElements();

    if (this.elements.name === '') {
      this.elements.name = 'diagramRoot';
    }

    window.addEventListener('resize', this.resize.bind(this));
    this.sizeHtmlText();
    this.initialize();
    this.isTouchDevice = Object(_tools_tools__WEBPACK_IMPORTED_MODULE_3__["isTouchDevice"])();
    this.animateNextFrame();
  }

  _createClass(Diagram, [{
    key: "getShapes",
    value: function getShapes() {
      var high = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var webgl = this.webglLow;
      var draw2D = this.draw2DLow;

      if (high) {
        webgl = this.webglHigh;
        draw2D = this.draw2DHigh;
      }

      return new _DiagramPrimatives_DiagramPrimatives__WEBPACK_IMPORTED_MODULE_8__["default"](webgl, draw2D, this.htmlCanvas, this.limits);
    }
  }, {
    key: "getEquations",
    value: function getEquations() {
      var high = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var shapes = this.shapesLow;

      if (high) {
        shapes = this.shapesHigh;
      }

      return new _DiagramEquation_DiagramEquation__WEBPACK_IMPORTED_MODULE_9__["default"](shapes);
    }
  }, {
    key: "getObjects",
    value: function getObjects() {
      var high = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var shapes = this.shapesLow;
      var equation = this.equationLow;

      if (high) {
        shapes = this.shapesHigh;
        equation = this.equationHigh;
      }

      return new _DiagramObjects_DiagramObjects__WEBPACK_IMPORTED_MODULE_10__["default"](shapes, equation, this.isTouchDevice, this.animateNextFrame.bind(this));
    }
  }, {
    key: "sizeHtmlText",
    value: function sizeHtmlText() {
      var scale = this.fontScale * 1 / 35;
      var size = this.htmlCanvas.offsetWidth * scale - 1;
      this.htmlCanvas.style.fontSize = "".concat(size, "px");
      var style = window.getComputedStyle(document.documentElement);

      if (style) {
        var prop = '--lesson__diagram-font-size';
        var docElem = document.documentElement;

        if (docElem) {
          docElem.style.setProperty(prop, "".concat(size, "px"));
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.gesture.destroy();
      this.webglLow.gl.getExtension('WEBGL_lose_context').loseContext();
      this.webglHigh.gl.getExtension('WEBGL_lose_context').loseContext();
    } // setGLDiagramSpaceTransforms() {
    //   const glSpace = {
    //     x: { bottomLeft: -1, width: 2 },
    //     y: { bottomLeft: -1, height: 2 },
    //   };
    //   const diagramSpace = {
    //     x: { bottomLeft: this.limits.left, width: this.limits.width },
    //     y: { bottomLeft: this.limits.bottom, height: this.limits.height },
    //   };
    //   this.diagramToGLSpaceTransformMatrix =
    //     spaceToSpaceTransformMatrix(glSpace, diagramSpace);
    //   this.glToDiagramSpaceTransformMatrix =
    //     spaceToSpaceTransformMatrix(diagramSpace, glSpace);
    // }

  }, {
    key: "setSpaceTransforms",
    value: function setSpaceTransforms() {
      var glSpace = {
        x: {
          bottomLeft: -1,
          width: 2
        },
        y: {
          bottomLeft: -1,
          height: 2
        }
      };
      var diagramSpace = {
        x: {
          bottomLeft: this.limits.left,
          width: this.limits.width
        },
        y: {
          bottomLeft: this.limits.bottom,
          height: this.limits.height
        }
      };
      var canvasRect = this.canvasLow.getBoundingClientRect();
      var pixelSpace = {
        x: {
          bottomLeft: 0,
          width: canvasRect.width
        },
        y: {
          bottomLeft: canvasRect.height,
          height: -canvasRect.height
        }
      };
      var percentSpace = {
        x: {
          bottomLeft: 0,
          width: 1
        },
        y: {
          bottomLeft: 1,
          height: -1
        }
      };
      this.diagramToGLSpaceTransform = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_2__["spaceToSpaceTransform"])(diagramSpace, glSpace, 'Diagram');
      this.glToDiagramSpaceTransform = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_2__["spaceToSpaceTransform"])(glSpace, diagramSpace);
      this.pixelToDiagramSpaceTransform = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_2__["spaceToSpaceTransform"])(pixelSpace, diagramSpace);
      this.diagramToPixelSpaceTransform = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_2__["spaceToSpaceTransform"])(diagramSpace, pixelSpace);
      this.pixelToGLSpaceTransform = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_2__["spaceToSpaceTransform"])(pixelSpace, glSpace);
      this.glToPixelSpaceTransform = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_2__["spaceToSpaceTransform"])(glSpace, pixelSpace);
      this.diagramToCSSPercentSpaceTransform = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_2__["spaceToSpaceTransform"])(diagramSpace, percentSpace);
    }
  }, {
    key: "initialize",
    value: function initialize() {
      // this.setSpaceTransforms();
      this.elements.setFirstTransform(this.diagramToGLSpaceTransform);
    }
  }, {
    key: "updateLimits",
    value: function updateLimits(limits) {
      this.limits = limits._dup();
      this.setSpaceTransforms();
    }
  }, {
    key: "resize",
    value: function resize() {
      this.webglLow.resize();
      this.webglHigh.resize();
      this.draw2DLow.resize();
      this.draw2DHigh.resize();
      this.setSpaceTransforms();
      this.sizeHtmlText();
      this.elements.resizeHtmlObject();
      this.animateNextFrame();
    } // Handle touch down, or mouse click events within the canvas.
    // The default behavior is to be able to move objects that are touched
    // and dragged, then when they are released, for them to move freely before
    // coming to a stop.

  }, {
    key: "touchDownHandler",
    value: function touchDownHandler(clientPoint) {
      if (this.inTransition) {
        return false;
      } // Get the touched point in clip space


      var pixelPoint = this.clientToPixel(clientPoint); // console.log(pixelPoint)

      var glPoint = pixelPoint.transformBy(this.pixelToGLSpaceTransform.matrix()); // console.log(glPoint.transformBy(this.glToDiagramSpaceTransform.matrix()))
      // const clipPoint = this.clientToClip(clientPoint);
      // Get all the diagram elements that were touched at this point (element
      // must have isTouchable = true to be considered)

      this.beingTouchedElements = this.elements.getTouched(glPoint);

      if (this.moveTopElementOnly) {
        if (this.beingTouchedElements.length > 0) {
          this.beingTouchedElements[0].click();
        }
      } else {
        this.beingTouchedElements.forEach(function (e) {
          return e.click();
        });
      } // Make a list of, and start moving elements that are being moved
      // (element must be touched and have isMovable = true to be in list)


      this.beingMovedElements = [];

      for (var i = 0; i < this.beingTouchedElements.length; i += 1) {
        var element = this.beingTouchedElements[i];

        if (element.isMovable) {
          this.beingMovedElements.push(element);
          element.startBeingMoved();
        }
      }

      if (this.beingMovedElements.length > 0) {
        this.animateNextFrame();
      }

      if (this.beingTouchedElements.length > 0) {
        return true;
      }

      return false;
    } // Handle touch up, or mouse click up events in the canvas. When an UP even
    // happens, the default behavior is to let any elements being moved to move
    // freely until they decelerate to 0.

  }, {
    key: "touchUpHandler",
    value: function touchUpHandler() {
      // console.log("before", this.elements._circle.transform.t())
      // console.log(this.beingMovedElements)
      for (var i = 0; i < this.beingMovedElements.length; i += 1) {
        var element = this.beingMovedElements[i];

        if (element.state.isBeingMoved) {
          element.stopBeingMoved();
          element.startMovingFreely();
        }
      }

      this.beingMovedElements = [];
      this.beingTouchedElements = []; // console.log("after", this.elements._circle.transform.t())
    }
  }, {
    key: "rotateElement",
    value: function rotateElement(element, previousClientPoint, currentClientPoint) {
      var center = element.getDiagramPosition();

      if (center == null) {
        center = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"](0, 0);
      }

      var previousPixelPoint = this.clientToPixel(previousClientPoint);
      var currentPixelPoint = this.clientToPixel(currentClientPoint);
      var previousDiagramPoint = previousPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
      var currentDiagramPoint = currentPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
      var currentAngle = Math.atan2(currentDiagramPoint.y - center.y, currentDiagramPoint.x - center.x);
      var previousAngle = Math.atan2(previousDiagramPoint.y - center.y, previousDiagramPoint.x - center.x);
      var diffAngle = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_2__["minAngleDiff"])(previousAngle, currentAngle);

      var transform = element.transform._dup();

      var rot = transform.r();

      if (rot == null) {
        rot = 0;
      }

      var newAngle = rot - diffAngle; // if (newAngle < 0) {
      //   newAngle += 2 * Math.PI;
      // }
      // if (newAngle > 2 * Math.PI) {
      //   newAngle -= 2 * Math.PI;
      // }

      transform.updateRotation(newAngle);
      element.moved(transform._dup());
    }
  }, {
    key: "translateElement",
    value: function translateElement(element, previousClientPoint, currentClientPoint) {
      var previousPixelPoint = this.clientToPixel(previousClientPoint);
      var currentPixelPoint = this.clientToPixel(currentClientPoint);
      var previousDiagramPoint = previousPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
      var currentDiagramPoint = currentPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
      var delta = currentDiagramPoint.sub(previousDiagramPoint);

      var currentTransform = element.transform._dup();

      var currentTranslation = currentTransform.t();

      if (currentTranslation != null) {
        var newTranslation = currentTranslation.add(delta);
        currentTransform.updateTranslation(newTranslation);
        element.moved(currentTransform);
      }
    }
  }, {
    key: "scaleElement",
    value: function scaleElement(element, previousClientPoint, currentClientPoint) {
      var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      var previousPixelPoint = this.clientToPixel(previousClientPoint);
      var currentPixelPoint = this.clientToPixel(currentClientPoint);
      var previousDiagramPoint = previousPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
      var currentDiagramPoint = currentPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
      var center = element.getDiagramPosition();
      var previousMag = previousDiagramPoint.sub(center).distance();
      var currentMag = currentDiagramPoint.sub(center).distance();
      var currentScale = element.transform.s();

      if (currentScale != null) {
        var currentTransform = element.transform._dup();

        var newScaleX = currentScale.x * currentMag / previousMag;
        var newScaleY = currentScale.y * currentMag / previousMag;

        if (type === 'x') {
          currentTransform.updateScale(newScaleX, 1);
        } else if (type === 'y') {
          currentTransform.updateScale(1, newScaleY);
        } else {
          currentTransform.updateScale(newScaleX, newScaleY);
        }

        element.moved(currentTransform);
      }
    } // Handle touch/mouse move events in the canvas. These events will only be
    // sent if the initial touch down happened in the canvas.
    // The default behavior is to drag (move) any objects that were touched in
    // the down event to the new location.
    // This function should return true if the move event should NOT be processed
    // by the system. For example, on a touch device, a touch and drag would
    // normally scroll the screen. Typically, you would want to move the diagram
    // element and not the screen, so a true would be returned.

  }, {
    key: "touchMoveHandler",
    value: function touchMoveHandler(previousClientPoint, currentClientPoint) {
      if (this.inTransition) {
        return false;
      }

      if (this.beingMovedElements.length === 0) {
        return false;
      }

      var previousPixelPoint = this.clientToPixel(previousClientPoint); // const currentPixelPoint = this.clientToPixel(currentClientPoint);

      var previousGLPoint = previousPixelPoint.transformBy(this.pixelToGLSpaceTransform.matrix()); // Go through each element being moved, get the current translation

      for (var i = 0; i < this.beingMovedElements.length; i += 1) {
        var element = this.beingMovedElements[i];

        if (element !== this.elements) {
          if (element.isBeingTouched(previousGLPoint) || element.move.canBeMovedAfterLoosingTouch) {
            var elementToMove = element.move.element == null ? element : element.move.element;

            if (elementToMove.state.isBeingMoved === false) {
              elementToMove.startBeingMoved();
            }

            if (this.beingMovedElements.indexOf(elementToMove) === -1) {
              this.beingMovedElements.push(elementToMove);
            }

            if (element.move.type === 'rotation') {
              this.rotateElement(elementToMove, previousClientPoint, currentClientPoint);
            } else if (element.move.type === 'scale') {
              this.scaleElement(elementToMove, previousClientPoint, currentClientPoint);
            } else if (element.move.type === 'scaleX') {
              this.scaleElement(elementToMove, previousClientPoint, currentClientPoint, 'x');
            } else if (element.move.type === 'scaleY') {
              this.scaleElement(elementToMove, previousClientPoint, currentClientPoint, 'y');
            } else {
              this.translateElement(elementToMove, previousClientPoint, currentClientPoint);
            }
          }
        }

        if (this.moveTopElementOnly) {
          i = this.beingMovedElements.length;
        }
      }

      this.animateNextFrame();
      return true;
    }
  }, {
    key: "stop",
    value: function stop() {
      var cancelled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var forceSetToEndOfPlan = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.elements.stop(cancelled, forceSetToEndOfPlan);
    } // To add elements to a diagram, either this method can be overridden,
    // or the `add` method can be used.

  }, {
    key: "createDiagramElements",
    value: function createDiagramElements() {
      // $FlowFixMe
      this.elements = new _Element__WEBPACK_IMPORTED_MODULE_4__["DiagramElementCollection"]();
      this.elements.diagramLimits = this.limits;
    }
  }, {
    key: "add",
    value: function add(name, diagramElement) {
      this.elements.add(name, diagramElement);
    }
  }, {
    key: "clearContext",
    value: function clearContext() {
      // const bc = this.backgroundColor;
      // this.webgl.gl.clearColor(bc[0], bc[1], bc[2], bc[3]);
      this.webglLow.gl.clearColor(0, 0, 0, 0);
      this.webglLow.gl.clear(this.webglLow.gl.COLOR_BUFFER_BIT);
      this.webglHigh.gl.clearColor(0, 0, 0, 0);
      this.webglHigh.gl.clear(this.webglHigh.gl.COLOR_BUFFER_BIT);

      if (this.draw2DLow) {
        this.draw2DLow.ctx.clearRect(0, 0, this.draw2DLow.ctx.canvas.width, this.draw2DLow.ctx.canvas.height);
      }

      if (this.draw2DHigh) {
        this.draw2DHigh.ctx.clearRect(0, 0, this.draw2DHigh.ctx.canvas.width, this.draw2DHigh.ctx.canvas.height);
      }
    }
  }, {
    key: "draw",
    value: function draw(now) {
      this.drawQueued = false;
      this.clearContext(); // This transform converts standard gl clip space, to diagram clip space
      // defined in limits.
      // const normWidth = 2 / this.limits.width;
      // const normHeight = 2 / this.limits.height;
      // const clipTransform = new Transform()
      //   .scale(normWidth, normHeight)
      //   .translate(
      //     (-this.limits.width / 2 - this.limits.left) * normWidth,
      //     (this.limits.height / 2 - this.limits.top) * normHeight,
      //   );
      // const t1 = performance.now();

      this.elements.draw(this.diagramToGLSpaceTransform, now);

      if (this.elements.isMoving()) {
        this.animateNextFrame();
      } // console.log(performance.now() - t1)
      // console.log(Date.now() - measure)

    }
  }, {
    key: "animateNextFrame",
    value: function animateNextFrame() {
      if (!this.drawQueued) {
        this.drawQueued = true;
        this.globalAnimation.queueNextFrame(this.draw.bind(this));
      }
    }
  }, {
    key: "isAnimating",
    value: function isAnimating() {
      return this.elements.state.isAnimating;
    }
  }, {
    key: "clientToPixel",
    value: function clientToPixel(clientLocation) {
      var canvas = this.canvasLow.getBoundingClientRect();
      return new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"](clientLocation.x - canvas.left, clientLocation.y - canvas.top);
    }
  }]);

  return Diagram;
}();

/* harmony default export */ __webpack_exports__["default"] = (Diagram);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Arrow.js":
/*!*************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Arrow.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Arrow; });
/* harmony import */ var _DrawingObjects_VertexObject_VertexArrow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexArrow */ "./src/js/diagram/DrawingObjects/VertexObject/VertexArrow.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");




function Arrow(webgl) {
  var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var legWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
  var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var legHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.5;
  var tip = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"](0, 0);
  var rotation = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  var color = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : [1, 1, 1, 1];
  var transformOrLocation = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"](0, 0);
  var diagramLimits = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Rect"](-1, -1, 2, 2);
  var vertexLine = new _DrawingObjects_VertexObject_VertexArrow__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, width, legWidth, height, legHeight, tip, rotation);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertexLine, transform, color, diagramLimits);
}

/***/ }),

/***/ "./src/js/diagram/DiagramElements/DashedLine.js":
/*!******************************************************!*\
  !*** ./src/js/diagram/DiagramElements/DashedLine.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DrawingObjects_VertexObject_VertexDashedLine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexDashedLine */ "./src/js/diagram/DrawingObjects/VertexObject/VertexDashedLine.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");





function DashedLine(webgl, start, length, width, rotation, dashStyle, color, transformOrLocation, diagramLimits) {
  var vertexLine = new _DrawingObjects_VertexObject_VertexDashedLine__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, start, length, width, rotation, dashStyle);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertexLine, transform, color, diagramLimits);
}

/* harmony default export */ __webpack_exports__["default"] = (DashedLine);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/Bar.js":
/*!********************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/Bar.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Bracket; });
/* harmony import */ var _VertexBar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VertexBar */ "./src/js/diagram/DiagramElements/Equation/VertexBar.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");




function Bracket(webgl, color, side, numLines, transformOrLocation, diagramLimits) {
  var vertices = new _VertexBar__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, side, numLines);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertices, transform, color, diagramLimits);
}

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/Brace.js":
/*!**********************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/Brace.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Brace; });
/* harmony import */ var _VertexBrace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VertexBrace */ "./src/js/diagram/DiagramElements/Equation/VertexBrace.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");




function Brace(webgl, color, side, numLines, transformOrLocation, diagramLimits) {
  var vertices = new _VertexBrace__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, side, numLines);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertices, transform, color, diagramLimits);
}

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/Bracket.js":
/*!************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/Bracket.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Bracket; });
/* harmony import */ var _VertexBracket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VertexBracket */ "./src/js/diagram/DiagramElements/Equation/VertexBracket.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
 // import VertexPolygonFilled from '../../DrawingObjects/VertexObject/VertexPolygon';




function Bracket(webgl, color, side, numLines, transformOrLocation, diagramLimits) {
  // const serifSides = 30;
  // const serifRadius = 0.05;
  var vertices = new _VertexBracket__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, side, numLines); // const serif = new VertexPolygonFilled(
  //   webgl,
  //   serifSides,
  //   serifRadius,
  //   0,
  //   new Point(0, 0),
  //   serifSides,
  // );

  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertices, transform, color, diagramLimits);
}

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/GLEquation.js":
/*!***************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/GLEquation.js ***!
  \***************************************************************/
/*! exports provided: AnnotationInformation, getDiagramElement, createEquationElements, contentToElement, EquationForm, Equation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnnotationInformation", function() { return AnnotationInformation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDiagramElement", function() { return getDiagramElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEquationElements", function() { return createEquationElements; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "contentToElement", function() { return contentToElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EquationForm", function() { return EquationForm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Equation", function() { return Equation; });
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _tools_mathtools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../tools/mathtools */ "./src/js/diagram/tools/mathtools.js");
/* harmony import */ var _tools_tools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../tools/tools */ "./src/js/tools/tools.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../DrawingObjects/TextObject/TextObject */ "./src/js/diagram/DrawingObjects/TextObject/TextObject.js");
/* harmony import */ var _DrawContext2D__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../DrawContext2D */ "./src/js/diagram/DrawContext2D.js");
/* harmony import */ var _tools_htmlGenerator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../tools/htmlGenerator */ "./src/js/tools/htmlGenerator.js");
/* harmony import */ var _DrawingObjects_HTMLObject_HTMLObject__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../DrawingObjects/HTMLObject/HTMLObject */ "./src/js/diagram/DrawingObjects/HTMLObject/HTMLObject.js");
function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }







 // import { TextObject } from './DrawingObjects/TextObject/TextObject';

 // Equation is a class that takes a set of drawing objects (TextObjects,
// DiagramElementPrimatives or DiagramElementCollections and HTML Objects
// and arranges their size in a )

var BlankElement =
/*#__PURE__*/
function () {
  function BlankElement() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.03;
    var ascent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var descent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, BlankElement);

    this.width = width;
    this.ascent = ascent;
    this.descent = descent;
    this.height = this.ascent + this.descent;
  }

  _createClass(BlankElement, [{
    key: "_dup",
    value: function _dup() {
      return new BlankElement(this.width, this.ascent, this.descent);
    }
  }]);

  return BlankElement;
}();

var Element =
/*#__PURE__*/
function () {
  function Element(content) {
    _classCallCheck(this, Element);

    this.content = content;
    this.ascent = 0;
    this.descent = 0;
    this.width = 0;
    this.location = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    this.height = 0;
  }

  _createClass(Element, [{
    key: "calcSize",
    value: function calcSize(location, scale) {
      var content = this.content;

      if (content instanceof BlankElement) {
        this.width = content.width * scale;
        this.height = content.height * scale;
        this.ascent = content.ascent * scale;
        this.descent = content.descent * scale;
        this.location = location._dup();
        this.scale = scale;
      }

      if (content instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementCollection"] || content instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"]) {
        // Update translation and scale
        content.transform.updateTranslation(location.x, location.y);
        content.transform.updateScale(scale, scale);
        content.updateLastDrawTransform(); // Get the boundaries of element
        // const t = content.lastDrawTransform._dup();
        // content.lastDrawTransform = content.transform._dup();

        var r = content.getRelativeVertexSpaceBoundingRect(); // content.lastDrawTransform = t;

        this.location = location._dup();
        this.scale = scale;
        this.ascent = r.top * scale;
        this.descent = -r.bottom * scale;
        this.height = r.height * scale;
        this.width = r.width * scale; // console.log(this.height)
      }
    }
  }, {
    key: "_dup",
    value: function _dup(namedCollection) {
      var c;

      if (this.content instanceof BlankElement) {
        c = new Element(this.content);
      } else if (namedCollection) {
        c = new Element(namedCollection[this.content.name]);
      } else {
        c = new Element(this.content);
      }

      c.ascent = this.ascent;
      c.descent = this.descent;
      c.width = this.width;
      c.location = this.location._dup();
      c.height = this.height;
      c.scale = this.scale;
      return c;
    }
  }, {
    key: "getAllElements",
    value: function getAllElements() {
      if (this.content instanceof BlankElement) {
        return [];
      }

      return [this.content];
    }
  }, {
    key: "setPositions",
    value: function setPositions() {
      var content = this.content;

      if (content instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementCollection"] || content instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"]) {
        content.transform.updateTranslation(this.location.x, this.location.y);
        content.transform.updateScale(this.scale, this.scale);
        content.updateLastDrawTransform();
      }
    }
  }, {
    key: "offsetLocation",
    value: function offsetLocation() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      this.location = this.location.add(offset);
    }
  }]);

  return Element;
}();

var Elements =
/*#__PURE__*/
function () {
  function Elements(content) {
    _classCallCheck(this, Elements);

    var nonNullContent = [];
    content.forEach(function (c) {
      if (c !== null) {
        nonNullContent.push(c);
      }
    });
    this.content = nonNullContent;
    this.ascent = 0;
    this.descent = 0;
    this.width = 0;
    this.location = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    this.height = 0;
  }

  _createClass(Elements, [{
    key: "_dup",
    value: function _dup(namedCollection) {
      var contentCopy = []; // console.log("Asdf", this.content, namedCollection)

      this.content.forEach(function (element) {
        return contentCopy.push(element._dup(namedCollection));
      });
      var c = new Elements(contentCopy);
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["duplicateFromTo"])(this, c, ['content']);
      return c;
    }
  }, {
    key: "calcSize",
    value: function calcSize(location, scale) {
      var des = 0;
      var asc = 0;

      var loc = location._dup();

      this.content.forEach(function (element) {
        element.calcSize(loc, scale);
        loc.x += element.width;

        if (element.descent > des) {
          des = element.descent;
        }

        if (element.ascent > asc) {
          asc = element.ascent;
        }
      }); // if (this.content.length === 4 && this.content[0] instanceof Fraction) {
      //   console.log(this.content)
      //   console.log(this.content[0].location, this.content[1].location)
      //   // debugger;
      // }

      this.width = loc.x - location.x;
      this.ascent = asc;
      this.descent = des;
      this.location = location._dup();
      this.height = this.descent + this.ascent;
    }
  }, {
    key: "getAllElements",
    value: function getAllElements() {
      var elements = [];
      this.content.forEach(function (e) {
        // if (e instanceof Element && !(e.content instanceof BlankElement)) {
        //   elements.push(e.content);
        // } else {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(e.getAllElements())); // }
      });
      return elements;
    }
  }, {
    key: "setPositions",
    value: function setPositions() {
      this.content.forEach(function (e) {
        e.setPositions();
      });
    }
  }, {
    key: "offsetLocation",
    value: function offsetLocation() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      this.location = this.location.add(offset);
      this.content.forEach(function (e) {
        e.offsetLocation(offset);
      });
    }
  }]);

  return Elements;
}(); // class Phrase extends Elements {
//   constructor(
//     mainContent: Elements,
//   ) {
//     super([mainContent]);
//   }
// }


var Fraction =
/*#__PURE__*/
function (_Elements) {
  _inherits(Fraction, _Elements);

  // mini: boolean;
  function Fraction(numerator, denominator, vinculum) {
    var _this;

    _classCallCheck(this, Fraction);

    if (vinculum) {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Fraction).call(this, [numerator, denominator, new Element(vinculum)]));
    } else {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Fraction).call(this, [numerator, denominator]));
    }

    _this.vinculum = vinculum;
    _this.numerator = numerator;
    _this.denominator = denominator;
    _this.vSpaceNum = 0;
    _this.vSpaceDenom = 0;
    _this.lineVAboveBaseline = 0;
    _this.lineWidth = 0; // this.mini = false;

    _this.scaleModifier = 1;
    _this.vinculumPosition = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    _this.vinculumScale = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](1, 0.01);
    return _possibleConstructorReturn(_this);
  }

  _createClass(Fraction, [{
    key: "_dup",
    value: function _dup(namedCollection) {
      var vinculum = this.vinculum;

      if (this.vinculum != null && namedCollection) {
        vinculum = namedCollection[this.vinculum.name];
      }

      var fractionCopy = new Fraction(this.numerator._dup(namedCollection), this.denominator._dup(namedCollection), vinculum);
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["duplicateFromTo"])(this, fractionCopy, ['numerator', 'denominator', 'vinculum', 'content']);
      return fractionCopy;
    }
  }, {
    key: "calcSize",
    value: function calcSize(location, incomingScale) {
      var scale = incomingScale * this.scaleModifier;
      this.location = location._dup();
      this.numerator.calcSize(location, scale);
      this.denominator.calcSize(location, scale);
      this.width = Math.max(this.numerator.width, this.denominator.width) * 1.3;
      var xNumerator = (this.width - this.numerator.width) / 2;
      var xDenominator = (this.width - this.denominator.width) / 2;
      this.vSpaceNum = scale * 0.05;
      this.vSpaceDenom = scale * 0.05;
      this.lineVAboveBaseline = scale * 0.07 / this.scaleModifier;
      this.lineWidth = Math.max(scale * 0.01, 0.008);
      var yNumerator = this.numerator.descent + this.vSpaceNum + this.lineVAboveBaseline;
      var yDenominator = this.denominator.ascent + this.vSpaceDenom - this.lineVAboveBaseline;
      var yScale = 1;
      var loc = this.location;
      this.numerator.calcSize(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](loc.x + xNumerator, loc.y + yScale * yNumerator), scale);
      this.denominator.calcSize(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](loc.x + xDenominator, loc.y - yScale * yDenominator), scale);
      this.descent = this.vSpaceNum + this.lineWidth / 2 - this.lineVAboveBaseline + this.denominator.ascent + this.denominator.descent;
      this.ascent = this.vSpaceNum + this.lineWidth / 2 + this.lineVAboveBaseline + this.numerator.ascent + this.numerator.descent;
      this.height = this.descent + this.ascent;
      var vinculum = this.vinculum;

      if (vinculum) {
        this.vinculumPosition = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.location.x, this.location.y + this.lineVAboveBaseline);
        this.vinculumScale = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.width, this.lineWidth);
        vinculum.transform.updateScale(this.vinculumScale);
        vinculum.transform.updateTranslation(this.vinculumPosition);
        vinculum.show();
      }
    }
  }, {
    key: "getAllElements",
    value: function getAllElements() {
      var elements = [];

      if (this.numerator) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(this.numerator.getAllElements()));
      }

      if (this.denominator) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(this.denominator.getAllElements()));
      }

      if (this.vinculum) {
        elements = _toConsumableArray(elements).concat([this.vinculum]);
      }

      return elements;
    }
  }, {
    key: "setPositions",
    value: function setPositions() {
      this.numerator.setPositions();
      this.denominator.setPositions();
      var vinculum = this.vinculum;

      if (vinculum) {
        vinculum.transform.updateScale(this.vinculumScale);
        vinculum.transform.updateTranslation(this.vinculumPosition);
      }
    }
  }, {
    key: "offsetLocation",
    value: function offsetLocation() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      this.location = this.location.add(offset);
      this.numerator.offsetLocation(offset);
      this.denominator.offsetLocation(offset);
      this.vinculumPosition = this.vinculumPosition.add(offset);
    }
  }]);

  return Fraction;
}(Elements);

var StrikeOut =
/*#__PURE__*/
function (_Elements2) {
  _inherits(StrikeOut, _Elements2);

  function StrikeOut(mainContent, strike) {
    var _this2;

    var strikeInSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, StrikeOut);

    if (strike) {
      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(StrikeOut).call(this, [mainContent, new Element(strike)]));
    } else {
      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(StrikeOut).call(this, [mainContent]));
    }

    _this2.strike = strike;
    _this2.scaleModifier = 1;
    _this2.lineWidth = 0.1;
    _this2.mainContent = mainContent;
    _this2.strikeInSize = strikeInSize;
    return _possibleConstructorReturn(_this2);
  }

  _createClass(StrikeOut, [{
    key: "_dup",
    value: function _dup(namedCollection) {
      var strike = null;

      if (this.strike != null && namedCollection) {
        strike = namedCollection[this.strike.name];
      } else {
        strike = this.strike;
      }

      var strikeOutCopy = new StrikeOut(this.mainContent._dup(namedCollection), strike);
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["duplicateFromTo"])(this, strikeOutCopy, ['strike', 'mainContent']);
      return strikeOutCopy;
    }
  }, {
    key: "calcSize",
    value: function calcSize(location, incomingScale) {
      var scale = incomingScale * this.scaleModifier;
      this.location = location._dup();
      this.mainContent.calcSize(location, scale);
      this.lineWidth = scale * 0.02;
      var lineExtension = this.lineWidth * 1;
      var bottomLeft = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](location.x, location.y - this.mainContent.descent);
      var topRight = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](location.x + this.mainContent.width, location.y + this.mainContent.ascent * 0.8);
      var strikeLine = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Line"](bottomLeft, topRight);
      var strikeBottomLeft = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Line"](bottomLeft, lineExtension, strikeLine.angle() + Math.PI).getPoint(2);
      var strikeLength = strikeLine.length() + lineExtension * 2;

      if (this.strikeInSize) {
        var strikeTopRight = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Line"](topRight, lineExtension, strikeLine.angle()).getPoint(2);
        this.width = strikeTopRight.x - strikeBottomLeft.x;
        this.ascent = Math.max(this.mainContent.ascent, strikeTopRight.y - location.y);
        this.descent = Math.max(this.mainContent.descent, location.y - strikeBottomLeft.y);
        var xOffset = this.mainContent.location.x - strikeBottomLeft.x;
        this.mainContent.offsetLocation(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](xOffset, 0));
        strikeBottomLeft.x += xOffset;
      } else {
        this.width = this.mainContent.width;
        this.ascent = this.mainContent.ascent;
        this.descent = this.mainContent.descent;
      }

      this.height = this.descent + this.ascent;
      var strike = this.strike;

      if (strike) {
        if (strike instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementCollection"]) {
          this.strikePosition = strikeBottomLeft._dup();
          this.strikeScale = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](strikeLength, this.lineWidth * 0.8);
          this.strikeRotation = strikeLine.angle();
          var width = this.strikeScale.x * Math.cos(this.strikeRotation); // $FlowFixMe

          strike._s1.transform.updateScale(this.strikeScale); // $FlowFixMe


          strike._s1.transform.updateTranslation(this.strikePosition); // $FlowFixMe


          strike._s1.transform.updateRotation(this.strikeRotation); // $FlowFixMe


          strike._s2.transform.updateScale(this.strikeScale); // $FlowFixMe


          strike._s2.transform.updateTranslation(this.strikePosition.add(width, 0)); // $FlowFixMe


          strike._s2.transform.updateRotation(Math.PI - this.strikeRotation);

          strike.showAll();
        } else {
          this.strikePosition = strikeBottomLeft._dup();
          this.strikeScale = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](strikeLength, this.lineWidth);
          this.strikeRotation = strikeLine.angle();
          strike.transform.updateScale(this.strikeScale);
          strike.transform.updateTranslation(this.strikePosition);
          strike.transform.updateRotation(this.strikeRotation);
          strike.show();
        }
      }
    }
  }, {
    key: "getAllElements",
    value: function getAllElements() {
      var elements = [];

      if (this.mainContent) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(this.mainContent.getAllElements()));
      }

      if (this.strike) {
        elements = _toConsumableArray(elements).concat([this.strike]);
      }

      return elements;
    }
  }, {
    key: "setPositions",
    value: function setPositions() {
      this.mainContent.setPositions();
      var strike = this.strike;

      if (strike) {
        if (strike instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementCollection"]) {
          var width = this.strikeScale.x * Math.cos(this.strikeRotation); // $FlowFixMe

          strike._s1.transform.updateScale(this.strikeScale); // $FlowFixMe


          strike._s1.transform.updateTranslation(this.strikePosition); // $FlowFixMe


          strike._s1.transform.updateRotation(this.strikeRotation); // $FlowFixMe


          strike._s2.transform.updateScale(this.strikeScale); // $FlowFixMe


          strike._s2.transform.updateTranslation(this.strikePosition.add(width, 0)); // $FlowFixMe


          strike._s2.transform.updateRotation(Math.PI - this.strikeRotation);
        } else {
          strike.transform.updateScale(this.strikeScale);
          strike.transform.updateTranslation(this.strikePosition);
          strike.transform.updateRotation(this.strikeRotation);
        }
      }
    }
  }, {
    key: "offsetLocation",
    value: function offsetLocation() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      this.location = this.location.add(offset);
      this.mainContent.offsetLocation(offset);
      this.strikePosition = this.strikePosition.add(offset);
    }
  }]);

  return StrikeOut;
}(Elements);

var AnnotationInformation = function AnnotationInformation(content) {
  var xPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'right';
  var yPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'top';
  var xAlign = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'left';
  var yAlign = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'bottom';
  var annotationScale = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.5;

  _classCallCheck(this, AnnotationInformation);

  this.content = content;
  this.xPosition = xPosition;
  this.yPosition = yPosition;
  this.xAlign = xAlign;
  this.yAlign = yAlign;
  this.annotationScale = annotationScale;
}; // Create an annotation to a set of Elements
// x/yPosition: annotation location relative to mainContent
// x/yAlign: annotation alignment relative to its location
// Position and Align can be words or numbers where:
//    left: 0
//    right: 1
//    center: 0.5
//    bottom: 0
//    top: 1
//    middle: 0.5
//    baseline: descent / height
//    numbers can be anything (not just between 0 and 1)
//      For example, xPosition of -1 would position the annotation
//      one mainContent width to the left of the mainContent left point

var Annotation =
/*#__PURE__*/
function (_Elements3) {
  _inherits(Annotation, _Elements3);

  function Annotation(mainContent, annotationOrAnnotationArray) {
    var _this3;

    var xPositionOrAnnotationInSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'right';
    var yPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'top';
    var xAlign = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'left';
    var yAlign = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'bottom';
    var annotationScale = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0.5;
    var annotationInSize = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

    _classCallCheck(this, Annotation);

    if (Array.isArray(annotationOrAnnotationArray)) {
      var annotationElements = [mainContent];
      annotationOrAnnotationArray.forEach(function (annotationInfo) {
        annotationElements.push(annotationInfo.content);
      });
      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Annotation).call(this, annotationElements));
    } else {
      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Annotation).call(this, [mainContent, annotationOrAnnotationArray]));
    } // super([mainContent, annotation]);


    _this3.mainContent = mainContent;
    _this3.annotations = [];

    if (Array.isArray(annotationOrAnnotationArray)) {
      _this3.annotations = annotationOrAnnotationArray;

      if (typeof xPositionOrAnnotationInSize === 'boolean') {
        _this3.annotationInSize = xPositionOrAnnotationInSize;
      } else {
        _this3.annotationInSize = false;
      }
    } else {
      var xPosition = 'right';

      if (typeof xPositionOrAnnotationInSize !== 'boolean') {
        xPosition = xPositionOrAnnotationInSize;
      }

      _this3.annotations = [new AnnotationInformation(annotationOrAnnotationArray, xPosition, yPosition, xAlign, yAlign, annotationScale)];
      _this3.annotationInSize = annotationInSize;
    }

    return _possibleConstructorReturn(_this3);
  }

  _createClass(Annotation, [{
    key: "_dup",
    value: function _dup(namedCollection) {
      // const annotationsCopy = [];
      var annotationsCopy = this.annotations.map(function (annotationInfo) {
        return new AnnotationInformation(annotationInfo.content._dup(namedCollection), annotationInfo.xPosition, annotationInfo.yPosition, annotationInfo.xAlign, annotationInfo.yAlign, annotationInfo.annotationScale);
      });
      var annotationCopy = new Annotation(this.mainContent._dup(namedCollection), annotationsCopy, this.annotationInSize);
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["duplicateFromTo"])(this, annotationCopy, ['mainContent', 'annotations']);
      return annotationCopy;
    }
  }, {
    key: "calcSize",
    value: function calcSize(location, incomingScale) {
      var _this4 = this;

      this.location = location._dup();
      this.mainContent.calcSize(location, incomingScale);
      var minX = this.mainContent.location.x;
      var minY = this.mainContent.location.y - this.mainContent.descent;
      var maxX = this.mainContent.location.x + this.mainContent.width;
      var maxY = this.mainContent.location.y + this.mainContent.ascent;
      this.annotations.forEach(function (annotationInfo) {
        var annotation = annotationInfo.content;
        var xPosition = annotationInfo.xPosition,
            yPosition = annotationInfo.yPosition,
            xAlign = annotationInfo.xAlign,
            yAlign = annotationInfo.yAlign,
            annotationScale = annotationInfo.annotationScale;
        annotation.calcSize(location, incomingScale * annotationScale);

        var annotationLoc = _this4.location._dup();

        var xPos = 0;
        var yPos = _this4.mainContent.descent / _this4.mainContent.height;

        if (xPosition === 'right') {
          xPos = 1;
        } else if (xPosition === 'center') {
          xPos = 0.5;
        } else if (typeof xPosition === 'number') {
          xPos = xPosition;
        }

        annotationLoc.x += _this4.mainContent.width * xPos;

        if (yPosition === 'bottom') {
          yPos = 0;
        } else if (yPosition === 'top') {
          yPos = 1;
        } else if (yPosition === 'middle') {
          yPos = 0.5;
        } else if (typeof yPosition === 'number') {
          yPos = yPosition;
        }

        annotationLoc.y += -_this4.mainContent.descent + _this4.mainContent.height * yPos;
        var xOffset = 0;
        var yOffset = annotation.descent / annotation.height;

        if (xAlign === 'right') {
          xOffset = 1;
        } else if (xAlign === 'center') {
          xOffset = 0.5;
        } else if (typeof xAlign === 'number') {
          xOffset = xAlign;
        }

        if (yAlign === 'bottom') {
          yOffset = 0;
        } else if (yAlign === 'top') {
          yOffset = 1;
        } else if (yAlign === 'middle') {
          yOffset = 0.5;
        } else if (typeof yAlign === 'number') {
          yOffset = yAlign;
        }

        var annotationOffset = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](-xOffset * annotation.width, annotation.descent - yOffset * annotation.height);
        annotation.calcSize(annotationLoc, incomingScale * annotationScale);
        annotation.offsetLocation(annotationOffset);
        var annotationMaxX = annotation.location.x + annotation.width;
        var annotationMaxY = annotation.location.y + annotation.ascent;
        var annotationMinX = annotation.location.x;
        var annotationMinY = annotation.location.y - annotation.descent;
        maxX = annotationMaxX > maxX ? annotationMaxX : maxX;
        maxY = annotationMaxY > maxY ? annotationMaxY : maxY;
        minX = annotationMinX < minX ? annotationMinX : minX;
        minY = annotationMinY < minY ? annotationMinY : minY;
      });

      if (this.annotationInSize) {
        var bottomLeft = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](minX, minY);
        var topRight = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](maxX, maxY);
        this.width = topRight.x - bottomLeft.x;
        this.ascent = topRight.y - this.mainContent.location.y;
        this.descent = this.mainContent.location.y - bottomLeft.y;
        var xOffset = this.mainContent.location.x - bottomLeft;

        if (xOffset) {
          this.mainContent.offsetLocation(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](xOffset, 0));
          this.annotations = this.annotations.map(function (annotationInfo) {
            return annotationInfo.content.offsetLocation(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](xOffset, 0));
          });
        }
      } else {
        this.width = this.mainContent.width;
        this.ascent = this.mainContent.ascent;
        this.descent = this.mainContent.descent;
      }

      this.height = this.descent + this.ascent;
    }
  }, {
    key: "getAllElements",
    value: function getAllElements() {
      var elements = [];

      if (this.mainContent) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(this.mainContent.getAllElements()));
      }

      this.annotations.forEach(function (annotationInfo) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(annotationInfo.content.getAllElements()));
      });
      return elements;
    }
  }, {
    key: "setPositions",
    value: function setPositions() {
      this.mainContent.setPositions();
      this.annotations.forEach(function (annotationInfo) {
        annotationInfo.content.setPositions();
      }); // this.annotation.setPositions();
    }
  }, {
    key: "offsetLocation",
    value: function offsetLocation() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      this.location = this.location.add(offset);
      this.mainContent.offsetLocation(offset);
      this.annotations.forEach(function (annotationInfo) {
        annotationInfo.content.offsetLocation(offset);
      }); // this.annotation.offsetLocation(offset);
    }
  }]);

  return Annotation;
}(Elements);

var SuperSub =
/*#__PURE__*/
function (_Elements4) {
  _inherits(SuperSub, _Elements4);

  function SuperSub(content, superscript, subscript) {
    var _this5;

    var xBias = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var subscriptXBias = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    _classCallCheck(this, SuperSub);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(SuperSub).call(this, [content, superscript, subscript]));
    _this5.superscript = superscript;
    _this5.subscript = subscript;
    _this5.subscriptXBias = subscriptXBias;
    _this5.mainContent = content;
    _this5.xBias = xBias;
    return _this5;
  }

  _createClass(SuperSub, [{
    key: "_dup",
    value: function _dup(namedCollection) {
      var superscript = this.superscript == null ? null : this.superscript._dup(namedCollection);
      var subscript = this.subscript == null ? null : this.subscript._dup(namedCollection);
      var superSubCopy = new SuperSub(this.mainContent._dup(namedCollection), superscript, subscript, this.xBias, this.subscriptXBias);
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["duplicateFromTo"])(this, superSubCopy, ['mainContent', 'superscript', 'subscript', 'content']);
      return superSubCopy;
    }
  }, {
    key: "calcSize",
    value: function calcSize(location, scale) {
      this.location = location._dup();

      var loc = location._dup();

      this.mainContent.calcSize(loc, scale);
      var w = this.mainContent.width;
      var asc = this.mainContent.ascent;
      var des = this.mainContent.descent;
      var superscript = this.superscript;

      if (superscript !== null) {
        var superLoc = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.location.x + this.mainContent.width + this.xBias, this.location.y + this.mainContent.ascent * 0.7);
        superscript.calcSize(superLoc, scale / 2);
        w = Math.max(w, superLoc.x - this.location.x + superscript.width);
        asc = Math.max(asc, superscript.ascent + superLoc.y - this.location.y);
        des = Math.max(des, this.location.y - (superLoc.y - superscript.descent));
      }

      var subscript = this.subscript;

      if (subscript !== null) {
        // TODO - y location should be minus the height of an "m" or "a" not
        // the height of the main content.
        var subLoc = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.location.x + this.mainContent.width - this.subscriptXBias + this.xBias, this.location.y - this.mainContent.height * 0.5);
        subscript.calcSize(subLoc, scale / 2);
        w = Math.max(w, subLoc.x - this.location.x + subscript.width);
        asc = Math.max(asc, subscript.ascent + subLoc.y - this.location.y);
        des = Math.max(des, subscript.descent + (this.location.y - subLoc.y));
      }

      this.width = w;
      this.ascent = asc;
      this.descent = des;
      this.height = this.descent + this.ascent;
    }
  }, {
    key: "getAllElements",
    value: function getAllElements() {
      var elements = [];

      if (this.superscript) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(this.superscript.getAllElements()));
      }

      if (this.subscript) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(this.subscript.getAllElements()));
      }

      if (this.mainContent) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(this.mainContent.getAllElements()));
      }

      return elements;
    }
  }, {
    key: "setPositions",
    value: function setPositions() {
      this.mainContent.setPositions();

      if (this.superscript) {
        this.superscript.setPositions();
      }

      if (this.subscript) {
        this.subscript.setPositions();
      }
    }
  }, {
    key: "offsetLocation",
    value: function offsetLocation() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      this.location = this.location.add(offset);
      this.mainContent.offsetLocation(offset);

      if (this.superscript) {
        this.superscript.offsetLocation(offset);
      }

      if (this.subscript) {
        this.subscript.offsetLocation(offset);
      }
    }
  }]);

  return SuperSub;
}(Elements);

var Bounds = function Bounds() {
  _classCallCheck(this, Bounds);

  this.width = 0;
  this.height = 0;
  this.ascent = 0;
  this.descent = 0;
};

var Integral =
/*#__PURE__*/
function (_Elements5) {
  _inherits(Integral, _Elements5);

  function Integral(limitMin, limitMax, content, integralGlyph) {
    var _this6;

    _classCallCheck(this, Integral);

    var glyph = integralGlyph !== null ? new Element(integralGlyph) : null;
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Integral).call(this, [glyph, limitMin, limitMax, content]));
    _this6.limitMin = limitMin;
    _this6.limitMax = limitMax;
    _this6.mainContent = content;
    _this6.integralGlyph = integralGlyph;
    _this6.glyphLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    _this6.glyphScale = 1;
    return _this6;
  }

  _createClass(Integral, [{
    key: "_dup",
    value: function _dup(namedCollection) {
      var limitMin = this.limitMin == null ? null : this.limitMin._dup(namedCollection);
      var limitMax = this.limitMax == null ? null : this.limitMax._dup(namedCollection);
      var content = this.mainContent == null ? null : this.mainContent._dup(namedCollection);
      var glyph = null;

      if (this.integralGlyph != null && namedCollection) {
        glyph = namedCollection[this.integralGlyph.name];
      } else {
        glyph = this.integralGlyph;
      }

      var integralCopy = new Integral(limitMin, limitMax, content, glyph);
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["duplicateFromTo"])(this, integralCopy, ['limitMin', 'limitMax', 'content', 'integralGlyph', 'content']);
      return integralCopy;
    }
  }, {
    key: "getAllElements",
    value: function getAllElements() {
      var elements = [];

      if (this.limitMin) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(this.limitMin.getAllElements()));
      }

      if (this.limitMax) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(this.limitMax.getAllElements()));
      }

      if (this.mainContent) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(this.mainContent.getAllElements()));
      }

      if (this.integralGlyph) {
        elements = _toConsumableArray(elements).concat([this.integralGlyph]);
      }

      return elements;
    }
  }, {
    key: "setPositions",
    value: function setPositions() {
      var integralGlyph = this.integralGlyph;

      if (integralGlyph != null) {
        integralGlyph.transform.updateScale(this.glyphScale, this.glyphScale);
        integralGlyph.transform.updateTranslation(this.glyphLocation.x, this.glyphLocation.y);
      }

      if (this.limitMin) {
        this.limitMin.setPositions();
      }

      if (this.limitMax) {
        this.limitMax.setPositions();
      }

      if (this.mainContent) {
        this.mainContent.setPositions();
      }
    }
  }, {
    key: "offsetLocation",
    value: function offsetLocation() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      this.location = this.location.add(offset);
      var integralGlyph = this.integralGlyph;

      if (integralGlyph != null) {
        this.glyphLocation = this.glyphLocation.add(offset);
      }

      if (this.mainContent) {
        this.mainContent.offsetLocation(offset);
      }

      if (this.limitMax) {
        this.limitMax.offsetLocation(offset);
      }

      if (this.limitMin) {
        this.limitMin.offsetLocation(offset);
      }
    }
  }, {
    key: "calcSize",
    value: function calcSize(location, scale) {
      this.location = location._dup();

      var loc = location._dup();

      var contentBounds = new Bounds();
      var limitMinBounds = new Bounds();
      var limitMaxBounds = new Bounds();
      var integralGlyphBounds = new Bounds();
      var mainContent = this.mainContent;

      if (mainContent instanceof Elements) {
        mainContent.calcSize(loc._dup(), scale);
        contentBounds.width = mainContent.width;
        contentBounds.height = mainContent.ascent + mainContent.descent;
        contentBounds.ascent = mainContent.ascent;
        contentBounds.descent = mainContent.descent;
      }

      var limitMax = this.limitMax;

      if (limitMax instanceof Elements) {
        limitMax.calcSize(loc._dup(), scale / 2);
        limitMaxBounds.width = limitMax.width;
        limitMaxBounds.height = limitMax.ascent + limitMax.descent;
        limitMaxBounds.ascent = limitMax.ascent;
        limitMaxBounds.descent = limitMax.descent;
      }

      var limitMin = this.limitMin;

      if (limitMin instanceof Elements) {
        limitMin.calcSize(loc._dup(), scale / 2);
        limitMinBounds.width = limitMin.width;
        limitMinBounds.height = limitMin.ascent + limitMin.descent;
        limitMinBounds.ascent = limitMin.ascent;
        limitMinBounds.descent = limitMin.descent;
      }

      var integralMinHeight = contentBounds.ascent + contentBounds.descent + limitMinBounds.height + limitMaxBounds.height;
      var numLines = Object(_tools_mathtools__WEBPACK_IMPORTED_MODULE_1__["roundNum"])(integralMinHeight / scale, 0);
      var height = numLines * scale * 1.2;
      var integralSymbolLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](loc.x, loc.y - height / 2 + scale * 0.45);
      var integralGlyph = this.integralGlyph;

      if (integralGlyph instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"]) {
        integralGlyph.show();
        integralGlyph.transform.updateScale(height, height);
        integralGlyph.transform.updateTranslation(integralSymbolLocation.x, integralSymbolLocation.y);
        this.glyphLocation = integralSymbolLocation;
        this.glyphScale = height;
        var bounds = integralGlyph.drawingObject.getRelativeVertexSpaceBoundingRect(); // .getRelativeGLBoundingRect(integralGlyph.transform.matrix());

        integralGlyphBounds.width = bounds.width * height;
        integralGlyphBounds.height = (-bounds.bottom + bounds.top) * height;
        integralGlyphBounds.ascent = bounds.top * height;
        integralGlyphBounds.descent = -bounds.bottom * height;
      }

      var minLimitLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.location.x + integralGlyphBounds.width * 0.5, integralSymbolLocation.y);
      var maxLimitLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.location.x + integralGlyphBounds.width * 1.2, integralSymbolLocation.y + integralGlyphBounds.height - limitMaxBounds.height / 2);
      var contentLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.location.x + integralGlyphBounds.width * 0.8, this.location.y);

      if (mainContent instanceof Elements) {
        mainContent.calcSize(contentLocation, scale);
      }

      if (limitMin instanceof Elements) {
        limitMin.calcSize(minLimitLocation, scale / 2);
      }

      if (limitMax instanceof Elements) {
        limitMax.calcSize(maxLimitLocation, scale / 2);
      }

      this.width = Math.max(integralGlyphBounds.width, limitMinBounds.width + minLimitLocation.x - this.location.x, limitMaxBounds.width + maxLimitLocation.x - this.location.x, contentBounds.width + contentLocation.x - this.location.x);
      this.ascent = Math.max(integralGlyphBounds.ascent, limitMaxBounds.ascent + maxLimitLocation.y - this.location.y, contentBounds.ascent + contentLocation.y - this.location.y);
      this.descent = Math.max(integralGlyphBounds.descent, limitMinBounds.descent + this.location.y - minLimitLocation.y, contentBounds.ascent + this.location.y - contentLocation.y);
      this.height = this.descent + this.ascent;
    }
  }]);

  return Integral;
}(Elements);

var Brackets =
/*#__PURE__*/
function (_Elements6) {
  _inherits(Brackets, _Elements6);

  function Brackets(content, glyph, rightGlyph) {
    var _this7;

    var space = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.03;

    _classCallCheck(this, Brackets);

    var left = glyph !== null ? new Element(glyph) : null;
    var right = rightGlyph !== null ? new Element(rightGlyph) : null;
    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(Brackets).call(this, [left, content, right]));
    _this7.glyph = glyph;
    _this7.rightGlyph = rightGlyph;
    _this7.mainContent = content;
    _this7.glyphLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    _this7.rightGlyphLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    _this7.glyphScale = 1;
    _this7.space = space;
    return _this7;
  }

  _createClass(Brackets, [{
    key: "_dup",
    value: function _dup(namedCollection) {
      var content = this.mainContent == null ? null : this.mainContent._dup(namedCollection);
      var lglyph = this.glyph;

      if (this.glyph != null && namedCollection) {
        lglyph = namedCollection[this.glyph.name];
      }

      var rglyph = this.rightGlyph;

      if (this.rightGlyph != null && namedCollection) {
        rglyph = namedCollection[this.rightGlyph.name];
      }

      var bracketCopy = new Brackets(content, lglyph, rglyph, this.space);
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["duplicateFromTo"])(this, bracketCopy, ['content', 'glyph', 'rightGlyph']); // console.log(this.glyph.getPosition()._dup(), this.rightGlyph.getPosition()._dup());

      return bracketCopy;
    }
  }, {
    key: "getAllElements",
    value: function getAllElements() {
      var elements = [];

      if (this.mainContent) {
        elements = _toConsumableArray(elements).concat(_toConsumableArray(this.mainContent.getAllElements()));
      }

      if (this.glyph) {
        elements = _toConsumableArray(elements).concat([this.glyph]);
      }

      if (this.rightGlyph) {
        elements = _toConsumableArray(elements).concat([this.rightGlyph]);
      } // console.log(this.glyph.getPosition()._dup(), this.rightGlyph.getPosition()._dup());


      return elements;
    }
  }, {
    key: "setPositions",
    value: function setPositions() {
      var glyph = this.glyph,
          rightGlyph = this.rightGlyph;

      if (glyph != null) {
        glyph.transform.updateScale(this.glyphScale, this.glyphScale);
        glyph.transform.updateTranslation(this.glyphLocation.x, this.glyphLocation.y);
      }

      if (rightGlyph != null) {
        rightGlyph.transform.updateScale(this.glyphScale, this.glyphScale);
        rightGlyph.transform.updateTranslation(this.rightGlyphLocation.x, this.rightGlyphLocation.y);
      }

      if (this.mainContent) {
        this.mainContent.setPositions();
      }
    }
  }, {
    key: "offsetLocation",
    value: function offsetLocation() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      this.location = this.location.add(offset);
      var glyph = this.glyph,
          rightGlyph = this.rightGlyph;

      if (glyph != null) {
        this.glyphLocation = this.glyphLocation.add(offset);
      }

      if (rightGlyph != null) {
        this.rightGlyphLocation = this.rightGlyphLocation.add(offset);
      }

      if (this.mainContent) {
        this.mainContent.offsetLocation(offset);
      } // console.log(this.glyph.getPosition()._dup(), this.rightGlyph.getPosition()._dup());

    }
  }, {
    key: "calcSize",
    value: function calcSize(location, scale) {
      this.location = location._dup();

      var loc = location._dup();

      var contentBounds = new Bounds();
      var glyphBounds = new Bounds();
      var rightGlyphBounds = new Bounds();
      var mainContent = this.mainContent;

      if (mainContent instanceof Elements) {
        mainContent.calcSize(loc._dup(), scale);
        contentBounds.width = mainContent.width;
        contentBounds.height = mainContent.ascent + mainContent.descent;
        contentBounds.ascent = mainContent.ascent;
        contentBounds.descent = mainContent.descent;
      }

      var heightScale = 1.4;
      var height = contentBounds.height * heightScale;
      var bracketScale = height;
      var glyphDescent = contentBounds.descent + contentBounds.height * (heightScale - 1) / 1.8;
      var leftSymbolLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](loc.x + this.space * scale, loc.y - glyphDescent);
      var glyph = this.glyph;

      if (glyph instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"]) {
        glyph.show();
        glyph.transform.updateScale(bracketScale, bracketScale);
        glyph.transform.updateTranslation(leftSymbolLocation.x, leftSymbolLocation.y);
        this.glyphLocation = leftSymbolLocation;
        this.glyphScale = bracketScale;
        var bounds = glyph.drawingObject.getRelativeVertexSpaceBoundingRect();
        glyphBounds.width = bounds.width * bracketScale;
        glyphBounds.height = (-bounds.bottom + bounds.top) * bracketScale;
        glyphBounds.ascent = bounds.top * bracketScale;
        glyphBounds.descent = -bounds.bottom * bracketScale;
      }

      var rightSymbolLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](loc.x + contentBounds.width + glyphBounds.width + this.space * 3 * scale, leftSymbolLocation.y);
      var rightGlyph = this.rightGlyph;

      if (rightGlyph instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"]) {
        rightGlyph.show();
        rightGlyph.transform.updateScale(bracketScale, bracketScale);
        rightGlyph.transform.updateTranslation(rightSymbolLocation.x, rightSymbolLocation.y);
        this.rightGlyphLocation = rightSymbolLocation;

        var _bounds = rightGlyph.drawingObject.getRelativeVertexSpaceBoundingRect();

        rightGlyphBounds.width = _bounds.width * bracketScale;
        rightGlyphBounds.height = (-_bounds.bottom + _bounds.top) * bracketScale;
        rightGlyphBounds.ascent = _bounds.top * bracketScale;
        rightGlyphBounds.descent = -_bounds.bottom * bracketScale;
      }

      var contentLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.location.x + glyphBounds.width + this.space * scale * 2, this.location.y);

      if (mainContent instanceof Elements) {
        mainContent.offsetLocation(contentLocation.sub(mainContent.location));
      }

      this.width = glyphBounds.width + contentBounds.width + rightGlyphBounds.width + this.space * scale * 4;
      this.ascent = glyphBounds.height - glyphDescent;
      this.descent = glyphDescent;
      this.height = this.descent + this.ascent; // console.log(this.glyphLocation, this.rightGlyphLocation)
      // console.log(this.glyph.getPosition()._dup(), this.rightGlyph.getPosition()._dup());
    }
  }]);

  return Brackets;
}(Elements);

var Bar =
/*#__PURE__*/
function (_Brackets) {
  _inherits(Bar, _Brackets);

  function Bar(content, barGlyph) {
    var _this8;

    var space = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.03;
    var outsideSpace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.03;
    var barPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'top';

    _classCallCheck(this, Bar);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(Bar).call(this, content, barGlyph, null, space));
    _this8.barPosition = barPosition;
    _this8.outsideSpace = outsideSpace;
    return _this8;
  }

  _createClass(Bar, [{
    key: "calcSize",
    value: function calcSize(location, scale) {
      this.location = location._dup();

      var loc = location._dup();

      var contentBounds = new Bounds();
      var glyphBounds = new Bounds();
      var mainContent = this.mainContent;

      if (mainContent instanceof Elements) {
        mainContent.calcSize(loc._dup(), scale);
        contentBounds.width = mainContent.width;
        contentBounds.height = mainContent.ascent + mainContent.descent;
        contentBounds.ascent = mainContent.ascent;
        contentBounds.descent = mainContent.descent;
      }

      var widthScale = 1;
      var width = contentBounds.width * widthScale;
      var bracketScale = width;
      var leftSymbolLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](loc.x - (widthScale - 1) * width / 2, loc.y + contentBounds.ascent + this.space * scale);

      if (this.barPosition === 'bottom') {
        leftSymbolLocation.y = loc.y - contentBounds.descent - this.space * scale;
      }

      var glyph = this.glyph;

      if (glyph instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"]) {
        glyph.show();
        glyph.transform.updateScale(bracketScale, bracketScale);
        glyph.transform.updateTranslation(leftSymbolLocation.x, leftSymbolLocation.y);
        this.glyphLocation = leftSymbolLocation;
        this.glyphScale = bracketScale;
        var bounds = glyph.drawingObject.getRelativeVertexSpaceBoundingRect();
        glyphBounds.width = bounds.width * bracketScale;
        glyphBounds.height = (-bounds.bottom + bounds.top) * bracketScale;
        glyphBounds.ascent = bounds.top * bracketScale;
        glyphBounds.descent = -bounds.bottom * bracketScale;
      }

      this.width = contentBounds.width;

      if (this.barPosition === 'top') {
        this.ascent = contentBounds.ascent + glyphBounds.height + this.space * scale + this.outsideSpace * scale;
        this.descent = contentBounds.descent;
      } else {
        this.ascent = contentBounds.ascent;
        this.descent = contentBounds.descent + glyphBounds.height + this.space * scale + this.outsideSpace * scale;
      }

      this.height = this.descent + this.ascent;
    } // Must make a dup method in a subclass or else the parent class will
    // create a new copy of its own class type

  }, {
    key: "_dup",
    value: function _dup(namedCollection) {
      var content = this.mainContent == null ? null : this.mainContent._dup(namedCollection);
      var glyph = this.glyph;

      if (this.glyph != null && namedCollection) {
        glyph = namedCollection[this.glyph.name];
      }

      var barCopy = new Bar(content, glyph, this.space, this.outsideSpace, this.barPosition);
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["duplicateFromTo"])(this, barCopy, ['content', 'glyph']);
      return barCopy;
    }
  }]);

  return Bar;
}(Brackets);

function getDiagramElement(collection, name) {
  if (typeof name === 'string') {
    if (collection && "_".concat(name) in collection) {
      // $FlowFixMe
      return collection["_".concat(name)];
    }

    return null;
  }

  return name;
}
function createEquationElements(elems, drawContext2D) {
  var colorOrFont = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var diagramLimits = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](-1, -1, 2, 2);
  var firstTransform = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
  var color = [1, 1, 1, 1];

  if (Array.isArray(colorOrFont)) {
    color = colorOrFont.slice();
  }

  var font = new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_4__["DiagramFont"]('Times New Roman', 'normal', 0.2, '200', 'left', 'alphabetic', color);
  var fontItalic = new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_4__["DiagramFont"]('Times New Roman', 'italic', 0.2, '200', 'left', 'alphabetic', color);

  if (colorOrFont instanceof _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_4__["DiagramFont"]) {
    font = colorOrFont._dup();
    font.style = 'normal';
    fontItalic = colorOrFont._dup();
    fontItalic.style = 'italic';

    if (font.color != null) {
      color = Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["RGBToArray"])(font.color);
    }
  }

  var collection = new _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementCollection"](new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]('Equation Elements Collection').scale(1, 1).rotate(0).translate(0, 0), diagramLimits);

  var makeElem = function makeElem(text, fontOrStyle) {
    var fontToUse = font;

    if (fontOrStyle instanceof _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_4__["DiagramFont"]) {
      fontToUse = fontOrStyle;
    } else if (fontOrStyle === 'italic') {
      fontToUse = fontItalic;
    } else if (fontOrStyle === 'normal') {
      fontToUse = font;
    } else if (text.match(/[A-Z,a-z]/)) {
      fontToUse = fontItalic;
    }

    var dT = new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_4__["DiagramText"](new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0), text, fontToUse);
    var to = new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_4__["TextObject"](drawContext2D, [dT]);
    var p = new _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"](to, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]('Equation Element').scale(1, 1).translate(0, 0), color, diagramLimits);
    return p;
  };

  Object.keys(elems).forEach(function (key) {
    if (typeof elems[key] === 'string') {
      if (!key.startsWith('space')) {
        collection.add(key, makeElem(elems[key], null));
      }
    }

    if (elems[key] instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"]) {
      collection.add(key, elems[key]);
    }

    if (elems[key] instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementCollection"]) {
      collection.add(key, elems[key]);
    }

    if (Array.isArray(elems[key])) {
      var _elems$key = _slicedToArray(elems[key], 7),
          text = _elems$key[0],
          col = _elems$key[1],
          isTouchable = _elems$key[2],
          onClick = _elems$key[3],
          direction = _elems$key[4],
          mag = _elems$key[5],
          fontOrStyle = _elems$key[6];

      var elem = makeElem(text, fontOrStyle);

      if (col) {
        elem.setColor(col);
      }

      if (isTouchable) {
        elem.isTouchable = isTouchable;
      }

      if (onClick) {
        elem.onClick = onClick;
      }

      if (direction) {
        elem.animate.transform.translation.style = 'curved';
        elem.animate.transform.translation.options.direction = direction;
      }

      if (mag) {
        elem.animate.transform.translation.style = 'curved';
        elem.animate.transform.translation.options.magnitude = mag;
      }

      collection.add(key, elem);
    }
  });
  collection.setFirstTransform(firstTransform);
  return collection;
}
function contentToElement(collection, content) {
  // If input is alread an Elements object, then return it
  if (content instanceof Elements) {
    // const namedElements = {};
    // collection.getAllElements().forEach((element) => {
    //   namedElements[element.name] = element;
    // });
    return content._dup();
  } // If it is not an Elements object, then create an Element(s) array
  // and create a new Elements Object


  var elementArray = []; // If the content is a string, then find the corresponding
  // DiagramElement associated with the string

  if (typeof content === 'string') {
    if (content.startsWith('space')) {
      var spaceNum = parseFloat(content.replace(/space[_]*/, '')) || 0.03;
      elementArray.push(new Element(new BlankElement(spaceNum)));
    } else {
      var diagramElement = getDiagramElement(collection, content);

      if (diagramElement) {
        elementArray.push(new Element(diagramElement));
      }
    } // Otherwise, if the input content is an array, then process each element
    // and add it to the ElementArray

  } else if (Array.isArray(content)) {
    content.forEach(function (c) {
      if (typeof c === 'string') {
        if (c.startsWith('space')) {
          var _spaceNum = parseFloat(c.replace(/space[_]*/, '')) || 0.03;

          elementArray.push(new Element(new BlankElement(_spaceNum)));
        } else {
          var _diagramElement = getDiagramElement(collection, c);

          if (_diagramElement) {
            elementArray.push(new Element(_diagramElement));
          }
        }
      } else if (c !== null) {
        elementArray.push(c);
      }
    }); // Otherwise, if the input is an Element or Elements object, so just add
    // it to the ElementsArray
  } else if (content !== null) {
    elementArray.push(content);
  }

  return new Elements(elementArray);
}
var EquationForm =
/*#__PURE__*/
function (_Elements7) {
  _inherits(EquationForm, _Elements7);

  function EquationForm(collection) {
    var _this9;

    _classCallCheck(this, EquationForm);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(EquationForm).call(this, []));
    _this9.collection = collection;
    _this9.description = null;
    _this9.modifiers = {};
    _this9.elementMods = {};
    _this9.time = null;
    return _this9;
  }

  _createClass(EquationForm, [{
    key: "getNamedElements",
    value: function getNamedElements() {
      var namedElements = {};
      this.collection.getAllElements().forEach(function (element) {
        namedElements[element.name] = element;
      });
      return namedElements;
    }
  }, {
    key: "_dup",
    value: function _dup() {
      var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.collection;
      var equationCopy = new EquationForm(collection); // equationCopy.collection = collection;
      // const allCollectionElements = collection.getAllElements();

      var namedElements = {}; // getAllPrimatives?

      collection.getAllElements().forEach(function (element) {
        namedElements[element.name] = element;
      });
      var newContent = [];
      this.content.forEach(function (contentElement) {
        newContent.push(contentElement._dup(namedElements));
      });
      equationCopy.content = newContent;
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["duplicateFromTo"])(this, equationCopy, ['content', 'collection', 'form']);
      return equationCopy;
    }
  }, {
    key: "createEq",
    value: function createEq(content) {
      var _this10 = this;

      var elements = [];
      content.forEach(function (c) {
        if (typeof c === 'string') {
          if (c.startsWith('space')) {
            var spaceNum = parseFloat(c.replace(/space[_]*/, '')) || 0.03;
            elements.push(new Element(new BlankElement(spaceNum)));
          } else {
            var diagramElement = getDiagramElement(_this10.collection, c);

            if (diagramElement) {
              elements.push(new Element(diagramElement));
            }
          }
        } else {
          elements.push(c._dup());
        }

        _this10.content = elements;
      });
    } // createNewEq(content: Array<Elements | Element | string>) {
    //   const eqn = new EquationForm(this.collection);
    //   eqn.createEq(content);
    //   return eqn;
    // }
    // By default, the colleciton is arranged so the first element in the
    // equation is at (0,0) in colleciton space.

  }, {
    key: "arrange",
    value: function arrange() {
      var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var alignH = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'left';
      var alignV = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'baseline';
      var fixTo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      // if (this.name === 'com_add') {
      //   console.log(this.name, 'start')
      //   flag = true;
      // }
      // const elementsInEqn = this.getAllElements();
      var elementsInCollection = this.collection.getAllElements();
      var elementsCurrentlyShowing = elementsInCollection.filter(function (e) {
        return e.isShown;
      });
      this.collection.hideAll();
      this.collection.show();

      _get(_getPrototypeOf(EquationForm.prototype), "calcSize", this).call(this, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0), scale);

      var fixPoint = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);

      if (fixTo instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"] || fixTo instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementCollection"]) {
        var t = fixTo.transform.t();

        if (t != null) {
          fixPoint = t._dup();
        }
      } else {
        fixPoint = fixTo._dup();
      }

      var w = this.width;
      var h = this.height;
      var a = this.ascent;
      var d = this.descent;

      var p = this.location._dup(); // if (this.name === 'com_add') {
      //   console.log(this.name, 'stop')
      //   flag = false;
      // }
      // let { height } = this;


      if (fixTo instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"] || fixTo instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementCollection"]) {
        var _t = fixTo.transform.t();

        if (_t != null) {
          var rect = fixTo.getVertexSpaceBoundingRect();
          w = rect.width;
          h = rect.height;
          a = rect.top - _t.y;
          d = _t.y - rect.bottom;
          p = _t._dup();
        }
      }

      if (alignH === 'right') {
        fixPoint.x += w;
      } else if (alignH === 'center') {
        fixPoint.x += w / 2;
      }

      if (alignV === 'top') {
        fixPoint.y += p.y + a;
      } else if (alignV === 'bottom') {
        fixPoint.y += p.y - d;
      } else if (alignV === 'middle') {
        fixPoint.y += p.y - d + h / 2;
      }

      var delta = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0).sub(fixPoint);

      if (delta.x !== 0 || delta.y !== 0) {
        this.offsetLocation(delta);
        this.setPositions();
      }

      this.collection.showOnly(elementsCurrentlyShowing);
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "dissolveElements",
    value: function dissolveElements(elements) {
      var disolve = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'in';
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;
      var time = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      if (elements.length === 0) {
        if (callback) {
          callback(false);
          return;
        }
      }

      var count = elements.length;
      var completed = 0;

      var end = function end(cancelled) {
        completed += 1;

        if (completed === count) {
          if (callback) {
            callback(cancelled);
          }
        }
      };

      elements.forEach(function (e) {
        e.disolveWithDelay(delay, time, disolve, end);
      });
    }
  }, {
    key: "getElementsToShowAndHide",
    value: function getElementsToShowAndHide() {
      var allElements = this.collection.getAllElements();
      var elementsShown = allElements.filter(function (e) {
        return e.isShown;
      });
      var elementsShownTarget = this.getAllElements();
      var elementsToHide = elementsShown.filter(function (e) {
        return elementsShownTarget.indexOf(e) === -1;
      });
      var elementsToShow = elementsShownTarget.filter(function (e) {
        return elementsShown.indexOf(e) === -1;
      });
      return {
        show: elementsToShow,
        hide: elementsToHide
      };
    }
  }, {
    key: "render",
    value: function render() {
      this.hideShow();
      this.setPositions();
    }
  }, {
    key: "showHide",
    value: function showHide() {
      var showTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var hideTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      this.collection.stop();
      this.collection.show();

      var _this$getElementsToSh = this.getElementsToShowAndHide(),
          show = _this$getElementsToSh.show,
          hide = _this$getElementsToSh.hide;

      if (showTime === 0) {
        show.forEach(function (e) {
          e.showAll(); // if (e instanceof DiagramElementCollection) {
          //   e.showAll();
          // } else {
          //   e.show();
          // }
        });
      } else {
        this.dissolveElements(show, 'in', 0.01, showTime, null);
      }

      if (hideTime === 0) {
        hide.forEach(function (e) {
          return e.hide();
        });
      } else {
        this.dissolveElements(hide, 'out', showTime, hideTime, callback);
      }
    }
  }, {
    key: "hideShow",
    value: function hideShow() {
      var showTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var hideTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      this.collection.stop();
      this.collection.show();

      var _this$getElementsToSh2 = this.getElementsToShowAndHide(),
          show = _this$getElementsToSh2.show,
          hide = _this$getElementsToSh2.hide;

      if (hideTime === 0) {
        hide.forEach(function (e) {
          return e.hide();
        });
      } else {
        this.dissolveElements(hide, 'out', 0.01, hideTime, null);
      }

      if (showTime === 0) {
        show.forEach(function (e) {
          e.showAll(); // if (e instanceof DiagramElementCollection) {
          //   e.showAll();
          // } else {
          //   e.show();
          // }
        });

        if (callback != null) {
          callback();
        }
      } else {
        this.dissolveElements(show, 'in', hideTime, showTime, callback);
      }
    }
  }, {
    key: "allHideShow",
    value: function allHideShow() {
      var _this11 = this;

      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var hideTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      var blankTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
      var showTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.5;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      this.collection.stop();
      var allElements = this.collection.getAllElements();
      var elementsShown = allElements.filter(function (e) {
        return e.isShown;
      });
      var elementsToShow = this.getAllElements();
      var elementsToDelayShowing = elementsToShow.filter(function (e) {
        return !e.isShown;
      });
      var elementsToShowAfterDisolve = elementsToShow.filter(function (e) {
        return e.isShown;
      });
      var cumTime = delay;

      if (elementsToShow.length === 0 && elementsShown.length === 0) {
        if (callback != null) {
          callback(false);
          return;
        }
      } // disolve out
      // set positions
      // disolve in


      var disolveOutCallback = function disolveOutCallback() {
        _this11.setPositions();
      };

      if (elementsToShow.length === 0) {
        disolveOutCallback = function disolveOutCallback(cancelled) {
          _this11.setPositions();

          if (callback != null) {
            callback(cancelled);
          }
        };
      }

      if (elementsShown.length > 0) {
        this.dissolveElements(elementsShown, 'out', delay, hideTime, disolveOutCallback);
        cumTime += hideTime;
      } else {
        this.setPositions();
      }

      var count = elementsToShow.length;
      var completed = 0;

      var end = function end(cancelled) {
        completed += 1;

        if (completed === count - 1) {
          if (callback) {
            callback(cancelled);
          }
        }
      };

      elementsToDelayShowing.forEach(function (e) {
        e.disolveWithDelay(cumTime + blankTime, showTime, 'in', end);
      });
      elementsToShowAfterDisolve.forEach(function (e) {
        e.disolveWithDelay(blankTime, showTime, 'in', end);
      });
    } // setColors() {
    //   Object.keys(this.elementMods).forEach((elementName) => {
    //     const mods = this.elementMods[elementName];
    //     const {
    //       element, color, style, direction, mag,
    //     } = mods;
    //     if (element != null) {
    //       if (color != null) {
    //         element.animateColorToWithDelay(color, cumTime, moveTimeToUse);
    //       }
    //       if (style != null) {
    //         element.animate.transform.translation.style = style;
    //       }
    //       if (direction != null) {
    //         element.animate.transform.translation.options.direction = direction;
    //       }
    //       if (mag != null) {
    //         element.animate.transform.translation.options.magnitude = mag;
    //       }
    //     }
    //   });
    // }

  }, {
    key: "animatePositionsTo",
    value: function animatePositionsTo( // location: Point,
    delay, disolveOutTime, moveTime, disolveInTime) {
      var _this12 = this;

      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var allElements = this.collection.getAllElements();
      this.collection.stop();
      var elementsShown = allElements.filter(function (e) {
        return e.isShown;
      });
      var elementsShownTarget = this.getAllElements();
      var elementsToHide = elementsShown.filter(function (e) {
        return elementsShownTarget.indexOf(e) === -1;
      });
      var elementsToShow = elementsShownTarget.filter(function (e) {
        return elementsShown.indexOf(e) === -1;
      });
      var currentTransforms = this.collection.getElementTransforms();
      this.setPositions();
      var animateToTransforms = this.collection.getElementTransforms();
      var elementsToMove = [];
      var toMoveStartTransforms = [];
      var toMoveStopTransforms = [];
      Object.keys(animateToTransforms).forEach(function (key) {
        var currentT = currentTransforms[key];
        var nextT = animateToTransforms[key];

        if (!currentT.isEqualTo(nextT)) {
          elementsToMove.push(key);
          toMoveStartTransforms.push(currentT);
          toMoveStopTransforms.push(nextT);
        }
      }); // Find move time to use. If moveTime is null, then a velocity is used.

      var moveTimeToUse;

      if (moveTime === null) {
        moveTimeToUse = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["getMoveTime"])(toMoveStartTransforms, toMoveStopTransforms, 0, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0.35, 0.35), // 0.25 diagram space per s
        2 * Math.PI / 6, // 60º per second
        new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0.4, 0.4) // 100% per second
        );
      } else {
        moveTimeToUse = moveTime;
      }

      this.collection.setElementTransforms(currentTransforms);
      var cumTime = delay;
      var moveCallback = null;
      var disolveInCallback = null;
      var disolveOutCallback = null;

      if (elementsToMove.length === 0 && elementsToShow.length === 0) {
        disolveOutCallback = callback;
      } else if (elementsToShow.length === 0) {
        moveCallback = callback;
      } else {
        disolveInCallback = callback;
      }

      if (elementsToHide.length > 0) {
        this.dissolveElements(elementsToHide, 'out', delay, disolveOutTime, disolveOutCallback);
        cumTime += disolveOutTime;
      }

      Object.keys(this.elementMods).forEach(function (elementName) {
        var mods = _this12.elementMods[elementName];
        var element = mods.element,
            color = mods.color,
            style = mods.style,
            direction = mods.direction,
            mag = mods.mag;

        if (element != null) {
          if (color != null) {
            element.animateColorToWithDelay(color, cumTime, moveTimeToUse);
          }

          if (style != null) {
            element.animate.transform.translation.style = style;
          }

          if (direction != null) {
            element.animate.transform.translation.options.direction = direction;
          }

          if (mag != null) {
            element.animate.transform.translation.options.magnitude = mag;
          }
        }
      });
      var t = this.collection.animateToTransforms(animateToTransforms, moveTimeToUse, cumTime, 0, moveCallback);

      if (t > 0) {
        cumTime = t;
      }

      if (elementsToShow.length > 0) {
        this.dissolveElements(elementsToShow, 'in', cumTime, disolveInTime, disolveInCallback);
        cumTime += disolveInTime + 0.001;
      }

      return cumTime;
    } // deprecate

  }, {
    key: "animateTo",
    value: function animateTo() {
      var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var fixElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var xAlign = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'left';
      var yAlign = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'baseline';
      var allElements = this.collection.getAllElements();
      this.collection.stop();
      var elementsShown = allElements.filter(function (e) {
        return e.isShown;
      });
      var elementsShownTarget = this.getAllElements();
      var elementsToHide = elementsShown.filter(function (e) {
        return elementsShownTarget.indexOf(e) === -1;
      });
      var elementsToShow = elementsShownTarget.filter(function (e) {
        return elementsShown.indexOf(e) === -1;
      });
      var currentTransforms = this.collection.getElementTransforms();
      this.arrange(scale, xAlign, yAlign, fixElement);
      var animateToTransforms = this.collection.getElementTransforms();
      this.collection.setElementTransforms(currentTransforms);
      this.dissolveElements(elementsToHide, 'out', 0.001, 0.01, null);
      this.collection.animateToTransforms(animateToTransforms, time, 0);
      this.dissolveElements(elementsToShow, 'in', time, 0.5, callback);
    } // deprecate

  }, {
    key: "sfrac",
    value: function sfrac(numerator, denominator, vinculum) {
      var scaleModifier = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var f = this.frac(numerator, denominator, vinculum);
      f.scaleModifier = scaleModifier;
      return f;
    } // deprecate

  }, {
    key: "frac",
    value: function frac(numerator, denominator, vinculum) {
      return new Fraction(contentToElement(this.collection, numerator), contentToElement(this.collection, denominator), getDiagramElement(this.collection, vinculum));
    } // deprecate

  }, {
    key: "sub",
    value: function sub(content, subscript) {
      return new SuperSub(contentToElement(this.collection, content), null, contentToElement(this.collection, subscript));
    } // deprecate

  }, {
    key: "sup",
    value: function sup(content, superscript) {
      return new SuperSub(contentToElement(this.collection, content), contentToElement(this.collection, superscript), null);
    } // deprecate

  }, {
    key: "supsub",
    value: function supsub(content, superscript, subscript) {
      return new SuperSub(contentToElement(this.collection, content), contentToElement(this.collection, superscript), contentToElement(this.collection, subscript));
    } // deprecate

  }, {
    key: "int",
    value: function int(limitMin, limitMax, content, integralGlyph) {
      return new Integral(contentToElement(this.collection, limitMin), contentToElement(this.collection, limitMax), contentToElement(this.collection, content), getDiagramElement(this.collection, integralGlyph));
    }
  }]);

  return EquationForm;
}(Elements);
var Equation =
/*#__PURE__*/
function () {
  // currentForm: ?EquationForm;
  // currentFormName: string;
  // currentFormType: string;
  function Equation(drawContext2D) {
    var diagramLimits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](-1, -1, 2, 2);
    var firstTransform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]('Equation').scale(1, 1).rotate(0).translate(0, 0);

    _classCallCheck(this, Equation);

    this.drawContext2D = drawContext2D;
    this.diagramLimits = diagramLimits;
    this.firstTransform = firstTransform;
    this.form = {};
    this.formAlignment = {
      vAlign: 'baseline',
      hAlign: 'left',
      fixTo: new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0),
      scale: 1
    };
    this.currentForm = '';
    this.currentFormType = '';
    this.formTypeOrder = ['base'];
    this.descriptionPosition = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    this.isAnimating = false;
  }

  _createClass(Equation, [{
    key: "_dup",
    value: function _dup() {
      var _this13 = this;

      var equationCopy = new Equation(this.drawContext2D, this.diagramLimits._dup(), this.firstTransform._dup());
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["duplicateFromTo"])(this, equationCopy, ['collection', 'form', 'drawContext2D', 'formAlignment']);

      var newCollection = this.collection._dup();

      equationCopy.collection = newCollection;
      var newForm = {};
      Object.keys(this.form).forEach(function (name) {
        if (!(name in newForm)) {
          newForm[name] = {};
        }

        Object.keys(_this13.form[name]).forEach(function (formType) {
          if (formType !== 'name') {
            newForm[name][formType] = _this13.form[name][formType]._dup(newCollection);
          } else {
            newForm[name][formType] = _this13.form[name][formType];
          }
        });
      });
      equationCopy.form = newForm;
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_2__["duplicateFromTo"])(this.formAlignment, equationCopy.formAlignment, ['fixTo']);
      var fixTo = this.formAlignment.fixTo;

      if (fixTo instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"]) {
        equationCopy.formAlignment.fixTo = this.formAlignment.fixTo._dup();
      } else {
        Object.keys(newCollection.elements).forEach(function (key) {
          if (newCollection.elements[key].name === fixTo.name) {
            equationCopy.formAlignment.fixTo = newCollection.elements[key];
          }
        });
      }

      return equationCopy;
    }
  }, {
    key: "createElements",
    value: function createElements(elems) {
      var colorOrFont = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var descriptionElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var descriptionPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      this.collection = createEquationElements(elems, this.drawContext2D, colorOrFont, this.diagramLimits, this.firstTransform);
      this.addDescriptionElement(descriptionElement, descriptionPosition);
    }
  }, {
    key: "addDescriptionElement",
    value: function addDescriptionElement() {
      var descriptionElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var descriptionPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      this.descriptionElement = descriptionElement;
      this.descriptionPosition = descriptionPosition;

      if (this.descriptionElement) {
        this.descriptionElement.setPosition(this.collection.getDiagramPosition().add(descriptionPosition));
      }
    }
  }, {
    key: "setPosition",
    value: function setPosition(position) {
      this.collection.setPosition(position);

      if (this.descriptionElement) {
        this.descriptionElement.setPosition(position.add(this.descriptionPosition));
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      this.collection.stop();
    }
  }, {
    key: "setElem",
    value: function setElem(element) {
      var elementColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var isTouchable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      var mag = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.5;
      var elem = element;

      if (typeof elem === 'string') {
        elem = getDiagramElement(this.collection, element);
      }

      if (elem instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementCollection"] || elem instanceof _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"]) {
        if (elementColor != null) {
          elem.setColor(elementColor);
        }

        elem.isTouchable = isTouchable;

        if (isTouchable) {
          this.collection.hasTouchableElements = true;
        }

        elem.animate.transform.translation.style = 'curved';
        elem.animate.transform.translation.options.direction = direction;
        elem.animate.transform.translation.options.magnitude = mag;
      }
    }
  }, {
    key: "addForm",
    value: function addForm(name, content) {
      var _this14 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!(name in this.form)) {
        this.form[name] = {};
      }

      var defaultOptions = {
        formType: 'base',
        addToSeries: true,
        elementMods: {},
        animationTime: null,
        // use velocities instead of time
        description: '',
        modifiers: {}
      };
      var optionsToUse = defaultOptions;

      if (options) {
        optionsToUse = Object.assign({}, defaultOptions, options);
      }

      var _optionsToUse = optionsToUse,
          formType = _optionsToUse.formType,
          description = _optionsToUse.description,
          modifiers = _optionsToUse.modifiers,
          animationTime = _optionsToUse.animationTime,
          elementMods = _optionsToUse.elementMods,
          addToSeries = _optionsToUse.addToSeries;
      var time = animationTime;
      this.form[name][formType] = new EquationForm(this.collection);
      this.form[name].name = name;
      this.form[name][formType].name = name;
      this.form[name][formType].description = description;
      this.form[name][formType].modifiers = modifiers;
      this.form[name][formType].type = formType;
      this.form[name][formType].elementMods = {};

      if (typeof time === 'number') {
        this.form[name][formType].time = {
          fromPrev: time,
          fromNext: time,
          fromAny: time
        };
      } else {
        this.form[name][formType].time = time;
      }

      Object.keys(elementMods).forEach(function (elementName) {
        var diagramElement = getDiagramElement(_this14.collection, elementName);

        if (diagramElement) {
          var color;
          var style;
          var direction;
          var mag;

          if (Array.isArray(elementMods[elementName])) {
            var _elementMods$elementN = _slicedToArray(elementMods[elementName], 4);

            color = _elementMods$elementN[0];
            style = _elementMods$elementN[1];
            direction = _elementMods$elementN[2];
            mag = _elementMods$elementN[3];
          } else {
            var _elementMods$elementN2 = elementMods[elementName];
            color = _elementMods$elementN2.color;
            style = _elementMods$elementN2.style;
            direction = _elementMods$elementN2.direction;
            mag = _elementMods$elementN2.mag;
          }

          _this14.form[name][formType].elementMods[elementName] = {
            element: diagramElement,
            color: color,
            style: style,
            direction: direction,
            mag: mag
          };
        }
      });
      var form = this.form[name][formType];
      form.createEq(content);
      form.type = formType;
      form.arrange(this.formAlignment.scale, this.formAlignment.hAlign, this.formAlignment.vAlign, this.formAlignment.fixTo);

      if (addToSeries) {
        if (this.formSeries == null) {
          this.formSeries = [];
        }

        this.formSeries.push(this.form[name]);
      } // make the first form added also equal to the base form as always
      // need a base form for some functions


      if (this.form[name].base === undefined) {
        var baseOptions = Object.assign({}, options);
        baseOptions.formType = 'base';
        this.addForm(name, content, baseOptions);
      }
    }
  }, {
    key: "getCurrentForm",
    value: function getCurrentForm() {
      if (this.form[this.currentForm] == null) {
        return null;
      }

      if (this.form[this.currentForm][this.currentFormType] == null) {
        return null;
      }

      return this.form[this.currentForm][this.currentFormType];
    }
  }, {
    key: "reArrangeCurrentForm",
    value: function reArrangeCurrentForm() {
      var form = this.getCurrentForm();

      if (form == null) {
        return;
      }

      form.arrange(this.formAlignment.scale, this.formAlignment.hAlign, this.formAlignment.vAlign, this.formAlignment.fixTo);
    }
  }, {
    key: "scaleForm",
    value: function scaleForm(name, scale) {
      var formType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'base';

      // console.log(name, this.form, formType, this.form[name][formType])
      if (name in this.form) {
        if (formType in this.form[name]) {
          this.form[name][formType].arrange(scale, this.formAlignment.hAlign, this.formAlignment.vAlign, this.formAlignment.fixTo);
        }
      }
    }
  }, {
    key: "scale",
    value: function scale(_scale) {
      var _this15 = this;

      Object.keys(this.form).forEach(function (name) {
        Object.keys(_this15.form[name]).forEach(function (formType) {
          if (formType !== 'name') {
            _this15.scaleForm(name, _scale, formType);
          }
        });
      });
    }
  }, {
    key: "setFormSeries",
    value: function setFormSeries(series) {
      var _this16 = this;

      this.formSeries = [];
      series.forEach(function (form) {
        if (typeof form === 'string') {
          _this16.formSeries.push(_this16.form[form]);
        } else {
          _this16.formSeries.push(form);
        }
      });
    }
  }, {
    key: "getFormIndex",
    value: function getFormIndex(formToGet) {
      var form = this.getForm(formToGet);
      var index = -1;

      if (form != null) {
        index = this.formSeries.indexOf(this.form[form.name]);
      }

      return index;
    }
  }, {
    key: "prevForm",
    value: function prevForm() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var currentForm = this.getCurrentForm();

      if (currentForm == null) {
        return;
      }

      var index = this.getFormIndex(currentForm);

      if (index > -1) {
        index -= 1;

        if (index < 0) {
          index = this.formSeries.length - 1;
        }

        this.goToForm(index, time, delay, 'fromNext');
      }
    }
  }, {
    key: "nextForm",
    value: function nextForm() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var animate = true;
      var currentForm = this.getCurrentForm();

      if (currentForm == null) {
        return;
      }

      var index = this.getFormIndex(currentForm);

      if (index > -1) {
        index += 1;

        if (index > this.formSeries.length - 1) {
          index = 0;
          animate = false;
        }

        this.goToForm(index, time, delay, 'fromPrev', animate);
      }
    }
  }, {
    key: "replayCurrentForm",
    value: function replayCurrentForm(time) {
      if (this.isAnimating) {
        this.collection.stop(true, true);
        this.collection.stop(true, true);
        this.isAnimating = false;
        var currentForm = this.getCurrentForm();

        if (currentForm != null) {
          this.showForm(currentForm);
        }

        return;
      }

      this.collection.stop();
      this.collection.stop();
      this.isAnimating = false;
      this.prevForm(0);
      this.nextForm(time, 0.5);
    }
  }, {
    key: "goToForm",
    value: function goToForm() {
      var _this17 = this;

      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var fromWhere = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'fromAny';
      var animate = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

      if (this.isAnimating) {
        this.collection.stop(true, true);
        this.collection.stop(true, true);
        this.isAnimating = false;
        var currentForm = this.getCurrentForm();

        if (currentForm != null) {
          this.showForm(currentForm);
        }

        return;
      }

      this.collection.stop();
      this.collection.stop();
      this.isAnimating = false;
      var nextIndex = 0;

      if (name == null) {
        var index = 0;

        var _currentForm = this.getCurrentForm();

        if (_currentForm != null) {
          index = this.formSeries.indexOf(this.form[_currentForm.name]);

          if (index < 0) {
            index = 0;
          }
        }

        nextIndex = index + 1;

        if (nextIndex === this.formSeries.length) {
          nextIndex = 0;
        }
      } else if (typeof name === 'number') {
        nextIndex = name;
      } else {
        this.formSeries.forEach(function (form, index) {
          if (form.name === name) {
            nextIndex = index;
          }
        });
      }

      var form = null;
      var formTypeToUse = null;
      var possibleFormTypes = this.formTypeOrder.filter(function (fType) {
        return fType in _this17.formSeries[nextIndex];
      });

      if (possibleFormTypes.length) {
        // eslint-disable-next-line prefer-destructuring
        formTypeToUse = possibleFormTypes[0];
      }

      if (formTypeToUse != null) {
        // $FlowFixMe
        form = this.formSeries[nextIndex][formTypeToUse];

        if (time === 0) {
          this.showForm(form);
        } else {
          this.isAnimating = true;

          var end = function end() {
            _this17.isAnimating = false;
          };

          if (animate) {
            var timeToUse = null;

            if (form.time != null && form.time[fromWhere] != null) {
              timeToUse = form.time[fromWhere];
            }

            form.animatePositionsTo(delay, 0.4, timeToUse, 0.4, end);
          } else {
            form.allHideShow(delay, 0.5, 0.2, 0.5, end);
          }

          this.setCurrentForm(form);
        }

        this.updateDescription();
      }
    }
  }, {
    key: "changeDescription",
    value: function changeDescription(formOrName) {
      var description = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var modifiers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var formType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'base';
      var form = this.getForm(formOrName, formType);

      if (form != null) {
        form.description = "".concat(description);
        form.modifiers = modifiers;
      }
    }
  }, {
    key: "updateDescription",
    value: function updateDescription() {
      var formOrName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var formType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base';
      var element = this.descriptionElement;

      if (element == null) {
        return;
      }

      if (element.isShown === false) {
        return;
      }

      var form = null;

      if (formOrName == null) {
        form = this.getCurrentForm();
      } else if (typeof formOrName === 'string') {
        form = this.getForm(formOrName, formType);
      } else {
        form = formOrName;
      }

      if (form == null) {
        return;
      }

      if (form.description == null) {
        return;
      }

      var drawingObject = element.drawingObject;

      if (drawingObject instanceof _DrawingObjects_HTMLObject_HTMLObject__WEBPACK_IMPORTED_MODULE_7__["default"]) {
        drawingObject.change(_tools_htmlGenerator__WEBPACK_IMPORTED_MODULE_6__["applyModifiers"](form.description, form.modifiers), element.lastDrawTransform.m());
        _tools_htmlGenerator__WEBPACK_IMPORTED_MODULE_6__["setOnClicks"](form.modifiers);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var form = this.getCurrentForm();

      if (form != null) {
        form.showHide();
        this.collection.show();
        form.setPositions();
        this.updateDescription();
      }
    }
  }, {
    key: "setCurrentForm",
    value: function setCurrentForm(formOrName) {
      var formType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base';

      if (typeof formOrName === 'string') {
        this.currentForm = '';
        this.currentFormType = '';

        if (formOrName in this.form) {
          this.currentForm = formOrName;

          if (formType in this.form[formOrName]) {
            this.currentFormType = formType;
          }
        }
      } else {
        this.currentForm = formOrName.name;
        this.currentFormType = formOrName.type;
      }
    }
  }, {
    key: "setUnits",
    value: function setUnits(units) {
      if (units === 'deg') {
        this.formTypeOrder = ['deg', 'base'];
      }

      if (units === 'rad') {
        this.formTypeOrder = ['rad', 'base'];
      }

      if (this.collection.isShown) {
        this.showForm(this.currentForm);
      }
    }
  }, {
    key: "showForm",
    value: function showForm(formOrName) {
      var formType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.collection.show();
      var form = formOrName;

      if (typeof formOrName === 'string') {
        form = this.getForm(formOrName, formType);
      }

      if (form) {
        this.setCurrentForm(form);
        this.render();
      }
    }
  }, {
    key: "getForm",
    value: function getForm(formOrName, formType) {
      var _this18 = this;

      if (formOrName instanceof EquationForm) {
        return formOrName;
      } // console.log(formType, this.form[formOrName])


      if (formOrName in this.form) {
        var formTypeToUse = formType;

        if (formTypeToUse == null) {
          var possibleFormTypes = this.formTypeOrder.filter(function (fType) {
            return fType in _this18.form[formOrName];
          });

          if (possibleFormTypes.length) {
            // eslint-disable-next-line prefer-destructuring
            formTypeToUse = possibleFormTypes[0];
          }
        }

        if (formTypeToUse != null) {
          return this.form[formOrName][formTypeToUse];
        }
      }

      return null;
    }
  }, {
    key: "phrase",
    value: function phrase(content) {
      return new Elements([contentToElement(this.collection, content)]);
    }
  }, {
    key: "frac",
    value: function frac(numerator, denominator, vinculum) {
      return new Fraction(contentToElement(this.collection, numerator), contentToElement(this.collection, denominator), getDiagramElement(this.collection, vinculum));
    }
  }, {
    key: "strike",
    value: function strike(content, _strike) {
      var strikeInSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return new StrikeOut(contentToElement(this.collection, content), getDiagramElement(this.collection, _strike), strikeInSize);
    }
  }, {
    key: "annotation",
    value: function annotation(content, annotationArray) {
      var annotationInSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return new Annotation(contentToElement(this.collection, content), annotationArray, annotationInSize);
    }
  }, {
    key: "ann",
    value: function ann(content) {
      var xPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'right';
      var yPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'top';
      var xAlign = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'left';
      var yAlign = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'bottom';
      var annotationScale = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.5;
      return new AnnotationInformation(contentToElement(this.collection, content), xPosition, yPosition, xAlign, yAlign, annotationScale);
    }
  }, {
    key: "sfrac",
    value: function sfrac(numerator, denominator, vinculum) {
      var scaleModifier = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var f = this.frac(numerator, denominator, vinculum);
      f.scaleModifier = scaleModifier;
      return f;
    }
  }, {
    key: "sub",
    value: function sub(content, subscript) {
      return new SuperSub(contentToElement(this.collection, content), null, contentToElement(this.collection, subscript));
    }
  }, {
    key: "sup",
    value: function sup(content, superscript) {
      return new SuperSub(contentToElement(this.collection, content), contentToElement(this.collection, superscript), null);
    }
  }, {
    key: "supsub",
    value: function supsub(content, superscript, subscript) {
      return new SuperSub(contentToElement(this.collection, content), contentToElement(this.collection, superscript), contentToElement(this.collection, subscript));
    }
  }, {
    key: "brac",
    value: function brac(content, leftBracket, rightBracket) {
      var space = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.03;
      return new Brackets(contentToElement(this.collection, content), getDiagramElement(this.collection, leftBracket), getDiagramElement(this.collection, rightBracket), space);
    }
  }, {
    key: "topBar",
    value: function topBar(content, bar) {
      var space = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.03;
      var outsideSpace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.03;
      return new Bar(contentToElement(this.collection, content), getDiagramElement(this.collection, bar), space, outsideSpace, 'top');
    }
  }, {
    key: "bottomBar",
    value: function bottomBar(content, bar) {
      var space = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.03;
      var outsideSpace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.03;
      return new Bar(contentToElement(this.collection, content), getDiagramElement(this.collection, bar), space, outsideSpace, 'bottom');
    }
  }, {
    key: "topComment",
    value: function topComment(content, comment, bar) {
      var space = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.03;
      var outsideSpace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.03;
      return this.annotation(this.topBar(content, bar, space, outsideSpace), [this.ann(comment, 'center', 'top', 'center', 'bottom')]);
    }
  }, {
    key: "bottomComment",
    value: function bottomComment(content, comment, bar) {
      var space = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.0;
      var outsideSpace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.03;
      return this.annotation(this.bottomBar(content, bar, space, outsideSpace), [this.ann(comment, 'center', 'bottom', 'center', 'top')]);
    }
  }]);

  return Equation;
}();

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/HTMLEquation.js":
/*!*****************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/HTMLEquation.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HTMLEquation; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function makeDiv(id, classes, text) {
  var indent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var indentStr = ' '.repeat(indent);
  var idStr = id ? " id=\"".concat(id, "\"") : '';
  var classString = classes ? " ".concat(classes.join(' ')) : '';
  var out = "".concat(indentStr, "<div").concat(idStr, " class=\"equation_element").concat(classString, "\">\n");
  out += "".concat(text, "\n");
  out += "".concat(indentStr, "</div>");
  return out;
} // Most fundamental Equation Element properties includes element size and
// location, as well as html id and classes.


var HTMLElementProperties =
/*#__PURE__*/
function () {
  function HTMLElementProperties() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, HTMLElementProperties);

    this.id = id;

    if (Array.isArray(classes)) {
      this.classes = classes;
    } else if (classes.length > 0) {
      this.classes = classes.split(' ');
    } else {
      this.classes = [];
    }
  }

  _createClass(HTMLElementProperties, [{
    key: "render",
    value: function render() {
      var indent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      return makeDiv(this.id, this.classes, text, indent);
    }
  }]);

  return HTMLElementProperties;
}();

var HTMLElement =
/*#__PURE__*/
function (_HTMLElementPropertie) {
  _inherits(HTMLElement, _HTMLElementPropertie);

  function HTMLElement(text) {
    var _this;

    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, HTMLElement);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HTMLElement).call(this, id, classes));

    _this.classes.push('equation_text');

    _this.text = text;
    return _this;
  }

  _createClass(HTMLElement, [{
    key: "render",
    value: function render() {
      var indent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return _get(_getPrototypeOf(HTMLElement.prototype), "render", this).call(this, indent, "".concat(' '.repeat(indent + 2)).concat(this.text));
    }
  }]);

  return HTMLElement;
}(HTMLElementProperties);

var HTMLElements =
/*#__PURE__*/
function (_HTMLElementPropertie2) {
  _inherits(HTMLElements, _HTMLElementPropertie2);

  function HTMLElements(content) {
    var _this2;

    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, HTMLElements);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(HTMLElements).call(this, id, classes));
    var filteredContent = [];
    content.forEach(function (c) {
      if (c !== null) {
        filteredContent.push(c);
      }
    });
    _this2.content = filteredContent;
    return _this2;
  }

  _createClass(HTMLElements, [{
    key: "render",
    value: function render() {
      var indent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return _get(_getPrototypeOf(HTMLElements.prototype), "render", this).call(this, indent, this.content.map(function (c) {
        return c.render(indent + 2);
      }).join('\n'));
    }
  }]);

  return HTMLElements;
}(HTMLElementProperties);

var Fraction =
/*#__PURE__*/
function (_HTMLElementPropertie3) {
  _inherits(Fraction, _HTMLElementPropertie3);

  function Fraction(numerator, denominator) {
    var _this3;

    var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var classes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    _classCallCheck(this, Fraction);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Fraction).call(this, id, classes));

    _this3.classes.push('fraction');

    _this3.numerator = numerator;
    _this3.denominator = denominator;
    return _this3;
  }

  _createClass(Fraction, [{
    key: "render",
    value: function render() {
      var indent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var s = ' '.repeat(indent + 2);
      var out = '';
      out += "".concat(s, "<div class=\"numerator\">\n");
      out += this.numerator.render(indent + 4);
      out += "\n".concat(s, "</div>\n");
      out += "".concat(s, "<div class=\"fraction_line\"> </div>\n");
      out += "".concat(s, "<div class=\"denominator\">\n");
      out += this.denominator.render(indent + 4);
      out += "\n".concat(s, "</div>");
      return _get(_getPrototypeOf(Fraction.prototype), "render", this).call(this, indent, out);
    }
  }]);

  return Fraction;
}(HTMLElementProperties);

var SuperSub =
/*#__PURE__*/
function (_HTMLElementPropertie4) {
  _inherits(SuperSub, _HTMLElementPropertie4);

  function SuperSub(content, superscript, subscript) {
    var _this4;

    var id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var classes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

    _classCallCheck(this, SuperSub);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(SuperSub).call(this, id, classes));

    _this4.classes.push('supersub');

    _this4.superscript = superscript;
    _this4.subscript = subscript;
    _this4.content = content;
    return _this4;
  }

  _createClass(SuperSub, [{
    key: "render",
    value: function render() {
      var indent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var s = ' '.repeat(indent + 2);
      var out = '';
      out += "".concat(s, "<div class=\"supsub_content element\">\n");
      out += this.content.render(indent + 2);
      out += "\n".concat(s, "</div>\n");
      out += "".concat(s, "<div class=\"super_sub element\">\n");
      out += "".concat(s, "<div class=\"super_sub_super superscript_text element\">\n");

      if (this.superscript !== null) {
        out += this.superscript.render(indent + 4);
      }

      out += "\n".concat(s, "</div>\n");
      out += "".concat(s, "<div class=\"super_sub_sub subscript_text element\">\n");

      if (this.subscript !== null) {
        out += this.subscript.render(indent + 4);
      }

      out += "\n".concat(s, "</div>");
      out += "\n".concat(s, "</div>\n");
      return _get(_getPrototypeOf(SuperSub.prototype), "render", this).call(this, indent, out);
    }
  }]);

  return SuperSub;
}(HTMLElementProperties);

var Subscript =
/*#__PURE__*/
function (_SuperSub) {
  _inherits(Subscript, _SuperSub);

  function Subscript(content, // eslint-disable-line no-use-before-define
  subscript) {
    var _this5;

    var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var classes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    _classCallCheck(this, Subscript);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Subscript).call(this, content, null, subscript, id, classes));

    var index = _this5.classes.indexOf('supersub');

    if (index > -1) {
      _this5.classes.splice(index, 1);
    }

    _this5.classes.push('subscript');

    return _this5;
  }

  return Subscript;
}(SuperSub);

var Superscript =
/*#__PURE__*/
function (_SuperSub2) {
  _inherits(Superscript, _SuperSub2);

  function Superscript(content, // eslint-disable-line no-use-before-define
  superscript) {
    var _this6;

    var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var classes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    _classCallCheck(this, Superscript);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Superscript).call(this, content, superscript, null, id, classes));

    var index = _this6.classes.indexOf('supersub');

    if (index > -1) {
      _this6.classes.splice(index, 1);
    }

    _this6.classes.push('superscript');

    return _this6;
  }

  return Superscript;
}(SuperSub);

var Root =
/*#__PURE__*/
function (_HTMLElementPropertie5) {
  _inherits(Root, _HTMLElementPropertie5);

  function Root(content) {
    var _this7;

    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, Root);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(Root).call(this, id, classes));
    _this7.content = content;
    return _this7;
  }

  _createClass(Root, [{
    key: "render",
    value: function render() {
      var indent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var s = ' '.repeat(indent + 2);
      var out = '';
      out += "".concat(s, "<div class=\"square_root element\">\n");
      out += "".concat(s, "  <div class=\"equation_element radical element\">\n");
      out += "".concat(s, "    &radic;\n");
      out += "".concat(s, "  </div>\n");
      out += this.content.render(indent + 4);
      out += "\n".concat(s, "</div>");
      return _get(_getPrototypeOf(Root.prototype), "render", this).call(this, indent, out);
    }
  }]);

  return Root;
}(HTMLElementProperties); // function contentToE(content: string | HTMLElements): HTMLElements {
//   let c;
//   if (typeof content === 'string') {
//     c = new HTMLElements(content);
//   } else {
//     c = content;
//   }
//   return c;
// }


function contentToElement(content) {
  if (content instanceof HTMLElements) {
    return content;
  }

  if (content instanceof HTMLElement || content instanceof HTMLElementProperties) {
    return new HTMLElements([content]);
  }

  if (typeof content === 'string') {
    return new HTMLElements([new HTMLElement(content)]);
  } // Otherwise must be array


  var elementArray = [];
  content.forEach(function (c) {
    if (typeof c === 'string') {
      elementArray.push(new HTMLElement(c));
    } else {
      elementArray.push(c);
    }
  });
  return new HTMLElements(elementArray);
}

var HTMLEquation =
/*#__PURE__*/
function (_HTMLElements) {
  _inherits(HTMLEquation, _HTMLElements);

  function HTMLEquation() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, HTMLEquation);

    return _possibleConstructorReturn(this, _getPrototypeOf(HTMLEquation).call(this, [], id, classes));
  }

  _createClass(HTMLEquation, [{
    key: "createEq",
    value: function createEq(content) {
      var _this8 = this;

      var elements = [];
      content.forEach(function (c) {
        if (typeof c === 'string') {
          elements.push(new HTMLElement(c));
        } else {
          elements.push(c);
        }

        _this8.content = elements;
      });
    }
  }, {
    key: "htmlElement",
    value: function htmlElement() {
      var element = document.createElement('div');
      element.setAttribute('id', this.id);
      element.innerHTML = this.render();
      this.classes.forEach(function (c) {
        if (c) {
          element.classList.add(c);
        }
      });
      return element;
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "el",
    value: function el(content) {
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      return new HTMLElement(content, id, classes);
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "supsub",
    value: function supsub(content, superscript, subscript) {
      var id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      var classes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
      return new SuperSub(contentToElement(content), contentToElement(superscript), contentToElement(subscript), id, classes);
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "sub",
    value: function sub(content, subscript) {
      var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var classes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      return new Subscript(contentToElement(content), contentToElement(subscript), id, classes);
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "sup",
    value: function sup(content, superscript) {
      var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var classes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      return new Superscript(contentToElement(content), contentToElement(superscript), id, classes);
    } // e(
    //   content: string | Array<HTMLElementProperties>,
    //   id: string = '',
    //   classes: string | Array<string> = [],
    // ) {
    //   return new HTMLElements(content, id, classes);
    // }
    // eslint-disable-next-line class-methods-use-this

  }, {
    key: "frac",
    value: function frac(numerator, denominator) {
      var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var classes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      return new Fraction(contentToElement(numerator), contentToElement(denominator), id, classes);
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "sqrt",
    value: function sqrt(content) {
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      return new Root(contentToElement(content), id, classes);
    }
  }]);

  return HTMLEquation;
}(HTMLElements);



/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/Integral.js":
/*!*************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/Integral.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Integral; });
/* harmony import */ var _VertexIntegral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VertexIntegral */ "./src/js/diagram/DiagramElements/Equation/VertexIntegral.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
 // import VertexPolygonFilled from '../../DrawingObjects/VertexObject/VertexPolygon';




function Integral(webgl, color, numLines, transformOrLocation, diagramLimits) {
  // const serifSides = 30;
  // const serifRadius = 0.05;
  var vertices = new _VertexIntegral__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, numLines, true); // const serif = new VertexPolygonFilled(
  //   webgl,
  //   serifSides,
  //   serifRadius,
  //   0,
  //   new Point(0, 0),
  //   serifSides,
  // );

  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertices, transform, color, diagramLimits);
}

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/RoundedSquareBracket.js":
/*!*************************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/RoundedSquareBracket.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RoundedSquareBracket; });
/* harmony import */ var _VertexRoundedSquareBracket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VertexRoundedSquareBracket */ "./src/js/diagram/DiagramElements/Equation/VertexRoundedSquareBracket.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");




function RoundedSquareBracket(webgl, color, side, numLines, transformOrLocation, diagramLimits) {
  var vertices = new _VertexRoundedSquareBracket__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, side, numLines);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertices, transform, color, diagramLimits);
}

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/SquareBracket.js":
/*!******************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/SquareBracket.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SquareBracket; });
/* harmony import */ var _VertexSquareBracket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VertexSquareBracket */ "./src/js/diagram/DiagramElements/Equation/VertexSquareBracket.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");




function SquareBracket(webgl, color, side, numLines, transformOrLocation, diagramLimits) {
  var vertices = new _VertexSquareBracket__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, side, numLines);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertices, transform, color, diagramLimits);
}

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/VertexBar.js":
/*!**************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/VertexBar.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _VertexBracket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VertexBracket */ "./src/js/diagram/DiagramElements/Equation/VertexBracket.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var VertexBar =
/*#__PURE__*/
function (_VertexBracket) {
  _inherits(VertexBar, _VertexBracket);

  function VertexBar() {
    _classCallCheck(this, VertexBar);

    return _possibleConstructorReturn(this, _getPrototypeOf(VertexBar).apply(this, arguments));
  }

  _createClass(VertexBar, [{
    key: "getPoints",
    value: function getPoints() {
      var w = 1 / 30;

      if (this.numLines > 1) {
        w /= this.numLines;
      }

      var leftPoints = [new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, this.mainHeight)];
      var rightPoints = [new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](w, 0), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](w, this.mainHeight)];
      var maxX = w;
      return {
        leftPoints: leftPoints,
        rightPoints: rightPoints,
        maxX: maxX
      };
    }
  }]);

  return VertexBar;
}(_VertexBracket__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexBar);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/VertexBrace.js":
/*!****************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/VertexBrace.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _VertexBracket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VertexBracket */ "./src/js/diagram/DiagramElements/Equation/VertexBracket.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var VertexBrace =
/*#__PURE__*/
function (_VertexBracket) {
  _inherits(VertexBrace, _VertexBracket);

  function VertexBrace() {
    _classCallCheck(this, VertexBrace);

    return _possibleConstructorReturn(this, _getPrototypeOf(VertexBrace).apply(this, arguments));
  }

  _createClass(VertexBrace, [{
    key: "getPoints",
    value: function getPoints() {
      var w = 1 / 20;

      if (this.numLines > 1) {
        w /= this.numLines;
      }

      var r1 = w * 3;
      var r2 = r1 * 1.3;
      var p1 = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](r1, 0);
      var p2 = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](w + r2 + w / 4, 0);
      var r1Angle = Math.PI / 2 * 0.8;
      var h = r1 * Math.sin(r1Angle);
      var r2Angle = Math.asin(h / r2);
      var segments = 5;
      var r1AngleStep = r1Angle / segments;
      var r2AngleStep = r2Angle / segments;
      var cornerR1Points = [];
      var cornerR2Points = [];

      for (var i = 0; i <= segments; i += 1) {
        cornerR1Points.push(Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(r1, Math.PI - i * r1AngleStep).add(p1));
        cornerR2Points.push(Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(r2, Math.PI - i * r2AngleStep).add(p2));
      }

      var width = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(r2, Math.PI - r2Angle).add(p2).x;
      var height = h;
      var top = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().translate(width - w, this.mainHeight - height);
      var bottom = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, -1).translate(width - w, height);
      var middleBottom = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(-1, 1).translate(width, this.mainHeight / 2 - height * 1);
      var middleTop = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(-1, -1).translate(width, this.mainHeight / 2 + height * 1);

      var leftPoints = _toConsumableArray(cornerR1Points.map(function (p) {
        return p.transformBy(bottom.m());
      }).reverse()).concat(_toConsumableArray(cornerR2Points.map(function (p) {
        return p.transformBy(middleBottom.m());
      })), _toConsumableArray(cornerR2Points.map(function (p) {
        return p.transformBy(middleTop.m());
      }).reverse()), _toConsumableArray(cornerR1Points.map(function (p) {
        return p.transformBy(top.m());
      })));

      var rightPoints = _toConsumableArray(cornerR2Points.map(function (p) {
        return p.transformBy(bottom.m());
      }).reverse()).concat(_toConsumableArray(cornerR1Points.map(function (p) {
        return p.transformBy(middleBottom.m());
      })), _toConsumableArray(cornerR1Points.map(function (p) {
        return p.transformBy(middleTop.m());
      }).reverse()), _toConsumableArray(cornerR2Points.map(function (p) {
        return p.transformBy(top.m());
      })));

      return {
        leftPoints: leftPoints,
        rightPoints: rightPoints,
        maxX: width * 2 - w
      };
    }
  }]);

  return VertexBrace;
}(_VertexBracket__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexBrace);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/VertexBracket.js":
/*!******************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/VertexBracket.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../DrawingObjects/VertexObject/VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var VertexBracket =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertexBracket, _VertexObject);

  _createClass(VertexBracket, [{
    key: "getPoints",
    value: function getPoints() {
      var w = 1 / this.numLines / 16;
      var r1 = w * 16 * this.numLines;
      var r2 = r1 * (1.4 - 0.4 * (1 - 1 / this.numLines)); // let r1 = 1;
      // let r2 = 1.5;
      // let w = 1 / 16;
      // if (this.numLines === 2) {
      //   r1 = 1.5;
      //   r2 = 2;
      //   w = 1 / 25;
      // }

      var mainHeight = this.mainHeight;
      var p1 = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](r1, mainHeight / 2);
      var p2 = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](r2 + w, mainHeight / 2);
      var r1Angle = Math.asin(mainHeight / 2 / r1);
      var r2Angle = Math.asin(mainHeight / 2 / r2);
      var numSegments = 10 * this.numLines;
      var r1AngleStep = r1Angle * 2 / numSegments;
      var r2AngleStep = r2Angle * 2 / numSegments;
      var r1Points = [];
      var r2Points = [];

      for (var i = 0; i <= numSegments; i += 1) {
        r1Points.push(Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(r1, Math.PI - r1Angle + i * r1AngleStep).add(p1));
        r2Points.push(Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(r2, Math.PI - r2Angle + i * r2AngleStep).add(p2));
      }

      var maxX = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(r2, Math.PI - r2Angle).add(p2).x;
      return {
        leftPoints: r1Points,
        rightPoints: r2Points,
        maxX: maxX
      };
    }
  }]);

  function VertexBracket(webgl, side) {
    var _this;

    var numLines = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, VertexBracket);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexBracket).call(this, webgl));
    _this.glPrimative = _this.gl.TRIANGLE_STRIP;
    _this.numLines = numLines;
    _this.mainHeight = 1;

    var _this$getPoints = _this.getPoints(),
        leftPoints = _this$getPoints.leftPoints,
        rightPoints = _this$getPoints.rightPoints,
        maxX = _this$getPoints.maxX;

    var points1 = [];
    var points2 = [];
    var t; // const maxX = polarToRect(r2, Math.PI - r2Angle).add(p2).x;

    if (side === 'right') {
      t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(-1, 1).translate(maxX, 0);
    } else if (side === 'top') {
      t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().translate(0, -_this.mainHeight / 2).rotate(-Math.PI / 2).translate(_this.mainHeight / 2, maxX);
    } else if (side === 'bottom') {
      t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().translate(0, -_this.mainHeight / 2).rotate(Math.PI / 2).translate(_this.mainHeight / 2, -maxX);
    } else {
      t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
    }

    points1 = leftPoints.map(function (p) {
      return p.transformBy(t.m());
    });
    points2 = rightPoints.map(function (p) {
      return p.transformBy(t.m());
    });
    _this.points = [];
    points1.forEach(function (r1p, index) {
      var r2p = points2[index];

      _this.points.push(r1p.x);

      _this.points.push(r1p.y);

      _this.points.push(r2p.x);

      _this.points.push(r2p.y);
    });
    _this.border[0] = [];
    points1.forEach(function (p) {
      _this.border[0].push(p);
    });

    for (var i = points2.length - 1; i >= 0; i -= 1) {
      _this.border[0].push(points2[i]);
    }

    _this.setupBuffer();

    return _this;
  }

  return VertexBracket;
}(_DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexBracket);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/VertexIntegral.js":
/*!*******************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/VertexIntegral.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../DrawingObjects/VertexObject/VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





function range(start, stop, step) {
  var out = [];

  for (var i = start; i <= stop + step * 0.5; i += step) {
    out.push(i);
  }

  return out;
}

var VertexIntegral =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertexIntegral, _VertexObject);

  function VertexIntegral(webgl) {
    var _this;

    var lineHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var serif = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, VertexIntegral);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexIntegral).call(this, webgl));
    _this.glPrimative = _this.gl.TRIANGLE_STRIP; // let mul = 0.5;
    // if (lineHeight === 1) {
    //   mul = 1;
    // }

    var mul = 0.3;

    if (lineHeight < 5) {
      mul = 1 - Math.log(lineHeight) / 2;
    }

    var k = 20;
    var L = 1;
    var sigma = 0.07;
    var a = 0.003 * mul;
    var bias = 0.01 * mul;
    var xArray = range(-0.18, 0.18, 0.01);
    var yArray = xArray.map(function (x) {
      return L / (1 + Math.exp(-k * x));
    });
    var normDist = xArray.map(function (x) {
      return a / Math.sqrt(2 * Math.PI * Math.pow(sigma, 2)) * Math.exp(-Math.pow(x, 2) / (2 * Math.pow(sigma, 2)));
    });
    var xLeft = xArray.map(function (x, index) {
      return x - normDist[index] - bias;
    });
    var xRight = xArray.map(function (x, index) {
      return x + normDist[index] + bias;
    });
    var serifRadius = 0.03 * mul;
    var serifPoints = 30; // calculate upper serif properites

    var num = xLeft.length;
    var upperSerifPoint = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](xLeft[num - 1], yArray[num - 1]);
    var gradient = k * yArray[num - 1] * (L - yArray[num - 1]);
    var theta = Math.atan(gradient);
    var alpha = Math.PI / 2 - theta;
    var center = upperSerifPoint.add(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](serifRadius * Math.cos(alpha), -serifRadius * Math.sin(alpha)));
    var dAngle = Math.PI * 2 / (serifPoints - 1);
    var startAngle = Math.PI / 2 + theta; // calculate lower serif properties

    var lowerSerifCenter = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](-center.x, L - center.y);
    var lowerSerifStartAngle = -alpha; // lower serif

    if (serif) {
      _this.border.push([]);

      _this.border.push([]);

      for (var i = 0; i < serifPoints; i += 1) {
        _this.points.push(lowerSerifCenter.x);

        _this.points.push(lowerSerifCenter.y);

        var angle = lowerSerifStartAngle + dAngle * i;
        var perimeterPoint = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](lowerSerifCenter.x + serifRadius * Math.cos(angle), lowerSerifCenter.y + serifRadius * Math.sin(angle));

        _this.points.push(perimeterPoint.x);

        _this.points.push(perimeterPoint.y);

        _this.border[1].push(perimeterPoint);
      }
    }

    var borderLeft = [];
    var borderRight = [];
    yArray.map(function (y, index) {
      var pLeft = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](xLeft[index], y);
      var pRight = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](xRight[index], y);

      _this.points.push(pRight.x);

      _this.points.push(pRight.y);

      _this.points.push(pLeft.x);

      _this.points.push(pLeft.y);

      borderLeft.push(pLeft._dup());
      borderRight.push(pRight._dup());
      return undefined;
    }); // upper serif

    if (serif) {
      for (var _i = 0; _i < serifPoints; _i += 1) {
        _this.points.push(center.x);

        _this.points.push(center.y);

        var _angle = startAngle + dAngle * _i;

        var _perimeterPoint = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](center.x + serifRadius * Math.cos(_angle), center.y + serifRadius * Math.sin(_angle));

        _this.points.push(_perimeterPoint.x);

        _this.points.push(_perimeterPoint.y);

        _this.border[2].push(_perimeterPoint);
      }
    }

    _this.border[0] = borderLeft.concat(borderRight.reverse());

    _this.border[0].push(_this.border[0][0]._dup()); // normalize all points to have bottom left corner at 0,0
    // and height to be 1.


    var bounds = _this.getGLBoundingRect(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().matrix());

    var t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().translate(-bounds.left, -bounds.bottom).scale(1 / bounds.height, 1 / bounds.height);

    for (var _i2 = 0; _i2 < _this.border.length; _i2 += 1) {
      var border = _this.border[_i2];

      for (var j = 0; j < border.length; j += 1) {
        _this.border[_i2][j] = _this.border[_i2][j].transformBy(t.matrix());
      }
    }

    for (var _i3 = 0; _i3 < _this.points.length; _i3 += 2) {
      var p = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](_this.points[_i3], _this.points[_i3 + 1]);
      var newP = p.transformBy(t.matrix());
      _this.points[_i3] = newP.x;
      _this.points[_i3 + 1] = newP.y;
    } // this.points[0] = new Point(0, 0);
    // this.points[1] = new Point(0, 0.5);
    // this.points[2] = new Point(0.5, 0.5);


    _this.setupBuffer();

    return _this;
  }

  return VertexIntegral;
}(_DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexIntegral);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/VertexRoundedSquareBracket.js":
/*!*******************************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/VertexRoundedSquareBracket.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _VertexBracket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VertexBracket */ "./src/js/diagram/DiagramElements/Equation/VertexBracket.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var VertexRoundedSquareBracket =
/*#__PURE__*/
function (_VertexBracket) {
  _inherits(VertexRoundedSquareBracket, _VertexBracket);

  function VertexRoundedSquareBracket() {
    _classCallCheck(this, VertexRoundedSquareBracket);

    return _possibleConstructorReturn(this, _getPrototypeOf(VertexRoundedSquareBracket).apply(this, arguments));
  }

  _createClass(VertexRoundedSquareBracket, [{
    key: "getPoints",
    value: function getPoints() {
      var w = 1 / 20;

      if (this.numLines > 1) {
        w /= this.numLines;
      }

      var r1 = w * 3;
      var r2 = r1 * 1.3;
      var p1 = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](r1, 0);
      var p2 = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](w + r2 + w / 4, 0);
      var r1Angle = Math.PI / 2 * 0.8;
      var h = r1 * Math.sin(r1Angle);
      var r2Angle = Math.asin(h / r2);
      var segments = 5;
      var r1AngleStep = r1Angle / segments;
      var r2AngleStep = r2Angle / segments;
      var cornerR1Points = [];
      var cornerR2Points = [];

      for (var i = 0; i <= segments; i += 1) {
        cornerR1Points.push(Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(r1, Math.PI - i * r1AngleStep).add(p1));
        cornerR2Points.push(Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(r2, Math.PI - i * r2AngleStep).add(p2));
      }

      var width = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(r2, Math.PI - r2Angle).add(p2).x;
      var height = h;
      var top = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().translate(0, this.mainHeight - height);
      var bottom = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, -1).translate(0, height);

      var leftPoints = _toConsumableArray(cornerR1Points.map(function (p) {
        return p.transformBy(bottom.m());
      }).reverse()).concat(_toConsumableArray(cornerR1Points.map(function (p) {
        return p.transformBy(top.m());
      })));

      var rightPoints = _toConsumableArray(cornerR2Points.map(function (p) {
        return p.transformBy(bottom.m());
      }).reverse()).concat(_toConsumableArray(cornerR2Points.map(function (p) {
        return p.transformBy(top.m());
      })));

      return {
        leftPoints: leftPoints,
        rightPoints: rightPoints,
        maxX: width
      };
    }
  }]);

  return VertexRoundedSquareBracket;
}(_VertexBracket__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexRoundedSquareBracket);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Equation/VertexSquareBracket.js":
/*!************************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Equation/VertexSquareBracket.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _VertexBracket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VertexBracket */ "./src/js/diagram/DiagramElements/Equation/VertexBracket.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var VertexSquareBracket =
/*#__PURE__*/
function (_VertexBracket) {
  _inherits(VertexSquareBracket, _VertexBracket);

  function VertexSquareBracket() {
    _classCallCheck(this, VertexSquareBracket);

    return _possibleConstructorReturn(this, _getPrototypeOf(VertexSquareBracket).apply(this, arguments));
  }

  _createClass(VertexSquareBracket, [{
    key: "getPoints",
    value: function getPoints() {
      var w = 1 / 30;

      if (this.numLines > 1) {
        w /= this.numLines;
      }

      var tail = w * 4;
      var leftPoints = [new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](tail, 0), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, this.mainHeight), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](tail, this.mainHeight)];
      var rightPoints = [new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](tail, w), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](w, w), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](w, this.mainHeight - w), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](tail, this.mainHeight - w)];
      var maxX = tail;
      return {
        leftPoints: leftPoints,
        rightPoints: rightPoints,
        maxX: maxX
      };
    }
  }]);

  return VertexSquareBracket;
}(_VertexBracket__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexSquareBracket);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Fan.js":
/*!***********************************************!*\
  !*** ./src/js/diagram/DiagramElements/Fan.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DrawingObjects_VertexObject_VertexFan__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexFan */ "./src/js/diagram/DrawingObjects/VertexObject/VertexFan.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");





function Fan(webgl, points, color, transformOrLocation, diagramLimits) {
  var vertexLine = new _DrawingObjects_VertexObject_VertexFan__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, points);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertexLine, transform, color, diagramLimits);
}

/* harmony default export */ __webpack_exports__["default"] = (Fan);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/HorizontalLine.js":
/*!**********************************************************!*\
  !*** ./src/js/diagram/DiagramElements/HorizontalLine.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DrawingObjects_VertexObject_VertexHorizontalLine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexHorizontalLine */ "./src/js/diagram/DrawingObjects/VertexObject/VertexHorizontalLine.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");





function HorizontalLine(webgl, start, length, width, rotation, color, transformOrLocation, diagramLimits) {
  var vertexLine = new _DrawingObjects_VertexObject_VertexHorizontalLine__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, start, length, width, rotation);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertexLine, transform, color, diagramLimits);
}

/* harmony default export */ __webpack_exports__["default"] = (HorizontalLine);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Lines.js":
/*!*************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Lines.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DrawingObjects_VertexObject_VertexLines__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexLines */ "./src/js/diagram/DrawingObjects/VertexObject/VertexLines.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");





function Lines(webgl, linePairs, numLinesThick, color, transformOrLocation, diagramLimits) {
  var vertexLine = new _DrawingObjects_VertexObject_VertexLines__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, linePairs, numLinesThick);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertexLine, transform, color, diagramLimits);
}

/* harmony default export */ __webpack_exports__["default"] = (Lines);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Plot/Axis.js":
/*!*****************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Plot/Axis.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObjects_VAxis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./VertexObjects/VAxis */ "./src/js/diagram/DiagramElements/Plot/VertexObjects/VAxis.js");
/* harmony import */ var _VertexObjects_VTickMarks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./VertexObjects/VTickMarks */ "./src/js/diagram/DiagramElements/Plot/VertexObjects/VTickMarks.js");
/* harmony import */ var _AxisProperties__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AxisProperties */ "./src/js/diagram/DiagramElements/Plot/AxisProperties.js");
/* harmony import */ var _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../DrawingObjects/TextObject/TextObject */ "./src/js/diagram/DrawingObjects/TextObject/TextObject.js");
/* harmony import */ var _DrawContext2D__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../DrawContext2D */ "./src/js/diagram/DrawContext2D.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






 // import TextObject from '../../textObjects/TextObject';




var Axis =
/*#__PURE__*/
function (_DiagramElementCollec) {
  _inherits(Axis, _DiagramElementCollec);

  function Axis(webgl, drawContext2D) {
    var _this;

    var axisProperties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _AxisProperties__WEBPACK_IMPORTED_MODULE_5__["AxisProperties"]();
    var transform = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]();
    var diagramLimits = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Rect"](-1, 1, 2, 2);

    _classCallCheck(this, Axis);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Axis).call(this, transform, diagramLimits));
    _this.props = axisProperties;
    _this.webgl = webgl;
    _this.diagramLimits = diagramLimits;
    _this.drawContext2D = drawContext2D;

    _this.build();

    return _this;
  }

  _createClass(Axis, [{
    key: "rebuild",
    value: function rebuild() {
      this.order = [];
      this.build();
    }
  }, {
    key: "build",
    value: function build() {
      var _this$props = this.props,
          minorTicks = _this$props.minorTicks,
          majorTicks = _this$props.majorTicks,
          minorGrid = _this$props.minorGrid,
          majorGrid = _this$props.majorGrid;

      if (majorTicks.mode === 'auto') {
        this.props.generateAutoMajorTicks();
      }

      if (minorTicks.mode === 'auto') {
        this.props.generateAutoMinorTicks();
      }

      var xRatio = 2 / this.diagramLimits.width; // const xRatio = 1;
      // const yRatio = 2 / diagramLimits.height;

      var cMajorTicksStart = this.props.valueToClip(majorTicks.start);
      var cMinorTicksStart = this.props.valueToClip(minorTicks.start);
      var majorTicksNum = this.props.getMajorNum();
      var minorTicksNum = this.props.getMinorNum(); // Grid

      this.addTicksOrGrid('minorGrid', this.webgl, minorGrid, minorTicksNum, minorTicks.step, cMinorTicksStart, xRatio, this.diagramLimits);
      this.addTicksOrGrid('majorGrid', this.webgl, majorGrid, majorTicksNum, majorTicks.step, cMajorTicksStart, xRatio, this.diagramLimits); // Ticks

      this.addTicksOrGrid('minorTicks', this.webgl, minorTicks, minorTicksNum, minorTicks.step, cMinorTicksStart, xRatio, this.diagramLimits);
      this.addTicksOrGrid('majorTicks', this.webgl, majorTicks, majorTicksNum, majorTicks.step, cMajorTicksStart, xRatio, this.diagramLimits); // Axis Line

      var axis = new _VertexObjects_VAxis__WEBPACK_IMPORTED_MODULE_3__["default"](this.webgl, this.props);
      this.add('line', new _Element__WEBPACK_IMPORTED_MODULE_0__["DiagramElementPrimative"](axis, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"](), this.props.color, this.diagramLimits));
      var font = new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_6__["DiagramFont"](this.props.titleFontFamily, 'normal', this.props.titleFontSize, this.props.titleFontWeight, 'center', 'middle', this.props.titleFontColor);
      var titleText = [new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_6__["DiagramText"](new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](0, 0).transformBy(new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]().rotate(this.props.rotation).matrix()), this.props.title, font)];
      var title = new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_6__["TextObject"](this.drawContext2D, titleText);
      this.add('title', new _Element__WEBPACK_IMPORTED_MODULE_0__["DiagramElementPrimative"](title, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]().rotate(this.props.rotation).translate(this.props.titleOffset.x, this.props.titleOffset.y), [0.5, 0.5, 0.5, 1], this.diagramLimits)); // Labels

      this.addTickLabels('major', this.drawContext2D, majorTicks, this.props.generateMajorLabels.bind(this.props), this.diagramLimits, this.props.majorTicks.labelOffset);
      this.addTickLabels('minor', this.drawContext2D, minorTicks, this.props.generateMinorLabels.bind(this.props), this.diagramLimits, this.props.minorTicks.labelOffset);
    }
  }, {
    key: "toClip",
    value: function toClip(value) {
      return this.props.toClip(value);
    }
  }, {
    key: "valueToClip",
    value: function valueToClip(value) {
      return this.props.valueToClip(value);
    }
  }, {
    key: "addTicksOrGrid",
    value: function addTicksOrGrid(name, webgl, ticksOrGrid, num, step, clipStart, xRatio, diagramLimits) {
      if (ticksOrGrid.mode !== 'off') {
        var ticks = new _VertexObjects_VTickMarks__WEBPACK_IMPORTED_MODULE_4__["default"](webgl, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"]( // clipStart - ticksOrGrid.width / 2 * xRatio,
        clipStart, this.props.start.y), this.props.rotation, num, this.toClip(step), ticksOrGrid.length, ticksOrGrid.width, ticksOrGrid.offset);
        this.add(name, new _Element__WEBPACK_IMPORTED_MODULE_0__["DiagramElementPrimative"](ticks, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]().scale(1, 1).rotate(0).translate(0, 0), ticksOrGrid.color, diagramLimits)); // if (name === 'majorTicks') {
        //   console.log(ticks)
        // }
      }
    }
  }, {
    key: "addTickLabels",
    value: function addTickLabels(name, drawContext2D, ticks, labelGenerator, diagramLimits, offset) {
      if (ticks.labelMode === 'auto') {
        labelGenerator();
      }

      var font = new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_6__["DiagramFont"](ticks.fontFamily, 'normal', ticks.fontSize, ticks.fontWeight, ticks.labelsHAlign, ticks.labelsVAlign, ticks.fontColor);

      if (this.props.rotation > Math.PI / 2 * 0.95) {
        font.alignV = 'middle';
        font.alignH = 'right';
      }

      var dText = [];

      for (var i = 0; i < ticks.labels.length; i += 1) {
        dText.push(new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_6__["DiagramText"](new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](this.valueToClip(ticks.start + i * ticks.step), 0).transformBy(new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]().rotate(this.props.rotation).matrix()), ticks.labels[i], font));
      }

      var axisLabels = new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_6__["TextObject"](drawContext2D, dText);
      this.add("label_".concat(name), new _Element__WEBPACK_IMPORTED_MODULE_0__["DiagramElementPrimative"](axisLabels, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]().scale(1, 1).rotate(0).translate(offset.x, offset.y), [0.5, 0.5, 0.5, 1], diagramLimits)); // const label = new TextObject(
      //   drawContext2D,
      //   ticks.labels[i],
      //   new Point(
      //     this.valueToClip(ticks.start + i * ticks.step),
      //     0,
      //   ).transformBy(new Transform().rotate(this.props.rotation).matrix()),
      //   [ticks.labelsHAlign, ticks.labelsVAlign],
      //   ticks.labelOffset,
      // );
      // label.fontSize = ticks.fontSize;
      // label.fontFamily = ticks.fontFamily;
      // label.fontWeight = ticks.fontWeight;
      // this.add(`label_${name}_${i}`, new DiagramElementPrimative(
      //   label,
      //   new Transform().scale(1, 1).rotate(0).translate(0, 0),
      //   [0.5, 0.5, 0.5, 1],
      //   diagramLimits,
      // ));
    }
  }]);

  return Axis;
}(_Element__WEBPACK_IMPORTED_MODULE_0__["DiagramElementCollection"]);

/* harmony default export */ __webpack_exports__["default"] = (Axis);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Plot/AxisProperties.js":
/*!***************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Plot/AxisProperties.js ***!
  \***************************************************************/
/*! exports provided: AxisProperties, GridProperties, TickProperties */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AxisProperties", function() { return AxisProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GridProperties", function() { return GridProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TickProperties", function() { return TickProperties; });
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _tools_mathtools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../tools/mathtools */ "./src/js/diagram/tools/mathtools.js");
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var defaultColor = [0.7, 0.7, 0.7, 1];

var GridProperties = // Clip Space
// General
function GridProperties() {
  _classCallCheck(this, GridProperties);

  this.length = 1;
  this.width = 0.01;
  this.color = defaultColor;
  this.mode = 'on';
  this.offset = 0;
};

var TickProperties =
/*#__PURE__*/
function (_GridProperties) {
  _inherits(TickProperties, _GridProperties);

  // Axis Space
  // Clip Space;
  // General
  function TickProperties() {
    var _this;

    _classCallCheck(this, TickProperties);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TickProperties).call(this));
    _this.start = 0;
    _this.step = 0.1;
    _this.length = 0.05;
    _this.width = 0.01;
    _this.offset = 0;
    _this.labelOffset = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    _this.color = defaultColor;
    _this.labels = [];
    _this.labelMode = 'auto';
    _this.labelsHAlign = 'center';
    _this.labelsVAlign = 'middle';
    _this.mode = 'on';
    _this.fontFamily = 'Helvetica Neue';
    _this.fontWeight = '400';
    _this.fontSize = 0.1;
    _this.fontColor = defaultColor;
    return _this;
  }

  return TickProperties;
}(GridProperties);

var AxisProperties =
/*#__PURE__*/
function () {
  function AxisProperties() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var rotation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, AxisProperties);

    this.name = name; // Clip Space

    this.start = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    this.length = 1;
    this.width = 0.01;
    this.rotation = rotation;
    this.color = [0.5, 0.5, 0.5, 1];
    this.title = '';
    this.titleOffset = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.length / 2, -0.1);
    this.titleRotation = 0;
    this.limits = {
      min: 0,
      max: 1
    };
    this.logarithmic = false;
    this.majorTicks = new TickProperties();
    this.minorTicks = new TickProperties();
    this.minorTicks.labelMode = 'off';
    this.majorGrid = new GridProperties();
    this.minorGrid = new GridProperties();
    this.titleFontFamily = 'Helvetica Neue';
    this.titleFontWeight = '400';
    this.titleFontSize = 0.13;
    this.titleFontColor = defaultColor;
  }

  _createClass(AxisProperties, [{
    key: "getNum",
    value: function getNum(start, step) {
      return Math.floor((this.limits.max - start) / step) + 1;
    }
  }, {
    key: "getMajorNum",
    value: function getMajorNum() {
      return this.getNum(this.majorTicks.start, this.majorTicks.step);
    }
  }, {
    key: "getMinorNum",
    value: function getMinorNum() {
      return this.getNum(this.minorTicks.start, this.minorTicks.step);
    }
  }, {
    key: "generateAuto",
    value: function generateAuto() {
      var approximateNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
      // const approximateNum = 10;
      var range = this.limits.max - this.limits.min;
      var step = range / approximateNum;
      var orderOfMagnitude = Object(_tools_mathtools__WEBPACK_IMPORTED_MODULE_1__["roundNum"])(Math.floor(Math.log10(step)), 0);
      step = Object(_tools_mathtools__WEBPACK_IMPORTED_MODULE_1__["roundNum"])(step, -orderOfMagnitude);
      var start = Object(_tools_mathtools__WEBPACK_IMPORTED_MODULE_1__["roundNum"])(this.limits.min, -orderOfMagnitude);

      if (start < this.limits.min) {
        start += Math.pow(10, orderOfMagnitude);
      }

      if (this.getNum(start, step) > 11) {
        step *= 2;
      }

      return {
        start: start,
        step: step
      };
    }
  }, {
    key: "generateAutoMajorTicks",
    value: function generateAutoMajorTicks() {
      var approximateNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

      var _this$generateAuto = this.generateAuto(approximateNum),
          start = _this$generateAuto.start,
          step = _this$generateAuto.step;

      this.majorTicks.start = start;
      this.majorTicks.step = step;
    }
  }, {
    key: "generateAutoMinorTicks",
    value: function generateAutoMinorTicks() {
      var approximateNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;

      var _this$generateAuto2 = this.generateAuto(approximateNum),
          start = _this$generateAuto2.start,
          step = _this$generateAuto2.step;

      this.minorTicks.start = start;
      this.minorTicks.step = step;
    }
  }, {
    key: "toClip",
    value: function toClip(value) {
      var ratio = this.length / (this.limits.max - this.limits.min);
      return value * ratio;
    }
  }, {
    key: "valueToClip",
    value: function valueToClip(value) {
      return this.toClip(value - this.limits.min) + this.start.x;
    }
  }, {
    key: "getMajorLabels",
    value: function getMajorLabels() {
      var labels = [];

      for (var i = 0, j = this.getMajorNum(); i < j; i += 1) {
        var value = this.majorTicks.start + i * this.majorTicks.step;
        labels.push(value.toString());
      }

      return labels;
    }
  }, {
    key: "generateMajorLabels",
    value: function generateMajorLabels() {
      this.majorTicks.labels = this.getMajorLabels();
    }
  }, {
    key: "getMinorLabels",
    value: function getMinorLabels() {
      var labels = [];

      for (var i = 0, j = this.getMinorNum(); i < j; i += 1) {
        var value = this.minorTicks.start + i * this.minorTicks.step;
        labels.push(value.toString());
      }

      return labels;
    }
  }, {
    key: "generateMinorLabels",
    value: function generateMinorLabels() {
      this.minorTicks.labels = this.getMinorLabels();
    }
  }]);

  return AxisProperties;
}();



/***/ }),

/***/ "./src/js/diagram/DiagramElements/Plot/VertexObjects/VAxis.js":
/*!********************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Plot/VertexObjects/VAxis.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DrawingObjects_VertexObject_Triangles_TRIHoriztonalLine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../DrawingObjects/VertexObject/Triangles/TRIHoriztonalLine */ "./src/js/diagram/DrawingObjects/VertexObject/Triangles/TRIHoriztonalLine.js");
/* harmony import */ var _AxisProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AxisProperties */ "./src/js/diagram/DiagramElements/Plot/AxisProperties.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../DrawingObjects/VertexObject/VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var VAxis =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VAxis, _VertexObject);

  function VAxis(webgl) {
    var _this;

    var axisProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _AxisProperties__WEBPACK_IMPORTED_MODULE_1__["AxisProperties"]();

    _classCallCheck(this, VAxis);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VAxis).call(this, webgl));
    var a = axisProperties;
    var t = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]().rotate(a.rotation).translate(a.start.x, a.start.y).matrix();

    if (a.width > 0) {
      var result = Object(_DrawingObjects_VertexObject_Triangles_TRIHoriztonalLine__WEBPACK_IMPORTED_MODULE_0__["default"])(new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"](0, 0), a.length, a.width, 0);
      var points = result.points,
          border = result.border;
      _this.points = points;
      _this.border = [border];
    }

    _this.transform(t);

    _this.setupBuffer();

    return _this;
  }

  return VAxis;
}(_DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_4__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VAxis);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/Plot/VertexObjects/VTickMarks.js":
/*!*************************************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Plot/VertexObjects/VTickMarks.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DrawingObjects_VertexObject_Triangles_TRIParallelLines__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../DrawingObjects/VertexObject/Triangles/TRIParallelLines */ "./src/js/diagram/DrawingObjects/VertexObject/Triangles/TRIParallelLines.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../DrawingObjects/VertexObject/VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var VTickMarks =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VTickMarks, _VertexObject);

  function VTickMarks(webgl, start, rotation, num, spacing, length, width, offset) {
    var _this;

    _classCallCheck(this, VTickMarks);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VTickMarks).call(this, webgl));
    var t = new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]().rotate(rotation).translate(0, 0).matrix();
    var result = Object(_DrawingObjects_VertexObject_Triangles_TRIParallelLines__WEBPACK_IMPORTED_MODULE_0__["default"])(num, spacing, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](start.x, start.y + offset), length, width, false, false);
    var points = result.points,
        border = result.border;
    _this.points = points;
    _this.border = border;

    _this.transform(t);

    _this.setupBuffer();

    return _this;
  }

  return VTickMarks;
}(_DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_3__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VTickMarks);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/PolyLine.js":
/*!****************************************************!*\
  !*** ./src/js/diagram/DiagramElements/PolyLine.js ***!
  \****************************************************/
/*! exports provided: PolyLine, PolyLineCorners */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PolyLine", function() { return PolyLine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PolyLineCorners", function() { return PolyLineCorners; });
/* harmony import */ var _DrawingObjects_VertexObject_VertexPolyLine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexPolyLine */ "./src/js/diagram/DrawingObjects/VertexObject/VertexPolyLine.js");
/* harmony import */ var _DrawingObjects_VertexObject_VertexPolyLineCorners__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexPolyLineCorners */ "./src/js/diagram/DrawingObjects/VertexObject/VertexPolyLineCorners.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");






function PolyLine(webgl, points, close, lineWidth, color, borderToPoint, transformOrLocation, diagramLimits) {
  var vertexLine = new _DrawingObjects_VertexObject_VertexPolyLine__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, points, close, lineWidth, borderToPoint);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_3__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_3__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_2__["DiagramElementPrimative"](vertexLine, transform, color, diagramLimits);
}

function PolyLineCorners(webgl, points, close, cornerLength, lineWidth, color, transformOrLocation, diagramLimits) {
  var vertexLineCorners = new _DrawingObjects_VertexObject_VertexPolyLineCorners__WEBPACK_IMPORTED_MODULE_1__["default"](webgl, points, close, cornerLength, lineWidth);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_3__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_3__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_2__["DiagramElementPrimative"](vertexLineCorners, transform, color, diagramLimits);
}



/***/ }),

/***/ "./src/js/diagram/DiagramElements/Polygon.js":
/*!***************************************************!*\
  !*** ./src/js/diagram/DiagramElements/Polygon.js ***!
  \***************************************************/
/*! exports provided: Polygon, PolygonFilled, PolygonLine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Polygon", function() { return Polygon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PolygonFilled", function() { return PolygonFilled; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PolygonLine", function() { return PolygonLine; });
/* harmony import */ var _DrawingObjects_VertexObject_VertexPolygon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexPolygon */ "./src/js/diagram/DrawingObjects/VertexObject/VertexPolygon.js");
/* harmony import */ var _DrawingObjects_VertexObject_VertexPolygonFilled__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexPolygonFilled */ "./src/js/diagram/DrawingObjects/VertexObject/VertexPolygonFilled.js");
/* harmony import */ var _DrawingObjects_VertexObject_VertexPolygonLine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexPolygonLine */ "./src/js/diagram/DrawingObjects/VertexObject/VertexPolygonLine.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");







function Polygon(webgl, numSides, radius, lineWidth, rotation, direction, numSidesToDraw, color, transformOrLocation, diagramLimits) {
  var vertexLine = new _DrawingObjects_VertexObject_VertexPolygon__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, numSides, radius, lineWidth, rotation, new _tools_g2__WEBPACK_IMPORTED_MODULE_4__["Point"](0, 0), numSidesToDraw, direction);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_4__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_4__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"](vertexLine, transform, color, diagramLimits);
}

function PolygonFilled(webgl, numSides, radius, rotation, numSidesToDraw, color, transformOrLocation, diagramLimits) {
  var textureLocation = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : '';
  var textureCoords = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : new _tools_g2__WEBPACK_IMPORTED_MODULE_4__["Rect"](0, 0, 1, 1);
  var vertexLineCorners = new _DrawingObjects_VertexObject_VertexPolygonFilled__WEBPACK_IMPORTED_MODULE_1__["default"](webgl, numSides, radius, rotation, new _tools_g2__WEBPACK_IMPORTED_MODULE_4__["Point"](0, 0), numSidesToDraw, textureLocation, textureCoords);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_4__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_4__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"](vertexLineCorners, transform, color, diagramLimits);
}

function PolygonLine(webgl, numSides, radius, rotation, direction, numSidesToDraw, numLines, color, transformOrLocation, diagramLimits) {
  var vertexLine = new _DrawingObjects_VertexObject_VertexPolygonLine__WEBPACK_IMPORTED_MODULE_2__["default"](webgl, numSides, radius, rotation, new _tools_g2__WEBPACK_IMPORTED_MODULE_4__["Point"](0, 0), numSidesToDraw, direction, numLines);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_4__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_4__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_3__["DiagramElementPrimative"](vertexLine, transform, color, diagramLimits);
}



/***/ }),

/***/ "./src/js/diagram/DiagramElements/RadialLines.js":
/*!*******************************************************!*\
  !*** ./src/js/diagram/DiagramElements/RadialLines.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DrawingObjects_VertexObject_VertexRadialLines__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexRadialLines */ "./src/js/diagram/DrawingObjects/VertexObject/VertexRadialLines.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");





function RadialLines(webgl) {
  var innerRadius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var outerRadius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.05;
  var dAngle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Math.PI / 4;
  var color = arguments.length > 5 ? arguments[5] : undefined;
  var transformOrLocation = arguments.length > 6 ? arguments[6] : undefined;
  var diagramLimits = arguments.length > 7 ? arguments[7] : undefined;
  var vertexLine = new _DrawingObjects_VertexObject_VertexRadialLines__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, innerRadius, outerRadius, width, dAngle, Math.PI * 2);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertexLine, transform, color, diagramLimits);
}

/* harmony default export */ __webpack_exports__["default"] = (RadialLines);

/***/ }),

/***/ "./src/js/diagram/DiagramElements/RectangleFilled.js":
/*!***********************************************************!*\
  !*** ./src/js/diagram/DiagramElements/RectangleFilled.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RectangleFilled; });
/* harmony import */ var _DrawingObjects_VertexObject_VertexRectangleFilled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexRectangleFilled */ "./src/js/diagram/DrawingObjects/VertexObject/VertexRectangleFilled.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");




function RectangleFilled(webgl, topLeft, width, height, cornerRadius, cornerSides, color, transformOrLocation, diagramLimits) {
  var vertexRectangle = new _DrawingObjects_VertexObject_VertexRectangleFilled__WEBPACK_IMPORTED_MODULE_0__["default"](webgl, topLeft, width, height, cornerRadius, cornerSides);
  var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Transform"]();

  if (transformOrLocation instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"]) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }

  return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](vertexRectangle, transform, color, diagramLimits);
}

/***/ }),

/***/ "./src/js/diagram/DiagramEquation/DiagramEquation.js":
/*!***********************************************************!*\
  !*** ./src/js/diagram/DiagramEquation/DiagramEquation.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DiagramEquation; });
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _DrawContext2D__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../DrawContext2D */ "./src/js/diagram/DrawContext2D.js");
/* harmony import */ var _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../DrawingObjects/TextObject/TextObject */ "./src/js/diagram/DrawingObjects/TextObject/TextObject.js");
/* harmony import */ var _DiagramElements_Equation_Integral__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../DiagramElements/Equation/Integral */ "./src/js/diagram/DiagramElements/Equation/Integral.js");
/* harmony import */ var _DiagramElements_Equation_Bracket__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../DiagramElements/Equation/Bracket */ "./src/js/diagram/DiagramElements/Equation/Bracket.js");
/* harmony import */ var _DiagramElements_Equation_Bar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../DiagramElements/Equation/Bar */ "./src/js/diagram/DiagramElements/Equation/Bar.js");
/* harmony import */ var _DiagramElements_Equation_SquareBracket__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../DiagramElements/Equation/SquareBracket */ "./src/js/diagram/DiagramElements/Equation/SquareBracket.js");
/* harmony import */ var _DiagramElements_Equation_Brace__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../DiagramElements/Equation/Brace */ "./src/js/diagram/DiagramElements/Equation/Brace.js");
/* harmony import */ var _DiagramElements_Equation_RoundedSquareBracket__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../DiagramElements/Equation/RoundedSquareBracket */ "./src/js/diagram/DiagramElements/Equation/RoundedSquareBracket.js");
/* harmony import */ var _DiagramElements_Equation_GLEquation__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../DiagramElements/Equation/GLEquation */ "./src/js/diagram/DiagramElements/Equation/GLEquation.js");
/* harmony import */ var _DiagramElements_Equation_HTMLEquation__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../DiagramElements/Equation/HTMLEquation */ "./src/js/diagram/DiagramElements/Equation/HTMLEquation.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }















var DiagramEquation =
/*#__PURE__*/
function () {
  function DiagramEquation(shapes) {
    _classCallCheck(this, DiagramEquation);

    this.webgl = shapes.webgl;
    this.draw2D = shapes.draw2D;
    this.limits = shapes.limits;
    this.shapes = shapes;
  }

  _createClass(DiagramEquation, [{
    key: "elements",
    value: function elements(elems) {
      var colorOrFont = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var firstTransform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]('elements');
      return Object(_DiagramElements_Equation_GLEquation__WEBPACK_IMPORTED_MODULE_11__["createEquationElements"])(elems, this.draw2D, colorOrFont, this.limits, firstTransform);
    }
  }, {
    key: "vinculum",
    value: function vinculum() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 1, 1, 1];
      return this.shapes.horizontalLine(new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](0, 0), 1, 1, 0, color, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]('vinculum').scale(1, 1).translate(0, 0));
    }
  }, {
    key: "strike",
    value: function strike() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 1, 1, 1];
      return this.shapes.horizontalLine(new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](0, 0), 1, 1, 0, color, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]('strike').scale(1, 1).rotate(0).translate(0, 0));
    }
  }, {
    key: "xStrike",
    value: function xStrike() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 1, 1, 1];
      var cross = this.shapes.collection(new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]('strike').scale(1, 1).rotate(0).translate(0, 0));
      cross.color = color;
      var strike1 = this.shapes.horizontalLine(new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](0, 0), 1, 1, 0, color, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]('strike').scale(1, 1).rotate(0).translate(0, 0));

      var strike2 = strike1._dup();

      cross.add('s1', strike1);
      cross.add('s2', strike2);
      return cross;
    }
  }, {
    key: "integral",
    value: function integral() {
      var numLines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [1, 1, 1, 1];
      return new _DiagramElements_Equation_Integral__WEBPACK_IMPORTED_MODULE_5__["default"](this.webgl, color, numLines, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]('integral').scale(1, 1).translate(0, 0), this.limits);
    }
  }, {
    key: "bracket",
    value: function bracket(side) {
      var numLines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [1, 1, 1, 1];
      return new _DiagramElements_Equation_Bracket__WEBPACK_IMPORTED_MODULE_6__["default"](this.webgl, color, side, numLines, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]('bracket').scale(1, 1).translate(0, 0), this.limits);
    }
  }, {
    key: "bar",
    value: function bar(side) {
      var numLines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [1, 1, 1, 1];
      return new _DiagramElements_Equation_Bar__WEBPACK_IMPORTED_MODULE_7__["default"](this.webgl, color, side, numLines, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]('bar').scale(1, 1).translate(0, 0), this.limits);
    }
  }, {
    key: "squareBracket",
    value: function squareBracket(side) {
      var numLines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [1, 1, 1, 1];
      return new _DiagramElements_Equation_SquareBracket__WEBPACK_IMPORTED_MODULE_8__["default"](this.webgl, color, side, numLines, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]('bar').scale(1, 1).translate(0, 0), this.limits);
    }
  }, {
    key: "brace",
    value: function brace(side) {
      var numLines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [1, 1, 1, 1];
      return new _DiagramElements_Equation_Brace__WEBPACK_IMPORTED_MODULE_9__["default"](this.webgl, color, side, numLines, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]('bar').scale(1, 1).translate(0, 0), this.limits);
    }
  }, {
    key: "roundedSquareBracket",
    value: function roundedSquareBracket(side) {
      var numLines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [1, 1, 1, 1];
      return new _DiagramElements_Equation_RoundedSquareBracket__WEBPACK_IMPORTED_MODULE_10__["default"](this.webgl, color, side, numLines, new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Transform"]('bar').scale(1, 1).translate(0, 0), this.limits);
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "make",
    value: function make(equationCollection) {
      return new _DiagramElements_Equation_GLEquation__WEBPACK_IMPORTED_MODULE_11__["EquationForm"](equationCollection);
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "makeHTML",
    value: function makeHTML() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new _DiagramElements_Equation_HTMLEquation__WEBPACK_IMPORTED_MODULE_12__["default"](id, classes);
    }
  }, {
    key: "makeEqn",
    value: function makeEqn() {
      return new _DiagramElements_Equation_GLEquation__WEBPACK_IMPORTED_MODULE_11__["Equation"](this.draw2D, this.limits);
    }
  }, {
    key: "makeDescription",
    value: function makeDescription(id) {
      return this.shapes.htmlElement(document.createElement('div'), id, 'lesson__equation_description', new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](0, 0), 'middle', 'left');
    }
  }]);

  return DiagramEquation;
}();



/***/ }),

/***/ "./src/js/diagram/DiagramObjects/DiagramObjects.js":
/*!*********************************************************!*\
  !*** ./src/js/diagram/DiagramObjects/DiagramObjects.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DiagramObjects; });
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _DrawContext2D__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../DrawContext2D */ "./src/js/diagram/DrawContext2D.js");
/* harmony import */ var _EquationNavigator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./EquationNavigator */ "./src/js/diagram/DiagramObjects/EquationNavigator.js");
/* harmony import */ var _DiagramElements_Equation_GLEquation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../DiagramElements/Equation/GLEquation */ "./src/js/diagram/DiagramElements/Equation/GLEquation.js");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Line */ "./src/js/diagram/DiagramObjects/Line.js");
/* harmony import */ var _EquationLabel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./EquationLabel */ "./src/js/diagram/DiagramObjects/EquationLabel.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


 // import {
//   DiagramElementCollection,
// } from '../Element';







var DiagramObjects =
/*#__PURE__*/
function () {
  function DiagramObjects(shapes, equation, isTouchDevice, animateNextFrame) {
    _classCallCheck(this, DiagramObjects);

    this.webgl = shapes.webgl;
    this.draw2D = shapes.draw2D;
    this.limits = shapes.limits;
    this.shapes = shapes;
    this.isTouchDevice = isTouchDevice;
    this.animateNextFrame = animateNextFrame;
    this.equation = equation;
  }

  _createClass(DiagramObjects, [{
    key: "equationNavigator",
    value: function equationNavigator(equation, offset) {
      var navType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'threeLine';
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      var xAlign = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'left';
      var vAlign = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'middle';
      var id = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "id_lesson__equation_navigator_".concat(Math.floor(Math.random() * 10000));
      return new _EquationNavigator__WEBPACK_IMPORTED_MODULE_3__["default"](this.shapes, this.animateNextFrame, equation, offset, navType, options, xAlign, vAlign, id);
    }
  }, {
    key: "line",
    value: function line() {
      for (var _len = arguments.length, options = new Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
      }

      var optionsToUse = Object.assign.apply(Object, [{}].concat(options));
      return new _Line__WEBPACK_IMPORTED_MODULE_5__["DiagramObjectLine"](this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame, optionsToUse);
    }
  }, {
    key: "label",
    value: function label() {
      for (var _len2 = arguments.length, options = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        options[_key2] = arguments[_key2];
      }

      var optionsToUse = Object.assign.apply(Object, [{}].concat(options));
      return new _EquationLabel__WEBPACK_IMPORTED_MODULE_6__["default"](this.equation, optionsToUse);
    } // lineNew(
    //   position: Point,
    //   length: number,
    //   angle: number,
    //   width: number,
    //   color: Array<number>,
    //   vertexSpaceStart: 'start' | 'end' | 'center' | number | Point = 'start',
    //   showLine: boolean,
    //   largerTouchBorder: boolean,
    // ) {
    //   return new DiagramObjectLine(
    //     this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
    //     {
    //       position,
    //       length,
    //       angle,
    //       vertexSpaceStart,
    //       width,
    //       color,
    //       showLine,
    //       largerTouchBorder,
    //     },
    //   );
    // }
    // linePoints(
    //   p1: Point,
    //   p2: Point,
    //   width: number,
    //   color: Array<number>,
    //   vertexOrigin: 'start' | 'end' | 'center' | number | Point = 'start',
    //   showLine: boolean,
    //   largerTouchBorder: boolean,
    //   ) {
    // }
    // length
    // width
    // color
    // vertexOrigin
    // line(
    //   p1OrPositionOrLength: Point | number,
    //   p2OrLengthOrWidth: Point | number,
    //   widthOrAngleOrColor: number | Array<number>,
    //   colorOrWidthOrVertexOrigin: Array<number> | number | TypeVertexSpaceStart | null = null,
    //   vertexOriginOrColor: TypeVertexOrigin | Array<number> | null = null,
    //   showLineOrVertexOrigin: boolean | TypeVertexOrigin | null = null,
    //   largerTouchBorderOrShowLine: boolean | null = null,
    //   largerTouchBorder: boolean | null = null,
    // ) {
    //   let position = new Point(0, 0);
    //   let length = 1;
    //   let angle = 0;
    //   let width = 0.01;
    //   let color = [1, 0, 0, 1];
    //   let vertexOrigin = 'start';
    //   let showLine = true;
    //   let largerTouchBorderToUse = true;
    //   if (p1OrPositionOrLength instanceof Point
    //     && p2OrLengthOrWidth instanceof Point) {
    //     const p1 = p1OrPositionOrLength;
    //     const p2 = p2OrLengthOrWidth;
    //     const line = new Line(p1, p2);
    //     position = p1OrPositionOrLength;
    //     length = line.length();
    //     angle = line.angle();
    //     width = widthOrAngleOrColor;
    //     color = colorOrWidthOrVertexOrigin;
    //     vertexOrigin = vertexOriginOrColor;
    //     showLine = showLineOrVertexOrigin;
    //     largerTouchBorderToUse = largerTouchBorderOrShowLine;
    //   } else if (p1OrPositionOrLength instanceof Point
    //     && typeof p2OrLengthOrWidth === 'number'
    //   ) {
    //     position = p1OrPositionOrLength;
    //     length = p2OrLengthOrWidth;
    //     angle = widthOrAngleOrColor;
    //     width = colorOrWidthOrVertexOrigin;
    //     color = vertexOriginOrColor;
    //     vertexOrigin = showLineOrVertexOrigin;
    //     showLine = largerTouchBorderOrShowLine;
    //     largerTouchBorderToUse = largerTouchBorder;
    //   } else {
    //     position = new Point(0, 0);
    //     length = p1OrPositionOrLength;
    //     width = p2OrLengthOrWidth;
    //     color = widthOrAngleOrColor;
    //     vertexOrigin = colorOrWidthOrVertexOrigin;
    //     showLine = true;
    //     largerTouchBorderToUse = true;
    //   }
    //   if (vertexOrigin == null) {
    //     vertexOrigin = 'start';
    //   }
    //   if (showLine == null) {
    //     showLine = true;
    //   }
    //   if (largerTouchBorderToUse == null) {
    //     largerTouchBorderToUse = true;
    //   }
    //   return new DiagramObjectLine(
    //     // $FlowFixMe
    //     this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
    //     {
    //       position,
    //       length,
    //       angle,
    //       vertexOrigin,
    //       width,
    //       color,
    //       showLine,
    //       largerTouchBorder,
    //     },
    //   );
    // }
    // lineOld(
    //   referenceOrP1: TypeVertexSpaceStart | Point = 'center',
    //   lengthOrP2: number | Point,
    //   width: number,
    //   color: Array<number>,
    //   showLine: boolean = true,
    //   largerTouchBorder: boolean = true,
    // ) {
    //   let line;
    //   if (referenceOrP1 instanceof Point && lengthOrP2 instanceof Point) {
    //     line = new DiagramObjectLine(
    //       this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
    //       {
    //         position: referenceOrP1,
    //         width,
    //         color,
    //         showLine,
    //         largerTouchBorder,
    //       },
    //     );
    //     line.setEndPoints(referenceOrP1, lengthOrP2);
    //     // return line;
    //   } else if (referenceOrP1 instanceof Point && typeof lengthOrP2 === 'number') {
    //     line = this.lineNew(
    //       referenceOrP1, lengthOrP2, 0, width, color, 'start', showLine,
    //       largerTouchBorder,
    //     );
    //     // return line;
    //     // const line = new DiagramObjectLine(
    //     //   this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
    //     //   referenceOrP1, lengthOrP2, width, 'end', width, color, showLine,
    //     //   largerTouchBorder,
    //     // )
    //     // return new DiagramObjectLine(
    //     //   this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
    //     //   referenceOrP1, lengthOrP2, width, color, showLine, largerTouchBorder,
    //     // );
    //   } else if (typeof lengthOrP2 === 'number') {
    //     line = this.lineNew(
    //       new Point(0, 0), lengthOrP2, 0, width, color, referenceOrP1, showLine,
    //       largerTouchBorder,
    //     );
    //   } else {
    //     line = this.lineNew(
    //       new Point(0, 0), 1, 0, 0.01, [1, 0, 0, 1], 'start', true, true,
    //     );
    //   }
    //   return line;
    // }
    // lineArrow(
    //   referenceOrP1: TypeVertexSpaceStart = 'center',
    //   lengthOrP2: number | Point,
    //   width: number,
    //   color: Array<number>,
    //   arrowHeight: number = width * 4,
    //   arrowWidth: number = width * 4,
    //   largerTouchBorder: boolean = true,
    // ) {
    //   const line = this.lineOld(
    //     referenceOrP1, lengthOrP2, width, color,
    //     true, largerTouchBorder,
    //   );
    //   // const line = new DiagramObjectLine(
    //   //   this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
    //   //   referenceOrP1, lengthOrP2, width, color, true, largerTouchBorder,
    //   // );
    //   line.addArrow(2, arrowWidth, arrowHeight);
    //   return line;
    // }
    // lineArrows(
    //   referenceOrP1: TypeVertexSpaceStart = 'center',
    //   lengthOrP2: number | Point,
    //   width: number,
    //   color: Array<number>,
    //   arrowHeight: number = width * 4,
    //   arrowWidth: number = width * 4,
    //   largerTouchBorder: boolean = true,
    // ) {
    //   const line = this.lineArrow(
    //     referenceOrP1, lengthOrP2, width, color, arrowHeight, arrowWidth,
    //     largerTouchBorder,
    //   );
    //   line.addArrow(1, arrowWidth, arrowHeight);
    //   return line;
    // }
    // lineLabelOnly(
    //   referenceOrP1: TypeVertexSpaceStart = 'center',
    //   lengthOrP2: number | Point,
    //   color: Array<number>,
    //   labelText: string | Equation | Array<string>,
    //   offset: number,
    //   location: TypeLineLabelLocation = 'outside',
    //   subLocation: TypeLineLabelSubLocation = 'left',
    //   orientation: TypeLineLabelOrientation = 'horizontal',
    //   linePosition: number = 0.5,
    // ) {
    //   const line = this.lineOld(
    //     referenceOrP1, lengthOrP2, 0.001, color,
    //     false, false,
    //   );
    //   // const line = new DiagramObjectLine(
    //   //   this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
    //   //   referenceOrP1, lengthOrP2, 0.001, color, false, false,
    //   // );
    //   line.addLabel(
    //     labelText, offset, location, subLocation, orientation, linePosition,
    //   );
    //   return line;
    // }
    // lineLabel(
    //   referenceOrP1: TypeVertexSpaceStart = 'center',
    //   lengthOrP2: number | Point,
    //   width: number,
    //   color: Array<number>,
    //   labelText: string | Equation | Array<string>,
    //   offset: number,
    //   location: TypeLineLabelLocation = 'outside',
    //   subLocation: TypeLineLabelSubLocation = 'left',
    //   orientation: TypeLineLabelOrientation = 'horizontal',
    //   linePosition: number = 0.5,
    // ) {
    //   // const line = new DiagramObjectLine(
    //   //   this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
    //   //   referenceOrP1, lengthOrP2, width, color, true, false,
    //   // );
    //   const line = this.lineOld(
    //     referenceOrP1, lengthOrP2, width, color,
    //     true, false,
    //   );
    //   line.addLabel(
    //     labelText, offset, location, subLocation, orientation, linePosition,
    //   );
    //   return line;
    // }

  }]);

  return DiagramObjects;
}();



/***/ }),

/***/ "./src/js/diagram/DiagramObjects/EquationLabel.js":
/*!********************************************************!*\
  !*** ./src/js/diagram/DiagramObjects/EquationLabel.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EquationLabel; });
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _DiagramElements_Equation_GLEquation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../DiagramElements/Equation/GLEquation */ "./src/js/diagram/DiagramElements/Equation/GLEquation.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import Diagram from '../Diagram';



var EquationLabel =
/*#__PURE__*/
function () {
  function EquationLabel(equations) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, EquationLabel);

    var defaultOptions = {
      label: '',
      color: [0, 0, 1, 1],
      scale: 0.7,
      position: new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0),
      form: '0',
      formType: 'base',
      vAlign: 'middle',
      hAlign: 'center'
    };
    var optionsToUse = Object.assign({}, defaultOptions, options);
    var labelTextOrEquation = optionsToUse.label;
    var color = optionsToUse.color,
        scale = optionsToUse.scale,
        position = optionsToUse.position;
    var form = optionsToUse.form,
        formType = optionsToUse.formType;
    var vAlign = optionsToUse.vAlign,
        hAlign = optionsToUse.hAlign;
    var eqn;

    if (typeof labelTextOrEquation === 'string') {
      eqn = equations.makeEqn();
      eqn.createElements({
        base: labelTextOrEquation
      }, color);
      eqn.collection.transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, 1).rotate(0).translate(position);
      eqn.formAlignment.fixTo = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      eqn.formAlignment.hAlign = hAlign;
      eqn.formAlignment.vAlign = vAlign;
      eqn.formAlignment.scale = scale;
      eqn.addForm('base', ['base']);
      eqn.setCurrentForm('base');
    } else if (labelTextOrEquation instanceof _DiagramElements_Equation_GLEquation__WEBPACK_IMPORTED_MODULE_1__["Equation"]) {
      eqn = labelTextOrEquation;
    } else {
      eqn = equations.makeEqn();
      var elements = {};
      labelTextOrEquation.forEach(function (labelText, index) {
        elements["_".concat(index)] = labelText;
      });
      eqn.createElements(elements, color);
      eqn.collection.transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, 1).rotate(0).translate(position);
      eqn.formAlignment.fixTo = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      eqn.formAlignment.hAlign = hAlign;
      eqn.formAlignment.vAlign = vAlign;
      eqn.formAlignment.scale = scale;
      labelTextOrEquation.forEach(function (labelText, index) {
        eqn.addForm("".concat(index), ["_".concat(index)]);
      });
      eqn.setCurrentForm(form, formType);
    }

    this.eqn = eqn;
  }

  _createClass(EquationLabel, [{
    key: "setText",
    value: function setText(text) {
      var form = this.eqn.getCurrentForm();

      if (form != null) {
        var key = Object.keys(form.collection.elements)[0];
        var textObject = form.collection.elements[key].drawingObject;

        if (textObject != null) {
          textObject.setText(text);
        }

        form.arrange(this.eqn.formAlignment.scale, this.eqn.formAlignment.hAlign, this.eqn.formAlignment.vAlign, this.eqn.formAlignment.fixTo);
      }
    }
  }, {
    key: "getText",
    value: function getText() {
      var textToReturn = '';
      var form = this.eqn.getCurrentForm();

      if (form != null) {
        var key = Object.keys(form.collection.elements)[0];
        var textObject = form.collection.elements[key].drawingObject;

        if (textObject != null) {
          textToReturn = textObject.text[0].text;
        }
      }

      return textToReturn;
    }
  }, {
    key: "updateRotation",
    value: function updateRotation(labelAngle, position) {
      var offsetMag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var offsetAngle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      if (offsetMag !== 0) {
        var labelWidth = 0;
        var labelHeight = 0;
        var currentForm = this.eqn.getCurrentForm();

        if (currentForm != null) {
          labelWidth = currentForm.width / 2 + 0.04;
          labelHeight = currentForm.height / 2 + 0.04;
        }

        var a = labelWidth + offsetMag;
        var b = labelHeight + offsetMag;
        var r = a * b / Math.sqrt(Math.pow(b * Math.cos(labelAngle - offsetAngle), 2) + Math.pow(a * Math.sin(labelAngle - offsetAngle), 2));
        this.eqn.collection.setPosition(position.add(Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(r, offsetAngle)));
      } else {
        this.eqn.collection.setPosition(position);
      }

      this.eqn.collection.transform.updateRotation(labelAngle);
    } // const label = {
    //   eqn,
    //   updateRotation,
    //   setText,
    //   getText,
    //   // updateScale,
    // };
    // return label;

  }]);

  return EquationLabel;
}();



/***/ }),

/***/ "./src/js/diagram/DiagramObjects/EquationNavigator.js":
/*!************************************************************!*\
  !*** ./src/js/diagram/DiagramObjects/EquationNavigator.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EquationNavigator; });
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _DiagramElements_Equation_GLEquation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../DiagramElements/Equation/GLEquation */ "./src/js/diagram/DiagramElements/Equation/GLEquation.js");
/* harmony import */ var _tools_htmlGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../tools/htmlGenerator */ "./src/js/tools/htmlGenerator.js");
/* harmony import */ var _tools_tools__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../tools/tools */ "./src/js/tools/tools.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }





 // eslint-disable-next-line no-use-before-define

function updateDescription(eqn, formType, descriptionElement, index) {
  var setClicks = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var prefix = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
  var element = descriptionElement;

  if (element == null) {
    return;
  }

  var form = null; // $FlowFixMe

  form = eqn.formSeries[index][formType];

  if (form == null) {
    return;
  }

  if (form.description == null) {
    return;
  }

  var monochrome = !setClicks;

  if (descriptionElement) {
    if (setClicks) {
      // eslint-disable-next-line no-param-reassign
      descriptionElement.innerHTML = _tools_htmlGenerator__WEBPACK_IMPORTED_MODULE_3__["applyModifiers"]("".concat(prefix).concat(form.description), form.modifiers);
      _tools_htmlGenerator__WEBPACK_IMPORTED_MODULE_3__["setOnClicks"](form.modifiers);
    } else {
      // eslint-disable-next-line no-param-reassign
      descriptionElement.innerHTML = _tools_htmlGenerator__WEBPACK_IMPORTED_MODULE_3__["applyModifiers"]("".concat(prefix).concat(form.description), form.modifiers, '', monochrome);
    }
  }
}

function enableTouch(element) {
  if (element) {
    element.classList.remove('lesson__eqn_nav__not_touchable');
  }
}

function disableTouch(element) {
  if (element) {
    element.classList.add('lesson__eqn_nav__not_touchable');
  }
}

function _updateButtons(nav) {
  var includeNextPrevPrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var nextPrefix = '';
  var prevPrefix = '';

  if (includeNextPrevPrefix) {
    nextPrefix = 'NEXT: ';
    prevPrefix = 'PREV: ';
  }

  var currentForm = nav.eqn.getCurrentForm();

  if (currentForm != null) {
    var index = nav.eqn.getFormIndex(currentForm);

    if (index === 0) {
      disableTouch(nav.refresh);
      disableTouch(nav.prev);
      disableTouch(nav.prevDescription);
      disableTouch(nav.description); // enableTouch(nav.nextDescription, true);
    } else {
      enableTouch(nav.refresh);
      enableTouch(nav.prev);
      enableTouch(nav.prevDescription);
      enableTouch(nav.description);
    }

    if (nav.eqn.formSeries.length > 1) {
      enableTouch(nav.next);
      enableTouch(nav.nextDescription);
    } else {
      disableTouch(nav.next);
      disableTouch(nav.nextDescription);
    }

    var nextIndex = index + 1;

    if (nextIndex > nav.eqn.formSeries.length - 1) {
      if (nav.nextDescription) {
        // eslint-disable-next-line no-param-reassign
        nav.nextDescription.innerHTML = 'RESTART from begining';
      }
    } else {
      updateDescription(nav.eqn, currentForm.type, nav.nextDescription, nextIndex, false, nextPrefix);
    }

    updateDescription(nav.eqn, currentForm.type, nav.description, index, true); // nav.eqn.updateDescription(currentForm);

    var prevIndex = index - 1;

    if (prevIndex >= 0) {
      updateDescription(nav.eqn, currentForm.type, nav.prevDescription, prevIndex, false, prevPrefix);
    } else if (nav.prevDescription) {
      // eslint-disable-next-line no-param-reassign
      nav.prevDescription.innerHTML = '';
    }
  }
}

function updateButtonsDescriptionOnly(nav) {
  var currentForm = nav.eqn.getCurrentForm();

  if (currentForm != null) {
    var index = nav.eqn.getFormIndex(currentForm);
    enableTouch(nav.description);
    updateDescription(nav.eqn, currentForm.type, nav.description, index, true);
  }
}

function makeType3Line(prevMethod, refreshMethod, nextMethod) // can be: 'twoLines'
{
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var table = document.createElement('table');
  var prevGroup = document.createElement('tr');
  var currentGroup = document.createElement('tr');
  var nextGroup = document.createElement('tr');
  var prev = document.createElement('td');
  var refresh = document.createElement('td');
  var next = document.createElement('td');
  var prevDescription = document.createElement('td');
  var description = document.createElement('td');
  var nextDescription = document.createElement('td');
  prevGroup.appendChild(prev);
  prevGroup.appendChild(prevDescription);
  nextGroup.appendChild(next);
  nextGroup.appendChild(nextDescription);
  currentGroup.appendChild(refresh);
  currentGroup.appendChild(description);
  table.appendChild(prevGroup);
  table.appendChild(currentGroup);
  table.appendChild(nextGroup);
  table.classList.add('lesson__eqn_nav__table');
  prevGroup.classList.add('lesson__eqn_nav__3line__prevRow');
  currentGroup.classList.add('lesson__eqn_nav__3line__currentRow');
  nextGroup.classList.add('lesson__eqn_nav__3line__nextRow');
  prev.classList.add('lesson__eqn_nav__3line__prevRow__button');
  refresh.classList.add('lesson__eqn_nav__3line__currentRow__button');
  next.classList.add('lesson__eqn_nav__3line__nextRow__button');
  prevDescription.classList.add('lesson__eqn_nav__3line__prevRow__description');
  description.classList.add('lesson__eqn_nav__3line__currentRow__description');
  description.classList.add('lesson__eqn_nav__description');
  nextDescription.classList.add('lesson__eqn_nav__3line__nextRow__description');
  var optionsToUse = options;

  if (!Array.isArray(options)) {
    optionsToUse = [options];
  } // Use two lines to stop jittering when transitioning from one line to two
  // lines


  if (optionsToUse.indexOf('twoLines') > -1) {
    prevGroup.classList.add('lesson__eqn_nav__3line__prev_twoLines');
    currentGroup.classList.add('lesson__eqn_nav__3line__current_twoLines');
    nextGroup.classList.add('lesson__eqn_nav__3line__next_twoLines');
  }

  prevGroup.onclick = prevMethod;
  currentGroup.onclick = refreshMethod;
  nextGroup.onclick = nextMethod;
  next.innerHTML = 'Next';
  prev.innerHTML = 'Prev';
  refresh.innerHTML = 'Refresh';
  return {
    table: table,
    prevGroup: prevGroup,
    currentGroup: currentGroup,
    nextGroup: nextGroup,
    prev: prev,
    refresh: refresh,
    next: next,
    prevDescription: prevDescription,
    description: description,
    nextDescription: nextDescription
  };
}

function makeTypeDescriptionOnly(nextMethod) {
  var table = document.createElement('table');
  var currentGroup = document.createElement('tr');
  var description = document.createElement('td');
  currentGroup.appendChild(description);
  table.appendChild(currentGroup);
  table.classList.add('lesson__eqn_nav__table');
  currentGroup.classList.add('lesson__eqn_nav__description_only__currentRow');
  description.classList.add('lesson__eqn_nav__description_only__currentRow__description');
  description.classList.add('lesson__eqn_nav__description');
  currentGroup.onclick = nextMethod;
  return {
    table: table,
    currentGroup: currentGroup,
    description: description
  };
}

function makeType1Line(prevMethod, refreshMethod, nextMethod) // can be: 'twoLines'
{
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var table = document.createElement('table');
  var currentGroup = document.createElement('tr');
  var prev = document.createElement('td');
  var next = document.createElement('td');
  var description = document.createElement('td');
  currentGroup.appendChild(prev);
  currentGroup.appendChild(description);
  currentGroup.appendChild(next);
  table.appendChild(currentGroup);
  table.classList.add('lesson__eqn_nav__table');
  currentGroup.classList.add('lesson__eqn_nav__1line__currentRow');
  prev.classList.add('lesson__eqn_nav__1line__prev__button');
  next.classList.add('lesson__eqn_nav__1line__next__button');
  description.classList.add('lesson__eqn_nav__1line__currentRow__description');
  description.classList.add('lesson__eqn_nav__description');
  var optionsToUse = options;

  if (!Array.isArray(options)) {
    optionsToUse = [options];
  } // Use two lines to stop jittering when transitioning from one line to two
  // lines


  if (optionsToUse.indexOf('twoLines') > -1) {
    currentGroup.classList.add('lesson__eqn_nav__1line__current_twoLines');
  }

  prev.onclick = prevMethod;
  description.onclick = refreshMethod;
  next.onclick = nextMethod;

  if (optionsToUse.indexOf('arrows') > -1) {
    var nextArrow = document.createElement('div');
    nextArrow.classList.add('lesson__eqn_nav__arrow_right');
    next.appendChild(nextArrow);
    var prevArrow = document.createElement('div');
    prevArrow.classList.add('lesson__eqn_nav__arrow_left');
    prev.appendChild(prevArrow);
  } else {
    next.innerHTML = 'Next';
    prev.innerHTML = 'Prev';
  }

  return {
    table: table,
    currentGroup: currentGroup,
    prev: prev,
    next: next,
    description: description
  };
}

function makeType2Line(prevMethod, refreshMethod, nextMethod) // can be: 'twoLines'
{
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var table = document.createElement('table');
  var row = document.createElement('tr');
  var descriptionRows = document.createElement('tr');
  var currentGroup = document.createElement('tr');
  var prev = document.createElement('td');
  var next = document.createElement('td');
  var nextGroup = document.createElement('tr'); // const descriptionRows = document.createElement('td');
  // const descriptionRow = document.createElement('tr');
  // const nextDescriptionRow = document.createElement('tr');

  var description = document.createElement('td');
  var nextDescription = document.createElement('td');
  currentGroup.appendChild(description);
  nextGroup.appendChild(nextDescription);
  descriptionRows.appendChild(currentGroup);
  descriptionRows.appendChild(nextGroup);
  row.appendChild(prev);
  row.appendChild(descriptionRows);
  row.appendChild(next);
  table.appendChild(row);
  table.classList.add('lesson__eqn_nav__table');
  currentGroup.classList.add('lesson__eqn_nav__2lines__currentRow');
  nextGroup.classList.add('lesson__eqn_nav__2lines__nextRow');
  prev.classList.add('lesson__eqn_nav__2lines__prev__button');
  next.classList.add('lesson__eqn_nav__2lines__next__button');
  description.classList.add('lesson__eqn_nav__2lines__currentRow__description');
  description.classList.add('lesson__eqn_nav__description');
  nextDescription.classList.add('lesson__eqn_nav__2lines__nextRow__description');
  var optionsToUse = options;

  if (!Array.isArray(options)) {
    optionsToUse = [options];
  } // Use two lines to stop jittering when transitioning from one line to two
  // lines


  if (optionsToUse.indexOf('twoLines') > -1) {
    currentGroup.classList.add('lesson__eqn_nav__2lines__current_twoLines');
  }

  prev.onclick = prevMethod;
  description.onclick = refreshMethod;
  next.onclick = nextMethod;
  nextDescription.onclick = nextMethod;

  if (optionsToUse.indexOf('arrows') > -1) {
    var nextArrow = document.createElement('div');
    nextArrow.classList.add('lesson__eqn_nav__arrow_right');
    next.appendChild(nextArrow);
    var prevArrow = document.createElement('div');
    prevArrow.classList.add('lesson__eqn_nav__arrow_left');
    prev.appendChild(prevArrow);
  } else {
    next.innerHTML = 'Next';
    prev.innerHTML = 'Prev';
  }

  return {
    table: table,
    currentGroup: currentGroup,
    nextGroup: nextGroup,
    prev: prev,
    next: next,
    nextDescription: nextDescription,
    description: description
  };
}

var EquationNavigator =
/*#__PURE__*/
function (_DiagramElementCollec) {
  _inherits(EquationNavigator, _DiagramElementCollec);

  function EquationNavigator(shapes, animateNextFrame, equation, offset) {
    var _this;

    var navType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'threeLine';
    var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
    var xAlign = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'left';
    var vAlign = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'middle';
    var id = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : Object(_tools_tools__WEBPACK_IMPORTED_MODULE_4__["generateUniqueId"])('id_lesson__equation_navigator_');

    _classCallCheck(this, EquationNavigator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EquationNavigator).call(this, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]('Eqn Nav').scale(1, 1).translate(0, 0), shapes.limits));
    _this.shapes = shapes;

    _this.setEquation(equation);

    _this.prev = null;
    _this.next = null;
    _this.refresh = null;
    _this.description = null;
    _this.nextDescription = null;
    _this.prevDescription = null;
    _this.table = null;
    _this.prevGroup = null;
    _this.currentGroup = null;
    _this.nextGroup = null;
    _this.animateNextFrame = animateNextFrame;
    _this.navType = navType;
    var navigatorHTMLElement = null;

    if (_this.navType === 'threeLine') {
      navigatorHTMLElement = makeType3Line(_this.clickPrev.bind(_assertThisInitialized(_assertThisInitialized(_this))), _this.clickRefresh.bind(_assertThisInitialized(_assertThisInitialized(_this))), _this.clickNext.bind(_assertThisInitialized(_assertThisInitialized(_this))), options);
    }

    if (_this.navType === 'descriptionOnly') {
      navigatorHTMLElement = makeTypeDescriptionOnly(_this.clickNext.bind(_assertThisInitialized(_assertThisInitialized(_this))));
    }

    if (_this.navType === 'oneLine') {
      navigatorHTMLElement = makeType1Line(_this.clickPrev.bind(_assertThisInitialized(_assertThisInitialized(_this))), _this.clickRefresh.bind(_assertThisInitialized(_assertThisInitialized(_this))), _this.clickNext.bind(_assertThisInitialized(_assertThisInitialized(_this))), options);
    }

    if (_this.navType === 'twoLine') {
      navigatorHTMLElement = makeType2Line(_this.clickPrev.bind(_assertThisInitialized(_assertThisInitialized(_this))), _this.clickRefresh.bind(_assertThisInitialized(_assertThisInitialized(_this))), _this.clickNext.bind(_assertThisInitialized(_assertThisInitialized(_this))), options);
    }

    var eqnCollectionPosition = _this.eqn.collection.getPosition();

    if (navigatorHTMLElement != null) {
      Object.assign(_assertThisInitialized(_assertThisInitialized(_this)), navigatorHTMLElement);

      var table = _this.shapes.htmlElement(navigatorHTMLElement.table, "".concat(id, "_table"), '', eqnCollectionPosition.add(offset), vAlign, xAlign);

      _this.add('table', table);
    }

    _this.eqn.collection.onClick = _this.clickNext.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.hasTouchableElements = true;
    _this.eqn.collection.isTouchable = true;
    _this.eqn.collection.touchInBoundingRect = true;
    return _this;
  } // const navigator = shapes.collection(;


  _createClass(EquationNavigator, [{
    key: "setEquation",
    value: function setEquation(eqn) {
      this.eqn = eqn; // this._eqn = [];

      this.add('eqn', eqn.collection);
    }
  }, {
    key: "clickNext",
    value: function clickNext() {
      this.eqn.nextForm(1.5);
      this.updateButtons();
      this.animateNextFrame();
    }
  }, {
    key: "clickPrev",
    value: function clickPrev() {
      this.eqn.prevForm(1.5);
      this.updateButtons();
      this.animateNextFrame();
    }
  }, {
    key: "clickRefresh",
    value: function clickRefresh() {
      var currentForm = this.eqn.getCurrentForm();

      if (currentForm != null) {
        var index = this.eqn.getFormIndex(currentForm);

        if (index > 0) {
          this.eqn.replayCurrentForm(1.5);
          this.animateNextFrame();
        }
      }

      this.updateButtons();
    }
  }, {
    key: "updateButtons",
    value: function updateButtons() {
      if (this.navType === 'equationOnly') {
        return;
      }

      if (this.navType === 'descriptionOnly') {
        updateButtonsDescriptionOnly(this);
      } else if (this.navType === 'twoLine') {
        _updateButtons(this, true);
      } else {
        _updateButtons(this);
      }
    }
  }, {
    key: "showForm",
    value: function showForm(formOrName) {
      var formType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.show();
      this.eqn.showForm(formOrName, formType);

      if (this._table) {
        this._table.show();

        this.updateButtons();
      }
    }
  }]);

  return EquationNavigator;
}(_Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementCollection"]);



/***/ }),

/***/ "./src/js/diagram/DiagramObjects/Line.js":
/*!***********************************************!*\
  !*** ./src/js/diagram/DiagramObjects/Line.js ***!
  \***********************************************/
/*! exports provided: DiagramObjectLine, MovableLine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiagramObjectLine", function() { return DiagramObjectLine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MovableLine", function() { return MovableLine; });
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _tools_mathtools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tools/mathtools */ "./src/js/diagram/tools/mathtools.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _EquationLabel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./EquationLabel */ "./src/js/diagram/DiagramObjects/EquationLabel.js");
/* harmony import */ var _DiagramElements_Equation_GLEquation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../DiagramElements/Equation/GLEquation */ "./src/js/diagram/DiagramElements/Equation/GLEquation.js");
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// import Diagram from '../Diagram';




 // top - text is on top of line (except when line is vertical)
// bottom - text is on bottom of line (except when line is vertical)
// left - text is to left of line (except when line is horiztonal)
// right - text is to right of line (except when line is horiztonal)
// end1 - text is on first end of line
// end2 - text is on second end of line
// outside - text is on left of line when line is vertical from 0 to 1
//           or, if a polygon is defined clockwise, outside will be outside.
// inside - text is on right of line when line is vertical from 0 to 1
//           or, if a polygon is defined anti-clockwise, outside will be outside.

// Line is a class that manages:
//   A straight line
//   Arrows
//   Label
//   Future: Dimension posts
//
// In vertex space, a line is defined as:
//   - horizontal
//   - length 1
//   - width defined by user
//   - left side (start) of line defined at a point by user
//
// To give the line a custom position, length and angle, the main
// class's transform is used:
//   - Translation for vertex space origin position
//   - Scale for line length
//   - Rotation for line angle
//
// In vertex space, a line would normally be positioned along the x axis.
//
//
// A line can be defined in three ways:
//   - p1, p2, width, vertexSpaceStart
//      - width and vertexSpaceStart used to calculate vertex line
//      - p1, p2 used to calculate length, angle, position
//      - length, angle, position used to modify transform
//   - Length, angle, width, vertexSpaceStart, position of vertexSpaceOrigin
//      - width and vertexSpaceStart used to calculate vertex line
//      - Length, angle, position used to modify transform
//   - p1, length, angle, width, vertexSpaceStart
//      - width and vertexSpaceStart used to calculate vertex line
//      - p1 used to calculate position
//      - length, angle, position used to modify transform
var LineLabel =
/*#__PURE__*/
function (_EquationLabel) {
  _inherits(LineLabel, _EquationLabel);

  function LineLabel(equation, labelText, color, offset) // number where 0 is end1, and 1 is end2
  {
    var _this;

    var location = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'top';
    var subLocation = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'left';
    var orientation = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'horizontal';
    var linePosition = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0.5;

    _classCallCheck(this, LineLabel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LineLabel).call(this, equation, {
      label: labelText,
      color: color
    }));
    _this.offset = offset;
    _this.location = location;
    _this.subLocation = subLocation;
    _this.orientation = orientation;
    _this.linePosition = linePosition;
    return _this;
  }

  return LineLabel;
}(_EquationLabel__WEBPACK_IMPORTED_MODULE_3__["default"]);

function makeStraightLine(shapes, length, width, position, color, dashStyle, largerTouchBorder, isTouchDevice) {
  var straightLine = shapes.horizontalLine(position, length, width, 0, color, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, 1).translate(0, 0));

  if (dashStyle) {
    straightLine = shapes.dashedLine(position, dashStyle.maxLength, width, 0, dashStyle.style, color, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, 1).translate(0, 0));
  }

  if (largerTouchBorder) {
    var multiplier = isTouchDevice ? 16 : 8;

    var increaseBorderSize = function increaseBorderSize(element) {
      for (var i = 0; i < element.drawingObject.border[0].length; i += 1) {
        // eslint-disable-next-line no-param-reassign
        element.drawingObject.border[0][i].y *= multiplier;
      }
    };

    increaseBorderSize(straightLine);
  }

  return straightLine;
} // export type TypeLine = {
//   _line: DiagramElementPrimative;
//   currentLength: number;
//   setLength: (number) => void;
//   setEndPoints: (Point, Point, number) => void;
//   animateLengthTo: (number, number, boolean, ?() => void) => void;
//   grow: (number, number, boolean, ?() => void) => void;
//   reference: 'center' | 'end';
//   showRealLength: boolean;
//   label: ?LineLabel;
//   _label: DiagramElementCollection;
//   arrow1: null | {
//     height: number;
//   };
//   arrow2: null | {
//     height: number;
//   };
//   setMovable: (?boolean) => void;
//   addArrow1: (number, number) => void;
//   addArrow2: (number, number) => void;
//   addLabel: (string, number, TypeLineLabelLocation,
//              TypeLineLabelSubLocation, TypeLineLabelOrientation, number
//             ) => void;
//   setEndPoints: (Point, Point, ?number) => void;
//   animateLengthTo: (number, number, boolean, ?() => void) => void;
//   grow: (number, number, boolean, ?() => void) => void;
//   pulseWidth: () => void;
//   updateLabel: (?number) => {};
//   offset: number;
// } & DiagramElementCollection;
// A line is always defined as horiztonal with length 1 in vertex space
// The line's position and rotation is the line collection transform
// translation and rotation respectively.
// The line's length is the _line primative x scale.


var DiagramObjectLine =
/*#__PURE__*/
function (_DiagramElementCollec) {
  _inherits(DiagramObjectLine, _DiagramElementCollec);

  _createClass(DiagramObjectLine, [{
    key: "calculateFromP1LengthAngle",
    // Diagram elements
    // label and arrow objects that exist if labels and arrows exist
    // line properties - read only
    // deprecate
    // line properties - read/write
    // line properties - private internal use only
    // line methods
    value: function calculateFromP1LengthAngle(p1, length, angle) {
      var t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(length, 1).rotate(angle);
      var startTransformed = this.vertexSpaceStart.transformBy(t.matrix());
      var position = p1.sub(startTransformed);
      return {
        length: length,
        angle: angle,
        position: position
      };
    }
  }, {
    key: "calculateFromP1P2",
    value: function calculateFromP1P2(p1, p2) {
      var line = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Line"](p1, p2);
      var length = line.length();
      var angle = line.angle();
      var t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(length, 1).rotate(angle);
      var startTransformed = this.vertexSpaceStart.transformBy(t.matrix());
      var position = p1.sub(startTransformed);
      return {
        length: length,
        angle: angle,
        position: position
      };
    }
  }]);

  function DiagramObjectLine(shapes, equation, isTouchDevice, animateNextFrame) {
    var _this2;

    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    _classCallCheck(this, DiagramObjectLine);

    var defaultOptions = {
      position: new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0),
      length: 1,
      angle: 0,
      width: 0.01,
      vertexSpaceStart: 'start',
      color: [0, 0, 1, 1],
      showLine: true,
      largerTouchBorder: true,
      offset: 0,
      dashStyle: null
    };
    var optionsToUse = Object.assign({}, defaultOptions, options);
    var dashStyle = optionsToUse.dashStyle;

    if (dashStyle) {
      var defaultMaxLength = optionsToUse.length;

      if (optionsToUse.p1 != null && optionsToUse.p2 != null) {
        defaultMaxLength = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["distance"])(optionsToUse.p1, optionsToUse.p2);
      }

      dashStyle = Object.assign({}, {
        maxLength: defaultMaxLength,
        dashStyle: [0.1]
      }, options.dashStyle);
    }

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(DiagramObjectLine).call(this, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]('Line').scale(1, 1).rotate(0).translate(0, 0), shapes.limits));

    _this2.setColor(optionsToUse.color);

    _this2.shapes = shapes;
    _this2.equation = equation;
    _this2.largerTouchBorder = optionsToUse.largerTouchBorder;
    _this2.isTouchDevice = isTouchDevice;
    _this2.animateNextFrame = animateNextFrame;
    _this2.dashStyle = dashStyle; // Calculate and store the line geometry
    //    The length, angle, p1 and p2 properties also exist in this.line,
    //    but are at this level for convenience

    _this2.offset = optionsToUse.offset;
    _this2.width = optionsToUse.width;
    _this2.position = optionsToUse.position;
    _this2.length = optionsToUse.length;
    _this2.angle = optionsToUse.angle;

    _this2.transform.updateTranslation(_this2.position);

    _this2.transform.updateRotation(_this2.angle); // Line is defined in vertex space as horiztonal along the x axis.
    // The reference will define how it is offset where:
    //    - start: line extends from 0 to length in x
    //    - end: line extends from -length to 0 in length
    //    - middle: line extends from -length / 2 to length / 2
    //    - percent: line extends from -length * % to length * (1 - %)


    _this2.vertexSpaceLength = 1;
    _this2.vertexSpaceStart = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);

    if (optionsToUse.vertexSpaceStart === 'end') {
      _this2.vertexSpaceStart = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](-1, 0);
    } else if (optionsToUse.vertexSpaceStart === 'center') {
      _this2.vertexSpaceStart = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](-0.5, 0);
    } else if (typeof optionsToUse.vertexSpaceStart === 'number') {
      _this2.vertexSpaceStart = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](-optionsToUse.vertexSpaceStart, 0);
    } else if (optionsToUse.vertexSpaceStart instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"]) {
      _this2.vertexSpaceStart = optionsToUse.vertexSpaceStart;
    } // this.vertexOrigin = vertexOrigin;
    // MultiMove means the line has a middle section that when touched
    // translates the line collection, and when the rest of the line is
    // touched then the line collection is rotated.


    _this2.multiMove = {
      vertexSpaceMidLength: 0,
      bounds: new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](-1, -1, 2, 2)
    };
    _this2._midLine = null; // If the line is to be shown (and not just a label) then make it

    _this2._line = null;

    if (optionsToUse.showLine) {
      // let dashStyleToUse = optionsToUse.dashStyle;
      // if (dashStyleToUse == null) {  // If undefined, make null
      //   dashStyleToUse = null;
      // }
      var straightLine = makeStraightLine(_this2.shapes, _this2.vertexSpaceLength, _this2.width, _this2.vertexSpaceStart, optionsToUse.color, _this2.dashStyle, optionsToUse.largerTouchBorder, isTouchDevice);

      _this2.add('line', straightLine);
    } // Arrow related properties


    _this2.arrow1 = null;
    _this2.arrow2 = null;
    _this2._arrow1 = null;
    _this2._arrow2 = null; // Label related properties

    _this2.label = null;
    _this2.showRealLength = false;
    _this2._label = null;

    _this2.setLength(_this2.length);

    if (optionsToUse.p1 != null && optionsToUse.p2 != null) {
      _this2.setEndPoints(optionsToUse.p1, optionsToUse.p2);
    }

    var defaultArrowOptions = {
      width: _this2.width * 4,
      height: _this2.width * 4
    };

    if (optionsToUse.arrowStart) {
      var arrowOptions = Object.assign({}, defaultArrowOptions, optionsToUse.arrowStart);

      _this2.addArrowStart(arrowOptions.height, arrowOptions.width);
    }

    if (optionsToUse.arrowEnd) {
      var _arrowOptions = Object.assign({}, defaultArrowOptions, optionsToUse.arrowEnd);

      _this2.addArrowEnd(_arrowOptions.height, _arrowOptions.width);
    } // Arrows overrides arrowStart or arrowEnd


    if (optionsToUse.arrows) {
      var arrows = {};

      if (_typeof(optionsToUse.arrows) === 'object') {
        arrows = optionsToUse.arrows;
      }

      var _arrowOptions2 = Object.assign({}, defaultArrowOptions, arrows);

      _this2.addArrows(_arrowOptions2.height, _arrowOptions2.width);
    }

    var defaultLabelOptions = {
      text: '',
      offset: 0,
      location: 'top',
      subLocation: 'left',
      orientation: 'horizontal',
      linePosition: 0.5
    };

    if (optionsToUse.label) {
      var labelOptions = Object.assign({}, defaultLabelOptions, optionsToUse.label);

      _this2.addLabel(labelOptions.text, labelOptions.offset, labelOptions.location, labelOptions.subLocation, labelOptions.orientation, labelOptions.linePosition);
    }

    return _this2;
  }

  _createClass(DiagramObjectLine, [{
    key: "pulseWidth",
    value: function pulseWidth() {
      var line = this._line;

      if (line != null) {
        line.stopPulsing();
        var oldTransformMethod = line.pulse.transformMethod;
        var oldPulseCallback = line.pulse.callback;

        var finishPulsing = function finishPulsing() {
          line.pulse.transformMethod = oldTransformMethod;
          line.pulse.callback = oldPulseCallback;
        };

        line.pulse.callback = finishPulsing;

        line.pulse.transformMethod = function (s) {
          return new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, s);
        };

        line.pulseScaleNow(1, 3);
      }

      var arrow1 = this._arrow1;
      var arrow2 = this._arrow2;

      if (arrow1 != null) {
        arrow1.pulseScaleNow(1, 2);
      }

      if (arrow2 != null) {
        arrow2.pulseScaleNow(1, 2);
      }

      var label = this._label;

      if (label != null) {
        label.pulseScaleNow(1, 1.5);
      }

      this.animateNextFrame();
    }
  }, {
    key: "addArrow",
    value: function addArrow(index) {
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.width * 4;
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : height;
      var r = Math.PI / 2;

      if (index === 2) {
        r = Math.PI / 2 * 3;
      }

      var a = this.shapes.arrow(width, 0, height, 0, this.color, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().translate(this.vertexSpaceStart.x, 0), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0), r); // $FlowFixMe

      this["arrow".concat(index)] = {
        height: height
      };
      this.add("arrow".concat(index), a);
      this.setLength(this.currentLength);
    }
  }, {
    key: "addArrows",
    value: function addArrows() {
      var arrowHeight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.width * 4;
      var arrowWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : arrowHeight;
      this.addArrow1(arrowHeight, arrowWidth);
      this.addArrow2(arrowHeight, arrowWidth);
    }
  }, {
    key: "addArrow1",
    value: function addArrow1() {
      var arrowHeight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.width * 4;
      var arrowWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : arrowHeight;
      this.addArrow(1, arrowHeight, arrowWidth);
    }
  }, {
    key: "addArrow2",
    value: function addArrow2() {
      var arrowHeight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.width * 4;
      var arrowWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : arrowHeight;
      this.addArrow(2, arrowHeight, arrowWidth);
    }
  }, {
    key: "addArrowStart",
    value: function addArrowStart() {
      var arrowHeight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.width * 4;
      var arrowWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : arrowHeight;
      this.addArrow1(arrowHeight, arrowWidth);
    }
  }, {
    key: "addArrowEnd",
    value: function addArrowEnd() {
      var arrowHeight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.width * 4;
      var arrowWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : arrowHeight;
      this.addArrow2(arrowHeight, arrowWidth);
    }
  }, {
    key: "setMovable",
    value: function setMovable() {
      var movable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var moveType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.move.type;
      var middleLengthPercent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.333;
      var translationBounds = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.diagramLimits;

      if (movable) {
        if (moveType === 'translation' || moveType === 'rotation' || moveType === 'scale' || moveType === 'scaleX' || moveType === 'scaleY') {
          this.move.type = moveType;
          this.isTouchable = true;
          this.isMovable = true;
          this.hasTouchableElements = true;

          if (this._line != null) {
            this._line.isTouchable = true;
            this._line.isMovable = false;
          }

          if (this._midLine) {
            this._midLine.isMovable = false;
          }

          this.multiMove.bounds = translationBounds;
        } else {
          this.setMultiMovable(middleLengthPercent, translationBounds);
        }
      } else {
        this.isMovable = false;
      }
    }
  }, {
    key: "setMultiMovable",
    value: function setMultiMovable(middleLengthPercent, translationBounds) {
      this.multiMove.vertexSpaceMidLength = middleLengthPercent * this.vertexSpaceLength;
      var start = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.vertexSpaceStart.x + this.vertexSpaceLength / 2 - this.multiMove.vertexSpaceMidLength / 2, 0);
      var midLine = makeStraightLine(this.shapes, this.multiMove.vertexSpaceMidLength, this.width, start, this.color, null, this.largerTouchBorder, this.isTouchDevice); // console.log(midLine)

      midLine.isTouchable = true;
      midLine.move.type = 'translation';
      midLine.move.element = this;
      midLine.isMovable = true;
      midLine.move.canBeMovedAfterLoosingTouch = true;
      this.add('midLine', midLine);

      if (this._line) {
        this._line.isTouchable = true;
        this._line.move.type = 'rotation';
        this._line.move.element = this;
        this._line.isMovable = true;
        this._line.move.canBeMovedAfterLoosingTouch = true;
      }

      this.hasTouchableElements = true;
      this.isTouchable = false;
      this.isMovable = false;
      this.multiMove.bounds = translationBounds;
      this.setLength(this.currentLength);
    }
  }, {
    key: "updateMoveTransform",
    value: function updateMoveTransform(t) {
      var r = t.r();
      var bounds = this.multiMove.bounds;

      if (r != null) {
        var w = Math.abs(this.currentLength / 2 * Math.cos(r));
        var h = Math.abs(this.currentLength / 2 * Math.sin(r));
        this.move.maxTransform.updateTranslation(bounds.right - w, bounds.top - h);
        this.move.minTransform.updateTranslation(bounds.left + w, bounds.bottom + h);

        if (r > 2 * Math.PI) {
          this.transform.updateRotation(r - 2 * Math.PI);
        }

        if (r < 0) {
          this.transform.updateRotation(r + 2 * Math.PI);
        }
      }
    }
  }, {
    key: "addLabel",
    value: function addLabel(labelText, offset) // number where 0 is end1, and 1 is end2
    {
      var location = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'top';
      var subLocation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'left';
      var orientation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'horizontal';
      var linePosition = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.5;
      this.label = new LineLabel(this.equation, labelText, this.color, offset, location, subLocation, orientation, linePosition);

      if (this.label != null) {
        this.add('label', this.label.eqn.collection);
      }

      this.updateLabel();
    }
  }, {
    key: "updateLabel",
    value: function updateLabel() {
      var parentRotationOffset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var label = this.label;

      if (label == null) {
        return;
      }

      var lineAngle = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["normAngle"])(this.transform.r() || 0);
      var labelAngle = 0;

      if (this.showRealLength && this._label) {
        this._label._base.drawingObject.setText(Object(_tools_mathtools__WEBPACK_IMPORTED_MODULE_1__["roundNum"])(this.currentLength, 2).toString());

        label.eqn.reArrangeCurrentForm();
      }

      var labelPosition = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.vertexSpaceStart.x * this.currentLength + label.linePosition * this.currentLength, 0);
      var labelOffsetAngle = Math.PI / 2;
      var labelOffsetMag = label.offset;

      if (label.location === 'end1' || label.location === 'end2') {
        if (label.location === 'end1') {
          labelPosition.x = this.vertexSpaceStart.x * this.currentLength - label.offset;
          labelOffsetAngle = -Math.PI;
        }

        if (label.location === 'end2') {
          labelPosition.x = this.vertexSpaceStart.x * this.currentLength + this.currentLength + label.offset;
          labelOffsetAngle = 0;
        }
      } else {
        var offsetTop = Math.cos(lineAngle) < 0 ? -Math.PI / 2 : Math.PI / 2;
        var offsetBottom = -offsetTop;
        var offsetLeft = Math.sin(lineAngle) > 0 ? Math.PI / 2 : -Math.PI / 2;
        var offsetRight = -offsetLeft;

        if (label.location === 'top') {
          labelOffsetAngle = offsetTop;
        }

        if (label.location === 'bottom') {
          labelOffsetAngle = offsetBottom;
        }

        if (label.location === 'right') {
          labelOffsetAngle = offsetRight;
        }

        if (label.location === 'left') {
          labelOffsetAngle = offsetLeft;
        }

        if (Object(_tools_mathtools__WEBPACK_IMPORTED_MODULE_1__["roundNum"])(Math.sin(lineAngle), 4) === 0 && (label.location === 'left' || label.location === 'right')) {
          if (label.subLocation === 'top') {
            labelOffsetAngle = offsetTop;
          }

          if (label.subLocation === 'bottom') {
            labelOffsetAngle = offsetBottom;
          }
        }

        if (Object(_tools_mathtools__WEBPACK_IMPORTED_MODULE_1__["roundNum"])(Math.cos(lineAngle), 4) === 0 && (label.location === 'top' || label.location === 'bottom')) {
          if (label.subLocation === 'right') {
            labelOffsetAngle = offsetRight;
          }

          if (label.subLocation === 'left') {
            labelOffsetAngle = offsetLeft;
          }
        }

        if (label.location === 'inside') {
          labelOffsetAngle = -Math.PI / 2;
        }

        if (label.location === 'outside') {
          labelOffsetAngle = Math.PI / 2;
        }
      }

      if (label.orientation === 'horizontal') {
        labelAngle = -lineAngle;
      }

      if (label.orientation === 'baseToLine') {
        if (labelPosition.y < 0) {
          labelAngle = Math.PI;
        }
      }

      if (label.orientation === 'baseAway') {
        if (labelPosition.y > 0) {
          labelAngle = Math.PI;
        }
      }

      if (label.orientation === 'baseUpright') {
        if (Math.cos(lineAngle) < 0) {
          labelAngle = Math.PI;
        }
      }

      label.updateRotation(labelAngle - parentRotationOffset, labelPosition, labelOffsetMag, labelOffsetAngle);
    }
  }, {
    key: "setLength",
    value: function setLength(newLength) {
      var lineStart = this.vertexSpaceStart.x * newLength;
      var lineLength = newLength;
      var straightLineLength = lineLength;
      var startOffset = 0;

      if (this.arrow1 && this._arrow1) {
        straightLineLength -= this.arrow1.height;
        startOffset = this.arrow1.height;

        this._arrow1.setPosition(lineStart);
      }

      if (this.arrow2 && this._arrow2) {
        straightLineLength -= this.arrow2.height;

        this._arrow2.setPosition(lineStart + lineLength, 0);
      }

      var line = this._line;

      if (line) {
        if (this.dashStyle) {
          line.lengthToDraw = straightLineLength; // const newStart = this.vertexSpaceStart.x * straightLineLength;
          // const delta = lineStart + startOffset - newStart;

          line.setPosition(lineStart + startOffset - this.vertexSpaceStart.x, 0);
        } else {
          line.transform.updateScale(straightLineLength, 1);
          var newStart = this.vertexSpaceStart.x * straightLineLength;
          var delta = lineStart + startOffset - newStart;
          line.setPosition(delta, 0);
        }
      }

      var midLine = this._midLine;

      if (midLine) {
        midLine.transform.updateScale(newLength, 1);
      }

      this.length = newLength;
      this.updateLineGeometry();
      this.currentLength = newLength; // to deprecate?

      this.updateLabel();
    }
  }, {
    key: "updateLineGeometry",
    value: function updateLineGeometry() {
      var t = this.transform.t();
      var r = this.transform.r();

      if (t != null && r != null) {
        this.position = t;
        this.angle = r;
        var p1 = this.vertexSpaceStart.transformBy(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(this.length).rotate(this.angle).translate(this.position).m());
        var line = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Line"](p1, this.length, this.angle);
        this.p1 = line.getPoint(1);
        this.p2 = line.getPoint(2);
        this.line = line;
      }
    }
  }, {
    key: "setLineDimensions",
    value: function setLineDimensions() {
      var offset = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(this.offset, this.angle + Math.PI / 2);
      this.transform.updateTranslation(this.position.add(offset));
      this.transform.updateRotation(this.angle);
      this.setLength(this.length);
      this.updateLabel();
    }
  }, {
    key: "setEndPoints",
    value: function setEndPoints(p, q) {
      var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.offset;
      this.offset = offset;

      var _this$calculateFromP = this.calculateFromP1P2(p, q),
          length = _this$calculateFromP.length,
          angle = _this$calculateFromP.angle,
          position = _this$calculateFromP.position;

      this.angle = angle;
      this.length = length;
      this.position = position;
      this.setLineDimensions(); // const pq = new Line(p, q);
      // this.angle = pq.angle();
      // this.length = pq.length();
      // this.position = p;
      // if (this.vertexOrigin === 'center') {
      //   this.position = pq.midpoint();
      // } else if (this.vertexOrigin === 'end') {
      //   this.position = q;
      // } else if (typeof this.vertexOrigin === 'number') {
      //   this.position = p.add(polarToRect(this.vertexOrigin * this.length, this.angle));
      // } else if (this.vertexOrigin instanceof Point) {
      //   this.position = p.add(this.vertexOrigin);
      // }
      // // this.updateLineGeometry();
      // // const newLength = distance(q, p);
      // // const pq = new Line(p, q);
      // this.transform.updateRotation(pq.angle());
      // const offsetdelta = polarToRect(offset, pq.angle() + Math.PI / 2);
      // // if (this.reference === 'center') {
      // this.transform.updateTranslation(this.position.add(offsetdelta));
      // // } else {
      // //   this.transform.updateTranslation(p.add(offsetdelta));
      // // }
      // this.setLength(this.length);
      // this.updateLabel();
    }
  }, {
    key: "animateLengthTo",
    value: function animateLengthTo() {
      var _this3 = this;

      var toLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var finishOnCancel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      this.stop();
      var initialLength = this.currentLength;
      var deltaLength = toLength - this.currentLength;

      var func = function func(percent) {
        _this3.setLength(initialLength + deltaLength * percent);
      };

      var done = function done() {
        if (finishOnCancel) {
          _this3.setLength(initialLength + deltaLength);
        }

        if (typeof callback === 'function' && callback) {
          callback();
        }
      };

      this.animateCustomTo(func, time, 0, done);
    }
  }, {
    key: "grow",
    value: function grow() {
      var fromLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var finishOnCancel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      this.stop();
      var target = this.currentLength;
      this.setLength(fromLength);
      this.animateLengthTo(target, time, finishOnCancel, callback);
    }
  }, {
    key: "showLineOnly",
    value: function showLineOnly() {
      this.show();

      if (this._line) {
        this._line.show();
      }

      if (this._arrow1) {
        this._arrow1.show();
      }

      if (this._arrow2) {
        this._arrow2.show();
      }

      if (this._label) {
        this._label.hideAll();
      }
    }
  }]);

  return DiagramObjectLine;
}(_Element__WEBPACK_IMPORTED_MODULE_2__["DiagramElementCollection"]);
var MovableLine =
/*#__PURE__*/
function (_DiagramObjectLine) {
  _inherits(MovableLine, _DiagramObjectLine);

  function MovableLine() {
    _classCallCheck(this, MovableLine);

    return _possibleConstructorReturn(this, _getPrototypeOf(MovableLine).apply(this, arguments));
  }

  return MovableLine;
}(DiagramObjectLine);

/***/ }),

/***/ "./src/js/diagram/DiagramPrimatives/DiagramPrimatives.js":
/*!***************************************************************!*\
  !*** ./src/js/diagram/DiagramPrimatives/DiagramPrimatives.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DiagramPrimatives; });
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Element */ "./src/js/diagram/Element.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _DrawContext2D__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../DrawContext2D */ "./src/js/diagram/DrawContext2D.js");
/* harmony import */ var _tools_mathtools__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../tools/mathtools */ "./src/js/diagram/tools/mathtools.js");
/* harmony import */ var _tools_tools__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../tools/tools */ "./src/js/tools/tools.js");
/* harmony import */ var _DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../DrawingObjects/VertexObject/VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
/* harmony import */ var _DiagramElements_PolyLine__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../DiagramElements/PolyLine */ "./src/js/diagram/DiagramElements/PolyLine.js");
/* harmony import */ var _DiagramElements_Fan__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../DiagramElements/Fan */ "./src/js/diagram/DiagramElements/Fan.js");
/* harmony import */ var _DiagramElements_Polygon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../DiagramElements/Polygon */ "./src/js/diagram/DiagramElements/Polygon.js");
/* harmony import */ var _DiagramElements_RadialLines__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../DiagramElements/RadialLines */ "./src/js/diagram/DiagramElements/RadialLines.js");
/* harmony import */ var _DiagramElements_HorizontalLine__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../DiagramElements/HorizontalLine */ "./src/js/diagram/DiagramElements/HorizontalLine.js");
/* harmony import */ var _DiagramElements_DashedLine__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../DiagramElements/DashedLine */ "./src/js/diagram/DiagramElements/DashedLine.js");
/* harmony import */ var _DiagramElements_RectangleFilled__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../DiagramElements/RectangleFilled */ "./src/js/diagram/DiagramElements/RectangleFilled.js");
/* harmony import */ var _DiagramElements_Lines__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../DiagramElements/Lines */ "./src/js/diagram/DiagramElements/Lines.js");
/* harmony import */ var _DiagramElements_Arrow__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../DiagramElements/Arrow */ "./src/js/diagram/DiagramElements/Arrow.js");
/* harmony import */ var _DiagramElements_Plot_AxisProperties__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../DiagramElements/Plot/AxisProperties */ "./src/js/diagram/DiagramElements/Plot/AxisProperties.js");
/* harmony import */ var _DiagramElements_Plot_Axis__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../DiagramElements/Plot/Axis */ "./src/js/diagram/DiagramElements/Plot/Axis.js");
/* harmony import */ var _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../DrawingObjects/TextObject/TextObject */ "./src/js/diagram/DrawingObjects/TextObject/TextObject.js");
/* harmony import */ var _DrawingObjects_HTMLObject_HTMLObject__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../DrawingObjects/HTMLObject/HTMLObject */ "./src/js/diagram/DrawingObjects/HTMLObject/HTMLObject.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }






















var DiagramPrimatives =
/*#__PURE__*/
function () {
  function DiagramPrimatives(webgl, draw2D, htmlCanvas, limits) {
    _classCallCheck(this, DiagramPrimatives);

    this.webgl = webgl;
    this.draw2D = draw2D;
    this.htmlCanvas = htmlCanvas;
    this.limits = limits;
  }

  _createClass(DiagramPrimatives, [{
    key: "polyLine",
    value: function polyLine(points, close, lineWidth, color) {
      var borderToPoint = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'never';
      var transform = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      return Object(_DiagramElements_PolyLine__WEBPACK_IMPORTED_MODULE_7__["PolyLine"])(this.webgl, points, close, lineWidth, color, borderToPoint, transform, this.limits);
    }
  }, {
    key: "fan",
    value: function fan() {
      var defaultOptions = {
        points: [],
        color: [1, 0, 0, 1],
        transform: null,
        position: null
      };

      for (var _len = arguments.length, options = new Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
      }

      var optionsToUse = Object.assign.apply(Object, [{}, defaultOptions].concat(options));
      var o = optionsToUse;
      var transform = o.transform;

      if (transform == null && o.position != null) {
        transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]('fan').translate(o.position);
      } else if (transform == null) {
        transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]('fan');
      }

      return Object(_DiagramElements_Fan__WEBPACK_IMPORTED_MODULE_8__["default"])(this.webgl, o.points, o.color, transform, this.limits);
    } // fan(
    //   points: Array<Point>,
    //   color: Array<number>,
    //   transform: Transform | Point = new Transform(),
    // ) {
    //   return Fan(
    //     this.webgl, points,
    //     color, transform, this.limits,
    //   );
    // }

  }, {
    key: "text",
    value: function text(textInput, location, color) {
      var fontInput = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var font = new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_18__["DiagramFont"]('Times New Roman', 'italic', 0.2, '200', 'center', 'middle', color);

      if (fontInput !== null) {
        font = fontInput;
      }

      var dT = new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_18__["DiagramText"](new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0), textInput, font);
      var to = new _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_18__["TextObject"](this.draw2D, [dT]);
      return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](to, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, 1).translate(location.x, location.y), color, this.limits);
    }
  }, {
    key: "htmlElement",
    value: function htmlElement(elementToAdd) {
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "id__temp_".concat(Math.round(Math.random() * 10000));
      var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var location = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      var alignV = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'middle';
      var alignH = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'left';
      var element = document.createElement('div');

      if (classes && element) {
        var classArray = classes.split(' ');
        classArray.forEach(function (c) {
          return element.classList.add(c.trim());
        });
      }

      if (Array.isArray(elementToAdd)) {
        elementToAdd.forEach(function (e) {
          return element.appendChild(e);
        });
      } else {
        element.appendChild(elementToAdd);
      }

      element.style.position = 'absolute';
      element.setAttribute('id', id);
      this.htmlCanvas.appendChild(element);
      var hT = new _DrawingObjects_HTMLObject_HTMLObject__WEBPACK_IMPORTED_MODULE_19__["default"](this.htmlCanvas, id, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0), alignV, alignH);
      var diagramElement = new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementPrimative"](hT, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, 1).translate(location.x, location.y), [1, 1, 1, 1], this.limits); // diagramElement.setFirstTransform();

      return diagramElement;
    }
  }, {
    key: "htmlText",
    value: function htmlText(textInput) {
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object(_tools_tools__WEBPACK_IMPORTED_MODULE_5__["generateUniqueId"])('id__html_text_');
      var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var location = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      var alignV = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'middle';
      var alignH = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'left';
      // const inside = document.createTextNode(textInput);
      var inside = document.createElement('div');
      inside.innerHTML = textInput;
      return this.htmlElement(inside, id, classes, location, alignV, alignH);
    }
  }, {
    key: "arrow",
    value: function arrow() {
      var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var legWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var legHeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.5;
      var color = arguments.length > 4 ? arguments[4] : undefined;
      var transform = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      var tip = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      var rotation = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
      return Object(_DiagramElements_Arrow__WEBPACK_IMPORTED_MODULE_15__["default"])(this.webgl, width, legWidth, height, legHeight, tip, rotation, color, transform, this.limits);
    }
  }, {
    key: "lines",
    value: function lines(linePairs) {
      var numLinesThick = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var color = arguments.length > 2 ? arguments[2] : undefined;
      var transform = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      return Object(_DiagramElements_Lines__WEBPACK_IMPORTED_MODULE_14__["default"])(this.webgl, linePairs, numLinesThick, color, transform, this.limits);
    }
  }, {
    key: "grid",
    value: function grid(bounds, xStep, yStep, numLinesThick, color) {
      var transform = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      var linePairs = []; // const xLimit = tools.roundNum(bounds.righ + xStep);

      if (xStep !== 0) {
        for (var x = bounds.left; _tools_mathtools__WEBPACK_IMPORTED_MODULE_4__["roundNum"](x, 8) <= bounds.right; x += xStep) {
          linePairs.push([new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](x, bounds.top), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](x, bounds.bottom)]);
        }
      }

      if (yStep !== 0) {
        for (var y = bounds.bottom; _tools_mathtools__WEBPACK_IMPORTED_MODULE_4__["roundNum"](y, 8) <= bounds.top; y += yStep) {
          linePairs.push([new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](bounds.left, y), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](bounds.right, y)]);
        }
      }

      return this.lines(linePairs, numLinesThick, color, transform);
    }
  }, {
    key: "polyLineCorners",
    value: function polyLineCorners(points, close, cornerLength, lineWidth, color) {
      var transform = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      return Object(_DiagramElements_PolyLine__WEBPACK_IMPORTED_MODULE_7__["PolyLineCorners"])(this.webgl, points, close, cornerLength, lineWidth, color, transform, this.limits);
    } // polygon(
    //   numSides: number,
    //   radius: number,
    //   lineWidth: number,
    //   rotation: number,
    //   direction: -1 | 1,
    //   numSidesToDraw: number,
    //   color: Array<number>,
    //   transform: Transform | Point = new Transform(),
    // ) {
    //   return Polygon(
    //     this.webgl, numSides, radius, lineWidth,
    //     rotation, direction, numSidesToDraw, color, transform, this.limits,
    //   );
    // }
    // polygonFilled(
    //   numSides: number,
    //   radius: number,
    //   rotation: number,
    //   numSidesToDraw: number,
    //   color: Array<number>,
    //   transform: Transform | Point = new Transform(),
    //   textureLocation: string = '',
    //   textureCoords: Rect = new Rect(0, 0, 1, 1),
    // ) {
    //   return PolygonFilled(
    //     this.webgl, numSides, radius,
    //     rotation, numSidesToDraw, color, transform, this.limits, textureLocation, textureCoords,
    //   );
    // }

  }, {
    key: "polygon",
    value: function polygon() {
      var defaultOptions = {
        sides: 4,
        radius: 1,
        width: 0.01,
        rotation: 0,
        clockwise: false,
        sidesToDraw: null,
        color: [1, 0, 0, 1],
        fill: false,
        transform: null,
        point: null,
        textureLocation: '',
        textureCoords: new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](0, 0, 1, 1)
      };

      for (var _len2 = arguments.length, options = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        options[_key2] = arguments[_key2];
      }

      var optionsToUse = Object.assign.apply(Object, [{}, defaultOptions].concat(options));
      var o = optionsToUse;
      var transform = o.transform;

      if (transform == null && o.point != null) {
        transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]('polygon').translate(o.point);
      } else if (transform == null) {
        transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]('polygon');
      }

      if (o.sidesToDraw == null) {
        o.sidesToDraw = o.sides;
      }

      var direction = 1;

      if (o.clockwise) {
        direction = -1;
      }

      if (o.fill) {
        return Object(_DiagramElements_Polygon__WEBPACK_IMPORTED_MODULE_9__["PolygonFilled"])(this.webgl, o.sides, o.radius, o.rotation, o.sidesToDraw, o.color, transform, this.limits, o.textureLocation, o.textureCoords);
      }

      return Object(_DiagramElements_Polygon__WEBPACK_IMPORTED_MODULE_9__["Polygon"])(this.webgl, o.sides, o.radius, o.width, o.rotation, direction, o.sidesToDraw, o.color, transform, this.limits);
    }
  }, {
    key: "polygonLine",
    value: function polygonLine(numSides, radius, rotation, direction, numSidesToDraw, numLines, // equivalent to thickness - integer
    color) {
      var transform = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      return Object(_DiagramElements_Polygon__WEBPACK_IMPORTED_MODULE_9__["PolygonLine"])(this.webgl, numSides, radius, rotation, direction, numSidesToDraw, numLines, color, transform, this.limits);
    }
  }, {
    key: "horizontalLine",
    value: function horizontalLine(start, length, width, rotation, color) {
      var transform = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      return Object(_DiagramElements_HorizontalLine__WEBPACK_IMPORTED_MODULE_11__["default"])(this.webgl, start, length, width, rotation, color, transform, this.limits);
    }
  }, {
    key: "dashedLine",
    value: function dashedLine(start, length, width, rotation, dashStyle, color) {
      var transform = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      return Object(_DiagramElements_DashedLine__WEBPACK_IMPORTED_MODULE_12__["default"])(this.webgl, start, length, width, rotation, dashStyle, color, transform, this.limits);
    }
  }, {
    key: "rectangleFilled",
    value: function rectangleFilled(topLeft, width, height, cornerRadius, cornerSides, color) {
      var transform = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      return Object(_DiagramElements_RectangleFilled__WEBPACK_IMPORTED_MODULE_13__["default"])(this.webgl, topLeft, width, height, cornerRadius, cornerSides, color, transform, this.limits);
    }
  }, {
    key: "radialLines",
    value: function radialLines() {
      var innerRadius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var outerRadius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.05;
      var dAngle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Math.PI / 4;
      var color = arguments.length > 4 ? arguments[4] : undefined;
      var transform = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      return Object(_DiagramElements_RadialLines__WEBPACK_IMPORTED_MODULE_10__["default"])(this.webgl, innerRadius, outerRadius, width, dAngle, color, transform, this.limits);
    }
  }, {
    key: "collection",
    value: function collection() {
      var transformOrPoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();

      if (transformOrPoint instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"]) {
        transform = transform.translate(transformOrPoint.x, transformOrPoint.y);
      } else {
        transform = transformOrPoint._dup();
      }

      return new _Element__WEBPACK_IMPORTED_MODULE_1__["DiagramElementCollection"](transform, this.limits);
    }
  }, {
    key: "repeatPattern",
    value: function repeatPattern(element, xNum, yNum, xStep, yStep) {
      var transform = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      var group = this.collection(transform);
      var t = element.transform.t();

      var transformToUse = element.transform._dup();

      if (t === null) {
        t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
        transformToUse = transformToUse.translate(0, 0);
      }

      if (t) {
        for (var x = 0; x < xNum; x += 1) {
          for (var y = 0; y < yNum; y += 1) {
            var copy = element._dup();

            copy.transform = transformToUse._dup();
            copy.transform.updateTranslation(t.x + xStep * x, t.y + yStep * y);
            group.add("xy".concat(x).concat(y), copy);
          }
        }
      }

      return group;
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "repeatPatternVertex",
    value: function repeatPatternVertex(element, xNum, yNum, xStep, yStep) {
      var transform = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();

      var copy = element._dup();

      var drawingObject = element.drawingObject; // console.log(element.drawingObject.points)

      if (drawingObject instanceof _DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_6__["default"]) {
        copy.transform = transform._dup();
        var newPoints = [];
        var points = drawingObject.points;

        for (var x = 0; x < xNum; x += 1) {
          for (var y = 0; y < yNum; y += 1) {
            for (var p = 0; p < points.length; p += 2) {
              newPoints.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](points[p] + x * xStep, points[p + 1] + y * yStep)); // console.log(points[p], points[p+1], newPoints.slice(-1))
            }
          }
        } // console.log(newPoints)


        copy.drawingObject.changeVertices(newPoints);
      }

      return copy;
    }
  }, {
    key: "axes",
    value: function axes() {
      var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var limits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](-1, -1, 2, 2);
      var yAxisLocation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var xAxisLocation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var stepX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.1;
      var stepY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0.1;
      var fontSize = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0.13;
      var showGrid = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : true;
      var color = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : [1, 1, 1, 0];
      var gridColor = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : [1, 1, 1, 0];
      var location = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      var decimalPlaces = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : 1;
      var lineWidth = 0.01;
      var xProps = new _DiagramElements_Plot_AxisProperties__WEBPACK_IMPORTED_MODULE_16__["AxisProperties"]('x', 0);
      xProps.minorTicks.mode = 'off';
      xProps.minorGrid.mode = 'off';
      xProps.majorGrid.mode = 'off';
      xProps.length = width;
      xProps.width = lineWidth;
      xProps.limits = {
        min: limits.left,
        max: limits.right
      };
      xProps.color = color.slice();
      xProps.title = '';
      xProps.majorTicks.start = limits.left;
      xProps.majorTicks.step = stepX;
      xProps.majorTicks.length = lineWidth * 5;
      xProps.majorTicks.offset = -xProps.majorTicks.length / 2;
      xProps.majorTicks.width = lineWidth * 2;
      xProps.majorTicks.labelMode = 'off';
      xProps.majorTicks.labels = _tools_mathtools__WEBPACK_IMPORTED_MODULE_4__["range"](xProps.limits.min, xProps.limits.max, stepX).map(function (v) {
        return v.toFixed(decimalPlaces);
      }).map(function (v) {
        if (v === yAxisLocation.toString() && yAxisLocation === xAxisLocation) {
          return "".concat(v, "     ");
        }

        return v;
      }); // xProps.majorTicks.labels[xProps.majorTicks.labels / 2] = '   0';

      xProps.majorTicks.labelOffset = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, xProps.majorTicks.offset - fontSize * 0.1);
      xProps.majorTicks.labelsHAlign = 'center';
      xProps.majorTicks.labelsVAlign = 'top';
      xProps.majorTicks.fontColor = color.slice();
      xProps.majorTicks.fontSize = fontSize;
      xProps.majorTicks.fontWeight = '400';
      var xAxis = new _DiagramElements_Plot_Axis__WEBPACK_IMPORTED_MODULE_17__["default"](this.webgl, this.draw2D, xProps, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, 1).rotate(0).translate(0, xAxisLocation - limits.bottom * height / 2), this.limits);
      var yProps = new _DiagramElements_Plot_AxisProperties__WEBPACK_IMPORTED_MODULE_16__["AxisProperties"]('x', 0);
      yProps.minorTicks.mode = 'off';
      yProps.minorGrid.mode = 'off';
      yProps.majorGrid.mode = 'off';
      yProps.length = height;
      yProps.width = xProps.width;
      yProps.limits = {
        min: limits.bottom,
        max: limits.top
      };
      yProps.color = xProps.color;
      yProps.title = '';
      yProps.rotation = Math.PI / 2;
      yProps.majorTicks.step = stepY;
      yProps.majorTicks.start = limits.bottom;
      yProps.majorTicks.length = xProps.majorTicks.length;
      yProps.majorTicks.offset = -yProps.majorTicks.length / 2;
      yProps.majorTicks.width = xProps.majorTicks.width;
      yProps.majorTicks.labelMode = 'off';
      yProps.majorTicks.labels = _tools_mathtools__WEBPACK_IMPORTED_MODULE_4__["range"](yProps.limits.min, yProps.limits.max, stepY).map(function (v) {
        return v.toFixed(decimalPlaces);
      }).map(function (v) {
        if (v === xAxisLocation.toString() && yAxisLocation === xAxisLocation) {
          return '';
        }

        return v;
      }); // yProps.majorTicks.labels[3] = '';

      yProps.majorTicks.labelOffset = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](yProps.majorTicks.offset - fontSize * 0.2, 0);
      yProps.majorTicks.labelsHAlign = 'right';
      yProps.majorTicks.labelsVAlign = 'middle';
      yProps.majorTicks.fontColor = xProps.majorTicks.fontColor;
      yProps.majorTicks.fontSize = fontSize;
      yProps.majorTicks.fontWeight = xProps.majorTicks.fontWeight;
      var yAxis = new _DiagramElements_Plot_Axis__WEBPACK_IMPORTED_MODULE_17__["default"](this.webgl, this.draw2D, yProps, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, 1).rotate(0).translate(yAxisLocation - limits.left * width / 2, 0), this.limits);
      var transform = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();

      if (location instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"]) {
        transform = transform.translate(location.x, location.y);
      } else {
        transform = location._dup();
      }

      var xy = this.collection(transform);

      if (showGrid) {
        var gridLines = this.grid(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](0, 0, width, height), _tools_mathtools__WEBPACK_IMPORTED_MODULE_4__["roundNum"](stepX * width / limits.width, 8), _tools_mathtools__WEBPACK_IMPORTED_MODULE_4__["roundNum"](stepY * height / limits.height, 8), 1, gridColor, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(1, 1).rotate(0).translate(0, 0));
        xy.add('grid', gridLines);
      }

      xy.add('y', yAxis);
      xy.add('x', xAxis);
      return xy;
    }
  }]);

  return DiagramPrimatives;
}();



/***/ }),

/***/ "./src/js/diagram/DrawContext2D.js":
/*!*****************************************!*\
  !*** ./src/js/diagram/DrawContext2D.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DrawContext2D =
/*#__PURE__*/
function () {
  function DrawContext2D(canvas) {
    _classCallCheck(this, DrawContext2D);

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    /* $FlowFixMe */

    var bsr = this.ctx.webkitBackingStorePixelRatio
    /* $FlowFixMe */
    || this.ctx.mozBackingStorePixelRatio
    /* $FlowFixMe */
    || this.ctx.msBackingStorePixelRatio
    /* $FlowFixMe */
    || this.ctx.oBackingStorePixelRatio
    /* $FlowFixMe */
    || this.ctx.backingStorePixelRatio || 1;
    var dpr = window.devicePixelRatio || 1;

    if (dpr === 1) {
      dpr = 2;
    }

    this.ratio = dpr / bsr;
    this.resize();
  }

  _createClass(DrawContext2D, [{
    key: "resize",
    value: function resize() {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.canvas.width = this.canvas.clientWidth * this.ratio;
      this.canvas.height = this.canvas.clientHeight * this.ratio;
      this.ctx.scale(this.ratio, this.ratio);
    }
  }, {
    key: "_dup",
    value: function _dup() {
      return this;
    }
  }]);

  return DrawContext2D;
}();

/* harmony default export */ __webpack_exports__["default"] = (DrawContext2D);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/DrawingObject.js":
/*!********************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/DrawingObject.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tools/g2 */ "./src/js/diagram/tools/g2.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

 // A Drawing object can be:
//  - GL primitive vertices
//  - Text object for 2D drawing contexts
//  - HTML Object in the diagram_html div
//
// It must have:
//
//   Properties:
//     - location     A reference location where relative boundaries are
//                    calculated from
//     - border       Array of borders in Diagram Units
//
//   Methods:
//     - drawWithTransformMatrix(transformMatrix)
//     - calcBorder(lastDrawTransformMatrix, glToDiagramTransform)
//

var DrawingObject =
/*#__PURE__*/
function () {
  // numPoints: number;           // Number of primative vertices
  // Border vertices
  // Border of any holes inside of main border
  function DrawingObject() {
    _classCallCheck(this, DrawingObject);

    // this.numPoints = 0;
    this.location = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    this.border = [[]];
    this.holeBorder = [[]];
  }

  _createClass(DrawingObject, [{
    key: "_dup",
    value: function _dup() {
      return this;
    } // eslint-disable-next-line class-methods-use-this, no-unused-vars

  }, {
    key: "setText",
    value: function setText(text) {}
  }, {
    key: "getGLBoundaries",
    value: function getGLBoundaries(lastDrawTransformMatrix) {
      var glBoundaries = [];
      this.border.forEach(function (boundary) {
        var glBorder = [];
        boundary.forEach(function (point) {
          glBorder.push(point.transformBy(lastDrawTransformMatrix));
        });
        glBoundaries.push(glBorder);
      });
      return glBoundaries;
    }
  }, {
    key: "getGLBoundaryHoles",
    value: function getGLBoundaryHoles(lastDrawTransformMatrix) {
      var glBoundaries = [];
      this.holeBorder.forEach(function (boundary) {
        var glBorder = [];
        boundary.forEach(function (point) {
          glBorder.push(point.transformBy(lastDrawTransformMatrix));
        });
        glBoundaries.push(glBorder);
      });
      return glBoundaries;
    }
    /* eslint-enable */

    /* eslint-disable class-methods-use-this, no-unused-vars */

  }, {
    key: "drawWithTransformMatrix",
    value: function drawWithTransformMatrix(transformMatrix, color, numPoints) {}
    /* eslint-enable */

  }, {
    key: "getGLBoundingRect",
    value: function getGLBoundingRect(lastDrawTransformMatrix) {
      var boundaries = this.getGLBoundaries(lastDrawTransformMatrix); // const min = new Point(0, 0);
      // const max = new Point(0, 0);
      // let firstPoint = true;
      // boundaries.forEach((boundary) => {
      //   boundary.forEach((point) => {
      //     if (firstPoint) {
      //       min.x = point.x;
      //       min.y = point.y;
      //       max.x = point.x;
      //       max.y = point.y;
      //       firstPoint = false;
      //     } else {
      //       min.x = point.x < min.x ? point.x : min.x;
      //       min.y = point.y < min.y ? point.y : min.y;
      //       max.x = point.x > max.x ? point.x : max.x;
      //       max.y = point.y > max.y ? point.y : max.y;
      //     }
      //   });
      // });
      // return new Rect(min.x, min.y, max.x - min.x, max.y - min.y);

      return Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["getBoundingRect"])(boundaries);
    }
  }, {
    key: "getVertexSpaceBoundingRect",
    value: function getVertexSpaceBoundingRect() {
      return Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["getBoundingRect"])(this.border);
    }
  }, {
    key: "getLocation",
    value: function getLocation() {
      return this.location;
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "getGLLocation",
    value: function getGLLocation(lastDrawTransformMatrix) {
      return this.getLocation().transformBy(lastDrawTransformMatrix);
    }
  }, {
    key: "getRelativeGLBoundingRect",
    value: function getRelativeGLBoundingRect(lastDrawTransformMatrix) {
      var glLocation = this.getGLLocation(lastDrawTransformMatrix);
      var glAbsoluteBoundaries = this.getGLBoundingRect(lastDrawTransformMatrix);
      var glRelativeBoundaries = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](glAbsoluteBoundaries.left - glLocation.x, glAbsoluteBoundaries.bottom - glLocation.y, glAbsoluteBoundaries.width, glAbsoluteBoundaries.height);
      return glRelativeBoundaries;
    }
  }, {
    key: "getRelativeVertexSpaceBoundingRect",
    value: function getRelativeVertexSpaceBoundingRect() {
      var absoluteBoundaries = this.getVertexSpaceBoundingRect();
      var relativeBoundaries = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](absoluteBoundaries.left - this.location.x, absoluteBoundaries.bottom - this.location.y, absoluteBoundaries.width, absoluteBoundaries.height);
      return relativeBoundaries;
    } // eslint-disable-next-line no-unused-vars, class-methods-use-this

  }, {
    key: "change",
    value: function change() {}
  }]);

  return DrawingObject;
}();

/* harmony default export */ __webpack_exports__["default"] = (DrawingObject);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/HTMLObject/HTMLObject.js":
/*!****************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/HTMLObject/HTMLObject.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _DrawingObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../DrawingObject */ "./src/js/diagram/DrawingObjects/DrawingObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// import * as m2 from '../tools/m2';



var HTMLObject =
/*#__PURE__*/
function (_DrawingObject) {
  _inherits(HTMLObject, _DrawingObject);

  // diagramLimits: Rect;
  function HTMLObject(parentDiv, id, location) {
    var _this;

    var alignV = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'middle';
    var alignH = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'center';

    _classCallCheck(this, HTMLObject);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HTMLObject).call(this));
    var element = document.getElementById(id);

    if (element) {
      _this.element = element;
    }

    _this.location = location;
    _this.alignV = alignV;
    _this.alignH = alignH;
    _this.parentDiv = parentDiv;
    _this.show = true;

    _this.setBorder();

    return _this;
  }

  _createClass(HTMLObject, [{
    key: "_dup",
    value: function _dup() {
      var c = new HTMLObject(this.parentDiv, this.id, this.location._dup(), this.alignV, this.alignH);
      c.show = this.show;
      c.border = this.border.map(function (b) {
        return b.map(function (p) {
          return p._dup();
        });
      });
      return c;
    }
  }, {
    key: "setBorder",
    value: function setBorder() {
      var parentRect = this.parentDiv.getBoundingClientRect();
      var elementRect = this.element.getBoundingClientRect();
      var left = elementRect.left - parentRect.left;
      var right = left + elementRect.width;
      var top = elementRect.top - parentRect.top;
      var bottom = top + elementRect.height;
      var boundary = [];
      boundary.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](left, top));
      boundary.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](right, top));
      boundary.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](right, bottom));
      boundary.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](left, bottom));
      this.border = [];
      this.border.push(boundary);
    }
  }, {
    key: "getGLBoundaries",
    value: function getGLBoundaries() {
      var parentRect = this.parentDiv.getBoundingClientRect();
      var glSpace = {
        x: {
          bottomLeft: -1,
          width: 2
        },
        y: {
          bottomLeft: -1,
          height: 2
        }
      };
      var pixelSpace = {
        x: {
          bottomLeft: 0,
          width: parentRect.width
        },
        y: {
          bottomLeft: parentRect.height,
          height: -parentRect.height
        }
      };
      var pixelToGLTransform = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["spaceToSpaceTransform"])(pixelSpace, glSpace);
      var elementRect = this.element.getBoundingClientRect();
      var left = elementRect.left - parentRect.left;
      var right = left + elementRect.width;
      var top = elementRect.top - parentRect.top;
      var bottom = top + elementRect.height;
      var boundary = [];
      boundary.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](left, top));
      boundary.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](right, top));
      boundary.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](right, bottom));
      boundary.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](left, bottom));
      return [boundary.map(function (p) {
        return p.transformBy(pixelToGLTransform.matrix());
      })];
    }
  }, {
    key: "glToPixelSpace",
    value: function glToPixelSpace(p) {
      var x = (p.x - -1) / 2 * this.parentDiv.offsetWidth;
      var y = (1 - p.y) / 2 * this.parentDiv.offsetHeight;
      return new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](x, y);
    }
  }, {
    key: "change",
    value: function change(newHtml, lastDrawTransformMatrix) {
      var element = newHtml;

      if (typeof newHtml === 'string') {
        element = document.createElement('div');
        element.innerHTML = newHtml;
      }

      if (element instanceof HTMLElement) {
        this.element.innerHTML = '';
        this.element.appendChild(element);
        this.transformHtml(lastDrawTransformMatrix);
      }
    }
  }, {
    key: "transformHtml",
    value: function transformHtml(transformMatrix) {
      if (this.show) {
        var glLocation = this.location.transformBy(transformMatrix);
        var pixelLocation = this.glToPixelSpace(glLocation);
        var w = this.element.offsetWidth;
        var h = this.element.offsetHeight;
        var left = 0;
        var top = 0;

        if (this.alignH === 'center') {
          left = -w / 2;
        } else if (this.alignH === 'right') {
          left = -w;
        }

        if (this.alignV === 'middle') {
          top = -h / 2;
        } else if (this.alignV === 'bottom') {
          top = -h;
        }

        var x = pixelLocation.x + left;
        var y = pixelLocation.y + top;
        this.element.style.position = 'absolute';
        this.element.style.left = "".concat(x, "px");
        this.element.style.top = "".concat(y, "px");
      } else {
        this.element.style.position = 'absolute';
        this.element.style.left = '-10000px';
        this.element.style.top = '-10000px'; // console.trace()
      }
    }
  }, {
    key: "drawWithTransformMatrix",
    value: function drawWithTransformMatrix(transformMatrix) {
      this.transformHtml(transformMatrix);
    }
  }]);

  return HTMLObject;
}(_DrawingObject__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (HTMLObject); // Transform -1 to 1 space to 0 to width/height space

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/TextObject/TextObject.js":
/*!****************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/TextObject/TextObject.js ***!
  \****************************************************************/
/*! exports provided: TextObject, DiagramText, DiagramFont */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextObject", function() { return TextObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiagramText", function() { return DiagramText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiagramFont", function() { return DiagramFont; });
/* harmony import */ var _tools_m2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/m2 */ "./src/js/diagram/tools/m2.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _DrawingObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../DrawingObject */ "./src/js/diagram/DrawingObjects/DrawingObject.js");
/* harmony import */ var _DrawContext2D__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../DrawContext2D */ "./src/js/diagram/DrawContext2D.js");
/* harmony import */ var _tools_tools__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../tools/tools */ "./src/js/tools/tools.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }







function colorArrayToString(color) {
  return "rgba(".concat(Math.floor(color[0] * 255), ",").concat(Math.floor(color[1] * 255), ",").concat(Math.floor(color[2] * 255), ",").concat(color[3], ")");
} // DiagramFont defines the font properties to be used in a TextObject


var DiagramFont =
/*#__PURE__*/
function () {
  function DiagramFont() {
    var family = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Helvetica Neue';
    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var weight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '200';
    var alignH = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'center';
    var alignV = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'middle';
    var color = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;

    _classCallCheck(this, DiagramFont);

    this.family = family;
    this.style = style;
    this.size = size;
    this.weight = weight;
    this.alignH = alignH;
    this.alignV = alignV;
    this.setColor(color); // if (Array.isArray(color)) {
    //   this.color = colorArrayToString(color);
    // } else {
    //   this.color = color;
    // }
  }

  _createClass(DiagramFont, [{
    key: "setColor",
    value: function setColor() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (Array.isArray(color)) {
        this.color = colorArrayToString(color);
      } else {
        this.color = color;
      }
    }
  }, {
    key: "set",
    value: function set(ctx) {
      var scalingFactor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      ctx.font = "".concat(this.style, " ").concat(this.weight, " ").concat(this.size * scalingFactor, "px ").concat(this.family);
      ctx.textAlign = this.alignH;
      ctx.textBaseline = this.alignV;
    }
  }, {
    key: "_dup",
    value: function _dup() {
      return new DiagramFont(this.family, this.style, this.size, this.weight, this.alignH, this.alignV, this.color);
    }
  }]);

  return DiagramFont;
}(); // DiagramText is a single text element of the diagram that is drawn at
// once and referenced to the same location


var DiagramText =
/*#__PURE__*/
function () {
  function DiagramText() {
    var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](0, 0);
    var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var font = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new DiagramFont();

    _classCallCheck(this, DiagramText);

    this.location = location._dup();
    this.text = text.slice();
    this.font = font._dup();
  }

  _createClass(DiagramText, [{
    key: "_dup",
    value: function _dup() {
      return new DiagramText(this.location._dup(), this.text, this.font._dup());
    }
  }]);

  return DiagramText;
}(); // TextObject is the DrawingObject used in the DiagramElementPrimative.
// TextObject will draw an array of DiagramText objects.


var TextObject =
/*#__PURE__*/
function (_DrawingObject) {
  _inherits(TextObject, _DrawingObject);

  function TextObject(drawContext2D) {
    var _this;

    var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, TextObject);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextObject).call(this));
    _this.drawContext2D = drawContext2D;
    _this.text = text;
    _this.scalingFactor = 1;

    if (text.length > 0) {
      var minSize = _this.text[0].font.size;

      _this.text.forEach(function (t) {
        if (t.font.size > 0 && t.font.size < minSize) {
          minSize = t.font.size;
        }
      });

      if (minSize < 20) {
        _this.scalingFactor = minSize * 50;
      }

      if (minSize < 1) {
        var power = -Math.log10(minSize) + 2;
        _this.scalingFactor = Math.pow(10, power);
      }
    }

    _this.setBorder();

    return _this;
  }

  _createClass(TextObject, [{
    key: "setText",
    value: function setText(text) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.text[index].text = text;
      this.setBorder();
    }
  }, {
    key: "_dup",
    value: function _dup() {
      var c = new TextObject(this.drawContext2D, this.text);
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_4__["duplicateFromTo"])(this, c);
      c.scalingFactor = this.scalingFactor;
      c.border = this.border.map(function (b) {
        return b.map(function (p) {
          return p._dup();
        });
      });
      return c;
    }
  }, {
    key: "setFont",
    value: function setFont(fontSize) {
      for (var i = 0; i < this.text.length; i += 1) {
        this.text[i].font.size = fontSize;
      }

      this.setBorder();
    }
  }, {
    key: "setColor",
    value: function setColor(color) {
      var c = colorArrayToString(color);

      for (var i = 0; i < this.text.length; i += 1) {
        this.text[i].font.color = c;
      }
    }
  }, {
    key: "draw",
    value: function draw(translation, rotation, scale, count, color) {
      var transformation = _tools_m2__WEBPACK_IMPORTED_MODULE_0__["identity"]();
      transformation = _tools_m2__WEBPACK_IMPORTED_MODULE_0__["translate"](transformation, translation.x, translation.y);
      transformation = _tools_m2__WEBPACK_IMPORTED_MODULE_0__["rotate"](transformation, rotation);
      transformation = _tools_m2__WEBPACK_IMPORTED_MODULE_0__["scale"](transformation, scale.x, scale.y);
      this.drawWithTransformMatrix(_tools_m2__WEBPACK_IMPORTED_MODULE_0__["t"](transformation), color);
    } // Text is drawn in pixel space which is 0, 0 in the left hand top corner on
    // a canvas of size canvas.offsetWidth x canvas.offsetHeight.
    //
    // Font size and text location is therefore defined in pixels.
    //
    // However, in a Diagram, the text canvas is overlaid on the diagram GL
    // canvas and we want to think about the size and location of text in
    // Diagram Space or Element Space (if the element has a specific transform).
    //
    // For example, if we have a diagram with limits: min: (0, 0), max(2, 1)
    // with a canvas of 1000 x 500 then:
    //    1) Transform pixel space (1000 x 500) to be GL Space (2 x 2). i.e.
    //         - Magnify pixel space by 500 so one unit in the 2D drawing
    //           context is equivalent to 1 unit in GL Space.
    //         - Translate pixel space so 0, 0 is in the middle of the canvas
    //    2) Transform GL Space to Element Space
    //         - The transform matrix in the input parameters includes the
    //           transform to Diagram Space and then Element Space.
    //         - Now one unit in the 2D drawing context is equivalent to 1 unit
    //           in Element Space - i.e. the canvas will have limits of min(0, 0)
    //           and max(2, 1).
    //    3) Plot out all text
    //
    // However, when font size is defined in Element Space, and ends up being
    // <1 Element Space units, we have a problem. This is because font size is
    // still in pixels (just now it's super scaled up). Therefore, a scaling
    // factor is needed to make sure the font size can stay well above 1. This
    // scaling factor scales the final space, so a larger font size can be used.
    // Then all locations definted in Element Space also need to be scaled by
    // this scaling factor.
    //
    // The scaling factor can be number that is large enough to make it so the
    // font size is >>1. In the TextObject constructor, the scaling factor is
    // designed to ensure drawn text always is >20px.

  }, {
    key: "drawWithTransformMatrix",
    value: function drawWithTransformMatrix(transformMatrix) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [1, 1, 1, 1];
      var ctx = this.drawContext2D.ctx; // Arbitrary scaling factor used to ensure font size is >> 1 pixel
      // const scalingFactor = this.drawContext2D.canvas.offsetHeight /
      //                       (this.diagramLimits.height / 1000);

      var scalingFactor = this.scalingFactor; // Color used if color is not defined in each DiagramText element

      var parentColor = "rgba(\n      ".concat(Math.floor(color[0] * 255), ",\n      ").concat(Math.floor(color[1] * 255), ",\n      ").concat(Math.floor(color[2] * 255), ",\n      ").concat(Math.floor(color[3] * 255), ")");
      ctx.save(); // First convert pixel space to a zoomed in pixel space with the same
      // dimensions as gl clip space (-1 to 1 for x, y), but inverted y
      // like to pixel space.
      // When zoomed: 1 pixel = 1 GL unit.
      // Zoom in so limits betcome 0 to 2:

      var sx = this.drawContext2D.canvas.offsetWidth / 2 / scalingFactor;
      var sy = this.drawContext2D.canvas.offsetHeight / 2 / scalingFactor; // Translate so limits become -1 to 1

      var tx = this.drawContext2D.canvas.offsetWidth / 2;
      var ty = this.drawContext2D.canvas.offsetHeight / 2; // Modify the incoming transformMatrix to be compatible with zoomed
      // pixel space
      //   - Scale by the scaling factor
      //   - Flip the y translation
      //   - Reverse rotation

      var tm = transformMatrix;
      var t = [tm[0], -tm[1], tm[2] * scalingFactor, -tm[3], tm[4], tm[5] * -scalingFactor, 0, 0, 1]; // Combine the zoomed pixel space with the incoming transform matrix
      // and apply it to the drawing context.

      var totalT = _tools_m2__WEBPACK_IMPORTED_MODULE_0__["mul"]([sx, 0, tx, 0, sy, ty, 0, 0, 1], t);
      ctx.transform(totalT[0], totalT[3], totalT[1], totalT[4], totalT[2], totalT[5]); // Fill in all the text

      this.text.forEach(function (diagramText) {
        diagramText.font.set(ctx, scalingFactor);

        if (diagramText.font.color) {
          ctx.fillStyle = diagramText.font.color;
        } else {
          ctx.fillStyle = parentColor;
        }

        ctx.fillText(diagramText.text, diagramText.location.x * scalingFactor, diagramText.location.y * -scalingFactor);
      });
      ctx.restore();
    }
  }, {
    key: "getGLBoundaries",
    value: function getGLBoundaries(lastDrawTransformMatrix) {
      var _this2 = this;

      var glBoundaries = [];
      this.text.forEach(function (t) {
        glBoundaries.push(_this2.getGLBoundaryOfText(t, lastDrawTransformMatrix));
      });
      return glBoundaries;
    }
  }, {
    key: "setBorder",
    value: function setBorder() {
      var _this3 = this;

      this.border = [];
      this.text.forEach(function (t) {
        _this3.border.push(_this3.getBoundaryOfText(t));
      }); // return glBoundaries;
    } // This method is used instead of the actual ctx.measureText because
    // Firefox and Chrome don't yet support it's advanced features.
    // Estimates are made for height based on width.
    // eslint-disable-next-line class-methods-use-this

  }, {
    key: "measureText",
    value: function measureText(ctx, text) {
      var aWidth = ctx.measureText('a').width; // Estimations of FONT ascent and descent for a baseline of "alphabetic"

      var ascent = aWidth * 1.4;
      var descent = aWidth * 0.08; // Uncomment below and change above consts to lets if more resolution on
      // actual text boundaries is needed
      // const maxAscentRe =
      //   /[ABCDEFGHIJKLMNOPRSTUVWXYZ1234567890!#%^&()@$Qbdtfhiklj]/g;

      var midAscentRe = /[acemnorsuvwxz*gyqp]/g;
      var midDecentRe = /[;,$]/g;
      var maxDescentRe = /[gjyqp@Q(){}[\]|]/g;
      var midAscentMatches = text.text.match(midAscentRe);

      if (Array.isArray(midAscentMatches)) {
        if (midAscentMatches.length === text.text.length) {
          ascent = aWidth * 0.95;
        }
      }

      var midDescentMatches = text.text.match(midDecentRe);

      if (Array.isArray(midDescentMatches)) {
        if (midDescentMatches.length > 0) {
          descent = aWidth * 0.2;
        }
      }

      var maxDescentMatches = text.text.match(maxDescentRe);

      if (Array.isArray(maxDescentMatches)) {
        if (maxDescentMatches.length > 0) {
          descent = aWidth * 0.5;
        }
      }

      var height = ascent + descent;

      var _ctx$measureText = ctx.measureText(text.text),
          width = _ctx$measureText.width;

      var asc = 0;
      var des = 0;
      var left = 0;
      var right = 0;

      if (text.font.alignH === 'left') {
        right = width;
      }

      if (text.font.alignH === 'center') {
        left = width / 2;
        right = width / 2;
      }

      if (text.font.alignH === 'right') {
        left = width;
      }

      if (text.font.alignV === 'alphabetic') {
        asc = ascent;
        des = descent;
      }

      if (text.font.alignV === 'top') {
        asc = 0;
        des = height;
      }

      if (text.font.alignV === 'bottom') {
        asc = height;
        des = 0;
      }

      if (text.font.alignV === 'middle') {
        asc = height / 2;
        des = height / 2;
      }

      return {
        actualBoundingBoxLeft: left,
        actualBoundingBoxRight: right,
        fontBoundingBoxAscent: asc,
        fontBoundingBoxDescent: des
      };
    }
  }, {
    key: "getBoundaryOfText",
    value: function getBoundaryOfText(text) {
      var boundary = [];
      var scalingFactor = this.scalingFactor; // Measure the text

      text.font.set(this.drawContext2D.ctx, scalingFactor); // const textMetrics = this.drawContext2D.ctx.measureText(text.text);

      var textMetrics = this.measureText(this.drawContext2D.ctx, text); // Create a box around the text

      var location = text.location;
      var box = [new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](-textMetrics.actualBoundingBoxLeft / scalingFactor, textMetrics.fontBoundingBoxAscent / scalingFactor).add(location), new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](textMetrics.actualBoundingBoxRight / scalingFactor, textMetrics.fontBoundingBoxAscent / scalingFactor).add(location), new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](textMetrics.actualBoundingBoxRight / scalingFactor, -textMetrics.fontBoundingBoxDescent / scalingFactor).add(location), new _tools_g2__WEBPACK_IMPORTED_MODULE_1__["Point"](-textMetrics.actualBoundingBoxLeft / scalingFactor, -textMetrics.fontBoundingBoxDescent / scalingFactor).add(location)];
      box.forEach(function (p) {
        boundary.push(p);
      }); // console.log('boundary', boundary.width, text.text)

      return boundary;
    }
  }, {
    key: "getGLBoundaryOfText",
    value: function getGLBoundaryOfText(text, lastDrawTransformMatrix) {
      var glBoundary = []; // const { scalingFactor } = this;
      // // Measure the text
      // text.font.set(this.drawContext2D.ctx, scalingFactor);
      // // const textMetrics = this.drawContext2D.ctx.measureText(text.text);
      // const textMetrics = this.measureText(this.drawContext2D.ctx, text);
      // // Create a box around the text
      // const { location } = text;
      // const box = [
      //   new Point(
      //     -textMetrics.actualBoundingBoxLeft / scalingFactor,
      //     textMetrics.fontBoundingBoxAscent / scalingFactor,
      //   ).add(location),
      //   new Point(
      //     textMetrics.actualBoundingBoxRight / scalingFactor,
      //     textMetrics.fontBoundingBoxAscent / scalingFactor,
      //   ).add(location),
      //   new Point(
      //     textMetrics.actualBoundingBoxRight / scalingFactor,
      //     -textMetrics.fontBoundingBoxDescent / scalingFactor,
      //   ).add(location),
      //   new Point(
      //     -textMetrics.actualBoundingBoxLeft / scalingFactor,
      //     -textMetrics.fontBoundingBoxDescent / scalingFactor,
      //   ).add(location),
      // ];

      var box = this.getBoundaryOfText(text);
      box.forEach(function (p) {
        glBoundary.push(p.transformBy(lastDrawTransformMatrix));
      });
      return glBoundary;
    }
  }]);

  return TextObject;
}(_DrawingObject__WEBPACK_IMPORTED_MODULE_2__["default"]);



/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/PolyLineTriangles.js":
/*!*************************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/PolyLineTriangles.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");


function simpleIntersect(p1, p2, q1, q2) {
  var lineP = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Line"](p1, p2);
  var lineQ = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Line"](q1, q2);
  return lineP.intersectsWith(lineQ).intersect;
} // Generate a thick line assuming gl.TRIANGLES where corners are sharp.
// Input:
//   * coords: an array of points that will define the center of the line


function polyLineTriangles(coords, close, width) {
  var points = [];
  var innerBorder = [];
  var outerBorder = [];
  var line1Pairs = [];
  var line2Pairs = [];
  var halfWidth = width / 2;
  var p;
  var q;

  if (close) {
    coords.push(coords[0]);
  } // got through the points that define the center of the line, and generate
  // offset lines on either side of them (named Line1 and Line2).


  for (var i = 1; i < coords.length; i += 1) {
    p = coords[i - 1]; // center line point 1

    q = coords[i]; // center line point 2

    var angle = Math.atan2(q.y - p.y, q.x - p.x);
    var offset1 = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](halfWidth * Math.cos(angle + Math.PI / 2), halfWidth * Math.sin(angle + Math.PI / 2));
    var offset2 = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](halfWidth * Math.cos(angle - Math.PI / 2), halfWidth * Math.sin(angle - Math.PI / 2));
    line1Pairs.push([p.add(offset1), q.add(offset1)]); // Offset line 1

    line2Pairs.push([p.add(offset2), q.add(offset2)]); // Offset line 2
  } // If the line closes on itself, then find the intersection point of
  // the first and last offset lines.
  // p and q will represent the first points of offset lines 1 and 2.


  if (close) {
    // intersection point of first and last offset 1 lines
    p = simpleIntersect(line1Pairs[0][0], line1Pairs[0][1], line1Pairs[line1Pairs.length - 1][0], line1Pairs[line1Pairs.length - 1][1]); // intersection point of first and last offset 2 lines

    q = simpleIntersect(line2Pairs[0][0], line2Pairs[0][1], line2Pairs[line1Pairs.length - 1][0], line2Pairs[line2Pairs.length - 1][1]);
  } else {
    // if not closing on itself, then the first point is simply the first
    // point of the offset lines.
    p = line1Pairs[0][0]; // eslint-disable-line prefer-destructuring

    q = line2Pairs[0][0]; // eslint-disable-line prefer-destructuring
  } // The line effectively has two borders (named an inside and outside border)
  // but the inner border isn't necessarily the INSIDE border, it is just a
  // name.
  // p and q are the first points of the borders.


  innerBorder.push(p._dup());
  outerBorder.push(q._dup()); // Go through all offset lines, calculate their intersection points
  // and from them calculate the triangle and border points.

  for (var _i = 1; _i < line1Pairs.length; _i += 1) {
    // First two points of the Triangle 1 are the two ending points
    // of the last line segment
    points.push(p.x);
    points.push(p.y);
    points.push(q.x);
    points.push(q.y); // Next points are the intersection between the first line and the second line

    p = simpleIntersect(line1Pairs[_i - 1][0], line1Pairs[_i - 1][1], line1Pairs[_i][0], line1Pairs[_i][1]);
    q = simpleIntersect(line2Pairs[_i - 1][0], line2Pairs[_i - 1][1], line2Pairs[_i][0], line2Pairs[_i][1]); // Push the next points to the border

    innerBorder.push(p._dup());
    outerBorder.push(q._dup()); // Finish triangle 1

    points.push(q.x);
    points.push(q.y); // Make triangle 2

    points.push(points[points.length - 6]);
    points.push(points[points.length - 6]);
    points.push(q.x);
    points.push(q.y);
    points.push(p.x);
    points.push(p.y);
  } // Calculate the last end points


  var endp;
  var endq; // In not closing the polyline, the end points are just the last offset
  // line points

  if (!close) {
    endp = line1Pairs[line1Pairs.length - 1][1]; // eslint-disable-line prefer-destructuring

    endq = line2Pairs[line2Pairs.length - 1][1]; // eslint-disable-line prefer-destructuring
    // If closing the polyline, then the end points are the start points
  } else {
    endp = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](points[0], points[1]);
    endq = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](points[2], points[3]);
  } // Close out the last two triangles


  points.push(p.x); // Last two points of last line segment

  points.push(p.y);
  points.push(q.x);
  points.push(q.y);
  points.push(endq.x);
  points.push(endq.y);
  points.push(p.x); // Last triangle

  points.push(p.y);
  points.push(endq.x);
  points.push(endq.y);
  points.push(endp.x);
  points.push(endp.y);
  innerBorder.push(endp._dup());
  outerBorder.push(endq._dup()); // If closing, then remove the last duplicate coord as it was added by this
  // function

  if (close) {
    coords.pop();
  } // Form the border array


  var border = []; // If the poly line is closed, only one of the offset lines is the outside
  // border. If open, then both are the border.

  if (close) {
    if (innerBorder[0].isInPolygon(outerBorder)) {
      border = outerBorder;
    } else {
      border = innerBorder;
    }
  } else {
    border.push(innerBorder[0]);

    for (var _i2 = 0; _i2 < outerBorder.length; _i2 += 1) {
      border.push(outerBorder[_i2]);
    }

    for (var _i3 = innerBorder.length - 1; _i3 >= 0; _i3 -= 1) {
      border.push(innerBorder[_i3]);
    }
  }

  return {
    points: points,
    border: border
  };
}

/* harmony default export */ __webpack_exports__["default"] = (polyLineTriangles);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/PolyLineTriangles3.js":
/*!**************************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/PolyLineTriangles3.js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return polyLineTriangles3; });
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
 // function simpleIntersect(p1: Point, p2: Point, q1: Point, q2: Point) {
//   const lineP = new Line(p1, p2);
//   const lineQ = new Line(q1, q2);
//   return lineP.intersectsWith(lineQ).intersect;
// }

// Generate a thick line assuming gl.TRIANGLES where corners are sharp.
// Input:
//   * coords: an array of points that will define the center of the line
function polyLineTriangles3(coords, close, width, borderToPoint) {
  var points = [];
  var border1 = []; // outside (vertex) when anticlockwise

  var border2 = []; // outside (vertex) when clockwise
  // const angleDir = [];    // -1 is anti-clockwise, +1 clockwise
  // const vertices = [];
  // class Vertex {
  //   point: Point;
  //   pre: ?Vertex;
  //   post: ?Vertex;
  //   dir: number;
  //   preAngle: ?number;
  //   postAngle: ?number;
  //   preLength: ?number;
  //   postLength: ?number;
  //   innerAngle: ?number
  //   constructor(point) {
  //     this.point = point;
  //     this.pre = null;
  //     this.post = null;
  //     this.dir = 0;
  //     this.preAngle = null;
  //     this.postAngle = null;
  //     this.preLength = null;
  //     this.postLength = null;
  //     this.minAngle = null;
  //   }
  // }
  // function calcAngleDir(
  //   pre: Point,
  //   mid: Point,
  //   post: Point,
  // ) {
  //   const midPost = post.sub(mid).toPolar();
  //   const midPre = pre.sub(mid).toPolar();
  //   const midPostUnit = polarToRect(1, midPost.angle);
  //   const midPreUnit = polarToRect(1, midPre.angle);
  //   const minAngle = minAngleDiff(midPost.angle, midPre.angle);
  //   let direction = Math.sin(minAngle);
  //   if (direction < 0) {
  //     direction = -1;
  //   } else if (direction > 0) {
  //     direction = 1;
  //   }
  //   const vertex = new Vertex(mid);
  //   vertex.dir = direction;
  //   vertex.preAngle = midPre.angle;
  //   vertex.postAngle = midPost.angle;
  //   vertex.preLength = midPre.mag;
  //   vertex.postLength = midPost.mag;
  //   vertex.minAngle = minAngle;
  //   vertices.push(vertex);
  // }
  // if (close) {
  //   calcAngleDir(coords[coords.length - 1], coords[0], coords[1]);
  // } else {
  //   angleDir.push(0);
  // }
  // for (let i = 1; i < coords.length - 1; i += 1) {
  //   calcAngleDir(coords[i - 1], coords[i], coords[i + 1]);
  // }
  // if (close) {
  //   calcAngleDir(coords[coords.length - 2], coords[coords.length - 1], coords[0]);
  // } else {
  //   angleDir.push(0);
  // }
  // console.log("Direction", vertices.map(v => v.dir))
  // console.log("PreLine Angle", vertices.map(v => v.preAngle).map(a => a * 180 / Math.PI))
  // console.log("PostLine Angle", vertices.map(v => v.postAngle).map(a => a * 180 / Math.PI))
  // console.log("InnerAngle", cornerAngle.map(a => a * 180 / Math.PI))
  // console.log(preLineLength)
  // got through the points that define the outside border of the line, and generate
  // offset lines on one side of them (named Line1 and Line2).
  // function findBorderAnglesConstantCornerWidth(
  //   preIndex: Point | null,
  //   midIndex: Point,
  //   postIndex: Point | null,
  // ) {
  //   const post = coords[postIndex];
  //   const mid = coords[midIndex];
  //   const pre = coords[preIndex];
  //   let innerAngle = 0;
  //   let direction = 0;
  //   if (pre != null && post != null) {
  //     const midPost = post.sub(mid).toPolar();
  //     const midPre = pre.sub(mid).toPolar();
  //     const midPostUnit = polarToRect(1, midPost.angle);
  //     const midPreUnit = polarToRect(1, midPre.angle);
  //     innerAngle = midPostUnit.add(midPreUnit).toPolar().angle || 0.00001;
  //     direction = Math.sin(midPost.angle - midPre.angle);
  //   } else if (pre == null && post != null) {
  //     const midPost = post.sub(mid).toPolar();
  //     innerAngle = midPost.angle - Math.PI / 2;
  //     direction = -1;
  //   } else if (post == null && pre != null) {
  //     const midPre = pre.sub(mid).toPolar();
  //     innerAngle = midPre.angle - Math.PI / 2;
  //     direction = 1;
  //   }
  //   let corner1 = polarToRect(width / 2, innerAngle).add(mid);
  //   let corner2 = polarToRect(width / 2, innerAngle + Math.PI).add(mid);
  //   if (direction < 0) {
  //     corner2 = polarToRect(width / 2, innerAngle).add(mid);
  //     corner1 = polarToRect(width / 2, innerAngle + Math.PI).add(mid);
  //   }
  //   border1.push(corner1);
  //   border2.push(corner2);
  // }

  function findBorderAngles(preIndex, midIndex, postIndex) {
    var post = postIndex == null ? null : coords[postIndex];
    var mid = coords[midIndex];
    var pre = preIndex == null ? null : coords[preIndex];
    var innerAngle = 0;
    var cornerR = width / 2;
    var direction = 0;
    var minAngle = 0;

    if (pre != null && post != null) {
      var midPost = post.sub(mid).toPolar();
      var midPre = pre.sub(mid).toPolar();
      var midPostUnit = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(1, midPost.angle);
      var midPreUnit = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(1, midPre.angle);
      innerAngle = midPostUnit.add(midPreUnit).toPolar().angle || 0.00001;
      minAngle = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["minAngleDiff"])(midPostUnit.toPolar().angle, midPreUnit.toPolar().angle);
      cornerR = Math.abs(width / 2 / Math.sin(innerAngle - midPost.angle));
      direction = Math.sin(midPost.angle - midPre.angle);
    } else if (pre == null && post != null) {
      var _midPost = post.sub(mid).toPolar();

      innerAngle = _midPost.angle - Math.PI / 2;
      cornerR = Math.abs(width / 2 / Math.sin(innerAngle - _midPost.angle));
      direction = 1;
    } else if (post == null && pre != null) {
      var _midPre = pre.sub(mid).toPolar();

      innerAngle = _midPre.angle - Math.PI / 2 + Math.PI;
      cornerR = Math.abs(width / 2 / Math.sin(innerAngle - _midPre.angle));
      direction = 1;
    } // cornerR = Math.min(cornerR, width * 2)


    var innerRadius = Math.min(cornerR, width * 6);
    var outerRadius = Math.min(cornerR, width * 2);
    var finalInnerRadius = innerRadius;
    var finalOuterRadius = outerRadius;

    if (borderToPoint === 'alwaysOn') {
      finalInnerRadius = innerRadius + outerRadius;
      finalOuterRadius = 0;
    }

    if (borderToPoint === 'onSharpAnglesOnly') {
      finalInnerRadius = innerRadius + outerRadius;
      finalOuterRadius = 0; // const minAngle = minAngleDiff(midPostUnit.angle, midPreUnit.angle);

      var sharpAngleThreshold = Math.PI * 0.9;

      if (Math.abs(minAngle) > sharpAngleThreshold) {
        var percent = Math.sin(Math.abs(minAngle)) / Math.sin(sharpAngleThreshold);
        finalInnerRadius = innerRadius + outerRadius * percent;
        finalOuterRadius = outerRadius * (1 - percent);
      }
    }

    var corner1 = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(finalInnerRadius, innerAngle).add(mid);
    var corner2 = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(finalOuterRadius, innerAngle + Math.PI).add(mid); // const delta = corner2.sub(mid);
    // // console.log(delta);
    // corner2 = corner2.sub(delta);
    // corner1 = corner1.sub(delta);

    if (direction < 0) {
      corner2 = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(finalInnerRadius, innerAngle).add(mid);
      corner1 = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(finalOuterRadius, innerAngle + Math.PI).add(mid);
    }

    border1.push(corner1);
    border2.push(corner2);
  } // function findBorderAnglesOutsideVertexFixed(
  //   preIndex: number | null,
  //   midIndex: number,
  //   postIndex: number | null,
  // ) {
  //   if (preIndex != null && postIndex != null) {
  //     const v = vertices[midIndex];
  //     v.pre = vertices[preIndex];
  //     v.post = vertices[postIndex];
  //     const { dir } = v;
  //     let vertex = v.point;
  //     const preDir = vertices[preIndex].dir;
  //     const postDir = vertices[postIndex].dir;
  //     let preBorderAngle = v.preAngle || 0;
  //     let postBorderAngle = v.postAngle || 0;
  //     if (preDir !== dir) {
  //       const midToBorderAngleDelta = Math.asin(width / v.preLength);
  //       preBorderAngle -= dir * midToBorderAngleDelta;
  //     }
  //     if (postDir !== dir) {
  //       const midToBorderAngleDelta = Math.asin(width / v.postLength);
  //       postBorderAngle += dir * midToBorderAngleDelta;
  //     }
  //     let angleDelta = Math.PI / 2;
  //     if (dir === -1) {
  //       angleDelta = -Math.PI / 2;
  //     }
  //     const pointOnPreInnerLine
  //       = vertex.add(polarToRect(width, preBorderAngle + angleDelta));
  //     const preInnerBorderLine = new Line(pointOnPreInnerLine, 1, preBorderAngle);
  //     const pointOnPostInnerLine
  //       = vertex.add(polarToRect(width, postBorderAngle - angleDelta));
  //     const postInnerBorderLine = new Line(pointOnPostInnerLine, 1, postBorderAngle);
  //     const intersection = postInnerBorderLine.intersectsWith(preInnerBorderLine);
  //     const intersectVector = intersection.intersect.sub(vertex).toPolar();
  //     const intersectMag = Math.min(intersectVector.mag, v.preLength, v.postLength);
  //     let innerCoord = vertex.add(polarToRect(intersectMag, intersectVector.angle));
  //     if (Math.abs(v.minAngle) > Math.PI / 2) {
  //       const offset = width / 2 * Math.cos(v.minAngle);
  //       vertex = vertex.add(polarToRect(offset, intersectVector.angle));
  //       innerCoord = innerCoord.add(polarToRect(offset, intersectVector.angle));
  //     }
  //     if (intersectMag < intersectVector.mag) {
  //       if (intersectMag === v.postLength) {
  //         const postBorderLine = new Line(vertex, 1, postBorderAngle);
  //         innerCoord = preInnerBorderLine.intersectsWith(postBorderLine).intersect;
  //       } else {
  //         const preBorderLine = new Line(vertex, 1, preBorderAngle);
  //         innerCoord = postInnerBorderLine.intersectsWith(preBorderLine).intersect;
  //       }
  //     }
  //     if (dir === -1) {
  //       border1.push(vertex);
  //       border2.push(innerCoord);
  //     } else {
  //       border1.push(innerCoord);
  //       border2.push(vertex);
  //     }
  //   }
  // }


  if (close) {
    findBorderAngles(coords.length - 1, 0, 1);
  } else {
    findBorderAngles(null, 0, 1);
  }

  for (var i = 1; i < coords.length - 1; i += 1) {
    findBorderAngles(i - 1, i, i + 1);
  }

  if (close) {
    findBorderAngles(coords.length - 2, coords.length - 1, 0);
  } else {
    findBorderAngles(coords.length - 2, coords.length - 1, null);
  } // for (let i = 0; i < vertices.length; i += 1) {
  //   findCornerPoints(i);
  // }


  var addTriangles = function addTriangles(i1, i2) {
    points.push(border1[i1].x);
    points.push(border1[i1].y);
    points.push(border2[i1].x);
    points.push(border2[i1].y);
    points.push(border2[i2].x);
    points.push(border2[i2].y);
    points.push(border1[i1].x);
    points.push(border1[i1].y);
    points.push(border2[i2].x);
    points.push(border2[i2].y);
    points.push(border1[i2].x);
    points.push(border1[i2].y);
  };

  for (var _i = 0; _i < coords.length - 1; _i += 1) {
    addTriangles(_i, _i + 1);
  }

  if (close) {
    addTriangles(coords.length - 1, 0);
  } // // If the line closes on itself, then find the intersection point of
  // // the first and last offset lines.
  // // p and q will represent the first points of offset lines 1 and 2.
  // if (close) {
  //   // intersection point of first and last offset 1 lines
  //   p = simpleIntersect(
  //     line1Pairs[0][0],
  //     line1Pairs[0][1],
  //     line1Pairs[line1Pairs.length - 1][0],
  //     line1Pairs[line1Pairs.length - 1][1],
  //   );
  //   // intersection point of first and last offset 2 lines
  //   q = simpleIntersect(
  //     line2Pairs[0][0],
  //     line2Pairs[0][1],
  //     line2Pairs[line1Pairs.length - 1][0],
  //     line2Pairs[line2Pairs.length - 1][1],
  //   );
  // } else {
  //   // if not closing on itself, then the first point is simply the first
  //   // point of the offset lines.
  //   p = line1Pairs[0][0];   // eslint-disable-line prefer-destructuring
  //   q = line2Pairs[0][0];   // eslint-disable-line prefer-destructuring
  // }
  // // The line effectively has two borders (named an inside and outside border)
  // // but the inner border isn't necessarily the INSIDE border, it is just a
  // // name.
  // // p and q are the first points of the borders.
  // innerBorder.push(p._dup());
  // outerBorder.push(q._dup());
  // // Go through all offset lines, calculate their intersection points
  // // and from them calculate the triangle and border points.
  // for (let i = 1; i < line1Pairs.length; i += 1) {
  //   // First two points of the Triangle 1 are the two ending points
  //   // of the last line segment
  //   points.push(p.x);
  //   points.push(p.y);
  //   points.push(q.x);
  //   points.push(q.y);
  //   // Next points are the intersection between the first line and the second line
  //   p = simpleIntersect(
  //     line1Pairs[i - 1][0],
  //     line1Pairs[i - 1][1],
  //     line1Pairs[i][0],
  //     line1Pairs[i][1],
  //   );
  //   q = simpleIntersect(
  //     line2Pairs[i - 1][0],
  //     line2Pairs[i - 1][1],
  //     line2Pairs[i][0],
  //     line2Pairs[i][1],
  //   );
  //   // Push the next points to the border
  //   innerBorder.push(p._dup());
  //   outerBorder.push(q._dup());
  //   // Finish triangle 1
  //   points.push(q.x);
  //   points.push(q.y);
  //   // Make triangle 2
  //   points.push(points[points.length - 6]);
  //   points.push(points[points.length - 6]);
  //   points.push(q.x);
  //   points.push(q.y);
  //   points.push(p.x);
  //   points.push(p.y);
  // }
  // // Calculate the last end points
  // let endp;
  // let endq;
  // // In not closing the polyline, the end points are just the last offset
  // // line points
  // if (!close) {
  //   endp = line1Pairs[line1Pairs.length - 1][1]; // eslint-disable-line prefer-destructuring
  //   endq = line2Pairs[line2Pairs.length - 1][1]; // eslint-disable-line prefer-destructuring
  // // If closing the polyline, then the end points are the start points
  // } else {
  //   endp = new Point(points[0], points[1]);
  //   endq = new Point(points[2], points[3]);
  // }
  // // Close out the last two triangles
  // points.push(p.x);             // Last two points of last line segment
  // points.push(p.y);
  // points.push(q.x);
  // points.push(q.y);
  // points.push(endq.x);
  // points.push(endq.y);
  // points.push(p.x);             // Last triangle
  // points.push(p.y);
  // points.push(endq.x);
  // points.push(endq.y);
  // points.push(endp.x);
  // points.push(endp.y);
  // innerBorder.push(endp._dup());
  // outerBorder.push(endq._dup());
  // // If closing, then remove the last duplicate coord as it was added by this
  // // function
  // if (close) {
  //   coords.pop();
  // }
  // function makeOuter(
  //   midPre: Point,
  //   mid: Point,
  //   midPost: Point,
  //   midIndex: number,
  // ) {
  //   const i = midIndex;
  //   const n = i * 12;
  //   const midAngle = threePointAngle(midPre, mid, midPost);
  //   const innerAngle = threePointAngle(midPre, innerBorder[i], midPost);
  //   const outerAngle = threePointAngle(midPre, outerBorder[i], midPost);
  //   const replace = (index, replacementPoint) => {
  //     let normIndex = index;
  //     if (index < 0) {
  //       normIndex += points.length;
  //     }
  //     if (index > points.length - 1) {
  //       normIndex -= points.length;
  //     }
  //     points[normIndex] = replacementPoint.x;
  //     points[normIndex + 1] = replacementPoint.y;
  //   };
  //   const minDistance = Math.min(distance(midPre, mid), distance(midPost, mid));
  //   let newInnerBorder;
  //   let newOuterBorder;
  //   if (innerAngle < midAngle || innerAngle === midAngle) {
  //     newInnerBorder = mid;
  //   }
  //   if (outerAngle < midAngle || outerAngle === midAngle) {
  //     newOuterBorder = mid;
  //   }
  //   if (newOuterBorder) {
  //     replace(n - 4 * 2, newOuterBorder);
  //     replace(n - 2 * 2, newOuterBorder);
  //     replace(n + 1 * 2, newOuterBorder);
  //     outerBorder[i] = newOuterBorder;
  //   }
  //   if (newInnerBorder) {
  //     replace(n - 1 * 2, newInnerBorder);
  //     replace(n, newInnerBorder);
  //     replace(n + 3 * 2, newInnerBorder);
  //     innerBorder[i] = newInnerBorder;
  //   }
  //   let midToBorderVector = innerBorder[i].sub(mid).toPolar();
  //   if (midToBorderVector.mag > minDistance) {
  //     newInnerBorder = mid.add(new Point(
  //       minDistance * Math.cos(midToBorderVector.angle),
  //       minDistance * Math.sin(midToBorderVector.angle),
  //     ));
  //   }
  //   midToBorderVector = outerBorder[i].sub(mid).toPolar();
  //   if (midToBorderVector.mag > minDistance) {
  //     newOuterBorder = mid.add(new Point(
  //       minDistance * Math.cos(midToBorderVector.angle),
  //       minDistance * Math.sin(midToBorderVector.angle),
  //     ));
  //   }
  //   if (newOuterBorder) {
  //     replace(n - 4 * 2, newOuterBorder);
  //     replace(n - 2 * 2, newOuterBorder);
  //     replace(n + 1 * 2, newOuterBorder);
  //     outerBorder[i] = newOuterBorder;
  //   }
  //   if (newInnerBorder) {
  //     replace(n - 1 * 2, newInnerBorder);
  //     replace(n, newInnerBorder);
  //     replace(n + 3 * 2, newInnerBorder);
  //     innerBorder[i] = newInnerBorder;
  //   }
  // }
  // for (let i = 1; i < coords.length - 1; i += 1) {
  //   makeOuter(coords[i - 1], coords[i], coords[i + 1], i);
  // }
  // if (close) {
  //   makeOuter(
  //     coords[line1Pairs.length - 2],
  //     coords[line1Pairs.length - 1],
  //     coords[0],
  //     line1Pairs.length - 1,
  //   );
  //   makeOuter(
  //     coords[line1Pairs.length - 1],
  //     coords[0],
  //     coords[1],
  //     0,
  //   );
  // }
  // // Form the border array


  var border = [];
  var holeBorder = []; // console.log(innerBorder)
  // console.log(outerBorder)
  // If the poly line is closed, only one of the offset lines is the outside
  // border. If open, then both are the border.

  if (close) {
    if (border1[0].isInPolygon(border2)) {
      border = border2;
      holeBorder = border1;
    } else {
      border = border1;
      holeBorder = border2;
    }
  } else {
    border.push(border1[0]);

    for (var _i2 = 0; _i2 < border2.length; _i2 += 1) {
      border.push(border2[_i2]);
    }

    for (var _i3 = border1.length - 1; _i3 >= 0; _i3 -= 1) {
      border.push(border1[_i3]);
    }
  }

  return {
    points: points,
    border: border,
    holeBorder: holeBorder
  };
} // export default polyLineTriangles;

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/Triangles/TRIHoriztonalLine.js":
/*!***********************************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/Triangles/TRIHoriztonalLine.js ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../tools/g2 */ "./src/js/diagram/tools/g2.js");


function TRIHorizontalLine() {
  var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.1;
  var rotation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().rotate(rotation).translate(start.x, start.y);
  var cx = 0;
  var cy = 0;
  var pList = [new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx, cy - width / 2), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx + length, cy - width / 2), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx + length, cy + width / 2), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx, cy - width / 2), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx + length, cy + width / 2), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx, cy + width / 2)];
  var pListTransformed = pList.map(function (p) {
    return p.transformBy(t.matrix());
  });
  var points = [];
  pListTransformed.map(function (p) {
    points.push(p.x);
    points.push(p.y);
    return true;
  });
  var border = [pList[0], pList[1], pList[2], pList[5]];
  return {
    points: points,
    border: border
  };
}

/* harmony default export */ __webpack_exports__["default"] = (TRIHorizontalLine);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/Triangles/TRIParallelLines.js":
/*!**********************************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/Triangles/TRIParallelLines.js ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../tools/g2 */ "./src/js/diagram/tools/g2.js");


function TRIParallelLines() {
  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var spacing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
  var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
  var length = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.1;
  var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.01;
  var logarithmic = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  var flip = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  var points = [];
  var border = [];
  var sign = 1;

  if (flip) {
    sign = -1;
  }

  var cy = start.y;

  for (var i = 0; i < num; i += 1) {
    var cx = void 0;

    if (logarithmic) {
      cx = start.x + spacing * Math.floor(i / 10) + Math.log10(i % 10) * spacing;
    } else {
      cx = start.x + spacing * i;
    }

    cx -= width / 2;
    points.push(cx, sign * cy);
    points.push(cx + width, sign * cy);
    points.push(cx + width, sign * (cy + length));
    points.push(cx, cy);
    points.push(cx + width, sign * (cy + length));
    points.push(cx, sign * (cy + length));
    border.push([new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx, sign * cy), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx + width, sign * cy), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx + width, sign * (cy + length)), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx, sign * (cy + length))]);
  }

  return {
    points: points,
    border: border
  };
}

/* harmony default export */ __webpack_exports__["default"] = (TRIParallelLines);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexArrow.js":
/*!*******************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexArrow.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var VertexArrow =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertexArrow, _VertexObject);

  function VertexArrow(webgl) {
    var _this;

    var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var legWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var legHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.5;
    var tip = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    var rotation = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

    _classCallCheck(this, VertexArrow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexArrow).call(this, webgl));
    _this.glPrimative = _this.gl.TRIANGLE_FAN;
    _this.height = height;
    var arrowHeight = height - legHeight;
    var points = [];
    points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0));
    points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](-width / 2, -arrowHeight));

    if (legHeight) {
      points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](-legWidth / 2.0, -arrowHeight));
      points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](-legWidth / 2.0, -height));
      points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](+legWidth / 2.0, -height));
      points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](+legWidth / 2.0, -arrowHeight));
    }

    points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](+width / 2, -arrowHeight));
    var t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().rotate(rotation).translate(tip);
    var transformedPoints = points.map(function (p) {
      return p.transformBy(t.matrix());
    }); // this.points = [
    //   0, 0,
    //   -width / 2, -arrowHeight,
    //   -legWidth / 2.0, -arrowHeight,
    //   -legWidth / 2.0, -height,
    //   +legWidth / 2.0, -height,
    //   +legWidth / 2.0, -arrowHeight,
    //   +width / 2, -arrowHeight,
    // ];

    transformedPoints.forEach(function (p) {
      _this.points.push(p.x);

      _this.points.push(p.y);

      _this.border[0].push(p);
    }); // for (let i = 0; i < this.points.length; i += 2) {
    //   // this.points[i] += tip.x;
    //   // this.points[i + 1] += tip.y;
    //   this.border[0].push(new Point(this.points[i], this.points[i + 1]));
    // }

    _this.border[0].push(_this.border[0][0]._dup());

    _this.setupBuffer();

    return _this;
  }

  return VertexArrow;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexArrow);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexDashedLine.js":
/*!************************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexDashedLine.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





function makeDash(start, length, width) {
  var p1 = start._dup();

  var p2 = start.add(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, width));
  var p3 = start.add(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](length, width));
  var p4 = start.add(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](length, 0));
  return [p1, p2, p3, p1, p3, p4];
}

var VertexDashedLine =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertexDashedLine, _VertexObject);

  function VertexDashedLine(webgl) {
    var _this;

    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    var maxLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.1;
    var rotation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var dashStyle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [1];

    _classCallCheck(this, VertexDashedLine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexDashedLine).call(this, webgl));
    _this.glPrimative = _this.gl.TRIANGLES;
    _this.dashCumLength = [];
    _this.maxLength = maxLength;
    var cx = 0;
    var cy = 0 - width / 2.0;
    var points = [];
    var cumLength = 0;
    var startVertex = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx, cy);
    var isGap = false;

    while (cumLength < maxLength) {
      for (var i = 0; i < dashStyle.length && cumLength < maxLength; i += 1) {
        var length = dashStyle[i];

        if (length + cumLength > maxLength) {
          length = maxLength - cumLength;
        }

        if (!isGap) {
          var dash = makeDash(startVertex, length, width);
          dash.forEach(function (d) {
            points.push(d);
          });
        }

        cumLength += length;
        startVertex.x += length;
        isGap = !isGap;

        _this.dashCumLength.push(cumLength);
      }
    } // rotate points


    var t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().rotate(rotation).translate(start.x, start.y);
    var transformedPoints = points.map(function (p) {
      return p.transformBy(t.matrix());
    });
    transformedPoints.forEach(function (p) {
      _this.points.push(p.x);

      _this.points.push(p.y);
    }); // const p = this.points;

    _this.border[0] = [transformedPoints[0], transformedPoints[1], transformedPoints[transformedPoints.length - 2], transformedPoints[transformedPoints.length - 1]];

    _this.border[0].push(_this.border[0][0]._dup());

    _this.setupBuffer();

    return _this;
  }

  _createClass(VertexDashedLine, [{
    key: "getPointCountForLength",
    value: function getPointCountForLength() {
      var drawLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.maxLength;

      if (drawLength >= this.maxLength) {
        return this.numPoints;
      }

      if (drawLength < this.dashCumLength[0]) {
        return 0;
      }

      for (var i = 0; i < this.dashCumLength.length; i += 1) {
        var _cumLength = this.dashCumLength[i];

        if (_cumLength > drawLength) {
          return (Math.floor((i - 1) / 2) + 1) * 6;
        }
      }

      return this.numPoints;
    }
  }]);

  return VertexDashedLine;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexDashedLine);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexFan.js":
/*!*****************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexFan.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var VertextFan =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertextFan, _VertexObject);

  // WebGL primitive used
  // radius from center to outside of polygon
  // center point
  // angle between adjacent verteces to center lines
  function VertextFan(webgl, points) {
    var _this;

    _classCallCheck(this, VertextFan);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertextFan).call(this, webgl));
    _this.glPrimative = webgl.gl.TRIANGLE_FAN;
    _this.points = [];
    points.forEach(function (p) {
      _this.points.push(p.x);

      _this.points.push(p.y);

      _this.border[0].push(p);
    });

    _this.setupBuffer();

    return _this;
  }

  return VertextFan;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertextFan);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexHorizontalLine.js":
/*!****************************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexHorizontalLine.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var VertexHorizontalLine =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertexHorizontalLine, _VertexObject);

  function VertexHorizontalLine(webgl) {
    var _this;

    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    var length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.1;
    var rotation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    _classCallCheck(this, VertexHorizontalLine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexHorizontalLine).call(this, webgl));
    var cx = 0;
    var cy = 0 - width / 2.0;
    var points = [];
    _this.glPrimative = _this.gl.TRIANGLE_STRIP;
    points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx, cy));
    points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx, cy + width));
    points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx + length, cy));
    points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](cx + length, cy + width)); // transform points

    var t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().rotate(rotation).translate(start.x, start.y);
    var transformedPoints = points.map(function (p) {
      return p.transformBy(t.matrix());
    });
    transformedPoints.forEach(function (p) {
      _this.points.push(p.x);

      _this.points.push(p.y);
    });
    _this.border[0] = [transformedPoints[0], transformedPoints[1], transformedPoints[transformedPoints.length - 1], transformedPoints[transformedPoints.length - 2]];

    _this.border[0].push(_this.border[0][0]._dup());

    _this.setupBuffer();

    return _this;
  }

  return VertexHorizontalLine;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexHorizontalLine);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexLines.js":
/*!*******************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexLines.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var VertexLines =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertexLines, _VertexObject);

  function VertexLines(webgl, linePairs) {
    var _this;

    var numLinesThick = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, VertexLines);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexLines).call(this, webgl));
    _this.glPrimative = _this.gl.LINES;
    _this.points = [];
    linePairs.forEach(function (line) {
      var _line = _slicedToArray(line, 2),
          p = _line[0],
          q = _line[1];

      var angle = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Line"](p, q).angle() + Math.PI / 2;
      var spacing = 0.003;
      var startMag = -spacing * (numLinesThick - 1) / 2;

      for (var i = 0; i < numLinesThick; i += 1) {
        var mag = startMag + i * spacing;

        _this.points.push(p.x + mag * Math.cos(angle));

        _this.points.push(p.y + mag * Math.sin(angle));

        _this.points.push(q.x + mag * Math.cos(angle));

        _this.points.push(q.y + mag * Math.sin(angle));
      } // this.points.push(p.x);
      // this.points.push(p.y);
      // this.points.push(q.x);
      // this.points.push(q.y);

    });
    _this.border = [];

    _this.setupBuffer();

    return _this;
  }

  return VertexLines;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexLines);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js":
/*!********************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_m2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/m2 */ "./src/js/diagram/tools/m2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _DrawingObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../DrawingObject */ "./src/js/diagram/DrawingObjects/DrawingObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// import * as g2 from '../g2';



 // Base clase of all shape objects made from verteces for webgl.
// The job of a VertexObject is to:
//  - Have the points of a object/shape
//  - Have the shape's border (used to determine whether a location is
//    within the shape)
//  - Setup the webgl buffer
//  - Draw the shape

var VertexObject =
/*#__PURE__*/
function (_DrawingObject) {
  _inherits(VertexObject, _DrawingObject);

  // shortcut for the webgl context
  // webgl instance for a html canvas
  // primitive tyle (e.g. TRIANGLE_STRIP)
  // Vertex buffer
  // Primative vertices of shape
  // Number of primative vertices
  // Border vertices
  function VertexObject(webgl) {
    var _this;

    _classCallCheck(this, VertexObject);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexObject).call(this));
    _this.numPoints = 0;
    _this.gl = webgl.gl;
    _this.webgl = webgl;
    _this.glPrimative = webgl.gl.TRIANGLES;
    _this.points = [];
    _this.z = 0;
    _this.textureLocation = '';
    _this.texturePoints = [];
    return _this;
  }

  _createClass(VertexObject, [{
    key: "setupBuffer",
    value: function setupBuffer() {
      var _this2 = this;

      var numPoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (numPoints === 0) {
        this.numPoints = this.points.length / 2.0;
      } else {
        this.numPoints = numPoints;
      }

      if (this.texturePoints.length === 0 && this.textureLocation) {
        this.createTextureMap();
      }

      if (this.textureLocation) {
        this.textureBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texturePoints), this.gl.STATIC_DRAW); // Create a texture.

        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture); // Fill the texture with a 1x1 blue pixel.

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        var image = new Image();
        image.src = this.textureLocation;
        image.addEventListener('load', function () {
          // Now that the image has loaded make copy it to the texture.
          _this2.gl.bindTexture(_this2.gl.TEXTURE_2D, texture);

          _this2.gl.pixelStorei(_this2.gl.UNPACK_FLIP_Y_WEBGL, 1);

          _this2.gl.texImage2D(_this2.gl.TEXTURE_2D, 0, _this2.gl.RGBA, _this2.gl.RGBA, _this2.gl.UNSIGNED_BYTE, image);

          function isPowerOf2(value) {
            // eslint-disable-next-line no-bitwise
            return (value & value - 1) === 0;
          } // Check if the image is a power of 2 in both dimensions.


          if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            _this2.gl.generateMipmap(_this2.gl.TEXTURE_2D);
          } else {
            // No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
            _this2.gl.texParameteri(_this2.gl.TEXTURE_2D, _this2.gl.TEXTURE_WRAP_S, _this2.gl.CLAMP_TO_EDGE);

            _this2.gl.texParameteri(_this2.gl.TEXTURE_2D, _this2.gl.TEXTURE_WRAP_T, _this2.gl.CLAMP_TO_EDGE);

            _this2.gl.texParameteri(_this2.gl.TEXTURE_2D, _this2.gl.TEXTURE_MIN_FILTER, _this2.gl.LINEAR);
          }
        });
      } // this.buffer = createBuffer(this.gl, this.vertices);


      this.buffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);
    }
  }, {
    key: "resetBuffer",
    value: function resetBuffer() {
      var numPoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.textureLocation) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.deleteTexture(this.textureBuffer);
      } // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);


      this.gl.deleteBuffer(this.buffer);
      this.setupBuffer(numPoints);
    } // eslint-disable-next-line no-unused-vars

  }, {
    key: "change",
    value: function change(coords) {
      this.resetBuffer();
    }
  }, {
    key: "changeVertices",
    value: function changeVertices(coords) {
      var _this3 = this;

      this.points = [];
      this.border = [];
      var minX = null;
      var minY = null;
      var maxX = null;
      var maxY = null;
      coords.forEach(function (p) {
        _this3.points.push(p.x);

        _this3.points.push(p.y);

        if (minX === null || p.x < minX) {
          minX = p.x;
        }

        if (minY === null || p.y < minY) {
          minY = p.y;
        }

        if (maxY === null || p.y > maxY) {
          maxY = p.y;
        }

        if (maxX === null || p.x > maxX) {
          maxX = p.x;
        }
      });

      if (minX != null && minY != null && maxX != null && maxY != null) {
        this.border[0] = [new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"](minX, minY), new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"](minX, maxY), new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"](maxX, maxY), new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"](maxX, minY)];
      }

      this.resetBuffer();
    } // Abstract method - should be reimplemented for any vertexObjects that

  }, {
    key: "getPointCountForAngle",
    value: function getPointCountForAngle() {
      var drawAngle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.PI * 2;
      return this.numPoints * drawAngle / (Math.PI * 2);
    } // Abstract method - should be reimplemented for any vertexObjects that
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "getPointCountForLength",
    value: function getPointCountForLength(drawLength) {
      return this.numPoints;
    }
  }, {
    key: "createTextureMap",
    value: function createTextureMap() {
      var xMinGL = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
      var xMaxGL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var yMinGL = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
      var yMaxGL = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var xMinTex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var xMaxTex = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
      var yMinTex = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var yMaxTex = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
      var glWidth = xMaxGL - xMinGL;
      var glHeight = yMaxGL - yMinGL;
      var texWidth = xMaxTex - xMinTex;
      var texHeight = yMaxTex - yMinTex;
      this.texturePoints = [];

      for (var i = 0; i < this.points.length; i += 2) {
        var x = this.points[i];
        var y = this.points[i + 1];
        var texNormX = (x - xMinGL) / glWidth;
        var texNormY = (y - yMinGL) / glHeight;
        this.texturePoints.push(texNormX * texWidth + xMinTex);
        this.texturePoints.push(texNormY * texHeight + yMinTex);
      }
    }
  }, {
    key: "draw",
    value: function draw(translation, rotation, scale, count, color) {
      var transformation = _tools_m2__WEBPACK_IMPORTED_MODULE_0__["identity"]();
      transformation = _tools_m2__WEBPACK_IMPORTED_MODULE_0__["translate"](transformation, translation.x, translation.y);
      transformation = _tools_m2__WEBPACK_IMPORTED_MODULE_0__["rotate"](transformation, rotation);
      transformation = _tools_m2__WEBPACK_IMPORTED_MODULE_0__["scale"](transformation, scale.x, scale.y);
      this.drawWithTransformMatrix(_tools_m2__WEBPACK_IMPORTED_MODULE_0__["t"](transformation), color, count);
    }
  }, {
    key: "drawWithTransformMatrix",
    value: function drawWithTransformMatrix(transformMatrix, color, count) {
      var size = 2; // 2 components per iteration

      var type = this.gl.FLOAT; // the data is 32bit floats

      var normalize = false; // don't normalize the data
      // 0 = move forward size * sizeof(type) each iteration to get
      // the next position

      var stride = 0;
      var offset = 0; // start at the beginning of the buffer
      // Turn on the attribute

      this.gl.enableVertexAttribArray(this.webgl.locations.a_position); // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer); // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)

      this.gl.vertexAttribPointer(this.webgl.locations.a_position, size, type, normalize, stride, offset);
      this.gl.uniformMatrix3fv(this.webgl.locations.u_matrix, false, _tools_m2__WEBPACK_IMPORTED_MODULE_0__["t"](transformMatrix)); // Translate

      this.gl.uniform1f(this.webgl.locations.u_z, this.z);
      this.gl.uniform4f(this.webgl.locations.u_color, color[0], color[1], color[2], color[3]); // Translate

      if (this.textureLocation) {
        // Textures
        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var texSize = 2; // 2 components per iteration

        var texType = this.gl.FLOAT; // the data is 32bit floats

        var texNormalize = false; // don't normalize the data

        var texStride = 0; // 0 = move forward size * sizeof(type) each iteration to get
        // the next position

        var texOffset = 0; // start at the beginning of the buffer

        this.gl.enableVertexAttribArray(this.webgl.locations.a_texcoord);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        this.gl.vertexAttribPointer(this.webgl.locations.a_texcoord, texSize, texType, texNormalize, texStride, texOffset);
      }

      if (this.textureLocation) {
        this.gl.uniform1i(this.webgl.locations.u_use_texture, 1);
      } else {
        this.gl.uniform1i(this.webgl.locations.u_use_texture, 0);
      }

      this.gl.drawArrays(this.glPrimative, offset, count);

      if (this.textureLocation) {
        this.gl.disableVertexAttribArray(this.webgl.locations.a_texcoord);
      }
    }
  }, {
    key: "transform",
    value: function transform(transformMatrix) {
      for (var i = 0; i < this.points.length; i += 2) {
        var p = new _tools_g2__WEBPACK_IMPORTED_MODULE_2__["Point"](this.points[i], this.points[i + 1]);
        p = p.transformBy(transformMatrix);
        this.points[i] = p.x;
        this.points[i + 1] = p.y;
      }

      for (var b = 0; b < this.border.length; b += 1) {
        for (var _p = 0; _p < this.border[b].length; _p += 1) {
          this.border[b][_p] = this.border[b][_p].transformBy(transformMatrix);
        }
      }
    } // calcBorder(lastDrawTransformMatrix: Array<number>) {
    //   const glBorders = [];
    //   this.border.forEach(border => {
    //     const glBorder = [];
    //     border.forEach(p => {
    //       glBorder.push(p.transformBy(lastDrawTransformMatrix));
    //     })
    //     glBorders.push(glBorder);
    //   });
    //   return glBorders;
    // }

  }]);

  return VertexObject;
}(_DrawingObject__WEBPACK_IMPORTED_MODULE_3__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexObject);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexPolyLine.js":
/*!**********************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexPolyLine.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
/* harmony import */ var _PolyLineTriangles3__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PolyLineTriangles3 */ "./src/js/diagram/DrawingObjects/VertexObject/PolyLineTriangles3.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var VertexPolyLine =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertexPolyLine, _VertexObject);

  function VertexPolyLine(webgl, coords, close, width) {
    var _this;

    var borderToPoint = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'never';

    _classCallCheck(this, VertexPolyLine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexPolyLine).call(this, webgl));
    _this.width = width;
    _this.close = close;
    _this.borderToPoint = borderToPoint;

    _this.setupPoints(coords);

    _this.setupBuffer();

    return _this;
  }

  _createClass(VertexPolyLine, [{
    key: "change",
    value: function change(coords) {
      this.setupPoints(coords);
      this.resetBuffer();
    }
  }, {
    key: "setupPoints",
    value: function setupPoints(coords) {
      var lineTriangles = Object(_PolyLineTriangles3__WEBPACK_IMPORTED_MODULE_3__["default"])(coords, this.close, this.width, this.borderToPoint);
      this.points = lineTriangles.points;
      this.border[0] = lineTriangles.border;
      this.holeBorder[0] = lineTriangles.holeBorder;
    }
  }]);

  return VertexPolyLine;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexPolyLine);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexPolyLineCorners.js":
/*!*****************************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexPolyLineCorners.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
/* harmony import */ var _PolyLineTriangles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PolyLineTriangles */ "./src/js/diagram/DrawingObjects/VertexObject/PolyLineTriangles.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






function cornerLength(coords, length) {
  var forceLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var center = coords[1];
  var ends = [coords[0], coords[2]];
  var points = [];

  for (var i = 0; i < 2; i += 1) {
    var delta = ends[i].sub(center);
    var angle = Math.atan2(delta.y, delta.x);
    var endLength = Math.sqrt(delta.x * delta.x + delta.y * delta.y);

    if (length < endLength || forceLength) {
      endLength = length;
    }

    points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](endLength * Math.cos(angle) + center.x, endLength * Math.sin(angle) + center.y));
  }

  points.push(points[1]._dup());
  points[1] = center._dup();
  return points;
}

var PolyLineCorners =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(PolyLineCorners, _VertexObject);

  function PolyLineCorners(webgl, coords, close, length, width) {
    var _this;

    _classCallCheck(this, PolyLineCorners);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PolyLineCorners).call(this, webgl));
    var newCoords = coords.slice();

    if (close) {
      newCoords.push(coords[0]);
      newCoords.push(coords[1]);
    }

    for (var i = 1, j = newCoords.length - 1; i < j; i += 1) {
      var cornerPoints = cornerLength([newCoords[i - 1], newCoords[i], newCoords[i + 1]], length, true);
      var cornerTriangles = Object(_PolyLineTriangles__WEBPACK_IMPORTED_MODULE_3__["default"])(cornerPoints, false, width);

      for (var k = 0, m = cornerTriangles.points.length; k < m; k += 1) {
        _this.points.push(cornerTriangles.points[k]);
      }

      _this.border[i - 1] = [];

      for (var _k = 0, _m = cornerTriangles.border.length; _k < _m; _k += 1) {
        _this.border[i - 1].push(cornerTriangles.border[_k]);
      }
    }

    _this.setupBuffer();

    return _this;
  }

  return PolyLineCorners;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (PolyLineCorners);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexPolygon.js":
/*!*********************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexPolygon.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var VertexPolygon =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertexPolygon, _VertexObject);

  // radius from center to outside of polygon
  // WebGL primitive used
  // outRad: number;       // radius from center to polygon vertex + 1/2 linewidth
  // inRad: number;        // radius from center to polygon vertex - 1/2 linewidth
  // center point
  // angle between adjacent verteces to center lines
  function VertexPolygon(webgl, numSides, // Must be 3 or greater (def: 3 if smaller)
  radius, lineWidth) {
    var _this;

    var rotation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var center = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    var numSidesToDraw = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : numSides;
    var direction = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;

    _classCallCheck(this, VertexPolygon);

    // setup webgl stuff
    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexPolygon).call(this, webgl));
    _this.glPrimative = webgl.gl.TRIANGLE_STRIP; // Check potential errors in constructor input

    var sides = numSides;
    var sidesToDraw = Math.floor(numSidesToDraw);

    if (sides < 3) {
      sides = 3;
    }

    if (sidesToDraw < 0) {
      sidesToDraw = 0;
    } else if (sidesToDraw > sides) {
      sidesToDraw = sides;
    } // setup shape geometry


    _this.radius = radius;
    var inRad = radius - lineWidth; // const outRad = radius + lineWidth / 2.0;
    // this.outRad = outRad;
    // this.inRad = inRad;

    _this.center = center;
    _this.dAngle = Math.PI * 2.0 / sides; // Setup shape primative vertices

    var i;
    var j = 0;

    for (i = 0; i <= sidesToDraw; i += 1) {
      _this.points[j] = center.x + inRad * Math.cos(i * _this.dAngle * direction + rotation * direction);
      _this.points[j + 1] = center.y + inRad * Math.sin(i * _this.dAngle * direction + rotation * direction);
      _this.points[j + 2] = center.x + radius * Math.cos(i * _this.dAngle * direction + rotation * direction);
      _this.points[j + 3] = center.y + radius * Math.sin(i * _this.dAngle * direction + rotation * direction);
      j += 4;
    } // Make the encapsulating border


    if (sidesToDraw < sides) {
      for (i = 0; i <= sidesToDraw; i += 1) {
        _this.border[0].push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](center.x + radius * Math.cos(i * _this.dAngle * direction + rotation * direction), center.y + radius * Math.sin(i * _this.dAngle * direction + rotation * direction)));
      }

      for (i = sidesToDraw; i >= 0; i -= 1) {
        _this.border[0].push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](center.x + inRad * Math.cos(i * _this.dAngle * direction + rotation * direction), center.y + inRad * Math.sin(i * _this.dAngle * direction + rotation * direction)));
      }

      _this.border[0].push(_this.border[0][0]._dup());
    } else {
      for (i = 0; i <= sidesToDraw; i += 1) {
        _this.border[0].push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](center.x + radius * Math.cos(i * _this.dAngle * direction + rotation * direction), center.y + radius * Math.sin(i * _this.dAngle * direction + rotation * direction)));
      }
    }

    _this.setupBuffer(); // console.log(this.numPoints);


    return _this;
  }

  _createClass(VertexPolygon, [{
    key: "drawToAngle",
    value: function drawToAngle(offset, rotate, scale, drawAngle, color) {
      var count = Math.floor(drawAngle / this.dAngle) * 2.0 + 2;

      if (drawAngle >= Math.PI * 2.0) {
        count = this.numPoints;
      }

      this.draw(offset, rotate, scale, count, color);
    }
  }, {
    key: "getPointCountForAngle",
    value: function getPointCountForAngle() {
      var drawAngle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.PI * 2;
      var count = Math.floor(drawAngle / this.dAngle) * 2.0 + 2;

      if (drawAngle >= Math.PI * 2.0) {
        count = this.numPoints;
      }

      return count;
    }
  }]);

  return VertexPolygon;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexPolygon);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexPolygonFilled.js":
/*!***************************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexPolygonFilled.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var PolygonFilled =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(PolygonFilled, _VertexObject);

  // WebGL primitive used
  // radius from center to outside of polygon
  // center point
  // angle between adjacent verteces to center lines
  function PolygonFilled(webgl, numSides, radius) {
    var _this;

    var rotation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var center = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    var numSidesToDraw = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : numSides;
    var textureLocation = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';
    var textureCoords = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](0, 0, 1, 1);

    _classCallCheck(this, PolygonFilled);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PolygonFilled).call(this, webgl));
    _this.glPrimative = webgl.gl.TRIANGLE_FAN; // Check potential errors in constructor input

    var sides = numSides;
    var sidesToDraw = numSidesToDraw;

    if (sides < 3) {
      sides = 3;
    }

    if (numSidesToDraw < 0) {
      sidesToDraw = 0;
    } else if (numSidesToDraw > sides) {
      sidesToDraw = sides;
    }

    _this.points = [center.x, center.y];
    _this.dAngle = 0;
    _this.radius = radius;
    _this.center = center;
    _this.dAngle = Math.PI * 2.0 / sides;
    var i;
    var j = 2; // let b = 0;
    // Make the encapsulating border

    if (sidesToDraw < sides) {
      _this.border[0].push(center._dup()); // b = 1;

    }

    for (i = 0; i < sidesToDraw + 1; i += 1) {
      _this.points[j] = center.x + radius * Math.cos(i * _this.dAngle + rotation);
      _this.points[j + 1] = center.y + radius * Math.sin(i * _this.dAngle + rotation);

      _this.border[0].push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](_this.points[j], _this.points[j + 1])); // b += 1;


      j += 2;
    }

    if (sidesToDraw < sides) {
      _this.border[0].push(center._dup());
    }

    _this.textureLocation = textureLocation;

    _this.createTextureMap(-_this.radius * 1.01 + center.x, _this.radius * 1.01 + center.x, -_this.radius * 1.01 + center.y, _this.radius * 1.01 + center.y, textureCoords.left, textureCoords.right, textureCoords.bottom, textureCoords.top);

    _this.setupBuffer();

    return _this;
  }

  _createClass(PolygonFilled, [{
    key: "drawToAngle",
    value: function drawToAngle(offset, rotate, scale, drawAngle, color) {
      var count = Math.floor(drawAngle / this.dAngle) * 2.0 + 2;

      if (drawAngle >= Math.PI * 2.0) {
        count = this.numPoints;
      }

      this.draw(offset, rotate, scale, count, color);
    }
  }, {
    key: "getPointCountForAngle",
    value: function getPointCountForAngle() {
      var drawAngle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.PI * 2;
      var count = Math.floor(drawAngle / this.dAngle) + 1;

      if (drawAngle >= Math.PI * 2.0) {
        count = this.numPoints;
      }

      return count;
    }
  }]);

  return PolygonFilled;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (PolygonFilled);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexPolygonLine.js":
/*!*************************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexPolygonLine.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var VertexPolygonLine =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertexPolygonLine, _VertexObject);

  // radius from center to outside of polygon
  // WebGL primitive used
  // center point
  // angle between adjacent verteces to center lines
  function VertexPolygonLine(webgl, numSides, // Must be 3 or greater (def: 3 if smaller)
  radius) {
    var _this;

    var rotation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var center = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
    var numSidesToDraw = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : numSides;
    var direction = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
    var thickness = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;

    _classCallCheck(this, VertexPolygonLine);

    // setup webgl stuff
    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexPolygonLine).call(this, webgl));
    _this.glPrimative = webgl.gl.LINES; // Check potential errors in constructor input

    var sides = numSides;
    var sidesToDraw = Math.floor(numSidesToDraw);

    if (sides < 3) {
      sides = 3;
    }

    if (sidesToDraw < 0) {
      sidesToDraw = 0;
    } else if (sidesToDraw > sides) {
      sidesToDraw = sides;
    } // setup shape geometry


    _this.radius = radius; // const inRad = radius - lineWidth;

    _this.center = center;
    _this.dAngle = Math.PI * 2.0 / sides; // const lines = [];

    var points = [];
    var thickPoints = [];

    for (var j = 1; j < thickness; j += 1) {
      thickPoints.push([]);
    }

    for (var i = 0; i <= sidesToDraw; i += 1) {
      var angle = i * _this.dAngle * direction + rotation * direction;
      points.push(Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(radius, angle));

      for (var _j = 1; _j < thickness; _j += 1) {
        thickPoints[_j - 1].push(Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["polarToRect"])(radius * (1 - _j * 0.003), angle));
      }
    }

    for (var _i = 1; _i <= sidesToDraw; _i += 1) {
      // lines.push([points[i - 1], points[i]]);
      _this.points.push(points[_i - 1].x);

      _this.points.push(points[_i - 1].y);

      _this.points.push(points[_i].x);

      _this.points.push(points[_i].y);

      for (var _j2 = 1; _j2 < thickness; _j2 += 1) {
        _this.points.push(thickPoints[_j2 - 1][_i - 1].x);

        _this.points.push(thickPoints[_j2 - 1][_i - 1].y);

        _this.points.push(thickPoints[_j2 - 1][_i].x);

        _this.points.push(thickPoints[_j2 - 1][_i].y);
      }
    }

    _this.border[0] = points;

    if (sidesToDraw < sides) {
      _this.border[0].push(center);
    } // for (let i = 1; i <= sidesToDraw; i += 1) {
    //   const lastAngle = (i - 1) * angleStep;
    //   const angle = i * angleStep;
    //   lines.push([polarToRect(1, lastAngle), polarToRect(1, angle)]);
    // }
    // // Setup shape primative vertices
    // let i;
    // let j = 0;
    // for (i = 0; i <= sidesToDraw; i += 1) {
    //   this.points[j] = polarToRect
    //   this.points[j] =
    //     center.x + inRad * Math.cos(i * this.dAngle * direction + rotation * direction);
    //   this.points[j + 1] =
    //     center.y + inRad * Math.sin(i * this.dAngle * direction + rotation * direction);
    //   this.points[j + 2] =
    //     center.x + radius * Math.cos(i * this.dAngle * direction + rotation * direction);
    //   this.points[j + 3] =
    //     center.y + radius * Math.sin(i * this.dAngle * direction + rotation * direction);
    //   j += 4;
    // }
    // // Make the encapsulating border
    // if (sidesToDraw < sides) {
    //   for (i = 0; i <= sidesToDraw; i += 1) {
    //     this.border[0].push(new Point(
    //       center.x + radius * Math.cos(i * this.dAngle * direction + rotation * direction),
    //       center.y + radius * Math.sin(i * this.dAngle * direction + rotation * direction),
    //     ));
    //   }
    //   for (i = sidesToDraw; i >= 0; i -= 1) {
    //     this.border[0].push(new Point(
    //       center.x + inRad * Math.cos(i * this.dAngle * direction + rotation * direction),
    //       center.y + inRad * Math.sin(i * this.dAngle * direction + rotation * direction),
    //     ));
    //   }
    //   this.border[0].push(this.border[0][0]._dup());
    // } else {
    //   for (i = 0; i <= sidesToDraw; i += 1) {
    //     this.border[0].push(new Point(
    //       center.x + radius * Math.cos(i * this.dAngle * direction + rotation * direction),
    //       center.y + radius * Math.sin(i * this.dAngle * direction + rotation * direction),
    //     ));
    //   }
    // }


    _this.setupBuffer(); // console.log(this.numPoints);


    return _this;
  }

  _createClass(VertexPolygonLine, [{
    key: "drawToAngle",
    value: function drawToAngle(offset, rotate, scale, drawAngle, color) {
      var count = Math.floor(drawAngle / this.dAngle) * 2.0 + 2;

      if (drawAngle >= Math.PI * 2.0) {
        count = this.numPoints;
      }

      this.draw(offset, rotate, scale, count, color);
    }
  }, {
    key: "getPointCountForAngle",
    value: function getPointCountForAngle() {
      var drawAngle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.PI * 2;
      var numSidesToDraw = Math.floor(drawAngle / this.dAngle) * 2.0;
      var pointCount = numSidesToDraw * 2;

      if (pointCount > this.numPoints) {
        pointCount = this.numPoints;
      } // let count = Math.floor(drawAngle / this.dAngle) * 2.0;
      // if (drawAngle >= Math.PI * 2.0) {
      //   count = this.numPoints;
      // }


      return pointCount;
    }
  }]);

  return VertexPolygonLine;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexPolygonLine);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexRadialLines.js":
/*!*************************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexRadialLines.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var VertexRadialLines =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertexRadialLines, _VertexObject);

  function VertexRadialLines(webgl) {
    var _this;

    var innerRadius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var outerRadius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.05;
    var dAngle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Math.PI / 4;
    var maxAngle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Math.PI * 2;

    _classCallCheck(this, VertexRadialLines);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexRadialLines).call(this, webgl));
    _this.innerRadius = innerRadius;
    _this.outerRadius = outerRadius;
    _this.dAngle = dAngle;
    _this.maxAngle = maxAngle;
    var currentAngle = 0;
    var j = -1;
    var b = -1;
    var referenceLine = [innerRadius, -width / 2.0, outerRadius, -width / 2.0, outerRadius, width / 2.0, innerRadius, -width / 2.0, outerRadius, width / 2.0, innerRadius, width / 2.0];

    while (currentAngle <= maxAngle) {
      for (var i = 0; i < 6; i += 1) {
        var newPoint = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](referenceLine[i * 2], referenceLine[i * 2 + 1]).rotate(currentAngle); // let newPoint = rotate(new coord(referenceLine[i*2],referenceLine[i*2+1]), currentAngle);

        _this.points[j += 1] = newPoint.x;
        _this.points[j += 1] = newPoint.y;
      }

      var radialLineBorder = [new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](_this.points[j - 11], _this.points[j - 10]), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](_this.points[j - 9], _this.points[j - 8]), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](_this.points[j - 7], _this.points[j - 6]), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](_this.points[j - 1], _this.points[j - 0]), new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](_this.points[j - 11], _this.points[j - 10])];
      _this.border[b += 1] = radialLineBorder;
      currentAngle += dAngle;
    }

    _this.setupBuffer();

    return _this;
  }

  _createClass(VertexRadialLines, [{
    key: "drawToAngle",
    value: function drawToAngle(offset, rotate, scale, drawAngle, color) {
      var count = Math.floor(drawAngle / this.dAngle) * 6.0 + 6.0;

      if (drawAngle >= this.maxAngle) {
        count = this.numPoints;
      }

      this.draw(offset, rotate, scale, count, color);
    }
  }, {
    key: "getPointCountForAngle",
    value: function getPointCountForAngle() {
      var drawAngle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.PI * 2;
      var count = Math.floor(drawAngle / this.dAngle) * 6.0 + 6;

      if (drawAngle >= Math.PI * 2.0) {
        count = this.numPoints;
      }

      return count;
    }
  }]);

  return VertexRadialLines;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VertexRadialLines);

/***/ }),

/***/ "./src/js/diagram/DrawingObjects/VertexObject/VertexRectangleFilled.js":
/*!*****************************************************************************!*\
  !*** ./src/js/diagram/DrawingObjects/VertexObject/VertexRectangleFilled.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return VertexRectangleFilled; });
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _webgl_webgl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../webgl/webgl */ "./src/js/diagram/webgl/webgl.js");
/* harmony import */ var _VertexObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var VertexRectangleFilled =
/*#__PURE__*/
function (_VertexObject) {
  _inherits(VertexRectangleFilled, _VertexObject);

  function VertexRectangleFilled(webgl, reference) {
    var _this;

    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var cornerRadius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var cornerSides = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;

    _classCallCheck(this, VertexRectangleFilled);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VertexRectangleFilled).call(this, webgl));
    _this.glPrimative = _this.gl.TRIANGLE_FAN;
    var points = [];
    points.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0));

    var makeCorner = function makeCorner(radius, sides, rotation, offset) {
      var cornerPoints = [];

      if (radius === 0 || sides <= 1) {
        cornerPoints.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0));
      } else {
        var step = Math.PI / 2 / sides;

        for (var i = 0; i < sides + 1; i += 1) {
          cornerPoints.push(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](radius * Math.cos(i * step + rotation) + offset.x, radius * Math.sin(i * step + rotation) + offset.y));
        }
      }

      return cornerPoints;
    };

    var rad = cornerRadius;
    var sides = cornerSides;
    points = _toConsumableArray(points).concat(_toConsumableArray(makeCorner(rad, sides, 0, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](width / 2 - rad, height / 2 - rad))));
    points = _toConsumableArray(points).concat(_toConsumableArray(makeCorner(rad, sides, Math.PI / 2, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](-width / 2 + rad, height / 2 - rad))));
    points = _toConsumableArray(points).concat(_toConsumableArray(makeCorner(rad, sides, Math.PI, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](-width / 2 + rad, -height / 2 + rad))));
    points = _toConsumableArray(points).concat(_toConsumableArray(makeCorner(rad, sides, Math.PI / 2 * 3, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](width / 2 - rad, -height / 2 + rad))));

    if (reference === 'topLeft') {
      points = points.map(function (p) {
        return p.add(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](width / 2, -height / 2));
      });
    }

    points.forEach(function (p) {
      _this.points.push(p.x);

      _this.points.push(p.y);
    });

    _this.points.push(_this.points[2]);

    _this.points.push(_this.points[3]);

    _this.border[0] = points.slice(1);

    _this.setupBuffer();

    return _this;
  }

  return VertexRectangleFilled;
}(_VertexObject__WEBPACK_IMPORTED_MODULE_2__["default"]);



/***/ }),

/***/ "./src/js/diagram/Element.js":
/*!***********************************!*\
  !*** ./src/js/diagram/Element.js ***!
  \***********************************/
/*! exports provided: DiagramElementPrimative, DiagramElementCollection, DiagramElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiagramElementPrimative", function() { return DiagramElementPrimative; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiagramElementCollection", function() { return DiagramElementCollection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiagramElement", function() { return DiagramElement; });
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _tools_m2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tools/m2 */ "./src/js/diagram/tools/m2.js");
/* harmony import */ var _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tools/mathtools */ "./src/js/diagram/tools/mathtools.js");
/* harmony import */ var _DrawingObjects_HTMLObject_HTMLObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DrawingObjects/HTMLObject/HTMLObject */ "./src/js/diagram/DrawingObjects/HTMLObject/HTMLObject.js");
/* harmony import */ var _DrawingObjects_DrawingObject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DrawingObjects/DrawingObject */ "./src/js/diagram/DrawingObjects/DrawingObject.js");
/* harmony import */ var _DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DrawingObjects/VertexObject/VertexObject */ "./src/js/diagram/DrawingObjects/VertexObject/VertexObject.js");
/* harmony import */ var _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DrawingObjects/TextObject/TextObject */ "./src/js/diagram/DrawingObjects/TextObject/TextObject.js");
/* harmony import */ var _tools_tools__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../tools/tools */ "./src/js/tools/tools.js");
/* harmony import */ var _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./AnimationPhase */ "./src/js/diagram/AnimationPhase.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }








 // eslint-disable-next-line import/no-cycle



function checkCallback(callback) {
  var callbackToUse = function callbackToUse() {};

  if (typeof callback === 'function') {
    callbackToUse = callback;
  }

  return callbackToUse;
} // A diagram is composed of multiple diagram elements.
//
// A diagram element can either be a:
//  - Primative: a basic element that has the webGL vertices, color
//  - Collection: a group of elements (either primatives or collections)
//
// A diagram element can be:
//  - transformed (resized, offset, rotated)
//  - animated (planned transform over time)
//  - moved with control (like dragging)
//  - moving freely (dragged then let go with an initial velocity)
//  - Pulsed
//
// This class manages:
//  - The diagram element
//  - Its current transformation
//  - Its animation plan, animation control and animation state
//  - Its movement state
//  - Its pulsing parameters
//
// A diagram element has an associated persistant transform that describes how
// to draw it. The transform includes any translation, rotation and/or scaling
// the element should be transformed by before drawing.
//
// If the diagram element is a collection of elements, then this transform is
// applied to all the child elements. Each child element will have it's own
// transform as well, and it will be multiplied by the parent transform.
//
// Whenever an element animated or moved, it's persistant transform is updated.
//
// Pulsing does not update an element's persistant transform, but does alter
// the element's current transform used for drawing itself and any children
// elements it has.
//


var DiagramElement =
/*#__PURE__*/
function () {
  // Transform of diagram element
  // presetTransforms: Object;       // Convenience dict of transform presets
  // Transform matrix used in last draw
  // lastDrawParentTransform: Transform;
  // lastDrawElementTransform: Transform;
  // lastDrawPulseTransform: Transform;
  // True if should be shown in diagram
  // Used to reference element in a collection
  // Element is able to be moved
  // Element can be touched
  // Touch event is not processed by Diagram
  // Callbacks
  // element.transform is updated
  // For the future when collections use color
  // this is in vertex space
  // Current animation/movement state of element
  // Pulse animation state
  function DiagramElement() {
    var transform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
    var diagramLimits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](-1, -1, 2, 2);

    _classCallCheck(this, DiagramElement);

    this.name = ''; // This is updated when an element is added to a collection

    this.uid = (Math.random() * 1e18).toString(36);
    this.isShown = true;
    this.transform = transform._dup();
    this.isMovable = false;
    this.isTouchable = false;
    this.isInteractive = false;
    this.hasTouchableElements = false;
    this.color = [1, 1, 1, 1];

    this.setTransformCallback = function () {};

    this.lastDrawTransform = this.transform._dup();
    this.onClick = null;
    this.lastDrawElementTransformPosition = {
      parentCount: 0,
      elementCount: 0
    };
    this.noRotationFromParent = false;
    this.animate = {
      color: {
        plan: [],
        toDisolve: '',
        callback: null
      },
      transform: {
        plan: [],
        translation: {
          style: 'linear',
          options: {
            rot: 1,
            magnitude: 0.5,
            offset: 0.5,
            controlPoint: null,
            direction: ''
          }
        },
        callback: null
      },
      custom: {
        plan: [],
        callback: null
      }
    };
    this.diagramLimits = diagramLimits;
    this.move = {
      maxTransform: this.transform.constant(1000),
      minTransform: this.transform.constant(-1000),
      limitToDiagram: false,
      maxVelocity: new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["TransformLimit"](5, 5, 5),
      freely: {
        zeroVelocityThreshold: new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["TransformLimit"](0.001, 0.001, 0.001),
        deceleration: new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["TransformLimit"](5, 5, 5)
      },
      bounce: true,
      canBeMovedAfterLoosingTouch: false,
      type: 'translation',
      element: null,
      limitLine: null
    };
    this.pulse = {
      time: 1,
      frequency: 0.5,
      A: 1,
      B: 0.5,
      C: 0,
      style: _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["sinusoid"],
      num: 1,
      transformMethod: function transformMethod(s) {
        return new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]().scale(s, s);
      },
      callback: function callback() {}
    };
    this.state = {
      isAnimating: false,
      isAnimatingColor: false,
      isAnimatingCustom: false,
      disolving: '',
      animation: {
        currentPhaseIndex: 0,
        // current animation phase index in plan
        currentPhase: new _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__["AnimationPhase"]() // current animation phase

      },
      colorAnimation: {
        currentPhaseIndex: 0,
        // current animation phase index in plan
        currentPhase: new _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__["ColorAnimationPhase"]() // current animation phase

      },
      customAnimation: {
        currentPhaseIndex: 0,
        // current animation phase index in plan
        currentPhase: new _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__["CustomAnimationPhase"](function () {}) // current animation phase

      },
      isBeingMoved: false,
      isMovingFreely: false,
      movement: {
        previousTime: -1,
        previousTransform: this.transform._dup(),
        velocity: this.transform.zero()
      },
      isPulsing: false,
      pulse: {
        startTime: -1
      }
    };
    this.interactiveLocation = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0); // this.presetTransforms = {};
  } // copyFrom(element: Object) {
  //   const copyValue = (value) => {
  //     if (typeof value === 'number'
  //         || typeof value === 'boolean'
  //         || typeof value === 'string'
  //         || value == null
  //         || typeof value === 'function') {
  //       return value;
  //     }
  //     if (typeof value._dup === 'function') {
  //       return value._dup();
  //     }
  //     // if (value instanceof AnimationPhase
  //     //     || value instanceof ColorAnimationPhase
  //     //     || value instanceof CustomAnimationPhase
  //     //     // eslint-disable-next-line no-use-before-define
  //     //     || value instanceof DiagramElementCollection
  //     //     // eslint-disable-next-line no-use-before-define
  //     //     || value instanceof DiagramElementPrimative
  //     //     || value instanceof DrawingObject
  //     //     || value instanceof Transform
  //     //     || value instanceof Point
  //     //     || value instanceof Rect
  //     //     || value instanceof TransformLimit) {
  //     //   return value._dup();
  //     // }
  //     if (Array.isArray(value)) {
  //       const arrayCopy = [];
  //       value.forEach(arrayElement => arrayCopy.push(copyValue(arrayElement)));
  //       return arrayCopy;
  //     }
  //     if (typeof value === 'object') {
  //       const objectCopy = {};
  //       Object.keys(value).forEach((key) => {
  //         const v = copyValue(value[key]);
  //         objectCopy[key] = v;
  //       });
  //       return objectCopy;
  //     }
  //     return value;
  //   };
  //   Object.keys(element).forEach((key) => {
  //     // $FlowFixMe
  //     this[key] = copyValue(element[key]);
  //   });
  // }
  // Space definition:
  //   * Pixel space: css pixels
  //   * GL Space: x,y = -1 to 1
  //   * Diagram Space: x,y = diagram limits
  //   * Element space: Combination of element transform and its
  //     parent transform's
  // A diagram element primative vertex object lives in GL SPACE.
  //
  // A diagram element has its own DIAGRAM ELEMENT SPACE, which is
  // the GL space transformed by `this.transform`.
  //
  // A diagram element is drawn in the DIAGRAM SPACE, by transforming
  // the DIAGRAM ELEMENT SPACE by an incoming transformation matrix in the draw
  // method. This incoming transformation matrix originates in the diagram
  // and waterfalls through each parent diagram collection element to the
  // current diagram element.
  //
  // this.lastDrawTransformationMatrix captures how a vertex was drawn in
  // the last frame, in DIAGRAM space as:
  //   vertex
  //     transformed by: DIAGRAM ELEMENT SPACE
  //     transfromed by: DIAGRAM SPACE transform
  //
  // By default, webgl clip space is a unit space from (-1, 1) to (1, 1)
  // independent of the aspect ratio of the canvas it is drawn on.
  //
  // A diagram object can have its own clip space with arbitrary limits. e.g.:
  //    * (-1, -1) to (1, 1)    similar to gl clip space
  //    * (0, 0) to (2, 2)      similar to gl clip space but offset
  //    * (0, 0) to (4, 2)      for rectangular aspect ratio diagram
  //
  // The diagram object clip space definition is stored in this.diagramLimits.
  //
  // To therefore transform a vertex (from GL SPACE) to DIAGRAM CLIP SPACE:
  //   * Take the vertex
  //   * Transform it to DIAGRAM SPACE (by transforming it with the
  //     lastDrawTransformMatrix)
  //   * Transform it to DIAGRAM CLIP SPACE by scaling and offsetting it
  //     to the clip space.
  //
  // Each diagram element holds a DIAGRAM ELMENT CLIP space
  // vertexToClip(vertex: Point) {
  //   const scaleX = this.diagramLimits.width / 2;
  //   const scaleY = this.diagramLimits.height / 2;
  //   const biasX = -(-this.diagramLimits.width / 2 - this.diagramLimits.left);
  //   const biasY = -(this.diagramLimits.height / 2 - this.diagramLimits.top);
  //   const transform = new Transform().scale(scaleX, scaleY).translate(biasX, biasY);
  //   return vertex.transformBy(this.lastDrawTransformMatrix)
  //     .transformBy(transform.matrix());
  // }
  // textVertexToClip(vertex: Point) {
  //   const scaleX = this.diagramLimits.width / 2;
  //   const scaleY = this.diagramLimits.height / 2;
  //   const biasX = -(-this.diagramLimits.width / 2 - this.diagramLimits.left);
  //   const biasY = -(this.diagramLimits.height / 2 - this.diagramLimits.top);
  //   const transform = new Transform().scale(scaleX, scaleY).translate(biasX, biasY);
  //   return vertex.transformBy(transform.matrix());
  // }
  // Calculate the next transform due to a progressing animation


  _createClass(DiagramElement, [{
    key: "calcNextAnimationTransform",
    value: function calcNextAnimationTransform(elapsedTime) {
      var phase = this.state.animation.currentPhase; // This flow error cannot happen as start is un-nulled in the phase start
      // $FlowFixMe

      var start = phase.startTransform._dup();

      var delta = phase.deltaTransform._dup();

      var percentTime = elapsedTime / phase.time;
      var percentComplete = phase.animationStyle(percentTime);
      var p = percentComplete; // let next = delta._dup().constant(p);
      // next = start.add(delta.mul(next));

      var next = start.toDelta(delta, p, phase.translationStyle, phase.translationOptions);
      return next;
    }
  }, {
    key: "calcNextAnimationColor",
    value: function calcNextAnimationColor(elapsedTime) {
      var phase = this.state.colorAnimation.currentPhase;
      var start = phase.startColor;
      var delta = phase.deltaColor;
      var percentTime = elapsedTime / phase.time;
      var percentComplete = phase.animationStyle(percentTime);
      var p = percentComplete;
      var next = [0, 0, 0, 1];

      if (start != null) {
        next = start.map(function (c, index) {
          return c + delta[index] * p;
        });
      }

      return next;
    }
  }, {
    key: "calcNextCustomAnimationPercentComplete",
    value: function calcNextCustomAnimationPercentComplete(elapsedTime) {
      var phase = this.state.customAnimation.currentPhase;
      var percentTime = elapsedTime / phase.time;
      var percentComplete = phase.animationStyle(percentTime);
      return percentComplete;
    }
  }, {
    key: "setPosition",
    value: function setPosition(pointOrX) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var position = pointOrX;

      if (typeof pointOrX === 'number') {
        position = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](pointOrX, y);
      }

      var currentTransform = this.transform._dup();

      currentTransform.updateTranslation(position);
      this.setTransform(currentTransform);
    } // Use this method to set the element's transform in case a callback has been
    // connected that is tied to an update of the transform.

  }, {
    key: "setTransform",
    value: function setTransform(transform) {
      this.transform = transform._dup().clip(this.move.minTransform, this.move.maxTransform, this.move.limitLine);

      if (this.setTransformCallback) {
        this.setTransformCallback(this.transform);
      }
    } // Set the next transform (and velocity if moving freely) for the next
    // animation frame.
    //
    // If animating, this transform will be the next frame determined by
    // the currently executing animation phase. If time exceeds the current
    // phase, then either the next phase will be started, or if there are no
    // more phases, the animation will complete.
    //
    // If moving freely, this method will set the next velocity and transform
    // based on the current velocity, current transform, elapsed time,
    // deceleration (in freelyProperties) and zeroVelocityThreshold.
    // Once the velocity goes to zero, this metho will stop the element moving
    // freely.

  }, {
    key: "setNextTransform",
    value: function setNextTransform(now) {
      // If animation is happening
      if (this.state.isAnimating) {
        var phase = this.state.animation.currentPhase; // If an animation hasn't yet started, the start time will be -1.
        // If this is so, then set the start time to the current time and
        // return the current transform.

        if (phase.startTime < 0) {
          phase.startTime = now;
          return;
        } // If we have got here, that means the animation has already started,
        // so calculate the time delta between now and the startTime


        var deltaTime = now - phase.startTime; // If this time delta is larger than the phase's planned time, then
        // either progress to the next animation phase, or end animation.

        if (deltaTime > phase.time) {
          // If there are more animation phases in the plan:
          //   - set the current transform to be the end of the current phase
          //   - start the next phase
          if (this.state.animation.currentPhaseIndex < this.animate.transform.plan.length - 1) {
            // Set current transform to the end of the current phase
            phase.finish(this); // this.setTransform(this.calcNextAnimationTransform(phase.time));
            // Get the amount of time that has elapsed in the next phase

            var nextPhaseDeltaTime = deltaTime - phase.time; // Start the next animation phase

            this.state.animation.currentPhaseIndex += 1;
            this.animatePhase(this.state.animation.currentPhaseIndex);
            this.state.animation.currentPhase.startTime = now - nextPhaseDeltaTime;
            this.setNextTransform(now);
            return;
          } // Note, stopAnimating will finish the last phase


          this.stopAnimating(false);
          return;
        } // If we are here, that means the time elapsed is not more than the
        // current animation phase plan time, so calculate the next transform.


        this.setTransform(this.calcNextAnimationTransform(deltaTime));
        return;
      } // If the element is moving freely, then calc it's next velocity and
      // transform. Save the new velocity into state.movement and return the
      // transform.


      if (this.state.isMovingFreely) {
        // If this is the first frame of moving freely, then record the current
        // time so can calculate velocity on next frame
        if (this.state.movement.previousTime < 0) {
          this.state.movement.previousTime = now;
          return;
        } // If got here, then we are now after the first frame, so calculate
        // the delta time from this frame to the previous


        var _deltaTime = now - this.state.movement.previousTime; // Calculate the new velocity and position


        var next = this.decelerate(_deltaTime);
        this.state.movement.velocity = next.velocity;
        this.state.movement.previousTime = now; // If the velocity is 0, then stop moving freely and return the current
        // transform

        if (this.state.movement.velocity.isZero()) {
          this.state.movement.velocity = this.state.movement.velocity.zero();
          this.stopMovingFreely(false);
        }

        this.setTransform(next.transform);
      }
    }
  }, {
    key: "setNextCustomAnimation",
    value: function setNextCustomAnimation(now) {
      // If animation is happening
      // if (this.name === 'diameterDimension') {
      //   console.log("0", this.state.isAnimatingCustom)
      // }
      if (this.state.isAnimatingCustom) {
        var phase = this.state.customAnimation.currentPhase; // console.log("0.5", phase.startTime)
        // If an animation hasn't yet started, the start time will be -1.
        // If this is so, then set the start time to the current time and
        // return the current transform.

        if (phase.startTime < 0) {
          phase.startTime = now - phase.plannedStartTime;
          return;
        } // const percent = calcNextCustomAnimationPercentComplete(now);
        // If we have got here, that means the animation has already started,
        // so calculate the time delta between now and the startTime


        var deltaTime = now - phase.startTime; // If this time delta is larger than the phase's planned time, then
        // either progress to the next animation phase, or end animation.

        if (deltaTime > phase.time) {
          // console.log("1")
          // If there are more animation phases in the plan:
          //   - set the current transform to be the end of the current phase
          //   - start the next phase
          if (this.state.customAnimation.currentPhaseIndex < this.animate.custom.plan.length - 1) {
            // Set current transform to the end of the current phase
            // phase.animationCallback(1);
            phase.finish(); // Get the amount of time that has elapsed in the next phase

            var nextPhaseDeltaTime = deltaTime - phase.time; // Start the next animation phase

            this.state.customAnimation.currentPhaseIndex += 1;
            this.animateCustomPhase(this.state.customAnimation.currentPhaseIndex);
            this.state.customAnimation.currentPhase.startTime = now - nextPhaseDeltaTime;
            this.setNextCustomAnimation(now);
            return;
          } // This needs to go before StopAnimating, as stopAnimating clears
          // the animation plan (incase a callback is used to start another
          // animation)
          // const endColor = this.calcNextAnimationColor(phase.time);
          // this.setColor(endColor);
          // console.log("2")
          // phase.animationCallback(1);


          this.stopAnimatingCustom(true); // console.log("3")

          return;
        } // If we are here, that means the time elapsed is not more than the
        // current animation phase plan time, so calculate the next transform.
        // console.log("4", this.state.isAnimatingCustom)


        var percent = this.calcNextCustomAnimationPercentComplete(deltaTime); // console.log(phase.animationCallback)

        phase.animationCallback(percent); // console.log("5", this.state.isAnimatingCustom)
        // this.setColor(this.calcNextAnimationColor(deltaTime));
      } // if (this.name === 'diameterDimension') {
      //   console.log("6", this.state.isAnimatingCustom)
      // }

    }
  }, {
    key: "setNextColor",
    value: function setNextColor(now) {
      // If animation is happening
      if (this.state.isAnimatingColor) {
        var phase = this.state.colorAnimation.currentPhase; // If an animation hasn't yet started, the start time will be -1.
        // If this is so, then set the start time to the current time and
        // return the current transform.

        if (phase.startTime < 0) {
          phase.startTime = now;
          return;
        } // If we have got here, that means the animation has already started,
        // so calculate the time delta between now and the startTime


        var deltaTime = now - phase.startTime; // If this time delta is larger than the phase's planned time, then
        // either progress to the next animation phase, or end animation.

        if (deltaTime > phase.time) {
          // If there are more animation phases in the plan:
          //   - set the current transform to be the end of the current phase
          //   - start the next phase
          if (this.state.colorAnimation.currentPhaseIndex < this.animate.color.plan.length - 1) {
            // Set current transform to the end of the current phase
            // this.setColor(this.calcNextAnimationColor(phase.time));
            // Phase callback
            phase.finish(this); // Get the amount of time that has elapsed in the next phase

            var nextPhaseDeltaTime = deltaTime - phase.time; // Start the next animation phase

            this.state.colorAnimation.currentPhaseIndex += 1;
            this.animateColorPhase(this.state.colorAnimation.currentPhaseIndex);
            this.state.colorAnimation.currentPhase.startTime = now - nextPhaseDeltaTime;
            this.setNextColor(now);
            return;
          } // This needs to go before StopAnimating, as stopAnimating clears
          // the animation plan (incase a callback is used to start another
          // animation)
          // const endColor = this.calcNextAnimationColor(phase.time);
          // this.setColor(endColor);
          // phase.finish(this);


          this.stopAnimatingColor(false);
          return;
        } // If we are here, that means the time elapsed is not more than the
        // current animation phase plan time, so calculate the next transform.


        this.setColor(this.calcNextAnimationColor(deltaTime)); // if(this.name === 'times') {
        //   console.log(now, this.color[3])
        // }
      }
    }
  }, {
    key: "setColor",
    value: function setColor(color) {
      this.color = color.slice();
    } // Decelerate over some time when moving freely to get a new element
    // transform and movement velocity

  }, {
    key: "decelerate",
    value: function decelerate(deltaTime) {
      var next = this.transform.decelerate(this.state.movement.velocity, this.move.freely.deceleration, deltaTime, this.move.freely.zeroVelocityThreshold);

      if (deltaTime > 0) {
        for (var i = 0; i < next.t.order.length; i += 1) {
          var t = next.t.order[i];
          var min = this.move.minTransform.order[i];
          var max = this.move.maxTransform.order[i];
          var v = next.v.order[i];

          if (t instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Translation"] && v instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Translation"] && max instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Translation"] && min instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Translation"] || t instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Scale"] && v instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Scale"] && max instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Scale"] && min instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Scale"]) {
            var onLine = true;

            if (this.move.limitLine != null) {
              onLine = t.shaddowIsOnLine(this.move.limitLine, 4);
            }

            if (min.x >= t.x || max.x <= t.x || !onLine) {
              if (this.move.bounce) {
                v.x = -v.x * 0.5;
              } else {
                v.x = 0;
              }
            }

            if (min.y >= t.y || max.y <= t.y || !onLine) {
              if (this.move.bounce) {
                v.y = -v.y * 0.5;
              } else {
                v.y = 0;
              }
            }

            next.v.order[i] = v;
          }

          if (t instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rotation"] && v instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rotation"] && max instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rotation"] && min instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rotation"]) {
            if (min.r >= t.r || max.r <= t.r) {
              if (this.move.bounce) {
                v.r = -v.r * 0.5;
              } else {
                v.r = 0;
              }
            }

            next.v.order[i] = v;
          }
        }

        next.v.calcMatrix();
      }

      return {
        velocity: next.v,
        transform: next.t
      };
    }
  }, {
    key: "updateLastDrawTransform",
    value: function updateLastDrawTransform() {
      var _this = this;

      var parentCount = this.lastDrawElementTransformPosition.parentCount;
      var pLength = this.lastDrawTransform.order.length;
      this.transform.order.forEach(function (t, index) {
        _this.lastDrawTransform.order[pLength - parentCount - index - 1] = t._dup();
      });
      this.lastDrawTransform.calcMatrix();
    }
  }, {
    key: "getParentLastDrawTransform",
    value: function getParentLastDrawTransform() {
      var parentCount = this.lastDrawElementTransformPosition.parentCount;
      return new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"](this.lastDrawTransform.order.slice(-parentCount));
    } // Start an animation plan of phases ending in a callback

  }, {
    key: "animatePlan",
    value: function animatePlan(phases) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.stopAnimating();
      this.stopMovingFreely();
      this.stopBeingMoved();
      this.animate.transform.plan = [];

      for (var i = 0, j = phases.length; i < j; i += 1) {
        this.animate.transform.plan.push(phases[i]);
      }

      if (this.animate.transform.plan.length > 0) {
        if (callback) {
          this.animate.transform.callback = callback;
        }

        this.state.isAnimating = true;
        this.state.animation.currentPhaseIndex = 0;
        this.animatePhase(this.state.animation.currentPhaseIndex);
      }
    }
  }, {
    key: "animateColorPlan",
    value: function animateColorPlan(phases) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.stopAnimatingColor();
      this.animate.color.plan = [];

      for (var i = 0, j = phases.length; i < j; i += 1) {
        this.animate.color.plan.push(phases[i]);
      }

      if (this.animate.color.plan.length > 0) {
        if (callback) {
          this.animate.color.callback = callback;
        } // console.log(this.animate.color.toDisolve, this.name)
        // this.state.disolving = this.animate.color.toDisolve;
        // this.animate.color.toDisolve = '';


        this.state.isAnimatingColor = true;
        this.state.colorAnimation.currentPhaseIndex = 0;
        this.animateColorPhase(this.state.colorAnimation.currentPhaseIndex);
      }
    }
  }, {
    key: "animateCustomPlan",
    value: function animateCustomPlan(phases) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.stopAnimatingCustom();
      this.animate.custom.plan = [];

      for (var i = 0, j = phases.length; i < j; i += 1) {
        this.animate.custom.plan.push(phases[i]);
      }

      if (this.animate.custom.plan.length > 0) {
        if (callback) {
          this.animate.custom.callback = callback;
        }

        this.state.isAnimatingCustom = true;
        this.state.customAnimation.currentPhaseIndex = 0;
        this.animateCustomPhase(this.state.customAnimation.currentPhaseIndex);
      }
    } // Start the animation of a phase - this should only be called by methods
    // internal to this class.

  }, {
    key: "animatePhase",
    value: function animatePhase(index) {
      this.state.animation.currentPhase = this.animate.transform.plan[index];
      this.state.animation.currentPhase.start(this.transform._dup());
    }
  }, {
    key: "animateColorPhase",
    value: function animateColorPhase(index) {
      this.state.colorAnimation.currentPhase = this.animate.color.plan[index];
      this.state.colorAnimation.currentPhase.start(this);
    }
  }, {
    key: "animateCustomPhase",
    value: function animateCustomPhase(index) {
      this.state.customAnimation.currentPhase = this.animate.custom.plan[index];
      this.state.customAnimation.currentPhase.start();
    }
  }, {
    key: "stopAnimatingGeneric",
    value: function stopAnimatingGeneric(cancelled, forceSetToEnd, currentPhaseIndex, animateString, isState) {
      // Animation state needs to be cleaned up before calling callbacks
      // as the last phase callback may trigger more animations which need
      // to start from scratch (and not use the existing callback for example).
      // Therefore, make some temporary variables to store the animation state.
      var runRemainingPhases = false; // const currentIndex = currentPhaseIndex;

      var runLastPhase = false;
      var _this$animate$animate = this.animate[animateString],
          plan = _this$animate$animate.plan,
          callback = _this$animate$animate.callback; // If the animation was cancelled, then run finish on all unfinished
      // phases.

      if (plan.length > 0 && this.state[isState] && cancelled) {
        runRemainingPhases = true;
      } // If the animation finished without being cancelled, then just call
      // the finish routine on the last phase as it hasn't been called yet
      // by setNextTransform


      if (!cancelled) {
        runLastPhase = true;
      } // Reset the animation state, plan and callback


      this.state[isState] = false; // $FlowFixMe

      this.animate[animateString].plan = [];
      this.animate[animateString].callback = null; // Finish remaining phases if required.

      if (runRemainingPhases) {
        var endIndex = plan.length - 1;

        for (var i = currentPhaseIndex; i <= endIndex; i += 1) {
          var phase = plan[i];

          if (phase instanceof _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__["CustomAnimationPhase"]) {
            phase.finish(cancelled, forceSetToEnd);
          } else {
            phase.finish(this, cancelled, forceSetToEnd);
          }
        }
      } // Finish last phases if required.


      if (runLastPhase) {
        if (plan.length > 0) {
          var _phase = plan.slice(-1)[0];

          if (_phase instanceof _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__["CustomAnimationPhase"]) {
            _phase.finish(cancelled, forceSetToEnd);
          } else {
            _phase.finish(this, cancelled, forceSetToEnd);
          }
        }
      } // Run animation plan callback if it exists.


      if (callback != null) {
        callback(cancelled);
      }
    } // When animation is stopped, any callback associated with the animation
    // needs to be called, with whatever is passed to stopAnimating.

  }, {
    key: "stopAnimating",
    value: function stopAnimating() {
      var cancelled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var forceSetToEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.stopAnimatingGeneric(cancelled, forceSetToEnd, this.state.animation.currentPhaseIndex, 'transform', 'isAnimating');
    }
  }, {
    key: "stopAnimatingColor",
    value: function stopAnimatingColor() {
      var cancelled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var forceSetToEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.stopAnimatingGeneric(cancelled, forceSetToEnd, this.state.colorAnimation.currentPhaseIndex, 'color', 'isAnimatingColor');
    }
  }, {
    key: "stopAnimatingCustom",
    value: function stopAnimatingCustom() {
      var cancelled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var forceSetToEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.stopAnimatingGeneric(cancelled, forceSetToEnd, this.state.colorAnimation.currentPhaseIndex, 'custom', 'isAnimatingCustom');
    } // **************************************************************
    // **************************************************************
    // Helper functions for quicker animation plans

  }, {
    key: "animateTo",
    value: function animateTo(transform) {
      var timeOrVelocity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var rotDirection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var easeFunction = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];
      this.animateTransformToWithDelay(transform, delay, timeOrVelocity, rotDirection, callback, true, easeFunction);
    }
  }, {
    key: "animateFrom",
    value: function animateFrom(transform) {
      var timeOrVelocity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var rotDirection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var easeFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];

      var target = this.transform._dup();

      this.animateTransformToWithDelay(target, 0, timeOrVelocity, rotDirection, callback, true, easeFunction);
    }
  }, {
    key: "animateColorTo",
    value: function animateColorTo(color) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var finishOnCancel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var easeFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["linear"];
      this.animateColorToWithDelay(color, 0, time, null, callback, finishOnCancel, easeFunction);
    }
  }, {
    key: "animateTransformToWithDelay",
    value: function animateTransformToWithDelay(targetTransform) {
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var timeOrVelocity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var rotDirection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var finishOnCancel = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
      var easeFunction = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];
      var addToExistingPlan = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;
      var callbackToUse = checkCallback(callback);
      var moveTime = 0;

      if (timeOrVelocity instanceof _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]) {
        moveTime = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["getMaxTimeFromVelocity"])(this.transform, targetTransform, timeOrVelocity, rotDirection);
      } else {
        moveTime = timeOrVelocity;
      }

      if (delay === 0 && moveTime === 0) {
        this.setTransform(targetTransform);
        callbackToUse(false);
        return;
      }

      var phaseDelay = null;
      var phaseMove = null;
      var phases = [];
      var delayCallback = null;
      var moveCallback = callbackToUse;

      if (moveTime === 0) {
        delayCallback = function delayCallback(cancelled) {
          callbackToUse(cancelled);
        };

        moveCallback = null;
      }

      if (delay > 0) {
        var delayTransform = this.transform._dup();

        if (addToExistingPlan && this.animate.transform.plan.length > 0) {
          delayTransform = this.animate.transform.plan.slice(-1)[0].targetTransform._dup();
        }

        phaseDelay = new _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__["AnimationPhase"](delayTransform, delayTransform, delay, rotDirection, delayCallback, finishOnCancel, _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["linear"], this.animate.transform.translation.style, this.animate.transform.translation.options);
        phases.push(phaseDelay);
      }

      if (moveTime > 0) {
        phaseMove = new _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__["AnimationPhase"](null, targetTransform, timeOrVelocity, rotDirection, moveCallback, finishOnCancel, easeFunction, this.animate.transform.translation.style, this.animate.transform.translation.options);
        phases.push(phaseMove);
      }

      if (phases.length > 0) {
        if (addToExistingPlan && this.state.isAnimating) {
          this.animate.transform.plan = _toConsumableArray(this.animate.transform.plan).concat(phases);
        } else {
          this.animatePlan(phases);
        }
      }
    }
  }, {
    key: "animateColorToWithDelay",
    value: function animateColorToWithDelay(color, delay) {
      var _this2 = this;

      var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var disolve = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var finishOnCancel = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
      var easeFunction = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["linear"];
      var addToExistingPlan = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;
      var callbackToUse = checkCallback(callback);

      if (delay === 0 && time === 0) {
        this.setColor(color);
        callbackToUse(false);
        return;
      }

      var phaseDelay = null;
      var phaseColor = null;
      var phases = [];
      var delayCallback = null;
      var colorCallback = callbackToUse;

      if (time === 0) {
        delayCallback = function delayCallback(cancelled) {
          if (!cancelled && finishOnCancel) {
            _this2.setColor(color);
          }

          callbackToUse(cancelled);
        };

        colorCallback = null;
      }

      if (delay > 0) {
        var delayColor = this.color.slice();

        if (addToExistingPlan && this.animate.color.plan.length > 0) {
          delayColor = this.animate.color.plan.slice(-1)[0].targetColor.slice();
        }

        var delayDisolve = null;

        if (disolve === 'in') {
          delayColor[3] = 0.01;
          delayDisolve = 'in';
        }

        phaseDelay = new _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__["ColorAnimationPhase"](delayColor, delayColor, delay, delayDisolve, delayCallback, finishOnCancel, _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["linear"]);
        phases.push(phaseDelay);
      }

      if (time > 0) {
        phaseColor = new _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__["ColorAnimationPhase"](null, color, time, disolve, colorCallback, finishOnCancel, easeFunction);
        phases.push(phaseColor);
      }

      if (phases.length > 0) {
        if (addToExistingPlan && this.state.isAnimatingColor) {
          this.animate.color.plan = _toConsumableArray(this.animate.color.plan).concat(phases);
        } else {
          this.animateColorPlan(phases);
        }
      }
    }
  }, {
    key: "disolveOutWithDelay",
    value: function disolveOutWithDelay() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      this.animateColorToWithDelay(this.color, delay, time, 'out', callback);
    }
  }, {
    key: "disolveInWithDelay",
    value: function disolveInWithDelay() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      this.animateColorToWithDelay(this.color, delay, time, 'in', callback);
    }
  }, {
    key: "disolveWithDelay",
    value: function disolveWithDelay() {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var disolve = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'in';
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var finishOnCancel = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      this.animateColorToWithDelay(this.color, delay, time, disolve, callback, finishOnCancel);
    }
  }, {
    key: "animateCustomTo",
    value: function animateCustomTo(phaseCallback) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var startPercent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var easeFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["linear"];
      this.animateCustomToWithDelay(0, phaseCallback, time, startPercent, callback, true, easeFunction, true);
    }
  }, {
    key: "animateCustomToWithDelay",
    value: function animateCustomToWithDelay(delay, phaseCallback) {
      var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var startPercent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var finishOnCancel = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
      var easeFunction = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];
      var addToExistingPlan = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;
      var callbackToUse = checkCallback(callback);

      if (delay === 0 && time === 0) {
        phaseCallback(1);
        callbackToUse(false);
        return;
      }

      var phaseDelay = null;
      var phaseCustom = null;
      var phases = [];
      var delayCallback = null;
      var customCallback = callbackToUse;

      if (time === 0) {
        delayCallback = function delayCallback(cancelled) {
          callbackToUse(cancelled);
        };

        customCallback = null;
      }

      if (delay > 0) {
        phaseDelay = new _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__["CustomAnimationPhase"](function () {}, delay, 0, delayCallback, finishOnCancel, _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["linear"]);
        phases.push(phaseDelay);
      }

      if (time > 0) {
        phaseCustom = new _AnimationPhase__WEBPACK_IMPORTED_MODULE_8__["CustomAnimationPhase"](phaseCallback, time, startPercent, customCallback, finishOnCancel, easeFunction);
        phases.push(phaseCustom);
      }

      if (phases.length > 0) {
        if (addToExistingPlan && this.state.isAnimating) {
          this.animate.custom.plan = _toConsumableArray(this.animate.custom.plan).concat(phases);
        } else {
          this.animateCustomPlan(phases);
        }
      } // if (delay === 0 && time === 0) {
      //   if (callback != null) {
      //     callback();
      //   }
      //   return;
      // }
      // let timeToUse = time;
      // if (time === 0) {
      //   timeToUse = 0.0001;
      // }
      // const phaseDelay = new CustomAnimationPhase(() => {}, delay, 0, easeFunction);
      // const phaseMove = new CustomAnimationPhase(
      //   phaseCallback, timeToUse,
      //   startPercent, easeFunction,
      // );
      // if (delay === 0) {
      //   this.animateCustomPlan([phaseMove], checkCallback(callback));
      // } else {
      //   this.animateCustomPlan([phaseDelay, phaseMove], checkCallback(callback));
      // }

    }
  }, {
    key: "disolveIn",
    value: function disolveIn() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.disolveInWithDelay(0, time, callback);
    }
  }, {
    key: "disolveOut",
    value: function disolveOut() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.disolveOutWithDelay(0, time, callback);
    } // With update only first instace of translation in the transform order

  }, {
    key: "animateTranslationTo",
    value: function animateTranslationTo(translation) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var easeFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];

      var transform = this.transform._dup();

      transform.updateTranslation(translation);
      this.animateTransformToWithDelay(transform, 0, time, 0, callback, true, easeFunction);
    } // With update only first instace of translation in the transform order

  }, {
    key: "animateScaleTo",
    value: function animateScaleTo(scale) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var easeFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];

      var transform = this.transform._dup();

      transform.updateScale(scale);
      this.animateTransformToWithDelay(transform, 0, time, 0, callback, true, easeFunction);
    } // Will update only first instace of translation in the transform order

  }, {
    key: "animateTranslationFrom",
    value: function animateTranslationFrom(translation) {
      var timeOrVelocity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var easeFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];

      var target = this.transform._dup();

      this.transform.updateTranslation(translation);
      this.animateTransformToWithDelay(target, 0, timeOrVelocity, 0, callback, true, easeFunction); // this.animateTo(target, timeOrVelocity, 0, 0, callback, easeFunction);
    }
  }, {
    key: "animateTranslationToWithDelay",
    value: function animateTranslationToWithDelay(translation) {
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var easeFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];

      var transform = this.transform._dup();

      transform.updateTranslation(translation);
      this.animateTransformToWithDelay(transform, delay, time, 0, callback, true, easeFunction);
    } // With update only first instace of rotation in the transform order

  }, {
    key: "animateRotationTo",
    value: function animateRotationTo(rotation, rotDirection) {
      var timeOrVelocity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var easeFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];

      var transform = this.transform._dup();

      transform.updateRotation(rotation);
      this.animateTransformToWithDelay(transform, 0, timeOrVelocity, rotDirection, callback, true, easeFunction);
    } // With update only first instace of rotation in the transform order

  }, {
    key: "animateTranslationAndRotationTo",
    value: function animateTranslationAndRotationTo(translation, rotation, rotDirection) {
      var time = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var easeFunction = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];

      var transform = this.transform._dup();

      transform.updateRotation(rotation);
      transform.updateTranslation(translation._dup());
      this.animateTransformToWithDelay(transform, 0, time, rotDirection, callback, true, easeFunction);
    }
  }, {
    key: "animateTranslationAndScaleTo",
    value: function animateTranslationAndScaleTo(translation, scale) {
      var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var easeFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];

      var transform = this.transform._dup();

      if (typeof scale === 'number') {
        transform.updateScale(scale, scale);
      } else {
        transform.updateScale(scale._dup());
      }

      transform.updateTranslation(translation._dup());
      this.animateTransformToWithDelay(transform, 0, time, 0, callback, true, easeFunction);
    } // **************************************************************
    // **************************************************************
    // Being Moved

  }, {
    key: "startBeingMoved",
    value: function startBeingMoved() {
      this.stopAnimating();
      this.stopMovingFreely();
      this.state.movement.velocity = this.transform.zero();
      this.state.movement.previousTransform = this.transform._dup();
      this.state.movement.previousTime = Date.now() / 1000;
      this.state.isBeingMoved = true;
    }
  }, {
    key: "moved",
    value: function moved(newTransform) {
      this.calcVelocity(newTransform);
      this.setTransform(newTransform._dup());
    }
  }, {
    key: "stopBeingMoved",
    value: function stopBeingMoved() {
      var currentTime = Date.now() / 1000; // Check wether last movement was a long time ago, if it was, then make
      // velocity 0 as the user has stopped moving before releasing touch/click

      if (this.state.movement.previousTime !== -1) {
        if (currentTime - this.state.movement.previousTime > 0.05) {
          this.state.movement.velocity = this.transform.zero();
        }
      }

      this.state.isBeingMoved = false;
      this.state.movement.previousTime = -1;
    }
  }, {
    key: "calcVelocity",
    value: function calcVelocity(newTransform) {
      var currentTime = Date.now() / 1000;

      if (this.state.movement.previousTime < 0) {
        this.state.movement.previousTime = currentTime;
        return;
      }

      var deltaTime = currentTime - this.state.movement.previousTime; // If the time is too small, weird calculations may happen

      if (deltaTime < 0.0001) {
        return;
      }

      this.state.movement.velocity = newTransform.velocity(this.transform, deltaTime, this.move.freely.zeroVelocityThreshold, this.move.maxVelocity);
      this.state.movement.previousTime = currentTime;
    } // Moving Freely

  }, {
    key: "startMovingFreely",
    value: function startMovingFreely() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.stopAnimating();
      this.stopBeingMoved();

      if (callback) {
        this.animate.transform.callback = callback;
      }

      this.state.isMovingFreely = true;
      this.state.movement.previousTime = -1;
      this.state.movement.velocity = this.state.movement.velocity.clipMag(this.move.freely.zeroVelocityThreshold, this.move.maxVelocity);
    }
  }, {
    key: "stopMovingFreely",
    value: function stopMovingFreely() {
      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.state.isMovingFreely = false;
      this.state.movement.previousTime = -1;

      if (this.animate.transform.callback) {
        this.animate.transform.callback(result); // if (result !== null && result !== undefined) {
        //   this.animate.transform.callback(result);
        // } else {
        //   this.animate.transform.callback();
        // }

        this.animate.transform.callback = null;
      }
    } // Take an input transform matrix, and output a list of transform matrices
    // that have been transformed by a pulse. The first matrix in the list
    // will be the largest, so when saving lastDrawTransformMatrix it can be
    // used to determine if a touch has occured in the object.
    //
    // When an object is animated or moved, it's new transform is saved as the
    // new transform of the object. In contrast, pulsing is not saved as the
    // current transform of the object, and is used only in the current draw
    // of the element.

  }, {
    key: "transformWithPulse",
    value: function transformWithPulse(now, transform) {
      var pulseTransforms = []; // To output list of transform matrices
      // If the diagram element is currently pulsing, the calculate the current
      // pulse magnitude, and transform the input matrix by the pulse

      if (this.state.isPulsing) {
        // If this is the first pulse frame, then set the startTime
        if (this.state.pulse.startTime === -1) {
          this.state.pulse.startTime = now;
        } // Calculate how much time has elapsed between this frame and the first
        // pulse frame


        var deltaTime = now - this.state.pulse.startTime; // If the elapsed time is larger than the planned pulse time, then
        // clip the elapsed time to the pulse time, and end pulsing (after this
        // draw). If the pulse time is 0, that means pulsing will loop
        // indefinitely.

        if (deltaTime > this.pulse.time && this.pulse.time !== 0) {
          // this.state.isPulsing = false;
          this.stopPulsing(true);
          deltaTime = this.pulse.time;
        } // Go through each pulse matrix planned, and transform the input matrix
        // with the pulse.


        for (var i = 0; i < this.pulse.num; i += 1) {
          // Get the current pulse magnitude
          var pulseMag = this.pulse.style(deltaTime, this.pulse.frequency, this.pulse.A instanceof Array ? this.pulse.A[i] : this.pulse.A, this.pulse.B instanceof Array ? this.pulse.B[i] : this.pulse.B, this.pulse.C instanceof Array ? this.pulse.C[i] : this.pulse.C); // Use the pulse magnitude to get the current pulse transform

          var pTransform = this.pulse.transformMethod(pulseMag); // if(this.name === '_radius') {
          // }
          // Transform the current transformMatrix by the pulse transform matrix
          // const pMatrix = m2.mul(m2.copy(transform), pTransform.matrix());
          // Push the pulse transformed matrix to the array of pulse matrices

          pulseTransforms.push(transform.transform(pTransform));
        } // If not pulsing, then make no changes to the transformMatrix.

      } else {
        pulseTransforms.push(transform._dup());
      }

      return pulseTransforms;
    }
  }, {
    key: "pulseScaleNow",
    value: function pulseScaleNow(time, scale) {
      var frequency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      this.pulse.time = time;

      if (frequency === 0 && time === 0) {
        this.pulse.frequency = 1;
      }

      if (frequency !== 0) {
        this.pulse.frequency = frequency;
      }

      if (time !== 0 && frequency === 0) {
        this.pulse.frequency = 1 / (time * 2);
      }

      this.pulse.A = 1;
      this.pulse.B = scale - 1;
      this.pulse.C = 0;
      this.pulse.num = 1;
      this.pulse.callback = callback;
      this.pulseNow();
    }
  }, {
    key: "pulseThickNow",
    value: function pulseThickNow(time, scale) {
      var num = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var bArray = [scale];
      this.pulse.num = num;

      if (this.pulse.num > 1) {
        var b = Math.abs(1 - scale);
        var bMax = b;
        var bMin = -b;
        var range = bMax - bMin;
        var bStep = range / (this.pulse.num - 1);
        bArray = [];

        for (var i = 0; i < this.pulse.num; i += 1) {
          bArray.push(bMax - i * bStep);
        }
      }

      this.pulse.time = time;
      this.pulse.frequency = 1 / (time * 2);
      this.pulse.A = 1;
      this.pulse.B = bArray;
      this.pulse.C = 0;
      this.pulse.callback = callback;
      this.pulseNow();
    }
  }, {
    key: "pulseNow",
    value: function pulseNow() {
      this.state.isPulsing = true;
      this.state.pulse.startTime = -1;
    }
  }, {
    key: "stopPulsing",
    value: function stopPulsing(result) {
      this.state.isPulsing = false;

      if (this.pulse.callback) {
        var callback = this.pulse.callback;
        this.pulse.callback = null;
        callback(result);
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      var cancelled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var forceSetToEndOfPlan = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.stopAnimating(cancelled, forceSetToEndOfPlan);
      this.stopAnimatingColor(cancelled, forceSetToEndOfPlan);
      this.stopAnimatingCustom(cancelled, forceSetToEndOfPlan);
      this.stopMovingFreely(cancelled);
      this.stopBeingMoved();
      this.stopPulsing(cancelled);
    }
  }, {
    key: "updateLimits",
    value: function updateLimits(limits) {
      this.diagramLimits = limits;
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "getGLBoundingRect",
    value: function getGLBoundingRect() {
      return new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](0, 0, 1, 1);
    }
  }, {
    key: "getDiagramBoundingRect",
    value: function getDiagramBoundingRect() {
      var gl = this.getGLBoundingRect();
      var glToDiagramScale = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.diagramLimits.width / 2, this.diagramLimits.height / 2);
      return new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](gl.left * glToDiagramScale.x, gl.bottom * glToDiagramScale.y, gl.width * glToDiagramScale.x, gl.height * glToDiagramScale.y);
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "getRelativeGLBoundingRect",
    value: function getRelativeGLBoundingRect() {
      return new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](0, 0, 1, 1);
    }
  }, {
    key: "getRelativeDiagramBoundingRect",
    value: function getRelativeDiagramBoundingRect() {
      var gl = this.getRelativeGLBoundingRect();
      var glToDiagramScale = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](this.diagramLimits.width / 2, this.diagramLimits.height / 2);
      return new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](gl.left * glToDiagramScale.x, gl.bottom * glToDiagramScale.y, gl.width * glToDiagramScale.x, gl.height * glToDiagramScale.y);
    }
  }, {
    key: "getCenterDiagramPosition",
    value: function getCenterDiagramPosition() {
      var rect = this.getDiagramBoundingRect();
      return new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](rect.left + rect.width / 2, rect.bottom + rect.height / 2);
    }
  }, {
    key: "getPosition",
    value: function getPosition() {
      var t = this.transform.t();
      var position = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);

      if (t != null) {
        position = t._dup();
      }

      return position;
    }
  }, {
    key: "getVertexSpaceDiagramPosition",
    value: function getVertexSpaceDiagramPosition(vertexSpacePoint) {
      var location = vertexSpacePoint.transformBy(this.lastDrawTransform.matrix());
      var glSpace = {
        x: {
          bottomLeft: -1,
          width: 2
        },
        y: {
          bottomLeft: -1,
          height: 2
        }
      };
      var diagramSpace = {
        x: {
          bottomLeft: this.diagramLimits.left,
          width: this.diagramLimits.width
        },
        y: {
          bottomLeft: this.diagramLimits.bottom,
          height: this.diagramLimits.height
        }
      };
      var glToDiagramSpace = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["spaceToSpaceTransform"])(glSpace, diagramSpace);
      return location.transformBy(glToDiagramSpace.matrix());
    }
  }, {
    key: "getDiagramPosition",
    value: function getDiagramPosition() {
      // console.log(this.name, this.getVertexSpaceDiagramPosition(new Point(0, 0)))
      // console.log(this.transform, this.lastDrawTransform)
      return this.getVertexSpaceDiagramPosition(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0)); // const location = new Point(0, 0).transformBy(this.lastDrawTransform.matrix());
      // const glSpace = {
      //   x: { bottomLeft: -1, width: 2 },
      //   y: { bottomLeft: -1, height: 2 },
      // };
      // const diagramSpace = {
      //   x: {
      //     bottomLeft: this.diagramLimits.left,
      //     width: this.diagramLimits.width,
      //   },
      //   y: {
      //     bottomLeft: this.diagramLimits.bottom,
      //     height: this.diagramLimits.height,
      //   },
      // };
      // const glToDiagramSpace = spaceToSpaceTransform(glSpace, diagramSpace);
      // return location.transformBy(glToDiagramSpace.matrix());
    }
  }, {
    key: "setDiagramPosition",
    value: function setDiagramPosition(diagramPosition) {
      var glSpace = {
        x: {
          bottomLeft: -1,
          width: 2
        },
        y: {
          bottomLeft: -1,
          height: 2
        }
      };
      var diagramSpace = {
        x: {
          bottomLeft: this.diagramLimits.left,
          width: this.diagramLimits.width
        },
        y: {
          bottomLeft: this.diagramLimits.bottom,
          height: this.diagramLimits.height
        }
      };
      var diagramToGLSpace = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["spaceToSpaceTransform"])(diagramSpace, glSpace);
      var glLocation = diagramPosition.transformBy(diagramToGLSpace.matrix());
      var t = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"](this.lastDrawTransform.order.slice(2));
      var newLocation = glLocation.transformBy(_tools_m2__WEBPACK_IMPORTED_MODULE_1__["inverse"](t.matrix()));
      this.setPosition(newLocation._dup());
    }
  }, {
    key: "setDiagramPositionToElement",
    value: function setDiagramPositionToElement(element) {
      var p = element.getDiagramPosition();
      this.setDiagramPosition(p._dup());
    }
  }, {
    key: "setPositionToElement",
    value: function setPositionToElement(element) {
      var p = element.transform.t();

      if (p != null) {
        this.setPosition(p._dup());
      }
    }
  }, {
    key: "setMoveBoundaryToDiagram",
    value: function setMoveBoundaryToDiagram() {
      var boundary = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [this.diagramLimits.left, this.diagramLimits.top - this.diagramLimits.height, this.diagramLimits.left + this.diagramLimits.width, this.diagramLimits.top];
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](1, 1);

      if (!this.isMovable) {
        return;
      }

      if (!this.move.limitToDiagram) {
        return;
      }

      var glSpace = {
        x: {
          bottomLeft: -1,
          width: 2
        },
        y: {
          bottomLeft: -1,
          height: 2
        }
      };
      var diagramSpace = {
        x: {
          bottomLeft: this.diagramLimits.left,
          width: this.diagramLimits.width
        },
        y: {
          bottomLeft: this.diagramLimits.bottom,
          height: this.diagramLimits.height
        }
      };
      var glToDiagramSpace = Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["spaceToSpaceTransform"])(glSpace, diagramSpace);
      var rect = this.getRelativeGLBoundingRect();
      var glToDiagramScaleMatrix = [glToDiagramSpace.matrix()[0], 0, 0, 0, glToDiagramSpace.matrix()[4], 0, 0, 0, 1];
      var minPoint = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](rect.left, rect.bottom).transformBy(glToDiagramScaleMatrix);
      var maxPoint = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](rect.right, rect.top).transformBy(glToDiagramScaleMatrix);
      var min = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      var max = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      min.x = boundary[0] - minPoint.x * scale.x;
      min.y = boundary[1] - minPoint.y * scale.y;
      max.x = boundary[2] - maxPoint.x * scale.x;
      max.y = boundary[3] - maxPoint.y * scale.y;
      this.move.maxTransform.updateTranslation(max.x, max.y);
      this.move.minTransform.updateTranslation(min.x, min.y);
    }
  }, {
    key: "show",
    value: function show() {
      this.isShown = true;
    }
  }, {
    key: "showAll",
    value: function showAll() {
      this.show();
    }
  }, {
    key: "hide",
    value: function hide() {
      this.isShown = false;
    }
  }, {
    key: "hideAll",
    value: function hideAll() {
      this.hide();
    }
  }, {
    key: "toggleShow",
    value: function toggleShow() {
      if (this.isShown) {
        this.hide();
      } else {
        this.show();
      }
    }
  }, {
    key: "click",
    value: function click() {
      if (this.onClick !== null && this.onClick !== undefined) {
        this.onClick(this);
      }
    }
  }, {
    key: "setMovable",
    value: function setMovable() {
      var movable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (movable) {
        this.isTouchable = true;
        this.isMovable = true;
      }
    } // processParentTransform(parentTransform: Transform): Transform {
    //   let newTransform;
    //   if (this.noRotationFromParent) {
    //     const finalParentTransform = parentTransform._dup();
    //     let r = 0;
    //     for (let i = 0; i < finalParentTransform.order.length; i += 1) {
    //       const t = finalParentTransform.order[i];
    //       if (t instanceof Rotation) {
    //         r += t.r;
    //       }
    //     }
    //     const m = parentTransform.matrix();
    //     const translation = new Point(m[2], m[5]);
    //     const scale = new Point(
    //       new Point(m[0], m[3]).distance(),
    //       new Point(m[1], m[4]).distance(),
    //     );
    //     newTransform = new Transform()
    //       .scale(scale)
    //       // .rotate(r)
    //       .translate(translation);
    //   } else {
    //     newTransform = parentTransform;
    //   }
    //   return newTransform;
    // }

  }]);

  return DiagramElement;
}(); // ***************************************************************
// Geometry Object
// ***************************************************************


var DiagramElementPrimative =
/*#__PURE__*/
function (_DiagramElement) {
  _inherits(DiagramElementPrimative, _DiagramElement);

  function DiagramElementPrimative(drawingObject) {
    var _this3;

    var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
    var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0.5, 0.5, 0.5, 1];
    var diagramLimits = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](-1, -1, 2, 2);

    _classCallCheck(this, DiagramElementPrimative);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(DiagramElementPrimative).call(this, transform, diagramLimits));
    _this3.drawingObject = drawingObject;
    _this3.color = color.slice();
    _this3.pointsToDraw = -1;
    _this3.angleToDraw = -1;
    _this3.lengthToDraw = -1;
    _this3.cannotTouchHole = false; // this.setMoveBoundaryToDiagram();

    return _this3;
  }

  _createClass(DiagramElementPrimative, [{
    key: "isBeingTouched",
    value: function isBeingTouched(glLocation) {
      if (!this.isTouchable) {
        return false;
      }

      var boundaries = this.drawingObject.getGLBoundaries(this.lastDrawTransform.matrix());
      var holeBoundaries = this.drawingObject.getGLBoundaryHoles(this.lastDrawTransform.matrix());

      for (var i = 0; i < boundaries.length; i += 1) {
        var boundary = boundaries[i];

        if (glLocation.isInPolygon(boundary)) {
          var isTouched = true;

          if (this.cannotTouchHole) {
            for (var j = 0; j < holeBoundaries.length; j += 1) {
              var holeBoundary = holeBoundaries[j];

              if (glLocation.isInPolygon(holeBoundary)) {
                isTouched = false;
                j = holeBoundaries.length;
              }
            }
          }

          if (isTouched) {
            return true;
          }
        }
      }

      return false;
    }
  }, {
    key: "_dup",
    value: function _dup() {
      var transform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      // const vertices = this.drawingObject._dup();
      var primative = new DiagramElementPrimative(this.drawingObject._dup()); // const primative = new DiagramElementPrimative(
      //   vertices,
      //   transform,
      //   color,
      //   this.diagramLimits._dup(),
      // );
      // primative.pointsToDraw = this.pointsToDraw;
      // primative.angleToDraw = this.angleToDraw;
      // primative.copyFrom(this);

      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_7__["duplicateFromTo"])(this, primative);

      if (transform != null) {
        primative.transform = transform._dup();
      }

      return primative;
    }
  }, {
    key: "setColor",
    value: function setColor(color) {
      this.color = color.slice();

      if (this instanceof DiagramElementPrimative) {
        if (this.drawingObject instanceof _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_6__["TextObject"]) {
          this.drawingObject.setColor(this.color);
        }

        if (this.drawingObject instanceof _DrawingObjects_HTMLObject_HTMLObject__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          // $FlowFixMe
          this.drawingObject.element.style.color = Object(_tools_tools__WEBPACK_IMPORTED_MODULE_7__["colorArrayToRGBA"])(this.color);
        }
      }
    }
  }, {
    key: "show",
    value: function show() {
      _get(_getPrototypeOf(DiagramElementPrimative.prototype), "show", this).call(this);

      if (this.drawingObject instanceof _DrawingObjects_HTMLObject_HTMLObject__WEBPACK_IMPORTED_MODULE_3__["default"]) {
        this.drawingObject.show = true;
        this.drawingObject.transformHtml(this.lastDrawTransform.matrix());
      }
    } // showAll() {
    //   this.show();
    // }

  }, {
    key: "hide",
    value: function hide() {
      _get(_getPrototypeOf(DiagramElementPrimative.prototype), "hide", this).call(this);

      if (this.drawingObject instanceof _DrawingObjects_HTMLObject_HTMLObject__WEBPACK_IMPORTED_MODULE_3__["default"]) {
        this.drawingObject.show = false;
        this.drawingObject.transformHtml(this.lastDrawTransform.matrix());
      }
    } // hideAll() {
    //   this.hide();
    // }

  }, {
    key: "getTouched",
    value: function getTouched(glLocation) {
      if (!this.isTouchable) {
        return [];
      }

      if (this.isBeingTouched(glLocation)) {
        return [this];
      }

      return [];
    }
  }, {
    key: "setFont",
    value: function setFont(fontSize) {
      if (this.drawingObject instanceof _DrawingObjects_TextObject_TextObject__WEBPACK_IMPORTED_MODULE_6__["TextObject"]) {
        this.drawingObject.setFont(fontSize);
      }
    }
  }, {
    key: "resizeHtmlObject",
    value: function resizeHtmlObject() {
      if (this.drawingObject instanceof _DrawingObjects_HTMLObject_HTMLObject__WEBPACK_IMPORTED_MODULE_3__["default"]) {
        this.drawingObject.transformHtml(this.lastDrawTransform.matrix());
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this4 = this;

      var parentTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (this.isShown) {
        this.setNextTransform(now);
        this.setNextColor(now); // set next color can end up hiding an element when disolving out

        if (!this.isShown) {
          return;
        }

        this.setNextCustomAnimation(now); // this.lastDrawParentTransform = parentTransform._dup();

        this.lastDrawElementTransformPosition = {
          parentCount: parentTransform.order.length,
          elementCount: this.transform.order.length
        }; // const finalParentTransform = this.processParentTransform(parentTransform);

        var newTransform = parentTransform.transform(this.transform);
        var pulseTransforms = this.transformWithPulse(now, newTransform); // let matrix = m2.mul(transformMatrix, this.transform.matrix());
        // matrix = this.transformWithPulse(now, matrix);
        // eslint-disable-next-line prefer-destructuring

        this.lastDrawTransform = pulseTransforms[0]; // this.lastDrawPulseTransform = pulseTransforms[0]._dup();

        var pointCount = -1;

        if (this.drawingObject instanceof _DrawingObjects_VertexObject_VertexObject__WEBPACK_IMPORTED_MODULE_5__["default"]) {
          pointCount = this.drawingObject.numPoints;

          if (this.angleToDraw !== -1) {
            pointCount = this.drawingObject.getPointCountForAngle(this.angleToDraw);
          }

          if (this.lengthToDraw !== -1) {
            pointCount = this.drawingObject.getPointCountForLength(this.lengthToDraw);
          }

          if (this.pointsToDraw !== -1) {
            pointCount = this.pointsToDraw;
          }
        }

        pulseTransforms.forEach(function (t) {
          _this4.drawingObject.drawWithTransformMatrix(t.matrix(), _this4.color, pointCount);
        });
      }
    }
  }, {
    key: "setFirstTransform",
    value: function setFirstTransform() {
      var parentTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      this.lastDrawElementTransformPosition = {
        parentCount: parentTransform.order.length,
        elementCount: this.transform.order.length
      }; // const finalParentTransform = this.processParentTransform(parentTransform);

      var firstTransform = parentTransform.transform(this.transform);
      this.lastDrawTransform = firstTransform;

      if (this.drawingObject instanceof _DrawingObjects_HTMLObject_HTMLObject__WEBPACK_IMPORTED_MODULE_3__["default"]) {
        this.drawingObject.transformHtml(firstTransform.matrix());
      }

      this.setMoveBoundaryToDiagram();
    }
  }, {
    key: "isMoving",
    value: function isMoving() {
      if (this.state.isAnimating || this.state.isMovingFreely || this.state.isBeingMoved || this.state.isPulsing || this.state.isAnimatingColor || this.state.isAnimatingCustom) {
        return true;
      }

      return false;
    } // // Update the translation move boundary for the element's transform.
    // // This will limit the first translation part of the transform to only
    // // translations within the max/min limit.
    // updateMoveTranslationBoundary(
    //   bounday: Array<number> = [
    //     this.diagramLimits.left,
    //     this.diagramLimits.top - this.diagramLimits.height,
    //     this.diagramLimits.left + this.diagramLimits.width,
    //     this.diagramLimits.top],
    //   scale: Point = new Point(1, 1),
    // ): void {
    //   const glSpace = {
    //     x: { bottomLeft: -1, width: 2 },
    //     y: { bottomLeft: -1, height: 2 },
    //   };
    //   const diagramSpace = {
    //     x: {
    //       bottomLeft: this.diagramLimits.left,
    //       width: this.diagramLimits.width,
    //     },
    //     y: {
    //       bottomLeft: this.diagramLimits.bottom,
    //       height: this.diagramLimits.height,
    //     },
    //   };
    //   const glToDiagramSpace = spaceToSpaceTransform(glSpace, diagramSpace);
    //   const rect = this.drawingObject.getRelativeGLBoundingRect(this.lastDrawTransform.matrix());
    //   const minPoint = new Point(rect.left, rect.bottom).transformBy(glToDiagramSpace.matrix());
    //   const maxPoint = new Point(rect.right, rect.top).transformBy(glToDiagramSpace.matrix());
    //   const min = new Point(0, 0);
    //   const max = new Point(0, 0);
    //   min.x = bounday[0] - minPoint.x * scale.x;
    //   min.y = bounday[1] - minPoint.y * scale.y;
    //   max.x = bounday[2] - maxPoint.x * scale.x;
    //   max.y = bounday[3] - maxPoint.y * scale.y;
    //   this.move.maxTransform.updateTranslation(
    //     max.x,
    //     max.y,
    //   );
    //   this.move.minTransform.updateTranslation(
    //     min.x,
    //     min.y,
    //   );
    // }

  }, {
    key: "getGLBoundaries",
    value: function getGLBoundaries() {
      return this.drawingObject.getGLBoundaries(this.lastDrawTransform.matrix());
    }
  }, {
    key: "getVertexSpaceBoundaries",
    value: function getVertexSpaceBoundaries() {
      return this.drawingObject.border;
    }
  }, {
    key: "getGLBoundingRect",
    value: function getGLBoundingRect() {
      return this.drawingObject.getGLBoundingRect(this.lastDrawTransform.matrix());
    }
  }, {
    key: "getVertexSpaceBoundingRect",
    value: function getVertexSpaceBoundingRect() {
      return this.drawingObject.getVertexSpaceBoundingRect();
    }
  }, {
    key: "getRelativeGLBoundingRect",
    value: function getRelativeGLBoundingRect() {
      return this.drawingObject.getRelativeGLBoundingRect(this.lastDrawTransform.matrix());
    }
  }, {
    key: "getRelativeVertexSpaceBoundingRect",
    value: function getRelativeVertexSpaceBoundingRect() {
      return this.drawingObject.getRelativeVertexSpaceBoundingRect();
    }
  }]);

  return DiagramElementPrimative;
}(DiagramElement); // ***************************************************************
// Collection of Geometry Objects or Collections
// ***************************************************************


var DiagramElementCollection =
/*#__PURE__*/
function (_DiagramElement2) {
  _inherits(DiagramElementCollection, _DiagramElement2);

  // biasTransform: Array<number>;
  function DiagramElementCollection() {
    var _this5;

    var transform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
    var diagramLimits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](-1, 1, 2, 2);

    _classCallCheck(this, DiagramElementCollection);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(DiagramElementCollection).call(this, transform, diagramLimits));
    _this5.elements = {};
    _this5.order = [];
    _this5.touchInBoundingRect = false;
    _this5.eqns = {};
    return _this5;
  }

  _createClass(DiagramElementCollection, [{
    key: "_dup",
    value: function _dup() {
      var collection = new DiagramElementCollection(); // collection.touchInBoundingRect = this.touchInBoundingRect;
      // collection.copyFrom(this);

      var doNotDuplicate = this.order.map(function (e) {
        return "_".concat(e);
      });
      Object(_tools_tools__WEBPACK_IMPORTED_MODULE_7__["duplicateFromTo"])(this, collection, ['elements', 'order'].concat(_toConsumableArray(doNotDuplicate)));

      for (var i = 0; i < this.order.length; i += 1) {
        var name = this.order[i];
        collection.add(name, this.elements[name]._dup());
      }

      return collection;
    }
  }, {
    key: "isMoving",
    value: function isMoving() {
      if (this.isShown === false) {
        return false;
      }

      if (this.state.isAnimating || this.state.isAnimatingCustom || this.state.isAnimatingColor || this.state.isMovingFreely || this.state.isBeingMoved || this.state.isPulsing) {
        return true;
      }

      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];

        if (element instanceof DiagramElementCollection) {
          if (element.isMoving()) {
            return true;
          }
        } else if (element.isShown && element.color[3] > 0 && element.isMoving()) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "add",
    value: function add(name, diagramElement) {
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
      this.elements[name] = diagramElement;
      this.elements[name].name = name; // $FlowFixMe

      this["_".concat(name)] = this.elements[name];

      if (index !== -1) {
        this.order = _toConsumableArray(this.order.slice(0, index)).concat([name], _toConsumableArray(this.order.slice(index)));
      } else {
        this.order.push(name);
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      var parentTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (this.isShown) {
        this.setNextTransform(now);
        this.setNextColor(now); // set next color can end up hiding an element when disolving out

        if (!this.isShown) {
          return;
        }

        this.setNextCustomAnimation(now); // this.lastDrawParentTransform = parentTransform._dup();
        // this.lastDrawElementTransform = this.transform._dup();

        this.lastDrawElementTransformPosition = {
          parentCount: parentTransform.order.length,
          elementCount: this.transform.order.length
        }; // const finalParentTransform = this.processParentTransform(parentTransform);

        var newTransform = parentTransform.transform(this.transform);
        var pulseTransforms = this.transformWithPulse(now, newTransform); // eslint-disable-next-line prefer-destructuring

        this.lastDrawTransform = pulseTransforms[0]; // this.lastDrawPulseTransform = pulseTransforms[0]._dup();

        for (var k = 0; k < pulseTransforms.length; k += 1) {
          for (var i = 0, j = this.order.length; i < j; i += 1) {
            this.elements[this.order[i]].draw(pulseTransforms[k], now);
          }
        }
      }
    }
  }, {
    key: "show",
    value: function show() {
      var listToShow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      _get(_getPrototypeOf(DiagramElementCollection.prototype), "show", this).call(this);

      listToShow.forEach(function (element) {
        if (element instanceof DiagramElementCollection) {
          element.showAll();
        } else {
          element.show();
        }
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      var listToShow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      _get(_getPrototypeOf(DiagramElementCollection.prototype), "hide", this).call(this);

      listToShow.forEach(function (element) {
        if (element instanceof DiagramElementCollection) {
          element.hideAll();
        } else {
          element.show();
        }
      });
    }
  }, {
    key: "showAll",
    value: function showAll() {
      this.show();

      for (var i = 0, j = this.order.length; i < j; i += 1) {
        var element = this.elements[this.order[i]];
        element.show();

        if (typeof element.hideAll === 'function') {
          element.showAll();
        }
      }
    }
  }, {
    key: "hideAll",
    value: function hideAll() {
      this.hide();

      for (var i = 0, j = this.order.length; i < j; i += 1) {
        var element = this.elements[this.order[i]];
        element.hide();

        if (typeof element.hideAll === 'function') {
          element.hideAll();
        }
      }
    }
  }, {
    key: "showOnly",
    value: function showOnly(listToShow) {
      this.hideAll();
      this.show();

      for (var i = 0, j = listToShow.length; i < j; i += 1) {
        var element = listToShow[i];

        if (element) {
          element.show();
        } else {
          throw Error("Diagram Element Error: Element does not exist at position ".concat(i));
        }
      }
    }
  }, {
    key: "hideOnly",
    value: function hideOnly(listToHide) {
      this.showAll();

      for (var i = 0, j = listToHide.length; i < j; i += 1) {
        var element = listToHide[i];
        element.hide();
      }
    } // This will only search elements within the collection for a touch
    // if the collection is touchable. Note, the elements can be queried
    // directly still, and will return if they are touched if they themselves
    // are touchable.

  }, {
    key: "isBeingTouched",
    value: function isBeingTouched(glLocation) {
      if (!this.isTouchable) {
        return false;
      }

      if (this.touchInBoundingRect) {
        var boundingRect = this.getGLBoundingRect();

        if (glLocation.x >= boundingRect.left && glLocation.x <= boundingRect.right && glLocation.y <= boundingRect.top && glLocation.y >= boundingRect.bottom) {
          return true;
        }
      }

      for (var i = 0, j = this.order.length; i < j; i += 1) {
        var element = this.elements[this.order[i]];

        if (element.isShown === true) {
          if (element.isBeingTouched(glLocation)) {
            return true;
          }
        }
      }

      return false;
    }
  }, {
    key: "resizeHtmlObject",
    value: function resizeHtmlObject() {
      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];
        element.resizeHtmlObject();
      }
    }
  }, {
    key: "setFirstTransform",
    value: function setFirstTransform() {
      var parentTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Transform"]();
      // const finalParentTransform = this.processParentTransform(parentTransform);
      var firstTransform = parentTransform.transform(this.transform);
      this.lastDrawTransform = firstTransform;

      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];
        element.setFirstTransform(firstTransform);
      }

      this.setMoveBoundaryToDiagram();
    }
  }, {
    key: "getGLBoundaries",
    value: function getGLBoundaries() {
      var boundaries = [];

      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];

        if (element.isShown) {
          var elementBoundaries = element.getGLBoundaries();
          boundaries = boundaries.concat(elementBoundaries);
        }
      }

      return boundaries;
    }
  }, {
    key: "getVertexSpaceBoundaries",
    value: function getVertexSpaceBoundaries() {
      var boundaries = [];

      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];

        if (element.isShown) {
          var elementBoundaries = element.getVertexSpaceBoundaries();
          boundaries = boundaries.concat(elementBoundaries);
        }
      }

      return boundaries;
    }
  }, {
    key: "getGLBoundingRect",
    value: function getGLBoundingRect() {
      var glAbsoluteBoundaries = this.getGLBoundaries();
      return Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["getBoundingRect"])(glAbsoluteBoundaries);
    }
  }, {
    key: "getVertexSpaceBoundingRect",
    value: function getVertexSpaceBoundingRect() {
      var boundaries = this.getVertexSpaceBoundaries();
      return Object(_tools_g2__WEBPACK_IMPORTED_MODULE_0__["getBoundingRect"])(boundaries);
    }
  }, {
    key: "getRelativeGLBoundingRect",
    value: function getRelativeGLBoundingRect() {
      var boundingRect = this.getGLBoundingRect();
      var location = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0).transformBy(this.lastDrawTransform.matrix());
      return new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](boundingRect.left - location.x, boundingRect.bottom - location.y, boundingRect.width, boundingRect.height);
    }
  }, {
    key: "getRelativeVertexSpaceBoundingRect",
    value: function getRelativeVertexSpaceBoundingRect() {
      var boundingRect = this.getVertexSpaceBoundingRect();
      var location = new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](0, 0);
      return new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Rect"](boundingRect.left - location.x, boundingRect.bottom - location.y, boundingRect.width, boundingRect.height);
    }
  }, {
    key: "updateLimits",
    value: function updateLimits(limits) {
      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];
        element.updateLimits(limits);
      }

      this.diagramLimits = limits;
    } // Returns an array of touched elements.
    // In a collection, elements defined later in the collection.order
    // array are on top of earlier elements. The touched array
    // is sorted to have elements on top first, where the collection containing
    // the elements will be before it's elements. For example, the array
    // would be ordered as:
    //  0: top collection
    //  1 to n: n top elements in collection
    //  n+1: second top collection
    //  n+2 to m: top elements in second top colleciton.

  }, {
    key: "getTouched",
    value: function getTouched(glLocation) {
      if (!this.isTouchable && !this.hasTouchableElements) {
        return [];
      }

      var touched = [];

      if (this.touchInBoundingRect || this.isTouchable) {
        if (this.isBeingTouched(glLocation)) {
          touched.push(this);
        }
      }

      for (var i = this.order.length - 1; i >= 0; i -= 1) {
        var element = this.elements[this.order[i]];

        if (element.isShown === true) {
          touched = touched.concat(element.getTouched(glLocation));
        } // If there is an element that is touched, then this collection should
        // also be touched.
        // if (touched.length > 0 && this.isTouchable) {
        //   touched = [this].concat(touched);
        // }

      }

      return touched;
    }
  }, {
    key: "stop",
    value: function stop() {
      var cancelled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var forceSetToEndOfPlan = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _get(_getPrototypeOf(DiagramElementCollection.prototype), "stop", this).call(this, cancelled, forceSetToEndOfPlan);

      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];
        element.stop(cancelled, forceSetToEndOfPlan);
      }
    }
  }, {
    key: "setFont",
    value: function setFont(fontSize) {
      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];
        element.setFont(fontSize);
      }
    }
  }, {
    key: "setColor",
    value: function setColor(color) {
      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];
        element.setColor(color);
      }

      this.color = color.slice();
    }
  }, {
    key: "getElementTransforms",
    value: function getElementTransforms() {
      var out = {};

      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];
        out[element.name] = element.transform._dup();
      }

      return out;
    }
  }, {
    key: "setElementTransforms",
    value: function setElementTransforms(elementTransforms) {
      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];

        if (element.name in elementTransforms) {
          element.transform = elementTransforms[element.name];
        }
      }
    }
  }, {
    key: "animateToTransforms",
    value: function animateToTransforms(elementTransforms) // translationPath: (Point, Point, number) => Point = linearPath,
    {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var rotDirection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var easeFunction = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _tools_mathtools__WEBPACK_IMPORTED_MODULE_2__["easeinout"];
      var callbackMethod = callback;
      var timeToAnimate = 0;

      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];

        if (element.name in elementTransforms) {
          if (element.isShown) {
            if (!elementTransforms[element.name].isEqualTo(element.transform)) {
              element.animateTo(elementTransforms[element.name], time, delay, rotDirection, callbackMethod, easeFunction); // only want to send callback once

              callbackMethod = null;
              timeToAnimate = time + delay;
            }
          } else {
            element.transform = elementTransforms[element.name]._dup();
          }
        }
      }

      if (timeToAnimate === 0 && callbackMethod != null) {
        callbackMethod(true);
      }

      return timeToAnimate;
    }
  }, {
    key: "getAllPrimatives",
    value: function getAllPrimatives() {
      var elements = [];

      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];

        if (element instanceof DiagramElementCollection) {
          elements = _toConsumableArray(elements).concat(_toConsumableArray(element.getAllElements()));
        } else {
          elements.push(element);
        }
      }

      return elements;
    }
  }, {
    key: "getAllElements",
    value: function getAllElements() {
      var elements = [];

      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]];
        elements.push(element);
      }

      return elements;
    } // Get all ineractive elemnts, but only go as deep as a
    // DiagramElementColleciton if it is touchable or movable

  }, {
    key: "getAllCurrentlyInteractiveElements",
    value: function getAllCurrentlyInteractiveElements() {
      var elements = [];

      for (var i = 0; i < this.order.length; i += 1) {
        var element = this.elements[this.order[i]]; // if (element.isShown) {

        if (element instanceof DiagramElementCollection) {
          if (!element.isTouchable && !element.isMovable && element.hasTouchableElements && !element.isInteractive) {
            elements = _toConsumableArray(elements).concat(_toConsumableArray(element.getAllCurrentlyInteractiveElements()));
          }
        }

        if (element.isTouchable || element.isMovable || element.isInteractive) {
          elements.push(element);
        } // }

      }

      return elements;
    } // disolveWithDelay(
    //   delay: number = 1,
    //   time: number = 1,
    //   disolve: 'in' | 'out' = 'in',
    //   callback: ?(boolean) => void = null,
    // ): void {
    //   for (let i = 0; i < this.order.length; i += 1) {
    //     const element = this.elements[this.order[i]];
    //     console.log(element.name)
    //     element.disolveWithDelay(delay, time, disolve, callback);
    //   }
    // }
    // // deprecate
    // disolveElementsOut(
    //   time: number = 1,
    //   callback: ?(boolean) => void = null,
    // ): void {
    //   for (let i = 0; i < this.order.length; i += 1) {
    //     const element = this.elements[this.order[i]];
    //     if (element instanceof DiagramElementCollection) {
    //       element.disolveElementsOut(time, callback);
    //     } else {
    //       element.disolveOut(time, callback);
    //     }
    //   }
    // }
    // // deprecate
    // disolveElementsIn(
    //   time: number = 1,
    //   callback: ?(boolean) => void = null,
    // ): void {
    //   for (let i = 0; i < this.order.length; i += 1) {
    //     const element = this.elements[this.order[i]];
    //     if (element instanceof DiagramElementCollection) {
    //       element.disolveElementsIn(time, callback);
    //     } else {
    //       element.disolveIn(time, callback);
    //     }
    //   }
    // }
    // This method is here as a convenience method for content item selectors
    // eslint-disable-next-line class-methods-use-this

  }, {
    key: "goToStep",
    value: function goToStep(step) {
      var elem = document.getElementById('id__lesson_item_selector_0');
      var elems = [];

      if (elem != null) {
        if (elem.children.length > 0) {
          for (var i = 0; i < elem.children.length; i += 1) {
            elems.push(elem.children[i]);
          }
        }
      }

      elems.forEach(function (e, index) {
        if (index === step) {
          e.classList.add('lesson__item_selector_selected');
        } else {
          e.classList.remove('lesson__item_selector_selected');
        }
      });
    }
  }, {
    key: "setMovable",
    value: function setMovable() {
      var movable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (movable) {
        this.hasTouchableElements = true;
        this.isMovable = true;
      }
    }
  }]);

  return DiagramElementCollection;
}(DiagramElement);



/***/ }),

/***/ "./src/js/diagram/Gesture.js":
/*!***********************************!*\
  !*** ./src/js/diagram/Gesture.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _Diagram__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Diagram */ "./src/js/diagram/Diagram.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

 // eslint-disable-next-line import/no-cycle



var Gesture =
/*#__PURE__*/
function () {
  function Gesture(diagram) {
    _classCallCheck(this, Gesture);

    this.diagram = diagram; // console.log(diagram.canvas.offsetWidth)
    // this.diagram.canvas.onmousedown = this.mouseDownHandler.bind(this);
    // this.diagram.canvas.onmouseup = this.mouseUpHandler.bind(this);
    // this.diagram.canvas.onmousemove = this.mouseMoveHandler.bind(this);

    this.addEvent('mousedown', this.mouseDownHandler, false);
    this.addEvent('mouseup', this.mouseUpHandler, false);
    this.addEvent('mousemove', this.mouseMoveHandler, false);
    this.addEvent('touchstart', this.touchStartHandler, false);
    this.addEvent('touchend', this.touchEndHandler, false);
    this.addEvent('touchmove', this.touchMoveHandler, false); // this.diagram.canvas.addEventListener(
    //   'touchstart',
    //   this.touchStartHandler.bind(this), false,
    // );
    // this.diagram.canvas.addEventListener(
    //   'touchend',
    //   this.touchEndHandler.bind(this), false,
    // );
    // this.diagram.canvas.addEventListener(
    //   'touchmove',
    //   this.touchMoveHandler.bind(this), false,
    // );

    this.enable = true; // Override these if you want to use your own touch handlers

    this.start = this.diagram.touchDownHandler.bind(this.diagram);
    this.end = this.diagram.touchUpHandler.bind(this.diagram);
    this.move = this.diagram.touchMoveHandler.bind(this.diagram);
  }

  _createClass(Gesture, [{
    key: "addEvent",
    value: function addEvent(event, method, flag) {
      this.diagram.htmlCanvas.addEventListener(event, method.bind(this), flag);
    }
  }, {
    key: "removeEvent",
    value: function removeEvent(event, method, flag) {
      this.diagram.htmlCanvas.removeEventListener(event, method.bind(this), flag);
    }
  }, {
    key: "startHandler",
    value: function startHandler(point) {
      if (this.enable) {
        this.mouseDown = true;
        this.previousPoint = point;
        return this.start(point);
      }

      return false;
    }
  }, {
    key: "endHandler",
    value: function endHandler() {
      this.mouseDown = false;
      this.end();
    }
  }, {
    key: "moveHandler",
    value: function moveHandler(event, point) {
      if (this.enable && this.mouseDown) {
        var disableEvent = this.move(this.previousPoint, point);

        if (disableEvent) {
          event.preventDefault();
        }

        this.previousPoint = point;
      }

      event.preventDefault();
    }
  }, {
    key: "touchStartHandler",
    value: function touchStartHandler(event) {
      var touch = event.touches[0];
      var disableEvent = this.startHandler(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](touch.clientX, touch.clientY));

      if (disableEvent) {
        event.preventDefault();
      }
    }
  }, {
    key: "mouseDownHandler",
    value: function mouseDownHandler(event) {
      this.startHandler(new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](event.clientX, event.clientY));
    }
  }, {
    key: "touchMoveHandler",
    value: function touchMoveHandler(event) {
      var touch = event.touches[0];
      this.moveHandler(event, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](touch.clientX, touch.clientY));
    }
  }, {
    key: "mouseMoveHandler",
    value: function mouseMoveHandler(event) {
      this.moveHandler(event, new _tools_g2__WEBPACK_IMPORTED_MODULE_0__["Point"](event.clientX, event.clientY));
    }
  }, {
    key: "mouseUpHandler",
    value: function mouseUpHandler() {
      this.endHandler();
    }
  }, {
    key: "touchEndHandler",
    value: function touchEndHandler() {
      this.endHandler();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.removeEvent('mousedown', this.mouseDownHandler, false);
      this.removeEvent('mouseup', this.mouseUpHandler, false);
      this.removeEvent('mousemove', this.mouseMoveHandler, false);
      this.removeEvent('touchstart', this.touchStartHandler, false);
      this.removeEvent('touchend', this.touchEndHandler, false);
      this.removeEvent('touchmove', this.touchMoveHandler, false);
    }
  }]);

  return Gesture;
}();

/* harmony default export */ __webpack_exports__["default"] = (Gesture);

/***/ }),

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

/***/ "./src/js/diagram/webgl/GlobalAnimation.js":
/*!*************************************************!*\
  !*** ./src/js/diagram/webgl/GlobalAnimation.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Singleton class that contains projects global variables
var GlobalAnimation =
/*#__PURE__*/
function () {
  // Method for requesting the next animation frame
  // used to cancel animation frames
  function GlobalAnimation() {
    _classCallCheck(this, GlobalAnimation);

    // If the instance alread exists, then don't create a new instance.
    // If it doesn't, then setup some default values.
    if (!GlobalAnimation.instance) {
      this.requestNextAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      GlobalAnimation.instance = this;
      this.drawQueue = [];
      this.nextDrawQueue = []; // this.drawScene = this.draw.bind(this);
    }

    return GlobalAnimation.instance;
  }

  _createClass(GlobalAnimation, [{
    key: "draw",
    value: function draw(now) {
      this.drawQueue = this.nextDrawQueue;
      this.nextDrawQueue = [];
      var nowSeconds = now * 0.001;

      for (var i = 0; i < this.drawQueue.length; i += 1) {
        this.drawQueue[i](nowSeconds);
      }

      this.drawQueue = [];
    }
  }, {
    key: "queueNextFrame",
    value: function queueNextFrame(func) {
      // if (!(func in this.nextDrawQueue)) {
      this.nextDrawQueue.push(func); // }
      // if (triggerFrameRequest) {
      //   this.animateNextFrame();
      // }

      if (this.nextDrawQueue.length === 1) {
        this.animateNextFrame();
      }
    } // Queue up an animation frame

  }, {
    key: "animateNextFrame",
    value: function animateNextFrame() {
      cancelAnimationFrame(this.animationId); // $FlowFixMe

      var nextFrame = this.requestNextAnimationFrame.call(window, this.draw.bind(this));
      this.animationId = nextFrame;
    }
  }]);

  return GlobalAnimation;
}(); // Do not automatically create and instance and return it otherwise can't
// mock elements in jest
// // const globalvars: Object = new GlobalVariables();
// // Object.freeze(globalvars);


/* harmony default export */ __webpack_exports__["default"] = (GlobalAnimation);

/***/ }),

/***/ "./src/js/diagram/webgl/shaders.js":
/*!*****************************************!*\
  !*** ./src/js/diagram/webgl/shaders.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var vertex = {
  simple: {
    source: 'attribute vec2 a_position;' + 'uniform mat3 u_matrix;' + 'uniform float u_z;' + 'void main() {' + 'gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, u_z, 1);' + '}',
    varNames: ['a_position', 'u_matrix', 'u_z']
  },
  withTexture: {
    source: 'attribute vec2 a_position;' + 'attribute vec2 a_texcoord;' + 'uniform mat3 u_matrix;' + 'uniform float u_z;' + 'varying vec2 v_texcoord;' + 'void main() {' + 'gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, u_z, 1);' + 'v_texcoord = a_texcoord;' + '}',
    varNames: ['a_position', 'a_texcoord', 'u_matrix', 'u_z']
  }
};
var fragment = {
  simple: {
    source: 'precision mediump float;' + 'uniform vec4 u_color;' + 'void main() {' + 'gl_FragColor = u_color;' + '}',
    varNames: ['u_color']
  },
  withTexture: {
    source: 'precision mediump float;' + 'uniform vec4 u_color;' + 'uniform int u_use_texture;' + 'uniform sampler2D u_texture;' + 'varying vec2 v_texcoord;' + 'void main() {' + 'if ( u_use_texture == 1) {' + 'gl_FragColor = texture2D(u_texture, v_texcoord);' + '} else {' + 'gl_FragColor = u_color;' + '}' + '}',
    varNames: ['u_color', 'u_use_texture', 'u_texture']
  }
};

var getShaders = function getShaders() {
  var vName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'simple';
  var fName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'simple';

  if (Object.hasOwnProperty.call(vertex, vName) && Object.hasOwnProperty.call(fragment, fName)) {
    return {
      vertexSource: vertex[vName].source,
      fragmentSource: fragment[fName].source,
      varNames: vertex[vName].varNames.concat(fragment[fName].varNames)
    };
  }

  return {
    vertexSource: '',
    fragmentSource: '',
    varNames: []
  };
};

/* harmony default export */ __webpack_exports__["default"] = (getShaders);

/***/ }),

/***/ "./src/js/diagram/webgl/webgl.js":
/*!***************************************!*\
  !*** ./src/js/diagram/webgl/webgl.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  gl.deleteProgram(program);
  return null;
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  gl.deleteShader(shader);
  return null;
}

function createProgramFromScripts(gl, vertexShaderSource, fragmentShaderSource) {
  // Get the strings for our GLSL shaders
  // const vertexShaderSource = document.getElementById(vertexScript).text;
  // const fragmentShaderSource = document.getElementById(fragScript).text;
  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource); // Link the two shaders into a program

  if (vertexShader && fragmentShader) {
    return createProgram(gl, vertexShader, fragmentShader);
  }

  return null;
}

function getGLLocations(gl, program, locationsList) {
  var i;
  var newLocations = {};
  var loc;

  for (i = 0; i < locationsList.length; i += 1) {
    loc = locationsList[i];

    if (loc[0] === 'a') {
      newLocations[loc] = gl.getAttribLocation(program, loc);
    }

    if (loc[0] === 'u') {
      newLocations[loc] = gl.getUniformLocation(program, loc);
    }
  }

  return newLocations;
} // function resizeCanvasToDisplaySize(canvas) {
//   // const mul = multiplier || 1;
//   const mul = window.devicePixelRatio || 1;
//   const width = canvas.clientWidth * mul || 0;
//   const height = canvas.clientHeight * mul || 0;
//   if (canvas.width !== width || canvas.height !== height) {
//     canvas.width = width;     // eslint-disable-line no-param-reassign
//     canvas.height = height;   // eslint-disable-line no-param-reassign
//     return true;
//   }
//   return false;
// }

/* eslint-disable */


function autoResize(event) {// let contRect = document.getElementById('container').getBoundingClientRect();
  // let diagRect = document.getElementById('diagram').getBoundingClientRect();
  // let textRect = document.getElementById('learning_text_container').getBoundingClientRect();
  // let canvRect = this.gl.canvas.getBoundingClientRect();
  // // console.log(contRect)
  // console.log(this.gl.canvas.getBoundingClientRect());
  // // this.gl.canvas.height = 500;
  // // this.gl.canvas.width = 500;
  // // this.gl.canvas.width=500;
  // // this.gl.viewport(diagRect.left, canvRect.height+canvRect.top, textRect.width, textRect.height); 
  // // this.gl.viewport(0,0,100,100);
  // // console.log(document.getElementById('Diagram').left);
}

var WebGLInstance =
/*#__PURE__*/
function () {
  function WebGLInstance(canvas, vertexSource, fragmentSource, shaderLocations, backgroundColor) {
    _classCallCheck(this, WebGLInstance);

    var gl = canvas.getContext('webgl', {
      antialias: true
    });

    if (gl instanceof WebGLRenderingContext) {
      this.gl = gl;
      this.program = createProgramFromScripts(this.gl, vertexSource, fragmentSource);
      this.locations = getGLLocations(this.gl, this.program, shaderLocations); // Prep canvas
      // resizeCanvasToDisplaySize(this.gl.canvas);

      this.resize(); // Tell WebGL how to convert from clip space to pixels
      // this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      // gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      // this.gl.viewport(0, 500, 500, 500);   // Tell WebGL how to convert from clip space to pixels
      // Clear the canvas
      // const bc = backgroundColor;
      // this.gl.clearColor(bc[0], bc[1], bc[2], bc[3]);

      this.gl.clearColor(0, 0, 0, 0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gl.disable(this.gl.DEPTH_TEST);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      this.gl.useProgram(this.program); // window.addEventListener('resize', autoResize.bind(this, event));
    }
  }

  _createClass(WebGLInstance, [{
    key: "resize",
    value: function resize() {
      var realToCSSPixels = window.devicePixelRatio; // console.log("asdf");
      // Lookup the size the browser is displaying the canvas in CSS pixels
      // and compute a size needed to make our drawingbuffer match it in
      // device pixels.

      var displayWidth = Math.floor(this.gl.canvas.clientWidth * realToCSSPixels);
      var displayHeight = Math.floor(this.gl.canvas.clientHeight * realToCSSPixels); // Check if the canvas is not the same size.

      if (this.gl.canvas.width !== displayWidth || this.gl.canvas.height !== displayHeight) {
        // Make the canvas the same size
        this.gl.canvas.width = displayWidth;
        this.gl.canvas.height = displayHeight;
      }

      this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    } // resize() {
    //   var width = this.gl.canvas.clientWidth;
    //   var height = this.gl.canvas.clientHeight;
    //   if (this.gl.canvas.width != width ||
    //       this.gl.canvas.height != height) {
    //      this.gl.canvas.width = width;
    //      this.gl.canvas.height = height;
    //      return true;
    //   }
    //   return false;
    // }
    // var needToRender = true;  // draw at least once
    // function checkRender() {
    //    if (resize() || needToRender) {
    //      needToRender = false;
    //      drawStuff();
    //    }
    //    requestAnimationFrame(checkRender);
    // }
    // checkRender();

  }]);

  return WebGLInstance;
}();

/* harmony default export */ __webpack_exports__["default"] = (WebGLInstance);

/***/ }),

/***/ "./src/js/diagramLib.js":
/*!******************************!*\
  !*** ./src/js/diagramLib.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _diagram_tools_g2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./diagram/tools/g2 */ "./src/js/diagram/tools/g2.js");
/* harmony import */ var _diagram_tools_mathtools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./diagram/tools/mathtools */ "./src/js/diagram/tools/mathtools.js");
/* harmony import */ var _diagram_Diagram__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./diagram/Diagram */ "./src/js/diagram/Diagram.js");
/* harmony import */ var _diagram_Element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./diagram/Element */ "./src/js/diagram/Element.js");
// import homePage from './views/home/home';
// // import aboutPage from './views/about/about';
// // import introPage from './views/introduction/introduction';
// // import lessonSinglePage from './views/lessonSinglePage/lessonSinglePage';
// // import lessonMultiPage from './views/lessonMultiPage/lessonMultiPage';
// homePage();
// // introPage();
// // aboutPage();




var tools = {
  math: _diagram_tools_mathtools__WEBPACK_IMPORTED_MODULE_1__,
  d2: _diagram_tools_g2__WEBPACK_IMPORTED_MODULE_0__
};
var diagramLib = {
  tools: tools,
  diagram: _diagram_Diagram__WEBPACK_IMPORTED_MODULE_2__,
  element: _diagram_Element__WEBPACK_IMPORTED_MODULE_3__
};
/* harmony default export */ __webpack_exports__["default"] = (diagramLib); // module.exports = {
//   mathTools, d2Tools,
// };

/***/ }),

/***/ "./src/js/tools/colorNames.js":
/*!************************************!*\
  !*** ./src/js/tools/colorNames.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// @ flow
function colorNames() {
  return {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgrey: '#a9a9a9',
    darkgreen: '#006400',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    grey: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgrey: '#d3d3d3',
    lightgreen: '#90ee90',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32'
  };
} // function a(input) {
//   console.log(input);
// }


/* harmony default export */ __webpack_exports__["default"] = (colorNames);

/***/ }),

/***/ "./src/js/tools/htmlGenerator.js":
/*!***************************************!*\
  !*** ./src/js/tools/htmlGenerator.js ***!
  \***************************************/
/*! exports provided: actionWord, click, highlight, addClass, addId, onClickId, highlightWord, centerV, centerH, centerVH, toHTML, clickWord, itemSelector, unit, applyModifiers, setOnClicks, setHTML */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "actionWord", function() { return actionWord; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "click", function() { return click; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "highlight", function() { return highlight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addClass", function() { return addClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addId", function() { return addId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onClickId", function() { return onClickId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "highlightWord", function() { return highlightWord; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "centerV", function() { return centerV; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "centerH", function() { return centerH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "centerVH", function() { return centerVH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toHTML", function() { return toHTML; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clickWord", function() { return clickWord; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "itemSelector", function() { return itemSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unit", function() { return unit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyModifiers", function() { return applyModifiers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setOnClicks", function() { return setOnClicks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setHTML", function() { return setHTML; });
/* harmony import */ var _tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools */ "./src/js/tools/tools.js");


function centerV() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var textToUse = '';

  if (Array.isArray(text)) {
    textToUse = "<p>".concat(text.join('</p><p>'), "</p>");
  } else {
    textToUse = text;
  }

  return "<div style=\"display: table; height: 100%;\">\n        <div style=\"display: table-cell; vertical-align: middle\">\n        ".concat(textToUse, "</div></div>");
}

function centerVH() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "<div style=\"display: table; height: 100%; text-align:center; width:100%\">\n        <div style=\"display: table-cell; vertical-align: middle\">\n        ".concat(text, "</div></div>");
}

function centerH() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "<div style=\"text-align:center;\">\n        ".concat(text, "</div>");
}

function itemSelector() {
  var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [''];
  var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var selectorIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var outStr = "<ul id=\"id__lesson_item_selector_".concat(selectorIndex, "\" \n                    class=").concat(classes, ">");
  items.forEach(function (item, index) {
    outStr += "<li id=\"id__lesson_item_selector_".concat(index, "\">").concat(item, "</li>");
  });
  outStr += '</ul>';
  return outStr;
}

var unit = function unit(deg, rad) {
  return "<span class=\"lesson__unit_deg\">".concat(deg, "</span><span class=\"lesson__unit_rad\">").concat(rad, "</span>\n  ");
};

function toHTML() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var idStr = '';

  if (id) {
    idStr = " id=\"".concat(id, "\"");
  }

  var classStr = '';

  if (classes) {
    classStr = " class=\"".concat(classes, "\"");
  }

  var colorStr = '';

  if (color) {
    colorStr = " style=\"color:".concat(Object(_tools__WEBPACK_IMPORTED_MODULE_0__["colorArrayToRGBA"])(color), ";\"");
  }

  return {
    replacementText: "<span".concat(idStr).concat(classStr, "\"").concat(colorStr, ">").concat(text.replace(RegExp(/_/, 'gi'), ' ').trim(), "</span>")
  };
}

function highlight() {
  var classesOrColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var classStr = 'highlight_word';

  if (typeof classesOrColor === 'string') {
    classStr = "".concat(classesOrColor, " ").concat(classStr);
  }

  var color = null;

  if (Array.isArray(classesOrColor)) {
    color = classesOrColor;
  }

  return {
    replacementText: function replacementText(text) {
      return toHTML(text, '', classStr, color);
    }
  };
}

function highlightWord(text) {
  var classesOrColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var classStr = 'highlight_word';

  if (typeof classesOrColor === 'string') {
    classStr = "".concat(classesOrColor, " ").concat(classStr);
  }

  var color = null;

  if (Array.isArray(classesOrColor)) {
    color = classesOrColor;
  }

  return {
    replacementText: toHTML(text, '', classStr, color).replacementText
  };
}

function addClass() {
  var classes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return {
    replacementText: function replacementText(text) {
      return toHTML(text, '', classes);
    } // id: '',

  };
}

function addId() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return {
    replacementText: function replacementText(text) {
      return toHTML(text, id);
    } // id: '',

  };
}

function clickWord(textToUse, id, actionMethod, bind) {
  var classesOrColor = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var interactive = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  var classStr = 'action_word';

  if (interactive) {
    classStr = "".concat(classStr, " interactive_word");
  }

  if (typeof classesOrColor === 'string') {
    classStr = "".concat(classesOrColor, " ").concat(classStr);
  }

  var color = null;

  if (Array.isArray(classesOrColor)) {
    color = classesOrColor;
  }

  var idToUse = function idToUse() {
    return id;
  }; // const id = `lesson__id_${textToUse}`;


  return {
    replacementText: function replacementText() {
      return toHTML(textToUse, idToUse(), classStr, color);
    },
    id: idToUse,
    actionMethod: actionMethod,
    bind: bind
  };
}

function click(actionMethod, bind) {
  var classesOrColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var interactive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var id = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var classStr = 'action_word';

  if (interactive) {
    classStr = "".concat(classStr, " interactive_word");
  }

  if (typeof classesOrColor === 'string') {
    classStr = "".concat(classesOrColor, " ").concat(classStr);
  }

  var color = null;

  if (Array.isArray(classesOrColor)) {
    color = classesOrColor;
  }

  var idToUse = function idToUse(text) {
    return "lesson__id_".concat(text).concat(id);
  };

  return {
    replacementText: function replacementText(text) {
      return toHTML(text, idToUse(text), classStr, color);
    },
    id: idToUse,
    actionMethod: actionMethod,
    bind: bind
  };
}

function actionWord(text) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var classesOrColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var interactive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var classStr = 'action_word';

  if (interactive) {
    classStr = "".concat(classStr, " interactive_word");
  }

  if (typeof classesOrColor === 'string') {
    classStr = "".concat(classesOrColor, " ").concat(classStr);
  }

  var color = null;

  if (Array.isArray(classesOrColor)) {
    color = classesOrColor;
  }

  return {
    replacementText: toHTML(text, id, classStr, color).replacementText,
    id: id
  };
}

function modifyText(text, key, mod) {
  var outText = '';
  var expression = new RegExp("\\|".concat(key, "\\|"), 'gi');
  var replacement = '';

  if (typeof mod.replacementText === 'string') {
    replacement = mod.replacementText;
  } else {
    replacement = mod.replacementText(key).replacementText; // console.log(replacement)
  }

  outText = text.replace(expression, replacement);
  return outText;
}

function onClickId(id, actionMethod, bind) {
  var additionalClassesToAdd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var element = document.getElementById(id);

  if (element) {
    element.classList.add('action_word_enabled');
    additionalClassesToAdd.split(' ').forEach(function (classString) {
      if (classString) {
        element.classList.add(classString);
      }
    });

    if (bind.length === 1) {
      element.onclick = actionMethod.bind(bind[0]);
    }

    if (bind.length === 2) {
      element.onclick = actionMethod.bind(bind[0], bind[1]);
    }

    if (bind.length === 3) {
      element.onclick = actionMethod.bind(bind[0], bind[1], bind[2]);
    }

    if (bind.length === 4) {
      element.onclick = actionMethod.bind(bind[0], bind[1], bind[2], bind[3]);
    }

    if (bind.length === 5) {
      element.onclick = actionMethod.bind(bind[0], bind[1], bind[2], bind[3], bind[4]);
    }

    if (bind.length === 6) {
      element.onclick = actionMethod.bind(bind[0], bind[1], bind[2], bind[3], bind[4], bind[5]);
    }

    if (bind.length === 7) {
      element.onclick = actionMethod.bind(bind[0], bind[1], bind[2], bind[3], bind[4], bind[5], bind[6]);
    }

    if (bind.length === 8) {
      element.onclick = actionMethod.bind(bind[0], bind[1], bind[2], bind[3], bind[4], bind[5], bind[6], bind[7]);
    }

    if (bind.length === 9) {
      element.onclick = actionMethod.bind(bind[0], bind[1], bind[2], bind[3], bind[4], bind[5], bind[6], bind[7], bind[8]);
    }
  }
}

function applyModifiers(text, modifiers) {
  var highlightClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'highlight_word';
  var monochrome = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var outText = text;
  Object.keys(modifiers).forEach(function (key) {
    var mod = modifiers[key];
    outText = modifyText(outText, key, mod);
  });
  var r = RegExp(/\|([^|]*)\|/, 'gi');
  outText = outText.replace(r, "<span class=\"".concat(highlightClass, "\">$1</span>"));

  if (monochrome) {
    var c = RegExp(/style="color:rgba\([^)]*\);"/, 'gi');
    outText = outText.replace(c, '');
    var h = RegExp(/highlight_word/, 'gi');
    outText = outText.replace(h, '');
    var i = RegExp(/interactive_word/, 'gi');
    outText = outText.replace(i, '');
    var id = RegExp(/id="[^"]*"/, 'gi');
    outText = outText.replace(id, '');
  }

  return outText;
}

function setOnClicks(modifiers) {
  var additionalClassesToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  Object.keys(modifiers).forEach(function (key) {
    var mod = modifiers[key];

    if ('actionMethod' in mod) {
      onClickId(mod.id(key), mod.actionMethod, mod.bind, additionalClassesToAdd);
    }
  });
}

function setHTML(element, text) {
  var modifiers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var classesToAdd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var modifiedText = applyModifiers(text, modifiers); // eslint-disable-next-line no-param-reassign

  element.innerHTML = modifiedText;
  setOnClicks(modifiers, classesToAdd);
}



/***/ }),

/***/ "./src/js/tools/tools.js":
/*!*******************************!*\
  !*** ./src/js/tools/tools.js ***!
  \*******************************/
/*! exports provided: divide, mulToString, add, Console, classify, extractFrom, ObjectKeyPointer, getElement, RGBToArray, HexToArray, cssColorToArray, colorArrayToRGB, colorArrayToRGBA, addToObject, duplicateFromTo, isTouchDevice, generateUniqueId */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "divide", function() { return divide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mulToString", function() { return mulToString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Console", function() { return Console; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "classify", function() { return classify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractFrom", function() { return extractFrom; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjectKeyPointer", function() { return ObjectKeyPointer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getElement", function() { return getElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RGBToArray", function() { return RGBToArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HexToArray", function() { return HexToArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cssColorToArray", function() { return cssColorToArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "colorArrayToRGB", function() { return colorArrayToRGB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "colorArrayToRGBA", function() { return colorArrayToRGBA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addToObject", function() { return addToObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "duplicateFromTo", function() { return duplicateFromTo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isTouchDevice", function() { return isTouchDevice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateUniqueId", function() { return generateUniqueId; });
/* harmony import */ var _colorNames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colorNames */ "./src/js/tools/colorNames.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

 // official css color names

var Console = function Console(text) {
  console.log(text); // eslint-disable-line no-console
};

function add(a, b) {
  return a + b;
}

function mulToString(a, b) {
  return (a * b).toString();
}

var divide = function divide(a, b) {
  return a / b;
};

var classify = function classify(key, value) {
  var nonEmpty = value || key;
  var withKey = nonEmpty[0] === '-' || nonEmpty.startsWith("".concat(key, "-")) ? "".concat(key, " ").concat(nonEmpty) : nonEmpty;
  var joinStr = " ".concat(key, "-");
  return "".concat(withKey.split(' -').join(joinStr));
};

var ObjectKeyPointer =
/*#__PURE__*/
function () {
  function ObjectKeyPointer(object, key) {
    _classCallCheck(this, ObjectKeyPointer);

    this.object = object;
    this.key = '';

    if (key in object) {
      this.key = key;
    }
  }

  _createClass(ObjectKeyPointer, [{
    key: "setValue",
    value: function setValue(value) {
      if (this.key) {
        this.object[this.key] = value;
      }
    }
  }, {
    key: "execute",
    value: function execute() {
      if (this.key) {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return this.object[this.key].apply(null, args);
      }

      return undefined;
    }
  }, {
    key: "value",
    value: function value() {
      if (this.key) {
        return this.object[this.key];
      }

      return undefined;
    }
  }]);

  return ObjectKeyPointer;
}(); //


function extractFrom(objectToExtractFrom, keyValues) {
  var keyPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var out = [];

  if (typeof keyValues === 'string') {
    if (keyPrefix + keyValues in objectToExtractFrom) {
      return new ObjectKeyPointer(objectToExtractFrom, keyPrefix + keyValues);
    }

    var keyHeirarchy = keyValues.split('_');
    var keys = keyHeirarchy.filter(function (k) {
      return k.length > 0;
    });

    if (keys.length > 1) {
      if (keyPrefix + keys[0] in objectToExtractFrom) {
        return extractFrom(objectToExtractFrom[keyPrefix + keys[0]], keys.slice(1).join('_'), keyPrefix);
      }
    } else if (keys.length === 1) {
      if (keyPrefix + keys[0] in objectToExtractFrom) {
        return new ObjectKeyPointer(objectToExtractFrom, keyPrefix + keys[0]);
      }
    }

    return undefined;
  }

  if (Array.isArray(keyValues)) {
    keyValues.forEach(function (kv) {
      var result = extractFrom(objectToExtractFrom, kv, keyPrefix);

      if (result !== undefined) {
        out.push(result);
      }
    });
  } else {
    Object.keys(keyValues).forEach(function (key) {
      if (keyPrefix + key in objectToExtractFrom) {
        out.push({
          obj: new ObjectKeyPointer(objectToExtractFrom, keyPrefix + key),
          // $FlowFixMe
          value: keyValues[key]
        });
      }
    });
  }

  return out;
}

function getElement(collection, keyValues) {
  return extractFrom(collection, keyValues, '_');
} // Function that converts any rgb or rgba string to an array of rgba numbers
// between 0 and 1


function RGBToArray(color) {
  // Reduce the rgb(a) string to just numbers
  var colString = color;
  colString = colString.replace(/.*\(/i, '');
  colString = colString.replace(/\)/i, '');
  var strArray = colString.split(','); // Go through each rgb(a) value and normalize to 1.0

  var value = strArray.map(function (x, index) {
    if (index < 3) {
      return parseInt(x, 10) / 255.0;
    }

    return parseFloat(x);
  }); // If an alpha value isn't included, then include it with default value 1.0

  if (value.length === 3) {
    value.push(1);
  }

  return value;
} // Function that converts any hex color string to an array of rgba numbers
// between 0 and 1 (where alpha is always 1)


function HexToArray(color) {
  var colHex = color.slice(1);

  if (colHex.length < 6) {
    colHex = "".concat(colHex[0]).concat(colHex[0]).concat(colHex[1]).concat(colHex[1]).concat(colHex[2]).concat(colHex[2]);
  }

  var col = [parseInt(colHex.slice(0, 2), 16) / 255.0, parseInt(colHex.slice(2, 4), 16) / 255.0, parseInt(colHex.slice(4, 6), 16) / 255.0, 1];
  return col;
}

function cssColorToArray(cssColorString) {
  var oNames = Object(_colorNames__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Official css color names

  var color = cssColorString.slice(0); // If the color is an official name, then replace it with the hex rgb
  // equivalent

  if (color in oNames) {
    color = oNames[color];
  } // colorValue is the rgba array of colors between 0 and 1


  var colorValue = []; // If color string starts with 'rgb' (and therefore also 'rgba')

  if (color.toLowerCase().startsWith('rgb')) {
    colorValue = RGBToArray(color); // If color string starts with '#' it is hex
  } else if (color.startsWith('#')) {
    colorValue = HexToArray(color);
  } // If the color value array is defined, then add it to the final
  // dictionary


  if (colorValue.length > 0) {
    return colorValue;
  }

  return null;
}

function colorArrayToRGBA(color) {
  return "rgba(".concat(Math.floor(color[0] * 255), ",").concat(Math.floor(color[1] * 255), ",").concat(Math.floor(color[2] * 255), ",").concat(color[3], ")");
}

function colorArrayToRGB(color) {
  return "rgb(".concat(Math.floor(color[0] * 255), ",").concat(Math.floor(color[1] * 255), ",").concat(Math.floor(color[2] * 255), ")");
}

function addToObject(obj, nameToAdd, valueToAdd) {
  var splitStr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '-';
  var levels = nameToAdd.split(splitStr);
  var currentLevel = obj;
  levels.forEach(function (level, index) {
    if (index === levels.length - 1) {
      currentLevel[level] = valueToAdd;
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(currentLevel, level)) {
      currentLevel[level] = {};
    }

    currentLevel = currentLevel[level];
  });
}

function duplicateFromTo(fromObject, toObject) {
  var exceptKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var copyValue = function copyValue(value) {
    if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string' || value == null || typeof value === 'function') {
      return value;
    }

    if (typeof value._dup === 'function') {
      return value._dup();
    }

    if (Array.isArray(value)) {
      var arrayCopy = [];
      value.forEach(function (arrayElement) {
        return arrayCopy.push(copyValue(arrayElement));
      });
      return arrayCopy;
    }

    if (_typeof(value) === 'object') {
      var objectCopy = {};
      Object.keys(value).forEach(function (key) {
        var v = copyValue(value[key]);
        objectCopy[key] = v;
      });
      return objectCopy;
    }

    return value;
  };

  Object.keys(fromObject).forEach(function (key) {
    if (exceptKeys.indexOf(key) === -1) {
      // eslint-disable-next-line no-param-reassign
      toObject[key] = copyValue(fromObject[key]);
    }
  });
}

function generateUniqueId() {
  var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var randomString = function randomString(s) {
    return "".concat(s).concat(Math.floor(Math.random() * 1000000));
  };

  var seedToUse = seed;

  if (seedToUse.length === 0) {
    seedToUse = 'id_random_';
  }

  var idExists = true;
  var newId = randomString(seedToUse);

  while (idExists) {
    newId = randomString(seedToUse);
    var element = document.getElementById(newId);

    if (element == null) {
      idExists = false;
    }
  }

  return newId;
}

function isTouchDevice() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

  var mq = function mq(query) {
    return window.matchMedia(query).matches;
  };
  /* eslint-disable no-undef, no-mixed-operators */
  // $FlowFixMe


  if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }
  /* eslint-enable no-undef, no-mixed-operators */
  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH


  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}



/***/ })

/******/ });
});
//# sourceMappingURL=diagramLib.js.map