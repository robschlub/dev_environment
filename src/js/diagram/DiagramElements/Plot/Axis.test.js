import Axis from './Axis';
import AxisProperties from './AxisProperties';
import { Point } from '../../g2';
import webgl from '../../../__mocks__/WebGLInstanceMock';
import { round } from '../../mathtools';


describe('Axis', () => {
  test('Default', () => {
    const props = new AxisProperties();
    props.width = 0.1;
    props.length = 1;
    props.start = new Point(1, 1);
    props.rotation = Math.PI / 2;
    const axis = new Axis(webgl, props);
    expect(axis.props.width).toBe(0.1);
    console.log(axis.props.majorTickLength)
    console.log(axis._majorTicks.vertices.points)
  });
});

