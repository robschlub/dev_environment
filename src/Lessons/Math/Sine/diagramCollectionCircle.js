// @flow

import Diagram from '../../../js/diagram/Diagram';
import { Transform, Point } from '../../../js/diagram/tools/g2';
import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
import SinCosCircle from '../../../LessonsCommon/SinCosCircle/SinCosCircle';
import type { SinCosCircleType, SinCosVarStateType } from '../../../LessonsCommon/SinCosCircle/SinCosCircle';
import lessonLayout from './layout';

type bowType = {
    _handle: DiagramElementPrimative;
    _string: DiagramElementPrimative;
  } & DiagramElementCollection;

export type extendedCircleType = {
  _bow: bowType;
} & SinCosCircleType;


type varStateExtendedType = {
  //
} & SinCosVarStateType;

export type SineCollectionType = {
  _circle: extendedCircleType;
  varState: varStateExtendedType;
};

class SineCollection extends SinCosCircle {
  _circle: extendedCircleType;
  varState: varStateExtendedType;

  makeBow() {
    const bow = this.shapes.collection();
    const { angle } = this.layout.bow;
    const handle = this.shapes.polygon(
      this.layout.anglePoints,
      this.layout.radius, this.layout.bow.lineWidth,
      -angle / 2, 1,
      this.layout.anglePoints * angle / Math.PI / 2,
      this.layout.colors.bowHandle, new Transform()
        .rotate(0)
        .translate(0, 0),
    );
    const offset = this.layout.radius * 0.05;
    const string = this.makeLine(
      new Point(0, 0),
      this.layout.radius * Math.sin(angle / 2) * 2 - offset, this.layout.bow.lineWidth,
      this.colors.bowString, new Transform()
        .rotate(Math.PI / 2)
        .translate(
          this.layout.radius * Math.cos(angle / 2) - this.layout.bow.lineWidth * 0.2,
          -this.layout.radius * Math.sin(angle / 2) + offset / 2,
        ),
    );

    bow.add('string', string);
    bow.add('handle', handle);
    return bow;
  }

  makeComplimentarySineCollection() {
    const collection = this.shapes.collection();
    const angle = Math.PI / 6;
    const radius = this.makeLine(
      new Point(0, 0), this.layout.radius, this.layout.linewidth,
      this.colors.radius, new Transform()
        .rotate(angle)
        .translate(0, 0),
    );

    const arc = this.shapes.polygon(
      this.layout.anglePoints, this.layout.radius, this.layout.linewidth, 0, 1,
      this.layout.anglePoints * angle / Math.PI / 2, this.colors.sine, new Point(0, 0),
    );

    const coArc = this.shapes.polygon(
      this.layout.anglePoints, this.layout.radius,
      this.layout.linewidth, angle, 1,
      this.layout.anglePoints * (Math.PI / 2 - angle) / Math.PI / 2,
      this.colors.cosine, new Point(0, 0),
    );

    collection.add('arc', arc);
    collection.add('coArc', coArc);
    collection.add('radius', radius);
    return collection;
  }

  addToCircle() {
    this._circle.add('bow', this.makeBow());
    this._circle.add('complimentarySineCollection', this.makeComplimentarySineCollection());
  }

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(lessonLayout(), diagram, transform);
    this.addToCircle();
  }

  showBow(done: ?(?mixed) => void = null) {
    const finishTransitionCircle = () => {
      this._circle._bow.show();
      this._circle._bow._handle.disolveIn(1);
      this._circle._bow._string.disolveIn(1, done);
    };
    this._circle._bow.stop(true);
    this._circle._bow.hideAll();
    this.transitionCircle(finishTransitionCircle, 'right', Math.PI / 4, 5);
    this.diagram.animateNextFrame();
  }
}

export default SineCollection;
