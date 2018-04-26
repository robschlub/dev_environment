// import getColors from '../diagram/colors';
import ShapesDiagram from './shapesDiagram';
// import { DiagramElementCollection, DiagramElementPrimative } from '../diagram/Element';
// import { Point } from '../diagram/tools/g2';
// @flow

function actionWord(text, id = '', classes = '') {
  return `<span id="${id}" class="${classes} action_word">${text}</span>`;
}

class Page {
  title: string;
  content: string;
  modifiers: Object;

  constructor() {
    this.title = 'Shapes and Corners';
    this.content =
      '<p>Many shapes have |_corners|.</p>' +
      '<p>Somes corners are |_more_sharp|, while others are |_less_sharp|.</p>' +
      '<p>The sharpness of the corner is a property that can describe a shape.</p>' +
      '<p>So how can you measure sharpness?</p>' +
      '<p>What name do we give to the sharpness?</p>';

    this.modifiers = {
      _corners:
        actionWord('corners', 'id_corners', 'class_corners'),
      _more_sharp:
        actionWord('more sharp', 'id_more_sharp', 'L2_col_more_sharp'),
      _less_sharp:
        actionWord('less sharp', 'id_less_sharp', 'L2_col_less_sharp'),
    };
    this.modifyContent();
  }

  modifyContent() {
    Object.keys(this.modifiers).forEach((key) => {
      const expression = new RegExp(`\\|${key}\\|`, 'gi');
      // console.log(expression);
      // console.log(key)
      // console.log(this);
      // console.log(this.modifiers);
      // console.log(this.modifiers[key]);
      // console.log(this.content.replace(expression, this.modifiers[key]));
      this.content = this.content.replace(expression, this.modifiers[key]);
    });
  }

  static setState(diagram: ShapesDiagram) {
    diagram.elements.hideOnly([
      diagram.elements._square._lessSharpCorners,
      diagram.elements._triangle._moreSharpCorners,
    ]);

    const corners = document.getElementById('id_corners');
    if (corners) {
      corners.onclick = diagram.toggleCorners.bind(diagram);
    }

    const moreSharp = document.getElementById('id_more_sharp');
    if (moreSharp) {
      moreSharp.onclick = diagram.toggleMoreSharpCorners.bind(diagram);
    }

    const lessSharp = document.getElementById('id_less_sharp');
    if (lessSharp) {
      lessSharp.onclick = diagram.toggleLessSharpCorners.bind(diagram);
    }
  }
}

export default Page;

//             for (modifier in page.modifiers) {
//                 let expression = new RegExp('\\|' + modifier + '\\|', 'gi');
//                 page.text = page.text.replace(expression, page.modifiers[modifier]);
//             }
//         }


// this.addPage({
//         title: 'Corners',
//         text: text,
//         modifiers: {
//             _corners: actionWord('corners', '_corners', 'L2_col_corners'),
//         },
//         state: function() {

//             geometry.showOnly([ shapes, 
//                                 shapes['_square'], 
//                                 shapes['_octagon'], 
//                                 shapes['_pent'],
//                                 triangle, 
//                                 triangle['_line'],
//                                 ]);
//             _this.hideAnnotation();
//             document.getElementById("annotation").setAttribute("style", "font-size:0;")
//             document.getElementById("_corners").onclick = geometry.toggleCorners.bind(geometry);
//         },
//         transitionNext: function(done) {
//             geometry.showOnly([triangle, triangle['_line']]);
//             triangle.animateTo(triangle.presetTransforms['onScreenCenter'], 0.7, 0, tools.easeinout,done)
//         },
//     });

//     text =  '<p>Somes corners are |_more_sharp|, while others are |_less_sharp|.</p>' +
//             '<p>So how can you measure sharpness?</p>' +
//             '<p>What name do we give to the sharpness?</p>'+
//             '';
//     this.addPage({
//         text: text,
//         modifiers: {
//             _more_sharp: actionWord('more sharp', '_more_sharp', 'L2_col_more_sharp'),
//             _less_sharp: actionWord('less sharp', '_less_sharp', 'L2_col_less_sharp'),
//         },
//         state: function() {
//             geometry.showOnly([triangle,triangle['_line']]);
//             _this.hideAnnotation();
//             document.getElementById("_more_sharp").onclick = triangle.toggleSharpCorners.bind(triangle);
//             document.getElementById("_less_sharp").onclick = triangle.toggleLessSharpCorners.bind(triangle);
//         },
//         transitionNext: function(done) {
//             startLine.show = true;
//             geometry._circle.show = true;
//             startLine.transform = startLine.presetTransforms['offScreen'].copy();
//             triangle.animateTo(triangle.presetTransforms['offScreen'], 0.7);
//             startLine.animateTo(startLine.presetTransforms['onScreenCenter'],0.7,0,tools.easeinout,done)
//             stick.isMovable = false;
//         },
//         transitionPrev: function(done) {
//             triangle.animateTo(triangle.presetTransforms['onScreenSmall'], 0.7, 0, tools.easeinout,done)
//         }
//     });