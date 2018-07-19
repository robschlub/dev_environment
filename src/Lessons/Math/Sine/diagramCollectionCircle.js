// @flow

import Diagram from '../../../js/diagram/Diagram';
import { Transform, Point, polarToRect } from '../../../js/diagram/tools/g2';
import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
import SinCosCircle from '../../../LessonsCommon/SinCosCircle/SinCosCircle';
import type { SinCosCircleType, SinCosVarStateType } from '../../../LessonsCommon/SinCosCircle/SinCosCircle';
import lessonLayout from './layout';

type bowType = {
    _handle: DiagramElementPrimative;
    _string: DiagramElementPrimative;
  } & DiagramElementCollection;

type complimentarySineCollectionType = {

} & DiagramElementCollection;

export type extendedCircleType = {
  _bow: bowType;
  _complimentarySineCollection: complimentarySineCollectionType;
} & SinCosCircleType;


type varStateExtendedType = {
  complimentaryRotatingTo: 'left' | 'right';
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
    const collection = this.shapes.collection(new Transform().rotate(0).translate(0, 0));
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

    const sine = this.makeSineLine('complimentary_sine');
    const cosine = this.makeCosineLine('complimentary_cosine');
    sine.updateRotation(this.layout.radius, angle);
    cosine.updateRotation(this.layout.radius, angle);

    const thetaPosition = polarToRect(this.layout.radius / 4, angle / 2);
    const theta = this.shapes.htmlText(
      'θ', 'id_diagram__complimentary_sine_angle', 'diagram__sine_text',
      thetaPosition, 'middle', 'center',
    );

    const eqn = this.diagram.equation.makeHTML('id__piOn2MinusTheta');
    eqn.createEq([eqn.frac('π', '2'), '−', 'θ']);

    const piOn2Position = polarToRect(this.layout.radius / 3.3, (Math.PI / 2 - angle) / 2 + angle);
    const piOn2MinusTheta = this.shapes.htmlText(
      eqn.render(), 'id_diagram__complimentary_cosine_angle', 'diagram__cosine_text',
      piOn2Position, 'middle', 'center',
    );

    const sineArc = this.shapes.polygon(
      this.layout.anglePoints, this.layout.radius / 5, this.layout.linewidth / 2, 0, 1,
      this.layout.anglePoints * angle / Math.PI / 2, this.colors.sine, new Point(0, 0),
    );
    const cosineArc = this.shapes.polygon(
      this.layout.anglePoints, this.layout.radius / 5,
      this.layout.linewidth / 2, angle, 1,
      this.layout.anglePoints * (Math.PI / 2 - angle) / Math.PI / 2,
      this.colors.cosine, new Point(0, 0),
    );

    collection.add('arc', arc);
    collection.add('coArc', coArc);
    collection.add('sine', sine);
    collection.add('sineArc', sineArc);
    collection.add('cosineArc', cosineArc);
    collection.add('cosine', cosine);
    collection.add('theta', theta);
    collection.add('piOn2MinusTheta', piOn2MinusTheta);
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
    this.varState.complimentaryRotatingTo = 'right';
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

  updateRotation() {
    super.updateRotation();
    const r = this.varState.rotation;
    if (this._circle._complimentarySineCollection.isShown) {
      this._circle._complimentarySineCollection.transform.updateRotation(r - Math.PI / 6);
    }
  }
  rotateComplimentaryAngle() {
    if (this.varState.complimentaryRotatingTo === 'right') {
      this._circle._radius.animateRotationTo(Math.PI / 2 + Math.PI / 6, 1, 2);
      this.varState.complimentaryRotatingTo = 'left';
    } else {
      this._circle._radius.animateRotationTo(Math.PI / 6, -1, 2);
      this.varState.complimentaryRotatingTo = 'right';
    }
    this.diagram.animateNextFrame();
  }
}

export default SineCollection;
