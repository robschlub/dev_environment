import Axis from './Axis';
import AxisProperties from './AxisProperties';
import { Point } from '../../g2';
import webgl from '../../../__mocks__/WebGLInstanceMock';
import { round } from '../../mathtools';


describe('Axis', () => {
  let axis;
  let props;
  beforeEach(() => {
    props = new AxisProperties();
    props.start = new Point(0, 0);
    props.length = 1;
    props.width = 0.01;
    props.rotation = Math.PI / 4;
    props.color = [0.5, 0.5, 0.5, 1];
    props.label = '';
    props.logarithmic = false;
    props.majorTick = true;
    props.majorTickSpacing = 0.5;
    props.majorTickLength = 0.05;
    props.majorTickWidth = 0.016;
    props.majorTickColor = [0.5, 0.5, 0.5, 1];
    props.majorTickLabels = [];
    props.majorTickOffset = 0;
    props.majorTickLabelOffset = -0.5;
    props.majorGrid = true;
    props.majorGridLength = 1;
    props.majorGridWidth = 0.008;
    props.majorGridColor = [0.7, 0.7, 0.7, 1];
    props.minorTickSpacing = 0.25;
    props.minorTickLength = 0.02;
    props.minorTickWidth = 0.008;
    props.minorTickColor = [0.5, 0.5, 0.5, 1];
    props.minorTickLabels = [];
    props.minorTickOffset = 0;
    props.minorTickLabelOffset = -0.5;
    props.minorGrid = true;
    props.minorGridLength = 1;
    props.minorGridWidth = 0.008;
    props.minorGridColor = [0.9, 0.9, 0.9, 1];

    axis = new Axis(webgl, props);
  });
  test('Default', () => {
    expect(axis.props.start).toEqual(new Point(0, 0));
    expect(axis.props.length).toBe(1);  // eslint-disable-line
    expect(axis.props.width).toBe(0.01);
    expect(axis.props.rotation).toBe(Math.PI / 4);
    expect(axis.props.color).toEqual([0.5, 0.5, 0.5, 1]);
    expect(axis.props.label).toBe('');
    expect(axis.props.logarithmic).toBe(false);
    expect(axis.props.majorTick).toBe(true);
    expect(axis.props.majorTickSpacing).toBe(0.5);
    expect(axis.props.majorTickLength).toBe(0.05);
    expect(axis.props.majorTickWidth).toBe(0.016);
    expect(axis.props.majorTickColor).toEqual([0.5, 0.5, 0.5, 1]);
    expect(axis.props.majorTickLabels).toEqual([]);
    expect(axis.props.majorTickOffset).toBe(0);
    expect(axis.props.majorTickLabelOffset).toBe(-0.5);
    expect(axis.props.majorGrid).toBe(true);
    expect(axis.props.majorGridLength).toBe(1);
    expect(axis.props.majorGridWidth).toBe(0.008);
    expect(axis.props.majorGridColor).toEqual([0.7, 0.7, 0.7, 1]);
    expect(axis.props.minorTickSpacing).toBe(0.25);
    expect(axis.props.minorTickLength).toBe(0.02);
    expect(axis.props.minorTickWidth).toBe(0.008);
    expect(axis.props.minorTickColor).toEqual([0.5, 0.5, 0.5, 1]);
    expect(axis.props.minorTickLabels).toEqual([]);
    expect(axis.props.minorTickOffset).toBe(0);
    expect(axis.props.minorTickLabelOffset).toBe(-0.5);
    expect(axis.props.minorGrid).toBe(true);
    expect(axis.props.minorGridLength).toBe(1);
    expect(axis.props.minorGridWidth).toBe(0.008);
    expect(axis.props.minorGridColor).toEqual([0.9, 0.9, 0.9, 1]);
  });
  test('Axis points', () => {
    const points = [
      0.0035355339059327372,
      -0.003535533905932738,
      0.7106423150924803,
      0.7035712472806147,
      0.7035712472806148,
      0.7106423150924802,
      0.0035355339059327372,
      -0.003535533905932738,
      0.7035712472806148,
      0.7106423150924802,
      -0.0035355339059327372,
      0.003535533905932738,
    ];
    expect(round(axis._line.vertices.points)).toEqual(round(points));
  });
  test('Major Tick points', () => {
    const points = [
      0,
      0,
      0.011313708498984762,
      0.01131370849898476,
      -0.024041630560342614,
      0.046669047558312145,
      0,
      0,
      -0.024041630560342614,
      0.046669047558312145,
      -0.035355339059327376,
      0.03535533905932738,
      0.3535533905932738,
      0.35355339059327373,
      0.36486709909225856,
      0.3648670990922585,
      0.3295117600329312,
      0.40022243815158587,
      0.3535533905932738,
      0.35355339059327373,
      0.3295117600329312,
      0.40022243815158587,
      0.3181980515339464,
      0.3889087296526011,
    ];
    expect(round(axis._majorTicks.vertices.points)).toEqual(round(points));
  });

  test('Minor Tick points', () => {
    const points = [
      0,
      0,
      0.005656854249492381,
      0.00565685424949238,
      -0.008485281374238568,
      0.019798989873223333,
      0,
      0,
      -0.008485281374238568,
      0.019798989873223333,
      -0.014142135623730949,
      0.014142135623730952,
      0.1767766952966369,
      0.17677669529663687,
      0.18243354954612928,
      0.18243354954612925,
      0.16829141392239833,
      0.1965756851698602,
      0.1767766952966369,
      0.17677669529663687,
      0.16829141392239833,
      0.1965756851698602,
      0.16263455967290594,
      0.19091883092036782,
      0.3535533905932738,
      0.35355339059327373,
      0.35921024484276615,
      0.3592102448427661,
      0.3450681092190352,
      0.37335238046649705,
      0.3535533905932738,
      0.35355339059327373,
      0.3450681092190352,
      0.37335238046649705,
      0.33941125496954283,
      0.3676955262170047,
      0.5303300858899107,
      0.5303300858899106,
      0.5359869401394031,
      0.535986940139403,
      0.5218448045156722,
      0.5501290757631339,
      0.5303300858899107,
      0.5303300858899106,
      0.5218448045156722,
      0.5501290757631339,
      0.5161879502661798,
      0.5444722215136415,
    ];
    expect(round(axis._minorTicks.vertices.points)).toEqual(round(points));
  });
  test('Major Grid points', () => {
    const points = [
      0,
      0,
      0.005656854249492381,
      0.00565685424949238,
      -0.7014499269370551,
      0.7127636354360399,
      0,
      0,
      -0.7014499269370551,
      0.7127636354360399,
      -0.7071067811865475,
      0.7071067811865476,
      0.3535533905932738,
      0.35355339059327373,
      0.35921024484276615,
      0.3592102448427661,
      -0.3478965363437813,
      1.0663170260293136,
      0.3535533905932738,
      0.35355339059327373,
      -0.3478965363437813,
      1.0663170260293136,
      -0.3535533905932737,
      1.0606601717798214,
    ];
    expect(round(axis._majorGrid.vertices.points)).toEqual(round(points));
  });

  test('Minor Grid points', () => {
    const points = [
      0,
      0,
      0.005656854249492381,
      0.00565685424949238,
      -0.7014499269370551,
      0.7127636354360399,
      0,
      0,
      -0.7014499269370551,
      0.7127636354360399,
      -0.7071067811865475,
      0.7071067811865476,
      0.1767766952966369,
      0.17677669529663687,
      0.18243354954612928,
      0.18243354954612925,
      -0.5246732316404181,
      0.8895403307326768,
      0.1767766952966369,
      0.17677669529663687,
      -0.5246732316404181,
      0.8895403307326768,
      -0.5303300858899106,
      0.8838834764831844,
      0.3535533905932738,
      0.35355339059327373,
      0.35921024484276615,
      0.3592102448427661,
      -0.3478965363437813,
      1.0663170260293136,
      0.3535533905932738,
      0.35355339059327373,
      -0.3478965363437813,
      1.0663170260293136,
      -0.3535533905932737,
      1.0606601717798214,
      0.5303300858899107,
      0.5303300858899106,
      0.5359869401394031,
      0.535986940139403,
      -0.1711198410471444,
      1.2430937213259505,
      0.5303300858899107,
      0.5303300858899106,
      -0.1711198410471444,
      1.2430937213259505,
      -0.17677669529663675,
      1.2374368670764582,
    ];
    expect(round(axis._minorGrid.vertices.points)).toEqual(round(points));
  });
});

