import getColors from './colors';
import GlobalVariables from './globals';

jest.mock('./colors');

describe('Globals Singleton', () => {
  beforeEach(() => {
    // const GlobalVariables = require('./globals');

    getColors.mockReturnValue({
      colorRed: [1, 0, 0, 1],
      colorBlue: [0, 0, 1, 1],
    });
    // const g = new GlobalVariables();
    // console.log(g.instance)
    // g.instance = false;
    // console.log(g.instance)
  });

  test('Actually a singletone', () => {
    // First globals object
    const gvars = new GlobalVariables();
    // Change a default value
    gvars.animateNextFrameFlag = true;

    // Second globals object
    const gvars2 = new GlobalVariables();

    // Second object should be the same as first, even with a default
    // value that has been changed
    expect(gvars).toBe(gvars2);
  });

  test('Globals has colors', () => {
    const gvars = new GlobalVariables();
    expect(gvars.colors.colorRed).toEqual([1, 0, 0, 1]);
  });

  test('Globals has requestNextAnimationFrame', () => {
    const gvars = new GlobalVariables();
    expect(typeof gvars.requestNextAnimationFrame).toEqual('function');
  });

  test('updateCanvas', () => {
    // Create mock canvas html element, with mock getBoundingClientRect
    // function
    document.body.innerHTML =
      '<div>' +
      '  <canvas id="c">' +
      '  </canvas>' +
      '</div>';
    const canvas = document.getElementById('c');
    const boundingRect = {
      bottom: 0,
      height: 1,
      left: 2,
      right: 3,
      top: 4,
      width: 5,
    };
    canvas.getBoundingClientRect = () => boundingRect;

    // Get singleton and check it is initialized correctly
    const gvars = new GlobalVariables();
    expect(gvars.canvasRect).toBe(null);

    // Update canvas
    gvars.updateCanvas(canvas);
    expect(gvars.canvasRect).toEqual(boundingRect);

    // Reset canvas to null
    gvars.updateCanvas(null);
    expect(gvars.canvasRect).toBe(null);
    expect(gvars.canvasWidth).toBe(0);
    expect(gvars.canvasHeight).toBe(0);
  });

  test('animateNextFrame', () => {
    const gvars = new GlobalVariables();
    expect(gvars.animationId).toBe(undefined);
    gvars.animateNextFrame();
    expect(gvars.animationId).toBe(1);
  });

  test('setDrawMethod', () => {
    const gvars = new GlobalVariables();
    const drawScene = a => a + 1;
    expect(gvars.drawScene).not.toBe(drawScene);
    gvars.setDrawMethod(drawScene);
    expect(gvars.drawScene).toBe(drawScene);
  });
});
