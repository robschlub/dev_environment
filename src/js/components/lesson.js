// @flow

import * as React from 'react';
import '../../css/style.scss';
// import { Lesson, Section } from '../Lesson/LessonBase';
import Lesson from '../Lesson/Lesson';
import Canvas from './canvas';
import Button from './button';

type Props = {
  lesson: Lesson;
  section?: number;
  type: 'singlePage' | 'multiPage';
};

type State = {
  htmlText: string,
};

export default class LessonComponent extends React.Component
                                    <Props, State> {
  lesson: Lesson;
  key: number;
  type: 'multiPage' | 'singlePage';
  state: State;
  diagrams: Object;

  constructor(props: Props) {
    super(props);
    // if (props.section) {
    //   this.state = {
    //     section: props.section,
    //   };
    // } else {
    this.state = {
      htmlText: '',
    };
    // }
    this.type = props.type;
    this.lesson = props.lesson;
    this.key = 0;
    this.lesson.refresh = this.refresh.bind(this);
  }

  refresh(htmlText: string) {
    this.setState({ htmlText });
  }
  goToNext() {
    this.lesson.nextSection();
  }

  goToPrevious() {
    this.lesson.prevSection();
  }

  componentDidMount() {
    // Instantiate all the diagrams now that the canvas elements have been
    // created.
    this.lesson.createDiagrams();
    this.lesson.setState();

    if (this.type === 'multiPage') {
      const nextButton = document.getElementById('lesson__button-next');
      if (nextButton instanceof HTMLElement) {
        nextButton.onclick = this.goToNext.bind(this);
      }
      const prevButton = document.getElementById('lesson__button-previous');
      if (prevButton instanceof HTMLElement) {
        prevButton.onclick = this.goToPrevious.bind(this);
      }
    }
  }

  renderTitle(title: string) {
    this.key += 1;
    return <div className='lesson__title' key={this.key}>
        {title}
      </div>;
  }

  renderContent(content: string) {
    this.key += 1;
    return <div key={this.key} className='lesson__text'
      dangerouslySetInnerHTML={ {
        __html: `${content}`,
      } }
      />;
  }

  // addButtons() {
  //   if (this.type === 'multiPage') {
  //     return <div className = "row justify-content-between lesson__button-container">
  //         <Button label="Previous" id="lesson__button-previous" className="-primary -multi-page-lesson"/>
  //         <Button label="Next" id="lesson__button-next" className="-primary -multi-page-lesson"/>
  //       </div>;
  //   }
  //   return <div />;
  // }
  addPrevButton() {
    if (this.type === 'multiPage') {
      return <Button label="<" id="lesson__button-previous" className=" -multi-page-lesson"/>;
    }
    return <div />;
  }
  addNextButton() {
    if (this.type === 'multiPage') {
      return <Button label=">" id="lesson__button-next" className=" -multi-page-lesson"/>;
    }
    return <div />;
  }

  renderMultiPageCanvas() {
    if (this.type === 'multiPage') {
      return <Canvas id="multipage_diagram"/>;
    }
    return <div />;
  }
  render() {
    return <div>
      <div id="lesson__container_name" className="lesson__container">
        
            {this.renderTitle(this.lesson.content.title)}
        
        
            {this.addPrevButton()}
            <div id="multipage_diagram" className="diagram__container">
              <canvas className='diagram__gl'>
              </canvas>
              <div id="dd" className='diagram__html'>
                {this.renderContent(this.lesson.getContentHtml())}
              </div>
              <canvas className='diagram__text'>
              </canvas>
            </div>
            {this.addNextButton()}
        
        
      </div>
    </div>;
  }
}
