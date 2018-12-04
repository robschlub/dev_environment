// @flow
import {
  Point, getMoveTime,
} from '../../tools/g2';
// import { roundNum } from '../../tools/mathtools';
import { duplicateFromTo } from '../../../tools/tools';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../Element';
import { Element, Elements, BlankElement } from './Elements/Element';

function getDiagramElement(
  collection: DiagramElementCollection,
  name: string | DiagramElementPrimative | DiagramElementCollection,
): DiagramElementPrimative | DiagramElementCollection | null {
  if (typeof name === 'string') {
    if (collection && `_${name}` in collection) {
    // $FlowFixMe
      return collection[`_${name}`];
    }
    return null;
  }
  return name;
}

export type TypeHAlign = 'left' | 'right' | 'center';
export type TypeVAlign = 'top' | 'bottom' | 'middle' | 'baseline';
export type TypeEquationForm = {
  collection: DiagramElementCollection;
  createEq: (Array<Elements | Element | string>) => void;
  arrange: (
    number, TypeHAlign | null, TypeVAlign | null,
    DiagramElementPrimative | DiagramElementCollection | Point
  ) => void;
  dissolveElements: (
    Array<DiagramElementPrimative | DiagramElementCollection>,
    boolean, number, number, ?(?boolean)) => void;
  getElementsToShowAndHide: () => void;
  showHide: (number, number, ?(?mixed)) => void;
  hideShow: (number, number, ?(?mixed)) => void;
  // animateTo: (
  //   number, number,
  //   DiagramElementPrimative | DiagramElementCollection | Point,
  //   ?(?mixed) => void,
  //   'left' | 'center' | 'right', 'top' | 'bottom' | 'middle' | 'baseline',
  // ) => void;
  animatePositionsTo: (number, ?(?mixed) => void) => void;
  description: string | null;
  modifiers: Object;
  type: string;
  elementMods: Object;
  time: number | null;
} & Elements;


export default class EquationForm extends Elements {
  collection: DiagramElementCollection;
  name: string;
  type: string;
  description: string | null;
  modifiers: Object;
  elementMods: Object;
  time: number | null;

  constructor(collection: DiagramElementCollection) {
    super([]);
    this.collection = collection;
    this.description = null;
    this.modifiers = {};
    this.elementMods = {};
    this.time = null;
  }

  getNamedElements() {
    const namedElements = {};
    this.collection.getAllElements().forEach((element) => {
      namedElements[element.name] = element;
    });
    return namedElements;
  }

  _dup(collection: DiagramElementCollection = this.collection) {
    const equationCopy = new EquationForm(collection);
    const namedElements = {};
    collection.getAllElements().forEach((element) => {
      namedElements[element.name] = element;
    });
    const newContent = [];
    this.content.forEach((contentElement) => {
      newContent.push(contentElement._dup(namedElements));
    });
    equationCopy.content = newContent;

    duplicateFromTo(this, equationCopy, ['content', 'collection', 'form']);
    return equationCopy;
  }

  createEq(content: Array<Elements | Element | string>) {
    const elements = [];
    content.forEach((c) => {
      if (typeof c === 'string') {
        if (c.startsWith('space')) {
          const spaceNum = parseFloat(c.replace(/space[_]*/, '')) || 0.03;
          elements.push(new Element(new BlankElement(spaceNum)));
        } else {
          const diagramElement = getDiagramElement(this.collection, c);
          if (diagramElement) {
            elements.push(new Element(diagramElement));
          }
        }
      } else {
        elements.push(c._dup());
      }
      this.content = elements;
    });
  }

