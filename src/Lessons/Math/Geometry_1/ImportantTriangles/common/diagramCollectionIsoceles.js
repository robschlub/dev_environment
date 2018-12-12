// @flow
import LessonDiagram from './diagram';
import {
  Transform, Rect, Point,
} from '../../../../../js/diagram/tools/g2';
import DiagramObjectAngle from '../../../../../js/diagram/DiagramObjects/Angle';
import { DiagramObjectLine } from '../../../../../js/diagram/DiagramObjects/Line';
// import { joinObjects } from '../../../../../js/tools/tools';
import {
  DiagramElementCollection,
} from '../../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

export default class IsocelesCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _tri: {
    _angle1: DiagramObjectAngle;
    _angle2: DiagramObjectAngle;
    _angle3: DiagramObjectAngle;
    _side12: DiagramObjectLine;
    _side23: DiagramObjectLine;
    _side31: DiagramObjectLine;
  }

  _splitLine1: DiagramObjectLine;
  _splitLine2: DiagramObjectLine;

  addLayout() {
    if (this.layout.addElements != null
      && Array.isArray(this.layout.addElements)
    ) {
      this.layout.addElements.forEach((elementDefinition, index) => {
        if (elementDefinition.name == null
          || elementDefinition.method == null
        ) {
          throw new Error(`Layout addElement at index ${index}: missing name property`);
          // return;
        }

        const getMethod = (e, remainingPath) => {
          if (!(remainingPath[0] in e)) {
            throw new Error(`Layout addElement at index ${index}: collection or method ${remainingPath} does not exist`);
          }
          if (remainingPath.length === 1) {
            return e[remainingPath[0]];
          }
          return getMethod(e[remainingPath[0]], remainingPath.slice(1));
        };

        let collectionPath;
        if (elementDefinition.path == null || elementDefinition.path === '') {
          collectionPath = this;
        } else {
          const path = elementDefinition.path.split('/');
          collectionPath = getMethod(this, path);
        }
        const methodPath = elementDefinition.method.split('/');

        const method = getMethod(this, methodPath).bind(getMethod(this, methodPath.slice(0, -1)));
        if (typeof method !== 'function') {
          return;
        }
        if (methodPath.slice(-1)[0].startsWith('add')) {
          method(collectionPath, elementDefinition.name, elementDefinition.options);
        } else {
          const element = method(elementDefinition.options);
          if (element == null) {
            return;
          }
          if (collectionPath instanceof DiagramElementCollection) {
            collectionPath.add(elementDefinition.name, element);
          }
        }
      });
    }
  }

  addGrid() {
    const lay = this.layout.grid;
    const grid = this.diagram.shapes.grid(
      new Rect(
        -lay.length / 2, -lay.height / 2,
        lay.length, lay.height,
      ),
      lay.spacing, lay.spacing, 2, this.layout.colors.grid,
      new Transform().translate(lay.position),
    );
    this.add('grid', grid);
  }

  addTri() {
    const iso = this.diagram.shapes.collection(new Transform('iso')
      .translate(0, 0));

    // tri
    const line = this.diagram.shapes.polyLine(this.layout.iso.tri);
    iso.add('line', line);

    // Angles
    let lay = this.layout.iso;
    iso.add('angle1', this.diagram.objects.angle(lay.angle, lay.angle1));
    iso.add('angle2', this.diagram.objects.angle(lay.angle, lay.angle2));
    iso.add('angle3', this.diagram.objects.angle(lay.angle, lay.angle3));

    // Sides
    lay = this.layout.iso;
    iso.add('side12', this.diagram.objects.line(lay.sideLength, lay.side12));
    iso.add('side23', this.diagram.objects.line(lay.sideLength, lay.side23));
    iso.add('side31', this.diagram.objects.line(lay.sideLength, lay.side31));
    this.add('tri', iso);
  }

  addSplitLines() {
    const lay = this.layout.iso;
    this.add('splitLine1', this.diagram.objects.line(lay.splitLine1));
    this.add('splitLine2', this.diagram.objects.line(lay.splitLine2));
  }

  addLeftRightTris() {
    const lay = this.layout.iso;
    const layL = this.layout.iso.left;
    const layR = this.layout.iso.right;

    const left = this.diagram.shapes.collection(new Transform('left').translate(0, 0));
    const right = this.diagram.shapes.collection(new Transform('left').translate(0, 0));

    // tri
    const leftLine = this.diagram.shapes.polyLine(this.layout.iso.left.tri);
    left.add('line', leftLine);

    // Angles
    left.add('angle1', this.diagram.objects.angle(lay.angle, layL.angle1));
    left.add('angle2', this.diagram.objects.angle(lay.angle, layL.angle2));
    left.add('angle3', this.diagram.objects.angle(lay.angle, layL.angle3));
    right.add('angle1', this.diagram.objects.angle(lay.angle, layR.angle1));
    right.add('angle2', this.diagram.objects.angle(lay.angle, layR.angle2));
    right.add('angle3', this.diagram.objects.angle(lay.angle, layR.angle3));

    // Sides
    left.add('side12', this.diagram.objects.line(lay.sideLength, layL.side12));
    left.add('side23', this.diagram.objects.line(lay.sideLength, layL.side23));
    left.add('side31', this.diagram.objects.line(lay.sideLength, layL.side31));
    right.add('side12', this.diagram.objects.line(lay.sideLength, layR.side12));
    right.add('side23', this.diagram.objects.line(lay.sideLength, layR.side23));
    right.add('side31', this.diagram.objects.line(lay.sideLength, layR.side31));

    const rightLine = this.diagram.shapes.polyLine(this.layout.iso.right.tri);
    right.add('line', rightLine);

    this.add('left', left);
    this.add('right', right);
  }

  addEquations() {
    // const color1 = [1, 0, 0, 1];
    // this.diagram.equation.addNavigator(this, 'test', {
    //   color: color1,
    //   elements: {
    //     a: 'a',
    //     b: 'b',
    //     c: 'c',
    //     _2: '2',
    //     v: { symbol: 'vinculum' },
    //   },
    //   forms: {
    //     '0': ['a', 'b', 'c'],
    //     '1': [{ frac: ['a', '_2', 'v'] }, 'c'],
    //   },
    //   formSeries: ['0', '1'],
    // });

    this.addLayout();

    // const elements = {
    //   a: 'a',
    //   b: 'b',
    //   c: 'c',
    //   d: 'd',
    //   e: 'e',
    //   f: 'f',
    //   g: 'g',
    //   v: { symbol: 'vinculum' },
    //   v1: { symbol: 'vinculum' },
    //   x: { symbol: 'xStrike' },
    //   lb: { symbol: 'bracket', side: 'left' },
    //   rb: { symbol: 'bracket', side: 'right' },
    //   lb1: { symbol: 'bracket', side: 'left' },
    //   rb1: { symbol: 'bracket', side: 'right' },
    //   lb2: { symbol: 'bracket', side: 'left' },
    //   rb2: { symbol: 'bracket', side: 'right', numLines: 2 },
    //   bar: { symbol: 'bar' },
    // };
    // const strikeCol = this.layout.colors.diagram.disabled;
    // this.diagram.equation.addEquation(this, 'testEqn', {
    //   color: this.layout.colors.diagram.text.base,
    //   scale: 2,
    // });
    // this.diagram.equation.addNavigator(this, 'testNav', {
    //   equation: this._testEqn,
    //   offset: new Point(0.2, -0.5),
    //   navType: '2Line',
    //   alignH: 'center',
    //   alignV: 'middle',
    //   navTypeOptions: { arrows: true },
    // });
    // // $FlowFixMe
    // const eqn = this._testEqn;
    // const e = eqn.eqn.functions;
    // // eslint-disable-next-line
    // const frac = e.frac.bind(e);
    // eqn.addElements(elements);
    // // eslint-disable-next-line
    // const s = 0.5;
    // eqn.addPhrases({
    //   abc: ['a', 'b', 'c'],
    // });
    // eqn.addForms({
    //   '0': ['a', 'b'],
    //   '1': e.topStrike(['a', 'b'], 'c', 'x', 0.07, 0.5),
    //   '2': 'c',
    //   // '0': e.topStrike('a', 'b', 'x'),
    // });
    // eqn.setFormSeries(['0', '1', '2']);
    // eqn.changeDescription('0', 'Hello');
    // eqn.changeDescription('1', 'There');
    // eqn.changeDescription('2', 'How are you');
    // eqn.showForm('1');

    // eqn.showForm('4');
    // console.log(eqn.eqn.forms['4'].base.height)
    // // eqn.showForm('5');
    // console.log(eqn.eqn.forms['5'].base.height)
    // console.log(eqn.eqn.forms['4'].base.content[0].content[0].height)
    // console.log(eqn.eqn.forms['5'].base.content[0].content[0].height)
    // console.log(eqn.eqn.forms['4'].base)
    // console.log(eqn.eqn.forms['5'].base)
    // const e = this._testEqn.eqn.functions;
    // const frac = e.frac.bind(e);
    // const eqn = this._testEqn;
    // eqn.addElements({
    //   a: 'a',
    //   b: 'b',
    //   c: 'c',
    //   _2: '2',
    //   v: { symbol: 'vinculum' },
    //   v1: { symbol: 'vinculum' },
    // });
    // eqn.addForms({
    //   '0': {
    //     frac: {
    //       nemerator: {
    //         frac: {
    //           numerator: 'a',
    //           denominator: 'b',
    //           symbol: 'v',
    //         },
    //       },
    //       denominator: 'c',
    //       symbol: 'v1',
    //     }
    //   },
    //   '0': {
    //     frac: [
    //       {
    //         frac: ['a', 'b', 'v']
    //       },
    //       'c',
    //       'v1',
    //     ]
    //   },
    //   '2': e.frac([e.frac(['a', 'b', 'v']), 'c', 'v1']),
    //   '1': frac(frac('a', 'b', 'v'), 'c', 'v1'),
    // });
    // eqn.setFormSeries(['0', '1', '2']);
    // eqn.showForm('1');

    // this.diagram.equation.addEquation(this, 'testEqn', {
    //   color: this.layout.colors.diagram.text.base,
    //   // color: [0, 1, 0, 1],
    //   elements: {
    //     a: 'a',
    //     b: {
    //       text: 'b',
    //       color: this.layout.colors.angles,
    //       elementOptions: {
    //         isTouchable: true,
    //         animate: { transform: { translation: { options: { magnitude: 0.23 } } } },
    //       },
    //     },
    //     c: 'c',
    //     d: 'd',
    //     e: 'e',
    //     f: 'f',
    //     v: {
    //       symbol: 'vinculum',
    //       elementOptions: {
    //         isTouchable: true,
    //       },
    //     },
    //     v1: { symbol: 'vinculum' },
    //     x: { symbol: 'xStrike' },
    //     s: { symbol: 'strike' },
    //     bar: { symbol: 'bar' },
    //     brace: { symbol: 'brace', side: 'bottom' },
    //     lb: { symbol: 'brace', side: 'left', color: [1, 0, 0, 1] },
    //     rb: { symbol: 'roundedSquareBracket', side: 'right' },
    //   },
    //   forms: {
    //   //   '0': ['.frac', ['a', 'b', 'v'], 'c'],
    //   //   '1': [{ frac: ['a', 'c', 'v'] }, 'b'],
    //   //   '2': ['b', 'a', 'c'],
    //   //   '3': {
    //   //     content: ['b', 'a', 'c'],
    //   //     elementMods: {
    //   //       b: {
    //   //         color: [1, 0, 0, 1],
    //   //       },
    //   //     },
    //   //     subForm: 'deg',
    //   //   },
    //   //   '4': {
    //   //     'deg': ['b', 'a', 'c'],
    //   //     'rad': {
    //   //       content: ['b', 'a', 'c'],
    //   //       elementMods: {
    //   //         b: {
    //   //           color: [1, 0, 0, 1],
    //   //         },
    //   //       },
    //   //     },
    //   //   },

    //     // '1c': {
    //     //   setup: {
    //     //     half: {
    //     //       frac: {
    //     //         numerator: ['a'],
    //     //         denominator: 'b',
    //     //         symbol: 'v',
    //     //       },
    //     //     },
    //     //   },
    //     //   content: [
    //     //     'half', 'equals', 'c',
    //     //   ],
    //     // },
    //     // '1b': [
    //     //   frac('a', 'b', 'v'),
    //     //   frac({ num: 'a', den: 'b', sym: 'v'}),
    //     //   {
    //     //     frac: {
    //     //       numerator: ['a'],
    //     //       denominator: 'b',
    //     //       symbol: 'v',
    //     //     },
    //     //   },
    //     //   { frac: ['a', 'b', 'v'] },
    //     //   {
    //     //     strike: {
    //     //       content: ['a'],
    //     //       widthSymbol: 'x',
    //     //     },
    //     //   },
    //     //   { strike: ['a', 'x'] },

    //     //   annotate(['_2', 'a', 'plus', 'b_'], {
    //     //     withAnnotation: ['minus_', 'b__'],
    //     //     relativeToContent: ['center', -0.4],
    //     //     relativeToAnnotation: ['center', 'top'],
    //     //     size: 0.6,
    //     //   }),

    //     //   {
    //     //     annotate: {
    //     //       content:              ['_2', 'a', 'plus', 'b_'],
    //     //       withAnnotation:       ['minus_', 'b__'],
    //     //       relativeToContent:    ['center', -0.4],
    //     //       relativeToAnnotation: ['center', 'top'],
    //     //       size: 0.6,
    //     //     },
    //     //   },
    //     //   {
    //     //     annotate: {
    //     //       content: ['_2', 'a', 'plus', 'b_'],
    //     //       withAnnotations: [
    //     //         {
    //     //           annotation: ['minus_', 'b__'],
    //     //           relativeToContent: ['center', -0.4],
    //     //           relativeToAnnotation: ['center', 'top'],
    //     //           size: 0.6,
    //     //         },
    //     //         {
    //     //           annotation: ['minus_', 'b__'],
    //     //           relativeToContent: ['right', 1.4],
    //     //           relativeToAnnotation: ['left', 'bottom'],
    //     //           size: 0.6,
    //     //         },
    //     //       ],
    //     //     },
    //     //   },
    //     // ],
    //   },
    // });
    // // $FlowFixMe
    // this._testEqn.setFormSeries(['1', '2']);
    // // $FlowFixMe
    // this._testEqn.addForms({
    //   '11': ['a', 'b', 'c'],
    //   '13': ['a', ['b', 'c']],
    //   '15': {
    //     content: ['b', 'a', 'c'],
    //     elementMods: {
    //       b: {
    //         color: [1, 0, 0, 1],
    //       },
    //     },
    //     subForm: 'deg',
    //   },
    //   '1': ['a', 'b', 'c'],
    //   // '2': [{ frac: ['a', 'b', 'v'] }],
    //   // '2': [{ brac: ['b', 'lb', 'rb'] }, 'a', 'c'],
    //   // '2': [{ brac: [[{ bottomBar: [['a', 'b'], 'bar', 1, 1] }, 'c'], 'lb', 'rb'] }],
    //   '2': {
    //     bottomComment: {
    //       content: ['a', 'b'],
    //       comment: ['c', 'd'],
    //       symbol: 'brace',
    //       contentSpace: 0.05,
    //       commentSpace: 0.05,
    //       scale: 0.6,
    //     },
    //   },
    //   // '2': [
    //   //   {
    //   //     annotate: {
    //   //       content: { topBar: [['a', 'b'], 'brace'] },
    //   //       withAnnotations: [
    //   //         {
    //   //           annotation: {
    //   //             annotation: 'c',
    //   //             relativeToContent: ['left', -0.4],
    //   //             relativeToAnnotation: ['right', 'top'],
    //   //             scale: 0.8,
    //   //           },
    //   //         },
    //   //         {
    //   //           annotation: {
    //   //             annotation: 'e',
    //   //             relativeToContent: [0.5, 1.2],
    //   //             relativeToAnnotation: ['center', 'bottom'],
    //   //             scale: 0.8,
    //   //           },
    //   //         },
    //   //       ],
    //   //     },
    //   //   },
    //   // ],
    //   '90': {
    //     content: ['a', 'b', 'c'],
    //     elementMods: {
    //       b: {
    //         color: [1, 0, 0, 1],
    //       },
    //     },
    //     time: 2,
    //     subForm: 'deg',
    //   },
    //   '1d': {
    //     frac: {
    //       numerator: 'a',
    //       denominator: 'b',
    //       symbol: 'v',
    //     },
    //   },
    //   // '1b': [{ frac: ['b', 'a', 'v'] }, 'c'],
    //   // '1g': [{ sfrac: ['b', 'a', 'v', 0.5] }, 'c'],
    //   // '1h': [
    //   //   {
    //   //     frac: {
    //   //       numerator: ['a', 'd'],
    //   //       denominator: 'b',
    //   //       symbol: 'v',
    //   //     },
    //   //   }, 'c',
    //   // ],
    //   '2a': [
    //     {
    //       frac: {
    //         numerator: { frac: ['d', 'e', 'v1', 0.5] },
    //         denominator: 'b',
    //         symbol: 'v',
    //       },
    //     }, 'c',
    //   ],
    //   '3': [{ frac: ['a', 'b', 'v'] }],
    //   '4': [
    //     {
    //       frac: {
    //         numerator: 'a',
    //         denominator: 'b',
    //         symbol: 'v',
    //       },
    //     },
    //   ],
    //   // '1': [
    //   //   {
    //   //     frac: [
    //   //       { frac: ['d', 'e', 'v1'] },
    //   //       'b',
    //   //       'v',
    //   //     ],
    //   //   }, 'c',
    //   // ],
    // });
    // this.diagram.equation.makeEqnFromOptions({
    //   name: 'isoEqn',
    //   addToCollection: this,
    //   color: this.layout.colors.diagram.text.base,
    //   elements: {
    //     a: { text: 'a', color: this.layout.colors.angles },
    //     // a_: 'a',
    //     b: { text: 'b', color: this.layout.colors.angles },
    //     b_: { text: 'b', color: this.layout.colors.angles },
    //     b__: { text: 'b', color: this.layout.colors.angles },
    //     _2: '2',
    //     _2_: '2',
    //     _2__: '2',
    //     _180: '180º',
    //     plus: ' + ',
    //     minus: ' - ',
    //     minus_: ' - ',
    //     equals: ' = ',
    //     v: { diagramObj: 'vinculum' },
    //     v_: { diagramObj: 'vinculum' },
    //     x: { diagramObj: 'xStrike', color: strikeCol },
    //     x_: { diagramObj: 'xStrike', color: strikeCol },
    //     x__: { diagramObj: 'xStrike', color: strikeCol },

    //     // plus: '+',
    //     // b: { text: 'b', color: [1, 0, 1, 1], drawPriority: 2 },
    //     // c: { text: 'c1', color: [1, 0, 1, 1], drawPriority: 0 },
    //     // d: 'd',
    //     // e: 'e',
    //     // v_: { diagramObj: 'vinculum' },
    //     // v__: { diagramObj: 'vinculum' },
    //     // lb: { diagramObj: 'bracket', side: 'left' },
    //     // rb: { diagramObj: 'bracket', side: 'right' },
    //     // tb: { diagramObj: 'brace', side: 'top' },
    //     // bb: { diagramObj: 'squareBracket', side: 'bottom' },
    //     // bar: { diagramObj: 'bar', side: 'top' },
    //   },
    //   alignment: {
    //     fixTo: 'equals',
    //     // scale: 1.5,
    //     // vAlign: 'top',
    //     // hAlign: 'right',
    //   },
    //   forms: {
    //     '0': ['_2', 'a', 'plus', 'b_', 'equals', '_180'],
    //     '1': [
    //       '.annotation', [
    //         ['_2', 'a', 'plus', 'b_'],
    //         ['.ann', [
    //           ['minus_', 'b__'],
    //           'center', -0.4, 'center', 'top', 0.6],
    //         ],
    //       ],
    //       'equals',
    //       '.annotation', [
    //         '_180',
    //         ['.ann', [
    //           ['minus', 'b'],
    //           'center', -0.4, 'center', 'top', 0.6],
    //         ],
    //       ],
    //     ],
    //     '1a': [
    //       {
    //         annotation: [
    //           ['_2', 'a', 'plus', 'b_'],
    //           {
    //             ann: [
    //               ['minus_', 'b__'],
    //               'center', -0.4, 'center', 'top', 0.6,
    //             ],
    //           },
    //         ],
    //       },
    //       'equals',
    //       '.annotation', [
    //         '_180',
    //         ['.ann', [
    //           ['minus', 'b'],
    //           'center', -0.4, 'center', 'top', 0.6],
    //         ],
    //       ],
    //     ],
    //     '2': [
    //       '.annotation', [
    //         ['_2', 'a', 'plus', '.strike', ['b_', 'x']],
    //         ['.ann', [
    //           ['minus_', '.strike', ['b__', 'x_']],
    //           'center', -0.4, 'center', 'top', 0.6],
    //         ],
    //       ],
    //       'equals',
    //       '.annotation', [
    //         '_180',
    //         ['.ann', [
    //           ['minus', 'b'],
    //           'center', -0.4, 'center', 'top', 0.6],
    //         ],
    //       ],
    //     ],
    //     '2a': [
    //       '_2', 'a',
    //       '.strike', [['plus', 'b_'], 'x'],
    //       '.strike', [['minus_', 'b__'], 'x_'],
    //       'equals',
    //       '_180', 'minus', 'b',
    //     ],
    //     '3': [
    //       '_2', 'a',
    //       'equals',
    //       '_180', 'minus', 'b',
    //     ],
    //     '4': [
    //       '.frac', [['_2', 'a'], '_2_', 'v_'],
    //       'equals',
    //       '.frac', [['_180', 'minus', 'b'], '_2', 'v'],
    //     ],
    //     '5': [
    //       '.frac', [
    //         ['.strike', ['_2', 'x'], 'a'],
    //         ['.strike', ['_2_', 'x_']],
    //         'v_',
    //       ],
    //       'equals',
    //       '.frac', [['_180', 'minus', 'b'], '_2', 'v'],
    //     ],
    //     '6': [
    //       'a',
    //       'equals',
    //       '.frac', [['_180', 'minus', 'b'], '_2', 'v'],
    //     ],
    //     '16': {
    //       'deg': {
    //         content: ['a', 'space', 'plus', 'b'],
    //       },
    //       'rad': {
    //         content: ['b', 'space', 'plus', 'a'],
    //       },
    //     },
    //   },
    //   currentForm: '0',
    //   formSeries: ['0', '1', '2', '3', '4', '5', '6'],
    // });
    // this.diagram.equation.makeEqnFromOptions({
    //   name: 'test',
    //   addToCollection: this,
    //   color: this.layout.colors.angles,
    //   elements: {
    //     a: 'a',
    //     _2: '2',
    //     plus: '+',
    //     b: { text: 'b', color: [1, 0, 1, 1], drawPriority: 2 },
    //     c: { text: 'c1', color: [1, 0, 1, 1], drawPriority: 0 },
    //     d: 'd',
    //     e: 'e',
    //     v: { diagramObj: 'vinculum' },
    //     v_: { diagramObj: 'vinculum' },
    //     v__: { diagramObj: 'vinculum' },
    //     lb: { diagramObj: 'bracket', side: 'left' },
    //     rb: { diagramObj: 'bracket', side: 'right' },
    //     tb: { diagramObj: 'brace', side: 'top' },
    //     bb: { diagramObj: 'squareBracket', side: 'bottom' },
    //     bar: { diagramObj: 'bar', side: 'top' },
    //   },
    //   forms: {
    //     '0': ['a', 'space', 'plus', 'b'],
    //     '1': ['b', 'plus', 'a'],
    //     '2': ['.frac', ['a', '_2', 'v'], 'space', 'plus', 'b'],
    //     '3': ['.frac', {
    //       numerator: 'b',
    //       denominator: '_2',
    //       vinculum: 'v',
    //     }, 'space', 'plus', 'a'],
    //     '4': {
    //       content: ['a', 'space', 'plus', 'b'],
    //       elementMods: {
    //         a: {
    //           color: [0, 0, 1, 1],
    //         },
    //       },
    //     },
    //     '5': ['.sfrac', ['a', '_2', 'v', 0.7], 'space', 'plus', 'b'],
    //     '6': ['.frac', [
    //       ['a', 'space', 'plus', 'space', 'e'],
    //       ['.sfrac', ['b', ['.sfrac', ['d', 'c', 'v__', 0.7]], 'v_', 0.8]],
    //       'v',
    //     ]],
    //     '7': ['a', '.sub', ['b', '_2']],
    //     '8': ['a', '.sup', ['b', '_2']],
    //     '9': ['a', '.supsub', ['b', '_2', 'c']],
    //     '10': ['a', '.brac', ['b', 'lb', 'rb']],
    //     '11': ['a', '.topComment', [['b', 'plus', 'c'], ['_2', 'd'], 'tb']],
    //     '12': ['a', '.bottomComment', [['b', 'plus', 'c'], ['_2', 'd'], 'bb']],
    //     '13': ['a', '.topBar', [['b', 'plus', 'c'], 'bar']],
    //     '14': ['a', '.bottomBar', [['b', 'plus', 'c'], 'bar']],
    //     '15': ['a', '.annotation', [
    //       ['b', 'plus', 'c'],
    //       [
    //         '.ann', ['d', 'left', 'bottom', 'right', 'top'],
    //         '.ann', ['e', 'right', 'top', 'left', 'bottom'],
    //       ],
    //       true,
    //     ], '_2'],
    //     '16': {
    //       'deg': {
    //         content: ['a', 'space', 'plus', 'b'],
    //       },
    //       'rad': {
    //         content: ['b', 'space', 'plus', 'a'],
    //       },
    //     },
    //     '17': {
    // eslint-disable-next-line
    //       content: ['b', 'space1', '.frac', ['a', ['.sfrac', ['d', ['.sfrac', ['e', 'c', 'v__', 0.5]], 'v_', 0.5]], 'v']],
    //       alignment: {
    //         fixTo: new Point(1, 1),
    //         scale: 1.5,
    //         vAlign: 'top',
    //         hAlign: 'right',
    //       },
    //     },
    //   },
    //   currentForm: '0',
    //   formSeries: ['0', '1', '2', '3', '4', '5', '16'],
    // });
  }

  // addSideLengths() {
  //   const { points } = this.layout.iso.tri;
  //   const addLine = (p: { p1: number, p2: number }, name) => {
  //     const line = this.diagram.objects.line(joinObjects(
  //       this.layout.iso.sideLength, p,
  //     ));
  //     this.add(name, line);
  //   };
  //   addLine(this.layout.iso.side12, 'side12');
  //   addLine(this.layout.iso.side23, 'side23');
  //   addLine(this.layout.iso.side31, 'side31');
  //   addLine(this.layout.iso.sideH, 'sideH');
  // }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform('Iso').rotate(0).translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.setPosition(this.layout.iso.position);
    this.addGrid();
    this.addTri();
    this.addLeftRightTris();
    this.addSplitLines();
    this.addEquations();
    // eslint-disable-next-line
    console.log(this)
    // this.setTransformCallback = () => {
    //   const r = this.transform.r();
    //   // console.log(r)
    //   if (r != null) {
    //     this._angle1.update(r);
    //     this._angle2.update(r);
    //     this._angle3.update(r);
    //   }
    // };
    // this._angle1.setAngle({p1: new Point(1, 0), p2: new Point(0, 0), p3: new Point(1, 1)});
    this.hasTouchableElements = true;
    // this.touchInBoundingRect = true;
    // this.isTouchable = true;
    // this.isMovable = true;
    // this.move.type = 'rotation';
    // this._angle1.hasTouchableElements = true;
    // this._angle1._side2.isTouchable = true;
    // this._angle1._side2.isMovable = true;
    // this._angle1._side2.move.type = 'rotation';
    // this._angle1._side2.setTransformCallback = () => {
    //   const r = this._angle1._side2.transform.r();
    //   if (r != null) {
    //     this._angle1.setAngle({angle: r})
    //     this._angle1.update();
    //   }
    // }
  }

  pulseEqualSides() {
    if (this._tri._side23._label != null) {
      this._tri._side23._label.pulseScaleNow(1, 2);
    }
    if (this._tri._side31._label != null) {
      this._tri._side31._label.pulseScaleNow(1, 2);
    }
    this.diagram.animateNextFrame();
  }

  pulseEqualAngles() {
    this._tri._angle1.pulseScaleNow(1, 1.5);
    this._tri._angle2.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  pulseAngle3() {
    this._tri._angle3.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  toggleSplitLines(index: number | null) {
    const line1 = this._splitLine1;
    const line2 = this._splitLine2;
    let indexToUse = 1;
    if (index === null) {
      if (line1.isShown) {
        indexToUse = 2;
      } else {
        indexToUse = 1;
      }
    } else {
      indexToUse = index;
    }

    if (indexToUse === 1) {
      line1.showAll();
      line2.hideAll();
    } else {
      line1.hideAll();
      line2.showAll();
    }
    this.diagram.animateNextFrame();
  }
}
