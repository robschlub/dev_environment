import HTMLObject from './HtmlObject';
import { Point, Transform, Rect } from '../tools/g2';

describe('Diagram HTML Object', () => {
  let parentDiv;
  let h;
  let mockElement;
  beforeEach(() => {
    parentDiv = {
      offsetWidth: 1000,
      offsetHeight: 500,
    };
    mockElement = {
      style: {},
      getBoundingRect: () => new Rect(-1, -1, 2, 2),
      offsetWidth: 20,
      offsetHeight: 20,
    };
    const element = document.createElement('div');
    const inside = document.createTextNode('test text');
    element.appendChild(inside);
    element.setAttribute('id', 'html_test_element');
    document.body.appendChild(element);
    h = new HTMLObject(parentDiv, 'html_test_element', new Point(0, 0), 'middle', 'center');
    h.element = mockElement;
  });
  test('Instantiation', () => {
    expect(h.location).toEqual(new Point(0, 0));
    expect(h.alignV).toBe('middle');
    expect(h.alignH).toBe('center');
    expect(h.parentDiv).toBe(parentDiv);
    expect(h.element).toBe(mockElement);
  });
  test('glToPixelSpace', () => {
    let gl = new Point(0, 0);
    let pixel = h.glToPixelSpace(gl);
    let expected = new Point(500, 250);
    expect(pixel).toEqual(expected);

    gl = new Point(-1, 1);
    pixel = h.glToPixelSpace(gl);
    expected = new Point(0, 0);
    expect(pixel).toEqual(expected);

    gl = new Point(1, -1);
    pixel = h.glToPixelSpace(gl);
    expected = new Point(1000, 500);
    expect(pixel).toEqual(expected);
  });
  test('transformHtml', () => {
    h.transformHtml(new Transform().matrix());
    expect(h.element.style)
      .toEqual({ position: 'absolute', left: '490px', top: '240px' });
  });
});
