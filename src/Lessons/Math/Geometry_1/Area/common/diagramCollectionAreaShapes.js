// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point, Rect, polarToRect,
} from '../../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../../../js/diagram/Element';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import { range } from '../../../../../js/diagram/tools/mathtools';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';
import { makeLine } from '../../../../LessonsCommon/tools/line';

export default class AreaShapesCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _square1: DiagramElementPrimative;
  _square2: DiagramElementPrimative;
  _circle: DiagramElementPrimative;
  _length: {
    _line: TypeLine;
    _line1: TypeLine;
    _line2: TypeLine;
    _line3: TypeLine;
    _line4: TypeLine;
    _ticks: DiagramElementPrimative;
  } & DiagramElementCollection;

  addShapes() {
    const square1 = this.diagram.shapes.polygonFilled(
      4, Math.sqrt(((this.layout.square1.sideLength / 2) ** 2) * 2),
      Math.PI / 4, 4, this.layout.colors.square1,
      new Transform('s1').translate(this.layout.square1.position),
    );
    this.add('square1', square1);

    const square2 = this.diagram.shapes.polygonFilled(
      4, Math.sqrt(((this.layout.square2.sideLength / 2) ** 2) * 2),
      Math.PI / 4, 4, this.layout.colors.square2,
      new Transform('s2').translate(this.layout.square2.position),
    );
    this.add('square2', square2);

    const circle = this.diagram.shapes.polygonFilled(
      this.layout.circle.numSides, this.layout.circle.radius,
      0, this.layout.circle.numSides, this.layout.colors.circle,
      new Transform('c').translate(this.layout.circle.position),
    );
    this.add('circle', circle);
  }

  addLengthMeasure() {
    const lay = this.layout.lengthMeasure;
    const col = this.layout.colors;
    const lengthMeasure = this.diagram.shapes.collection(new Transform('lengthMeasure')
      .translate(lay.position));

    const makeL = (position, length, labelText, name, labelPos, color, width) => {
      const line = makeLine(this.diagram, 'center', 1, width, color);
      line.setPosition(position);
      line.setLength(length);
      line.addLabel(labelText, 0.05, 'labelPos', '', 'horizontal');
      lengthMeasure.add(`line${name}`, line);
    };
    makeL(new Point(0, 0), lay.length, '4m', '', 'bottom', col.line, lay.width);
    const sectionLength = lay.length / lay.sections;
    let start = -lay.length / 2 + sectionLength / 2;
    for (let i = 0; i < lay.sections; i += 1) {
      const label = i === 0 ? '1m' : '';
      makeL(
        new Point(start + i * sectionLength, lay.referenceOffset),
        sectionLength,
        label, `${i}`, 'top', col.reference, lay.width / 2,
      );
    }
    start = -lay.length / 2;
    const grid = this.diagram.shapes.grid(new Rect(
      start,
      lay.referenceOffset - lay.tickLength / 2,
      lay.length,
      lay.tickLength,
    ), lay.length / lay.sections, 0, col.reference);
    lengthMeasure.add('ticks', grid);
    this.add('length', lengthMeasure);
  }

  addAngleMeasure() {
    const lay = this.layout.angleMeasure;
    const angleMeasure = this.diagram.shapes.collection(new Transform('angleM')
      .translate(lay.position));
    const col = this.layout.colors;
    const line = this.diagram.shapes.polyLine([
      new Point(lay.length, 0),
      new Point(0, 0),
      new Point(lay.length * Math.cos(lay.angle), lay.length * Math.sin(lay.angle)),
    ], false, lay.width, col.line);
    angleMeasure.add('line', line);

    const tick = (angle, radius, length) => [
      polarToRect(radius, angle),
      polarToRect(radius - length, angle),
    ];
    const minorTickLines = range(1, 59)
      .map(a => tick(a * Math.PI / 180, lay.length, lay.minorTickLength));
    const minorTicks = this.diagram.shapes.lines(minorTickLines, col.reference);
    const majorTickLines = range(10, 50, 10)
      .map(a => tick(a * Math.PI / 180, lay.length, lay.majorTickLength));
    const majorTicks = this.diagram.shapes.lines(majorTickLines, col.reference);
    angleMeasure.add('minorTicks', minorTicks);
    angleMeasure.add('majorTicks', majorTicks);
    this.add('angle', angleMeasure);
  }

  addCircles() {
    const lay = this.layout.circles;
    const col = this.layout.colors;
    const circle = this.diagram.shapes.polygon(
      lay.sides, lay.radius, lay.width, 0, 1, lay.sides, col.grid,
      lay.position,
    );
    const pattern = this.diagram.shapes.repeatPattern(
      circle, lay.num, lay.num, lay.radius * 2, lay.radius * 2,
    );
    this.add('circles', pattern);
  }

  // eslint-disable-next-line class-methods-use-this
  makeWaveSegment(
    length: number,
    mag: number,
    segments: number,
    start: Point = new Point(0, 0),
    rotation: number = 0,
  ) {
    const step = length / segments;
    const xPoints = range(0, length, step);
    const points = xPoints.map(x => new Point(
      x,
      mag * Math.cos(x / length * 2 * Math.PI),
    ));
    const transform = new Transform().rotate(rotation).translate(start);
    const tPoints = points.map(p => p.transformBy(transform.m()));
    return tPoints;
  }

  makeGenericGrid(xNum: number, yNum: number, sideLength: number) {
    const lay = this.layout.genericGrid;
    const length = xNum * sideLength;
    const height = yNum * sideLength;
    const hPoints = this.makeWaveSegment(
      sideLength, lay.waveMag,
      lay.segments, new Point(-length / 2, -height / 2 - lay.waveMag),
    );
    const hSegment = this.diagram.shapes.polyLine(
      hPoints, false, lay.width, this.layout.colors.grid,
      'never',
    );
    const hLines = this.diagram.shapes.repeatPatternVertex(
      hSegment,
      length / sideLength, height / sideLength + 1,
      sideLength, sideLength,
    );

    const vPoints = this.makeWaveSegment(
      sideLength, lay.waveMag,
      lay.segments, new Point(-length / 2 + lay.waveMag, -height / 2), Math.PI / 2,
    );
    const vSegment = this.diagram.shapes.polyLine(
      vPoints, false, lay.width, this.layout.colors.grid,
      'never',
    );
    const vLines = this.diagram.shapes.repeatPatternVertex(
      vSegment, length / sideLength + 1,
      height / sideLength, sideLength, lay.sideLength,
    );

    const group = this.diagram.shapes.collection();
    group.add('vLines', vLines);
    group.add('hLines', hLines);
    return group;
  }

  addGenericGrid() {
    const lay = this.layout.genericGrid;
    const group = this.makeGenericGrid(
      lay.length / lay.sideLength + 1,
      lay.height / lay.sideLength + 1,
      lay.sideLength,
    );
    this.add('generic', group);
  }

  addSmallGenericGrid() {
    const lay = this.layout.genericGrid;
    const group = this.makeGenericGrid(
      4,
      4,
      lay.sideLength,
    );
    this.add('smallGeneric', group);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addShapes();
    this.addLengthMeasure();
    this.addAngleMeasure();
    this.addCircles();
    this.addGenericGrid();
    this.addSmallGenericGrid();
    this.setPosition(this.layout.shapesPosition);
    this.hasTouchableElements = true;
  }
}
