// @flow

import * as React from 'react';
import '../../css/style.scss';
import ShapesDiagram from '../Lesson/shapesDiagram';
import Page from '../Lesson/content';
import Canvas from './canvas';
// import '../../css/diagram.scss';

type Props = {
  id?: string;
  didMountFn?: (string) => mixed;
};

// const page = new Page();

export default class LessonPage extends React.Component
                                    <Props> {
  page: Page;
  diagram: ShapesDiagram;

  constructor(props: Props) {
    super(props);
    this.page = new Page();
  }

  componentDidMount() {
    // const id = this.props.id || '';
    this.diagram = new ShapesDiagram('shapes');
    Page.setState(this.diagram);
  }


  render() {
    // const id = this.props.id || '';
    return <div className='main_page'>
        <div className='lesson_container'>
          <div className='lesson_title'>
            {this.page.title}
          </div>
          <div className='lesson_text'
               dangerouslySetInnerHTML={ { __html: this.page.content } } />
          <Canvas id="shapes"/>
        </div>
      </div>;
  }
}
