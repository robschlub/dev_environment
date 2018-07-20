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
  } & DiagramElementCollection;
  _xAxis: DiagramElementPrimative;
  _yAxis: DiagramElementPrimative;
} & DiagramElementCollection;

export type extendedCircleType = {
  _bow: bowType;
  _complimentarySineCollection: complimentarySineCollectionType;
  _cosineSymmetry: {
    _radius: DiagramElementPrimative;
    _angle: {
      _arc: DiagramElementPrimative;
      _text: DiagramElementPrimative;
    } & DiagramElementCollection;
    _sine: sineLineType;
    _text: DiagramElementCollection;
    _xAxis: DiagramElementPrimative;
  } & DiagramElementCollection;
} & SinCosCircleType;


type varStateExtendedType = {
  complimentaryRotatingTo: 'left' | 'right' | 'done';
} & SinCosVarStateType;

export type SineCollectionType = {
  _circle: extendedCircleType;
  _cosineEqn: DiagramElementPrimative;
  varState: varStateExtendedType;
};

class SineCollection extends SinCosCircle {
  _circle: extendedCircleType;
  varState: varStateExtendedType;
  _cosineEqn: DiagramElementPrimative;

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

  makeComplimentarySineCollection(id: string = '') {
    const collection = this.shapes.collection(new Transform().rotate(0).translate(0, 0));
    const { angle } = this.layout.compAngle;
    const radius = this.makeLine(
      new Point(0, 0), this.layout.radius, this.layout.linewidth,
      this.colors.radius, new Transform()
        .scale(1, 1)
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

    const sine = this.makeSineLine(`complimentary_sine${id}`);
    const cosine = this.makeCosineLine(`complimentary_cosine${id}`);
    sine.textXOffset = -0.13;
    cosine.textOffset = 0.08;
    sine.updateRotation(this.layout.radius, angle);
    cosine.updateRotation(this.layout.radius, angle);


    const thetaPosition = polarToRect(this.layout.radius / 4, angle / 2);
    const theta = this.shapes.htmlText(
      'θ', `id_diagram__complimentary_sine_angle${id}`, 'diagram__sine_text',
      thetaPosition, 'middle', 'center',
    );

    const eqn = this.diagram.equation.makeHTML(`id__piOn2MinusTheta${id}`);
    eqn.createEq([eqn.frac('π', '2'), '−', 'θ']);

    const piOn2Position = polarToRect(this.layout.radius / 3.3, (Math.PI / 2 - angle) / 2 + angle);
    const piOn2MinusTheta = this.shapes.htmlText(
      eqn.render(), `id_diagram__complimentary_cosine_angle${id}`, 'diagram__cosine_text',
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

    collection.updateRotation = (r: number) => {
      // if (collection.isShown) {
      const radiusAngle = r - this.layout.compAngle.angle;
      collection.transform.updateRotation(radiusAngle);
      collection._sine.textXOffset = -0.13 + radiusAngle * 0.04;
      collection._sine.updateRotation(this.layout.radius, this.layout.compAngle.angle, true);
      collection._cosine.textYOffset = +0.08 + radiusAngle * 0.04;
      collection._cosine.updateRotation(this.layout.radius, this.layout.compAngle.angle, true);
      // }
    };

    collection.add('xAxis', xAxis);
    collection.add('yAxis', yAxis);
    collection.add('sine', sine);
    collection.add('sineArc', sineArc);
    collection.add('cosine', cosine);
    collection.add('theta', theta);
    collection.add('compAngle', compAngle);
    collection.add('radius', radius);
    return collection;
  }

  makeCosineSymmetry() {
    const symmetry = this.shapes.collection(new Transform().rotate(0));
    const angle = Math.PI / 2 - this.layout.compAngle.angle;
    const radius = this.makeLine(
      new Point(0, 0), this.layout.radius, this.layout.linewidth / 3,
      this.colors.axis, new Transform()
        .scale(1, 1)
        .rotate(angle)
        .translate(0, 0),
    );
    const xAxis = this.makeLine(
      new Point(0, 0), this.layout.radius, this.layout.linewidth / 3,
      this.colors.axis, new Transform()
        .scale(1, 1)
        .rotate(0)
        .translate(0, 0),
    );
    // radius.pulse.transformMethod = s => new Transform().scale(s, 1);
    // radius.pulse.style = s => s;

    const eqn = this.diagram.equation.makeHTML('id__symmetry_piOn2MinusTheta', 'diagram__cosine_text');
    eqn.createEq([eqn.frac('π', '2'), '−', 'θ']);

    const piOn2Position = polarToRect(this.layout.radius / 3.3, angle / 2);
    const piOn2MinusTheta = this.shapes.htmlText(
      eqn.render(), 'id_diagram__complimentary_symmetry_cosine_angle', '',
      piOn2Position, 'middle', 'center',
    );

    const arc = this.shapes.polygon(
      this.layout.anglePoints, this.layout.radius / 5,
      this.layout.linewidth / 2, 0, 1,
      this.layout.anglePoints * angle / Math.PI / 2,
      this.colors.cosine, new Point(0, 0),
    );

    const sine = this.makeSineLine('mirror_sine');

    const sineEqn = this.diagram.equation.makeHTML('id__symmetry_sine_piOn2MinusTheta', 'diagram__cosine_text');
    sineEqn.createEq(['sin', eqn.frac('π', '2'), '−', 'θ']);
    sine.setText(sineEqn.render());
    sine.textXOffset = 0.2;
    sine._line.color = this.colors.cosine;
    sine.updateRotation(this.layout.radius, angle);

    const compAngle = this.shapes.collection(new Transform().scale(1, 1));
    compAngle.add('text', piOn2MinusTheta);
    compAngle.add('arc', arc);

    symmetry.add('xAxis', xAxis);
    symmetry.add('sine', sine);
    symmetry.add('angle', compAngle);
    symmetry.add('radius', radius);

    // symmetry.add('text', piOn2MinusTheta);
    return symmetry;
  }

  makeCosineEquation() {
    const eqn = this.diagram.equation.makeHTML('id__symmetry_sine_cosine_eqn', 'diagram__cosine_text');
    eqn.createEq([
      eqn.el('cos θ = sin', 'id__symmetry_sine_cosine_eqn_left'),
      eqn.el('(', 'id__symmetry_sine_cosine_eqn_bracket_l'),
      eqn.frac('π', '2', 'id__symmetry_sine_cosine_eqn_frac'),
      eqn.el('− θ', 'id__symmetry_sine_cosine_eqn_right', ''),
      eqn.el(')', 'id__symmetry_sine_cosine_eqn_bracket_r'),
    ]);

    return this.shapes.htmlText(
      eqn.render(), 'id__sine_eqn_cosine', 'diagram__equation_text',
      this.layout.quadEqn.position, 'middle', 'center',
    );
  }

  addToCircle() {
    this._circle.add('bow', this.makeBow());
    this._circle.add('compShadow', this.makeComplimentarySineCollection('1'));
    this._circle.add('complimentarySineCollection', this.makeComplimentarySineCollection());
    this._circle.add('cosineSymmetry', this.makeCosineSymmetry());
    this._circle._compShadow.setColor(this.colors.grid);
    this._circle._compShadow._radius.transform.updateScale(1, 0.3);
  }

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(lessonLayout(), diagram, transform);
    this.addToCircle();
    this.add('cosineEqn', this.makeCosineEquation());
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
    this._circle._complimentarySineCollection._xAxis.show();
    this._circle._complimentarySineCollection._yAxis.show();
    this._circle._compShadow.hideAll();
    this._cosineEqn.hide();
    this._circle._cosineSymmetry.hideAll();
    this._circle._radius.show();
  }

  showStep(step: number) {
    this.showMinimalComplimentaryAngle();
    const compAngle = this._circle._complimentarySineCollection._compAngle;
    if (step >= 1) {
      compAngle.setFirstTransform(this._circle.transform);
      compAngle.showAll();
    }
    if (step >= 2) {
      this._circle._compShadow.setFirstTransform(this._circle.transform);
      this._circle._compShadow.showAll();
    }
    if (step >= 3) {
      this._circle._cosineSymmetry.setFirstTransform(this._circle.transform);
      this._circle._cosineSymmetry.show();
      this._circle._cosineSymmetry._angle.showAll();
      this._circle._cosineSymmetry._radius.show();
      this._circle._cosineSymmetry._xAxis.show();
      this._circle._radius.hide();
      this._circle._complimentarySineCollection.hideAll();
      // this.updateRotation();
    }
    if (step >= 4) {
      this._circle._cosineSymmetry._sine.showAll();
    }
    if (step >= 5) {
      this._cosineEqn.setFirstTransform(this.transform);
      this._cosineEqn.show();
    }
    this.updateRotation();
  }

  // eslint-disable-next-line class-methods-use-this
  goToStep(step: number) {
    super.goToStep(step);
    if (step === 0) {
      this.rotationLimits = {
        min: this.layout.compAngle.angle,
        max: this.layout.compAngle.angle,
      };
      this._circle._radius.transform.updateRotation(this.layout.compAngle.angle);
      this.showStep(0);
    }
    if (step === 1) {
      this.rotationLimits = {
        min: this.layout.compAngle.angle,
        max: this.layout.compAngle.angle,
      };
      this._circle._radius.transform.updateRotation(this.layout.compAngle.angle);
      this.showStep(1);
      this._circle._complimentarySineCollection._compAngle.pulseScaleNow(1, 1.5);
    }
    if (step === 2) {
      this.rotationLimits = {
        min: this.layout.compAngle.angle,
        max: Math.PI / 2 + this.layout.compAngle.angle,
      };
      this._circle._compShadow.updateRotation(this.layout.compAngle.angle);
      this._circle._compShadow.setFirstTransform(this._circle.transform);
      this._circle._radius.transform.updateRotation(this.layout.compAngle.angle);
      this.showStep(2);
      // this.updateRotation();
      this.rotateComplimentaryAngle(1);
    }

    if (step === 3) {
      this.rotationLimits = {
        min: this.layout.compAngle.angle + Math.PI / 2,
        max: this.layout.compAngle.angle + Math.PI / 2,
      };
      const angle = this.layout.compAngle.angle + Math.PI / 2;
      this._circle._radius.transform.updateRotation(angle);
      this._circle._compShadow.updateRotation(angle);
      this._circle._compShadow.setFirstTransform(this._circle.transform);
      this.showStep(3);
      this._circle._cosineSymmetry.transform.updateRotation(angle);

      this._circle._cosineSymmetry
        .animateRotationTo(0, 2, 2);
    }

    if (step === 4) {
      this.rotationLimits = {
        min: this.layout.compAngle.angle + Math.PI / 2,
        max: this.layout.compAngle.angle + Math.PI / 2,
      };
      const angle = this.layout.compAngle.angle + Math.PI / 2;
      this._circle._radius.transform.updateRotation(angle);
      this._circle._compShadow.updateRotation(angle);
      this._circle._compShadow.setFirstTransform(this._circle.transform);
      // this.updateRotation();
      this.showStep(4);
    }
    if (step === 5) {
      this.rotationLimits = {
        min: this.layout.compAngle.angle + Math.PI / 2,
        max: this.layout.compAngle.angle + Math.PI / 2,
      };
      this._circle._radius.transform.updateRotation(this.layout.compAngle.angle + Math.PI / 2);
      // this.updateRotation();
      this.showStep(5);
    }
    this.diagram.animateNextFrame();
  }

  updateRotation() {
    super.updateRotation();
    const r = this.varState.rotation;
    if (this._circle._complimentarySineCollection.isShown) {
      this._circle._complimentarySineCollection.updateRotation(r);
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
