import HTMLObject from './HtmlObject';
import { Point, Transform } from '../tools/g2';

describe('Diagram HTML Object', () => {
  let parentDiv;
  beforeEach(() => {
    parentDiv = {};
  });
  test('Instantiation', () => {
    const element = document.createElement('div');
    const inside = document.createTextNode('test text');
    element.appendChild(inside);
    element.setAttribute('id', 'html_test_element');
    document.body.appendChild(element);
    const h = new HTMLObject(parentDiv, 'html_test_element', new Point(0, 0), 'middle', 'center');
    expect(h.location).toEqual(new Point(0, 0));
  });
});
