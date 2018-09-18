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
        equals: ' = ',
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
    eqn.formAlignment.fixTo = new Point(0, 0);
    eqn.addForm('a', ['a', 'equals', 'b']);
    // eqn.addForm('b', ['b', 'equals', 'a']);
    return eqn;
  }

  makeMainEqn() {
    const eqn = this.makeEqn('baseline', 'left', 'equals', 1);
    eqn.setElem('a', this.colors.angleA, true, 'up', 0.85);
    eqn.setElem('b', this.colors.angleB, true, 'up', 1.05);
    eqn.showEqn = (angleType: TypeAdjacentAngle, eqnForm: TypeEquationForm) => {
      eqn.showForm(`${eqnForm}`);
    };

    const onclickEqn = (form: TypeEquationForm = 'add') => {
      const eqnForm = eqn.getForm(`${form}`);
      eqn.setCurrentForm(eqnForm);
      eqnForm.animateTo(1, 1.5, eqn.collection._equals);
      this.diagram.animateNextFrame();
    };

    eqn.collection._a.onClick = onclickEqn.bind(this, 'a');
    // eqn.collection._b.onClick = onclickEqn.bind(this, 'b');
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
    this.transform.updateScale(2, 2)
    // this.transform.updateTranslation(-1, -1);
    // this.transform.updateRotation(Math.PI / 2)
    // this._eqn.setPosition(0, 0);
    // this.add('triangle', new TriangleCollection(diagram, this.layout));
  }
}
