// @flow

import * as React from 'react';
import '../../css/style.scss';
import ShapesDiagram from '../Lesson/shapesDiagram';
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

  constructor(props: Props) {
    super(props);
    this.content = content;
  }

  componentDidMount() {
    // const id = this.props.id || '';
    this.diagram = new ShapesDiagram('shapes');
    console.log(this.content)
    this.content[0].setState(this.diagram);
  }


  render() {
    // const id = this.props.id || '';
    return <div className='main_page'>
        <div className='lesson_container'>
          <div className='lesson_title'>
            {this.content[0].title}
          </div>
          <div className='lesson_text'
               dangerouslySetInnerHTML={ { __html: this.content[0].content } } />
          <Canvas id="shapes"/>
          <div className='lesson_text'
               dangerouslySetInnerHTML={ { __html: this.content[1].content } } />
        </div>
      </div>;
  }
}
