// @flow

import * as React from 'react';
import '../../css/style.scss';
import ShapesDiagram from '../Lesson/shapesDiagram';
import CircleDiagram from '../Lesson/circleDiagram';
import content from '../Lesson/content';
import Canvas from './canvas';
import '../Lesson/lessonStyle.scss';
// import '../../css/diagram.scss';

type Props = {
  id?: string;
  didMountFn?: (string) => mixed;
};

// const page = new Page();

export default class LessonPage extends React.Component
                                    <Props> {
  content: content;
  diagram: ShapesDiagram;
  diagramCircle: CircleDiagram;

  constructor(props: Props) {
    super(props);
    this.content = content;
  }

  componentDidMount() {
    // const id = this.props.id || '';
    this.diagram = new ShapesDiagram('shapes');
    this.content[0].setState(this.diagram);
    this.diagramCircle = new CircleDiagram('circle');
    this.content[1].setState(this.diagramCircle);
  }

  // eslint-disable-next-line class-methods-use-this
  addParagraph(text: string, i: number) {
    return <div
      className="lesson_text"
      key={i}
      dangerouslySetInnerHTML={ {
        __html: `<p>${text}`,
      } }
    />;
  }

  // eslint-disable-next-line class-methods-use-this
  addDiagram(id: string, i: number) {
    return <Canvas id={id} key={i}/>;
  }

  renderContent(page: Object) {
    return page.content.map((c, i) => {
      if (typeof c === 'string') {
        return this.addParagraph(c, i);
      }
      return this.addDiagram(c.canvasId, i);
    });
  }

  render() {
    return <div className='main_page'>
      <div className='lesson_container'>
        {this.renderContent(this.content[0])}
        {this.renderContent(this.content[1])}
      </div>
    </div>;
  }
}
