import Axis from './Axis';
import { AxisProperties } from './AxisProperties';
import { Point } from '../../tools/g2';
import webgl from '../../../__mocks__/WebGLInstanceMock';
import { round } from '../../tools/mathtools';


describe('Axis', () => {
  let axis;
  let props;
  beforeEach(() => {
    const mockCtx = {
      ratio: 1,
      ctx: {
        font: '',
        textAlgin: '',
        textBaseline: '',
        canvas: {
          width: 100,
          height: 100,
        },
        measureText: () => {  // eslint-disable-line arrow-body-style
          return {
            actualBoundingBoxLeft: 0,
            actualBoundingBoxRight: 0,
            actualBoundingBoxAscent: 0,
            actualBoundingBoxDescent: 0,
          };
        },
      },
    };
    props = new AxisProperties();
    props.start = new Point(0, 0);
    props.length = 1;
    props.width = 0.01;
    props.rotation = Math.PI / 4;
    props.color = [0.5, 0.5, 0.5, 1];
    props.label = '';
    props.logarithmic = false;
    props.majorTicks.mode = 'on';
    props.majorTicks.step = 0.5;
    props.majorTicks.length = 0.05;
    props.majorTicks.width = 0.016;
    props.majorTicks.color = [0.5, 0.5, 0.5, 1];
    props.majorTicks.labels = [];
    props.majorTicks.offset = 0;
    props.majorTicks.labelMode = 'on';
    props.majorTicks.labelOffset = -0.5;
    props.majorGrid.mode = 'on';
    props.majorGrid.length = 1;
    props.majorGrid.width = 0.008;
    props.majorGrid.color = [0.7, 0.7, 0.7, 1];
    props.minorTicks.step = 0.25;
    props.minorTicks.length = 0.02;
    props.minorTicks.width = 0.008;
    props.minorTicks.color = [0.5, 0.5, 0.5, 1];
    props.minorTicks.labels = [];
    props.minorTicks.offset = 0;
    props.minorTicks.labelOffset = -0.5;
    props.minorTicks.labelMode = 'on';
    props.minorGrid.mode = 'on';
    props.minorGrid.length = 1;
    props.minorGrid.width = 0.008;
    props.minorGrid.color = [0.9, 0.9, 0.9, 1];
    axis = new Axis(webgl, mockCtx, props);
  });
  test('Default', () => {
    // console.log(axis.props)
    expect(axis.props.start).toEqual(new Point(0, 0));
    expect(axis.props.length).toBe(1);  // eslint-disable-line
    expect(axis.props.width).toBe(0.01);
    expect(axis.props.rotation).toBe(Math.PI / 4);
    expect(axis.props.color).toEqual([0.5, 0.5, 0.5, 1]);
    expect(axis.props.label).toBe('');
    expect(axis.props.logarithmic).toBe(false);
    expect(axis.props.majorTicks.mode).toBe('on');
    expect(axis.props.majorTicks.step).toBe(0.5);
    expect(axis.props.majorTicks).toHaveLength(0.05);
    expect(axis.props.majorTicks.width).toBe(0.016);
    expect(axis.props.majorTicks.color).toEqual([0.5, 0.5, 0.5, 1]);
    expect(axis.props.majorTicks.labels).toEqual([]);
    expect(axis.props.majorTicks.offset).toBe(0);
    expect(axis.props.majorTicks.labelOffset).toBe(-0.5);
    expect(axis.props.majorGrid.mode).toBe('on');
    expect(axis.props.majorGrid).toHaveLength(1);
    expect(axis.props.majorGrid.width).toBe(0.008);
    expect(axis.props.majorGrid.color).toEqual([0.7, 0.7, 0.7, 1]);
    expect(axis.props.minorTicks.step).toBe(0.25);
    expect(axis.props.minorTicks).toHaveLength(0.02);
    expect(axis.props.minorTicks.width).toBe(0.008);
    expect(axis.props.minorTicks.color).toEqual([0.5, 0.5, 0.5, 1]);
    expect(axis.props.minorTicks.labels).toEqual([]);
    expect(axis.props.minorTicks.offset).toBe(0);
    expect(axis.props.minorTicks.labelOffset).toBe(-0.5);
    expect(axis.props.minorGrid.mode).toBe('on');
    expect(axis.props.minorGrid).toHaveLength(1);
    expect(axis.props.minorGrid.width).toBe(0.008);
    expect(axis.props.minorGrid.color).toEqual([0.9, 0.9, 0.9, 1]);
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
      -0.013656854249492381,
      -0.00565685424949238,
      -0.002343145750507619,
      0.00565685424949238,
      -0.037698484809834995,
      0.041012193308819764,
      -0.013656854249492381,
      -0.00565685424949238,
      -0.037698484809834995,
      0.041012193308819764,
      -0.04901219330881976,
      0.029698484809835002,
      0.3398965363437814,
      0.34789653634378137,
      0.35121024484276614,
      0.3592102448427661,
      0.3158549057834388,
      0.39456558390209345,
      0.3398965363437814,
      0.34789653634378137,
      0.3158549057834388,
      0.39456558390209345,
      0.30454119728445406,
      0.38325187540310873,
      0.6934499269370552,
      0.7014499269370551,
      0.7047636354360399,
      0.7127636354360398,
      0.6694082963767125,
      0.7481189744953672,
      0.6934499269370552,
      0.7014499269370551,
      0.6694082963767125,
      0.7481189744953672,
      0.6580945878777278,
      0.7368052659963825,
    ];
    expect(round(axis._majorTicks.vertices.points)).toEqual(round(points));
  });

  test('Minor Tick points', () => {
    const points = [
      -0.006828427124746191,
      -0.00282842712474619,
      -0.0011715728752538096,
      0.00282842712474619,
      -0.015313708498984759,
      0.016970562748477143,
      -0.006828427124746191,
      -0.00282842712474619,
      -0.015313708498984759,
      0.016970562748477143,
      -0.02097056274847714,
      0.011313708498984762,
      0.1699482681718907,
      0.17394826817189069,
      0.17560512242138307,
      0.17960512242138305,
      0.1614629867976521,
      0.193747258045114,
      0.1699482681718907,
      0.17394826817189069,
      0.1614629867976521,
      0.193747258045114,
      0.15580613254815975,
      0.18809040379562164,
      0.3467249634685276,
      0.35072496346852755,
      0.35238181771801996,
      0.3563818177180199,
      0.338239682094289,
      0.37052395334175087,
      0.3467249634685276,
      0.35072496346852755,
      0.338239682094289,
      0.37052395334175087,
      0.33258282784479665,
      0.3648670990922585,
      0.5235016587651645,
      0.5275016587651644,
      0.5291585130146569,
      0.5331585130146568,
      0.515016377390926,
      0.5473006486383877,
      0.5235016587651645,
      0.5275016587651644,
      0.515016377390926,
      0.5473006486383877,
      0.5093595231414336,
      0.5416437943888953,
      0.7002783540618014,
      0.7042783540618013,
      0.7059352083112937,
      0.7099352083112936,
      0.6917930726875628,
      0.7240773439350245,
      0.7002783540618014,
      0.7042783540618013,
      0.6917930726875628,
      0.7240773439350245,
      0.6861362184380705,
      0.7184204896855322,
    ];
    expect(round(axis._minorTicks.vertices.points)).toEqual(round(points));
  });
  test('Major Grid points', () => {
    const points = [
      -0.006828427124746191,
      -0.00282842712474619,
      -0.0011715728752538096,
      0.00282842712474619,
      -0.7082783540618013,
      0.7099352083112938,
      -0.006828427124746191,
      -0.00282842712474619,
      -0.7082783540618013,
      0.7099352083112938,
      -0.7139352083112936,
      0.7042783540618014,
      0.3467249634685276,
      0.35072496346852755,
      0.35238181771801996,
      0.3563818177180199,
      -0.3547249634685275,
      1.0634885989045675,
      0.3467249634685276,
      0.35072496346852755,
      -0.3547249634685275,
      1.0634885989045675,
      -0.36038181771801986,
      1.0578317446550751,
      0.7002783540618014,
      0.7042783540618013,
      0.7059352083112937,
      0.7099352083112936,
      -0.001171572875253709,
      1.4170419894978412,
      0.7002783540618014,
      0.7042783540618013,
      -0.001171572875253709,
      1.4170419894978412,
      -0.006828427124746069,
      1.4113851352483489,
    ];
    expect(round(axis._majorGrid.vertices.points)).toEqual(round(points));
  });

  test('Minor Grid points', () => {
    const points = [
      -0.006828427124746191,
      -0.00282842712474619,
      -0.0011715728752538096,
      0.00282842712474619,
      -0.7082783540618013,
      0.7099352083112938,
      -0.006828427124746191,
      -0.00282842712474619,
      -0.7082783540618013,
      0.7099352083112938,
      -0.7139352083112936,
      0.7042783540618014,
      0.1699482681718907,
      0.17394826817189069,
      0.17560512242138307,
      0.17960512242138305,
      -0.5315016587651644,
      0.8867119036079306,
      0.1699482681718907,
      0.17394826817189069,
      -0.5315016587651644,
      0.8867119036079306,
      -0.5371585130146568,
      0.8810550493584383,
      0.3467249634685276,
      0.35072496346852755,
      0.35238181771801996,
      0.3563818177180199,
      -0.3547249634685275,
      1.0634885989045675,
      0.3467249634685276,
      0.35072496346852755,
      -0.3547249634685275,
      1.0634885989045675,
      -0.36038181771801986,
      1.0578317446550751,
      0.5235016587651645,
      0.5275016587651644,
      0.5291585130146569,
      0.5331585130146568,
      -0.17794826817189058,
      1.2402652942012042,
      0.5235016587651645,
      0.5275016587651644,
      -0.17794826817189058,
      1.2402652942012042,
      -0.18360512242138294,
      1.234608439951712,
      0.7002783540618014,
      0.7042783540618013,
      0.7059352083112937,
      0.7099352083112936,
      -0.001171572875253709,
      1.4170419894978412,
      0.7002783540618014,
      0.7042783540618013,
      -0.001171572875253709,
      1.4170419894978412,
      -0.006828427124746069,
      1.4113851352483489,
    ];
    expect(round(axis._minorGrid.vertices.points)).toEqual(round(points));
  });
});

