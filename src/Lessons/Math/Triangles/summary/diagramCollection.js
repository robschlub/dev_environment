// @flow
import { Transform, Point } from '../../../../js/diagram/tools/g2';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';

// import TriangleCollection from '../common/diagramCollectionTriangle';
import CommonLessonDiagramCollection from '../common/diagramCollection';

export default class DiagramCollection extends CommonLessonDiagramCollection {
  // _triangle: TriangleCollection;

  makeEqn(
    vAlign: string = 'baseline',
    hAlign: string = 'left',
    fixTo: string | Point = 'equals',
    scale: number = 1,
  ) {
    const eqn = this.diagram.equation.makeEqn();
    eqn.createElements(
      {
        a: 'a',
        b: 'b',
        // c: 'c',
        equals: ' = ',
        // minus: ' \u2212 ',
        // plus: ' + ',
        // _180: '180º',
        // _90: '90º',
        // _360: '360º',
        // pi: 'π',
        // _2: '2',
        // v: this.diagram.equation.vinculum(this.layout.colors.diagram.text.base),
      },
      this.layout.colors.diagram.text.base,
    );

    eqn.formAlignment.hAlign = hAlign;
    eqn.formAlignment.vAlign = vAlign;
    eqn.formAlignment.scale = scale;
    if (fixTo instanceof Point) {
      eqn.formAlignment.fixTo = fixTo;
    } else {
      eqn.formAlignment.fixTo = eqn.collection[`_${fixTo}`];
    }

    // eqn.addForm('a', ['a']);
    // eqn.addForm('b', ['b']);
    // eqn.addForm('c', ['c']);
    // eqn.addForm('adj_add', ['c', 'equals', 'a', 'plus', 'b']);
    // eqn.addForm('adj_a', ['a', 'equals', 'c', 'minus', 'b']);
    // eqn.addForm('adj_b', ['b', 'equals', 'c', 'minus', 'a']);
    // eqn.addForm('sup_a', ['a', 'equals', '_180', 'minus', 'b'], 'deg');
    // eqn.addForm('sup_a', ['a', 'equals', 'pi', 'minus', 'b'], 'rad');
    // eqn.addForm('sup_b', ['b', 'equals', '_180', 'minus', 'a'], 'deg');
    // eqn.addForm('sup_b', ['b', 'equals', 'pi', 'minus', 'a'], 'rad');
    // eqn.addForm('sup_add', ['_180', 'equals', 'a', 'plus', 'b'], 'deg');
    // eqn.addForm('sup_add', ['pi', 'equals', 'a', 'plus', 'b'], 'rad');

    eqn.addForm('com_a', ['a', 'equals', 'b']);
    // eqn.addForm('com_a', ['a', 'equals', eqn.frac('pi', '_2', 'v'), 'minus', 'b'], 'rad');
    eqn.addForm('com_b', ['b', 'equals', 'a']);
    // eqn.addForm('com_b', ['b', 'equals', eqn.frac('pi', '_2', 'v'), 'minus', 'a'], 'rad');
    // eqn.addForm('com_add', ['_90', 'equals', 'a', 'plus', 'b'], 'deg');
    // eqn.addForm('com_add', [eqn.frac('pi', '_2', 'v'), 'equals', 'a', 'plus', 'b'], 'rad');

    // eqn.addForm('exp_a', ['a', 'equals', '_360', 'minus', 'b'], 'deg');
    // eqn.addForm('exp_a', ['a', 'equals', '2', 'pi', 'minus', 'b'], 'rad');
    // eqn.addForm('exp_b', ['b', 'equals', '_360', 'minus', 'a'], 'deg');
    // eqn.addForm('exp_b', ['b', 'equals', '2', 'pi', 'minus', 'a'], 'rad');
    // eqn.addForm('exp_add', ['_360', 'equals', 'a', 'plus', 'b'], 'deg');
    // eqn.addForm('exp_add', ['2', 'pi', 'equals', 'a', 'plus', 'b'], 'rad');
    return eqn;
  }

  makeMainEqn() {
    const eqn = this.makeEqn('baseline', 'left', 'equals', this.layout.equationScale);
    // eqn.setPosition(this.layout.equationPosition);
    eqn.setElem('a', this.colors.angleA, true, 'up', 0.85);
    eqn.setElem('b', this.colors.angleB, true, 'up', 1.05);
    // eqn.setElem('c', this.colors.angleC, true, 'up', 1.05);
    // eqn.setElem('pi', null, true, 'down', 1.2);
    // eqn.setElem('v', null, true, 'down', 1.2);
    // eqn.setElem('_2', null, true, 'down', 1.2);
    // eqn.setElem('_90', null, true, 'down', 1);
    // eqn.setElem('_180', null, true, 'down', 1);
    // eqn.setElem('_360', null, true, 'down', 1);
    eqn.showEqn = (angleType: TypeAdjacentAngle, eqnForm: TypeEquationForm) => {
      eqn.showForm(`${angleType.slice(0, 2)}_${eqnForm}`);
    };

    const onclickEqn = (form: TypeEquationForm = 'add') => {
      const eqnForm = eqn.getForm(`${this.angleType.slice(0, 3)}_${form}`);
      eqn.setCurrentForm(eqnForm);
      eqnForm.animateTo(this.layout.equationScale, 1.5, eqn.collection._equals);
      // if (form === 'a') {
      //   this._lines._angleA.pulseScaleNow(1, 1.5);
      //   this._lines._angleB.showForm('b');
      //   this._lines._angleA.showForm(`${this.angleType.slice(0, 3)}_${form}`);
      // }
      // if (form === 'b') {
      //   this._lines._angleB.pulseScaleNow(1, 1.5);
      //   this._lines._angleA.showForm('a');
      //   this._lines._angleB.showForm(`${this.angleType.slice(0, 3)}_${form}`);
      // }
      // if (form === 'add') {
      //   console.log('add', this._eqn.lastDrawTransform._dup());
      //   this._lines._angleC.pulseScaleNow(1, 1.3);
      //   this._lines._angleA.showForm('a');
      //   this._lines._angleB.showForm('b');
      //   this._lines._angleC.showForm('c');
      // }
      // this.updateAngles();
      this.diagram.animateNextFrame();
    };

    eqn.collection._a.onClick = onclickEqn.bind(this, 'a');
    eqn.collection._b.onClick = onclickEqn.bind(this, 'b');
    // eqn.collection._c.onClick = onclickEqn.bind(this, 'add');
    // eqn.collection._pi.onClick = onclickEqn.bind(this, 'add');
    // eqn.collection.__90.onClick = onclickEqn.bind(this, 'add');
    // eqn.collection.__180.onClick = onclickEqn.bind(this, 'add');
    // eqn.collection.__360.onClick = onclickEqn.bind(this, 'add');
    // eqn.collection.__2.onClick = onclickEqn.bind(this, 'add');
    // eqn.collection._v.onClick = onclickEqn.bind(this, 'add');
    return eqn;
  }

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform().scale(1, 1),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);
    this.angleType = 'complementary'
    this.eqn = this.makeMainEqn();
    this.add('eqn', this.eqn.collection);
    this.transform.updateScale(1.7, 1.7)
    // this._eqn.setPosition(0, 0);
    // this.add('triangle', new TriangleCollection(diagram, this.layout));
  }
}
