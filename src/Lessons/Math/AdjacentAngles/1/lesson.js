// // @flow

import '../../../css/style.scss';
import renderLesson from '../../../js/views/lesson/lesson';
import { Point } from '../../../js/diagram/tools/g2';
import Content from './content';
import './style.scss';
import imgLink from './tile.png';

renderLesson(new Content('shapes'));

// export default function LessonDetails() {
//   const name = 'Adjacent Angles';
//   const link = '/Lessons/Math/AdjacentAngles';
//   const id = `id_lesson__navigator_tile_${name.toLowerCase()
//     .replace(/ /gi, '_')
//     .replace(/\?/gi, '')
//     .replace(/!/gi, '')}`;
//   const location = new Point(0, 0);
//   return {
//     imgLink,
//     name,
//     link,
//     id,
//     location,
//     }
//   }
// }