// @flow
import {
  Point,
} from '../../tools/g2';
import VertexBracket from './VertexBracket';

class VertexBar extends VertexBracket {
  getPoints() {
    let w = 1 / 16;

    if (this.numLines === 2) {
      w = 1 / 25;
    }

    const leftPoints = [
      new Point(0, 0),
      new Point(0, this.mainHeight),
    ];
    const rightPoints = [
      new Point(w, 0),
      new Point(w, this.mainHeight),
    ];
    const maxX = w;
    return { leftPoints, rightPoints, maxX };
  }
}
export default VertexBar;

