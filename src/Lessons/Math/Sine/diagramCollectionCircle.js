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

type angleAnnotationType = {
  _label: DiagramElementPrimative;
  _arc: DiagramElementPrimative;
} & DiagramElementCollection;

type complimentarySineCollectionType = {
  _sine: sineLineType;
  _cosine: sineLineType;
  _radius: DiagramElementPrimative;
  _theta: angleAnnotationType;
  // _sineArc: DiagramElementPrimative;
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

  makeAngleAnnotation(
    angleStart: number,
    angleSize: number,
    angleText: string = '',
    id: string = '',
    color: Array<number> = [0.5, 0.5, 0.5, 1],
    layout: Object = this.layout.angleAnnotation,
  ) {
    const angleFraction = angleSize / Math.PI / 2;
    const labelPosition = polarToRect(layout.arc.radius +
      layout.label.radiusOffset, angleStart + angleSize / 2);
    const label = this.shapes.htmlText(
      angleText,
      `id_lessons__angle_annotation__${id}`,
      'lessons__equation__text lessons__angle_annotation__text',
      labelPosition,
      'middle', 'center',
    );
    label.setColor(color);

    const arc = this.shapes.polygon(
      layout.arc.sides, layout.arc.radius, layout.arc.lineWidth, angleStart, 1,
      layout.arc.sides * angleFraction, color,
      new Transform(),
    );

    const angleAnnotation = this.shapes.collection(new Transform()
      .scale(1, 1).rotate(0));
    angleAnnotation.add('arc', arc);
    angleAnnotation.add('label', label);
    return angleAnnotation;
  }

  makeThetaAngle(
    id: string = '',
    color: Array<number> = [0.5, 0.5, 0.5, 1],
  ) {
    return this.makeAngleAnnotation(
      0, this.layout.compAngle.angle,
      'θ', `theta_${id}`, color, this.layout.thetaAngle,
    );
  }

  makeComplimentAngle(
    id: string = '',
    color: Array<number> = [0.5, 0.5, 0.5, 1],
    rotation: number = 0,
  ) {
    const eqn = this.diagram.equation.makeHTML(`id_lessons__equation__compliment_angle_${id}`);

    eqn.createEq([eqn.frac('π', '2'), '−', 'θ']);
    const complimentAngle = this.makeAngleAnnotation(
      rotation,
      Math.PI / 2 - this.layout.compAngle.angle,
      eqn.render(),
      `comp_${id}`,
      color,
      this.layout.complimentAngle,
    );
    return complimentAngle;
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

    const theta = this.makeThetaAngle(id, this.colors.sine);
    const sine = this.makeSineLine(`complimentary_sine${id}`);
    const cosine = this.makeCosineLine(`complimentary_cosine${id}`);
    sine.textXOffset = -0.13;
    cosine.textOffset = 0.08;
    sine._text.color = this.colors.sine;
    cosine._text.color = this.colors.cosine;
    sine.updateRotation(this.layout.radius, angle);
    cosine.updateRotation(this.layout.radius, angle);

    const compAngle = this.makeComplimentAngle(id, this.colors.cosine, angle);

    const xAxis = this.makeLine(
      new Point(0, 0), this.layout.axes.length, this.layout.linewidth / 4,
      this.colors.axes, new Transform().translate(0, 0),
    );
    const yAxis = this.makeLine(
      new Point(0, 0), this.layout.axes.length, this.layout.linewidth / 4,
      this.colors.axes, new Transform().rotate(Math.PI / 2).translate(0, 0),
    );

    collection.updateRotation = (r: number) => {
      const radiusAngle = r - this.layout.compAngle.angle;
      collection.transform.updateRotation(radiusAngle);
      collection._sine.textXOffset = -0.13 + radiusAngle * 0.04;
      collection._sine.updateRotation(this.layout.radius, this.layout.compAngle.angle, true);
      collection._cosine.textYOffset = +0.08 + radiusAngle * 0.04;
      collection._cosine.updateRotation(this.layout.radius, this.layout.compAngle.angle, true);
    };

    collection.add('xAxis', xAxis);
    collection.add('yAxis', yAxis);
    collection.add('sine', sine);
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
      this.colors.radius, new Transform()
        .scale(1, 1)
        .rotate(angle),
    );

    const compAngle = this.makeComplimentAngle('symmetry', this.colors.cosine);
    const cosine = this.makeSineLine('mirror_cosine');
    cosine.setText('cos θ');
    cosine.textXOffset = 0.13;
    cosine._line.setColor(this.colors.cosine);
    cosine._text.setColor(this.colors.cosine);
    cosine.updateRotation(this.layout.radius, angle);

    const eqn = this.diagram.equation.makeHTML('id__symmetry_sine_piOn2MinusTheta', 'diagram__cosine_text');
    eqn.createEq(['= sin', eqn.frac('π', '2'), '−', 'θ']);
    const sine = this.shapes.htmlText(
      eqn.render(), 'id__sine_consine_symmetry_sine',
      'diagram__equation_text',
      this.layout.quadEqn.position, 'middle', 'center',
    );

    symmetry.add('sine', sine);
    symmetry.add('cosine', cosine);
    symmetry.add('compAngle', compAngle);
    symmetry.add('radius', radius);
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
    this._circle._complimentarySineCollection._theta.showAll();
    // console.log(this._circle._complimentarySineCollection._theta)
    // this._circle._complimentarySineCollection._sineArc.show();
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
      this._circle._cosineSymmetry._compAngle.show();
      this._circle._cosineSymmetry._compAngle._arc.show();
      this._circle._cosineSymmetry._radius.show();
      // this._circle._cosineSymmetry._xAxis.show();
      this._circle._cosineSymmetry._cosine.show();
      this._circle._cosineSymmetry._cosine._line.show();
      // this.updateRotation();
    }
    if (step >= 4) {
      this._circle._cosineSymmetry._cosine.showAll();
      this._circle._cosineSymmetry._compAngle.showAll();
      // this._circle._cosineSymmetry._sine.show();
      this._circle._complimentarySineCollection.hideAll();
      this._circle._radius.hide();
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
    // need to call stop twice as there is up to two levels of callbacks
    this._circle.stop();
    this._circle.stop();

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
      const sineLength = this.layout.radius * Math.cos(this.layout.compAngle.angle) / this.layout.radius;

      const mirror = (percent: number) => {
        const startAngle = angle;
        const stopAngle = angle - this.layout.compAngle.angle * 2;
        const currentAngle = startAngle + (stopAngle - startAngle) * percent;
        const currentScale = Math.sin(startAngle) / Math.sin(currentAngle);
        this._circle._cosineSymmetry._radius.transform
          .updateRotation(currentAngle);

        this._circle._cosineSymmetry._radius.transform
          .updateScale(currentScale, (1 - percent) * 2 - 1);
        this._circle._cosineSymmetry._compAngle.transform
          .updateScale(-(1 - percent * 2), 1);

        this._circle._cosineSymmetry._cosine._line.transform
          .updateTranslation(currentScale * this.layout.radius * Math.cos(currentAngle), 0);
        this._circle._cosineSymmetry._cosine._line.transform
          .updateScale(sineLength, (1 - percent) * 2 - 1);
      };

      const done = () => {
        this._circle._radius.hide();
        this._circle._complimentarySineCollection.disolveElementsOut(1);
        this._circle._cosineSymmetry._compAngle._label.disolveIn(1);
        this._circle._cosineSymmetry._cosine._text.disolveIn(1);
      };

      this._circle._cosineSymmetry
        .animateCustomTo(mirror, 1.5, 0, done);
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
      // this._circle._cosineSymmetry._angle._text.disolveOut(2);
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
