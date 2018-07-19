// @flow

import Diagram from '../../../js/diagram/Diagram';
import { Transform, Point, polarToRect } from '../../../js/diagram/tools/g2';
import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
import SinCosCircle from '../../../LessonsCommon/SinCosCircle/SinCosCircle';
import type { SinCosCircleType, SinCosVarStateType, sineLineType } from '../../../LessonsCommon/SinCosCircle/SinCosCircle';
import lessonLayout from './layout';

type bowType = {
    _handle: DiagramElementPrimative;
    _string: DiagramElementPrimative;
  } & DiagramElementCollection;

type complimentarySineCollectionType = {
  _sine: sineLineType;
  _cosine: sineLineType;
  _radius: DiagramElementPrimative;
  _theta: DiagramElementPrimative;
  _sineArc: DiagramElementPrimative;
  _compAngle: {
    _arc: DiagramElementPrimative;
    _text: DiagramElementCollection;
  };
} & DiagramElementCollection;

export type extendedCircleType = {
  _bow: bowType;
  _complimentarySineCollection: complimentarySineCollectionType;
} & SinCosCircleType;


type varStateExtendedType = {
  complimentaryRotatingTo: 'left' | 'right' | 'done';
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

    // const arc = this.shapes.polygon(
    //   this.layout.anglePoints, this.layout.radius, this.layout.linewidth, 0, 1,
    //   this.layout.anglePoints * angle / Math.PI / 2, this.colors.sine, new Point(0, 0),
    // );

    // const coArc = this.shapes.polygon(
    //   this.layout.anglePoints, this.layout.radius,
    //   this.layout.linewidth, angle, 1,
    //   this.layout.anglePoints * (Math.PI / 2 - angle) / Math.PI / 2,
    //   this.colors.cosine, new Point(0, 0),
    // );

    const sine = this.makeSineLine('complimentary_sine');
    const cosine = this.makeCosineLine('complimentary_cosine');
    sine.textXOffset = -0.13;
    cosine.textOffset = 0.08;
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

    const compAngle = this.shapes.collection(new Transform().scale(1, 1));
    compAngle.add('text', piOn2MinusTheta);
    compAngle.add('arc', cosineArc);


    const xAxis = this.makeLine(
      new Point(0, 0), this.layout.axes.length, this.layout.linewidth / 4,
      this.colors.axes, new Transform().translate(0, 0),
    );
    const yAxis = this.makeLine(
      new Point(0, 0), this.layout.axes.length, this.layout.linewidth / 4,
      this.colors.axes, new Transform().rotate(Math.PI / 2).translate(0, 0),
    );

    collection.add('xAxis', xAxis);
    collection.add('yAxis', yAxis);
    // collection.add('arc', arc);
    // collection.add('coArc', coArc);
    collection.add('sine', sine);
    collection.add('sineArc', sineArc);
    // collection.add('cosineArc', cosineArc);
    collection.add('cosine', cosine);
    collection.add('theta', theta);
    // collection.add('piOn2MinusTheta', piOn2MinusTheta);
    collection.add('compAngle', compAngle);
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
    this.varState.complimentaryRotatingTo = 'done';
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

  showMinimalComplimentaryAngle() {
    this._circle._complimentarySineCollection.hideAll();
    this._circle._complimentarySineCollection.show();
    this._circle._complimentarySineCollection._radius.show();
    this._circle._complimentarySineCollection._sine.showAll();
    this._circle._complimentarySineCollection._cosine.showAll();
    this._circle._complimentarySineCollection._theta.show();
    this._circle._complimentarySineCollection._sineArc.show();
  }

  showStep(step: number) {
    this.showMinimalComplimentaryAngle();
    const compAngle = this._circle._complimentarySineCollection._compAngle;
    compAngle.showAll();
    if (step === 2) {
      //
    }
  }

  // eslint-disable-next-line class-methods-use-this
  goToStep(step: number) {
    super.goToStep(step);
    if (step === 0) {
      this._circle._radius.transform.updateRotation(this.layout.compAngle.angle);
      this.updateRotation();
      this.showStep(0);
      this.rotationLimits = {
        min: Math.PI / 6,
        max: Math.PI / 6,
      };
      this._circle._complimentarySineCollection._compAngle.pulseScaleNow(1, 1.5);
    }
    if (step === 1) {
      this.showStep(0);
      this.rotateComplimentaryAngle(1);
      this.rotationLimits = {
        min: Math.PI / 6,
        max: Math.PI / 2 + Math.PI / 6,
      };
    }
    this.diagram.animateNextFrame();
  }

  updateRotation() {
    super.updateRotation();
    const r = this.varState.rotation;
    const comp = this._circle._complimentarySineCollection;
    if (comp.isShown) {
      const angle = r - this.layout.compAngle.angle;
      comp.transform.updateRotation(angle);
      comp._sine.textXOffset = -0.13 + angle * 0.04;
      comp._sine.updateRotation(this.layout.radius, this.layout.compAngle.angle, false);
      comp._cosine.textYOffset = +0.08 + angle * 0.04;
      comp._cosine.updateRotation(this.layout.radius, this.layout.compAngle.angle, false);
    }
  }
  rotateComplimentaryAngle(toQuad: number | null) {
    const maxAngle = Math.PI / 2 + this.layout.compAngle.angle;
    const minAngle = this.layout.compAngle.angle;
    let toAngle = minAngle;
    const r = this._circle._radius.transform.r();
    if (r != null && toQuad === null) {
      if (r < (maxAngle - minAngle) / 2 + minAngle) {
        toAngle = maxAngle;
      }
    }

    if (toQuad === 0) {
      toAngle = minAngle;
    }
    if (toQuad === 1) {
      toAngle = maxAngle;
    }

    this._circle._radius.animateRotationTo(toAngle, 2, 2);
    this.diagram.animateNextFrame();
  }
}

export default SineCollection;