  // An Equation collection is a flat collection of DiagramElements.
  //
  // The form determines how elements are positioned relative to each other.
  //
  // A form of an equation takes the form's elements (a subset of the
  // collection) and applies a translation and scale transformation. This
  // aligns all the elements of a form relative to each other to render
  // the desired form.
  //
  // Arranging a form of an equation goes through each element in the form
  // and positions and scales it in the equation's vertex space.
  // It also saves the locaiton and scale information in the form's element
  // property.
  //
  // The elements are positioned relative to 0,0 in vertex space based on the
  // fixTo, alignH and alignV parameters.
  //
  // fixTo can only be a point in the equation's vertex space, or a
  // DiagramElement in the equation.
  //
  // If fixTo is an element in the equation:
  //    - the fixTo element is positioned at 0, 0, and all other elements
  //      repositioned relative to that.
  //    - The equation collection setPosition (or translation transform) can
  //      then be used to position the equation in the diagram (or relative
  //      collection space)
  //    - if alignH is:
  //        - 'middle': the fixTo element is centered in x around (0, 0)
  //        - 'right': the fixTo element right most point is at x = 0
  //        - 'left': default - the fixTo element x position at 0
  //    - if alignV is:
  //        - 'center': the fixTo element is centered in y around (0, 0)
  //        - 'bottom': the fixTo element bottom most point is at y = 0
  //        - 'top': the fixTo element top most point is at y = 0
  //        - 'baseline': default - the fixTo element y position at 0
  //
  // If fixTo is a Point, the equation is positioned at that point in the
  // equation's vertex space.
  //  - alignH:
  //    - 'left': The equation's left most element's left most point is at
  //              Point.x
  //    - 'right': The equation's right most element's right most point is at
  //              Point.x
  //    - 'center': The equation is centered horizontally around Point.x
  //  - alignV:
  //    - 'baseline': The equation's baseline is at Point.y
  //    - 'top': The equation's top most element's top most point is at Point.y
  //    - 'bottom': The equation's top most element's top most point is at
  //                Point.y
  //    - 'middle': The equation is centered vertically around Point.y
  //
  arrange(
    scale: number = 1,
    alignH: TypeHAlign | null = 'left',
    alignV: TypeVAlign | null = 'baseline',
    fixTo: DiagramElementPrimative | DiagramElementCollection | Point = new Point(0, 0),
  ) {
    const elementsInCollection = this.collection.getAllElements();
    const elementsCurrentlyShowing = elementsInCollection.filter(e => e.isShown);
    this.collection.hideAll();
    this.collection.show();
    super.calcSize(new Point(0, 0), scale);

    let fixPoint = new Point(0, 0);
    if (fixTo instanceof DiagramElementPrimative
        || fixTo instanceof DiagramElementCollection) {
      const t = fixTo.transform.t();
      if (t != null) {
        fixPoint = t._dup();
      }
    } else {
      fixPoint = new Point(-fixTo.x, -fixTo.y);
    }

    let w = this.width;
    let h = this.height;
    let a = this.ascent;
    let d = this.descent;
    let p = this.location._dup();

    if (fixTo instanceof DiagramElementPrimative
        || fixTo instanceof DiagramElementCollection) {
      const t = fixTo.transform.t();
      const s = fixTo.transform.s();
      if (t != null && s != null) {
        const rect = fixTo.getVertexSpaceBoundingRect();
        w = rect.width * s.x;
        h = rect.height * s.y;
        a = rect.top * s.y - t.y;
        d = t.y - rect.bottom * s.y;
        p = t._dup();
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

    const delta = new Point(0, 0).sub(fixPoint);
    if (delta.x !== 0 || delta.y !== 0) {
      this.offsetLocation(delta);
      this.setPositions();
    }

    this.collection.showOnly(elementsCurrentlyShowing);
  }

  // eslint-disable-next-line class-methods-use-this
  dissolveElements(
    elements: Array<DiagramElementPrimative | DiagramElementCollection>,
    disolve: 'in' | 'out' = 'in',
    delay: number = 0.01,
    time: number = 1,
    callback: ?(boolean) => void = null,
  ) {
    if (elements.length === 0) {
      if (callback) {
        callback(false);
        return;
      }
    }
    const count = elements.length;
    let completed = 0;
    const end = (cancelled: boolean) => {
      completed += 1;
      if (completed === count) {
        if (callback) {
          callback(cancelled);
        }
      }
    };
    elements.forEach((e) => {
      e.disolveWithDelay(delay, time, disolve, end);
    });
  }

  getElementsToShowAndHide() {
    const allElements = this.collection.getAllElements();
    const elementsShown = allElements.filter(e => e.isShown);
    const elementsShownTarget = this.getAllElements();
    const elementsToHide =
      elementsShown.filter(e => elementsShownTarget.indexOf(e) === -1);
    const elementsToShow: Array<DiagramElementCollection | DiagramElementPrimative> =
      elementsShownTarget.filter(e => elementsShown.indexOf(e) === -1);
    return {
      show: elementsToShow,
      hide: elementsToHide,
    };
  }

  render() {
    this.hideShow();
    this.setPositions();
  }

  showHide(
    showTime: number = 0,
    hideTime: number = 0,
    callback: ?(?mixed) => void = null,
  ) {
    this.collection.stop();
    this.collection.show();
    const { show, hide } = this.getElementsToShowAndHide();
    if (showTime === 0) {
      show.forEach((e) => {
        e.showAll();
      });
    } else {
      this.dissolveElements(show, 'in', 0.01, showTime, null);
    }

    if (hideTime === 0) {
      hide.forEach(e => e.hide());
    } else {
      this.dissolveElements(hide, 'out', showTime, hideTime, callback);
    }
  }

  hideShow(
    showTime: number = 0,
    hideTime: number = 0,
    callback: ?(?mixed) => void = null,
  ) {
    this.collection.stop();
    this.collection.show();
    const { show, hide } = this.getElementsToShowAndHide();
    if (hideTime === 0) {
      hide.forEach(e => e.hide());
    } else {
      this.dissolveElements(hide, 'out', 0.01, hideTime, null);
    }
    if (showTime === 0) {
      show.forEach((e) => {
        e.showAll();
      });
      if (callback != null) {
        callback();
      }
    } else {
      this.dissolveElements(show, 'in', hideTime, showTime, callback);
    }
  }

  allHideShow(
    delay: number = 0,
    hideTime: number = 0.5,
    blankTime: number = 0.5,
    showTime: number = 0.5,
    callback: ?(boolean) => void = null,
  ) {
    this.collection.stop();
    const allElements = this.collection.getAllElements();
    const elementsShown = allElements.filter(e => e.isShown);
    const elementsToShow = this.getAllElements();
    const elementsToDelayShowing = elementsToShow.filter(e => !e.isShown);
    const elementsToShowAfterDisolve = elementsToShow.filter(e => e.isShown);
    let cumTime = delay;

    if (elementsToShow.length === 0 && elementsShown.length === 0) {
      if (callback != null) {
        callback(false);
        return;
      }
    }
    // disolve out
    // set positions
    // disolve in

    let disolveOutCallback = () => {
      this.setPositions();
    };
    if (elementsToShow.length === 0) {
      disolveOutCallback = (cancelled: boolean) => {
        this.setPositions();
        if (callback != null) {
          callback(cancelled);
        }
      };
    }

    if (elementsShown.length > 0) {
      this.dissolveElements(
        elementsShown, 'out', delay, hideTime, disolveOutCallback,
      );
      cumTime += hideTime;
    } else {
      this.setPositions();
    }

    const count = elementsToShow.length;
    let completed = 0;
    const end = (cancelled: boolean) => {
      completed += 1;
      if (completed === count - 1) {
        if (callback) {
          callback(cancelled);
        }
      }
    };
    elementsToDelayShowing.forEach((e) => {
      e.disolveWithDelay(cumTime + blankTime, showTime, 'in', end);
    });
    elementsToShowAfterDisolve.forEach((e) => {
      e.disolveWithDelay(blankTime, showTime, 'in', end);
    });
  }

  animatePositionsTo(
    delay: number,
    disolveOutTime: number,
    moveTime: number | null,
    disolveInTime: number,
    callback: ?(?mixed) => void = null,
  ) {
    const allElements = this.collection.getAllElements();
    this.collection.stop();
    const elementsShown = allElements.filter(e => e.isShown);
    const elementsShownTarget = this.getAllElements();
    const elementsToHide =
      elementsShown.filter(e => elementsShownTarget.indexOf(e) === -1);
    const elementsToShow =
      elementsShownTarget.filter(e => elementsShown.indexOf(e) === -1);

    const currentTransforms = this.collection.getElementTransforms();
    this.setPositions();
    const animateToTransforms = this.collection.getElementTransforms();

    const elementsToMove = [];
    const toMoveStartTransforms = [];
    const toMoveStopTransforms = [];
    Object.keys(animateToTransforms).forEach((key) => {
      const currentT = currentTransforms[key];
      const nextT = animateToTransforms[key];
      if (!currentT.isEqualTo(nextT)) {
        elementsToMove.push(key);
        toMoveStartTransforms.push(currentT);
        toMoveStopTransforms.push(nextT);
      }
    });

    // Find move time to use. If moveTime is null, then a velocity is used.
    let moveTimeToUse;
    if (moveTime === null) {
      moveTimeToUse = getMoveTime(
        toMoveStartTransforms, toMoveStopTransforms, 0,
        new Point(0.35, 0.35),      // 0.25 diagram space per s
        2 * Math.PI / 6,            // 60º per second
        new Point(0.4, 0.4),            // 100% per second
      );
    } else {
      moveTimeToUse = moveTime;
    }
    this.collection.setElementTransforms(currentTransforms);
    let cumTime = delay;

    let moveCallback = null;
    let disolveInCallback = null;
    let disolveOutCallback = null;

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

    Object.keys(this.elementMods).forEach((elementName) => {
      const mods = this.elementMods[elementName];
      const {
        element, color, style, direction, mag,
      } = mods;
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
    const t = this.collection.animateToTransforms(
      animateToTransforms,
      moveTimeToUse,
      cumTime,
      0,
      moveCallback,
    );
    if (t > 0) {
      cumTime = t;
    }

    if (elementsToShow.length > 0) {
      this.dissolveElements(elementsToShow, 'in', cumTime, disolveInTime, disolveInCallback);
      cumTime += disolveInTime + 0.001;
    }
    return cumTime;
  }
}