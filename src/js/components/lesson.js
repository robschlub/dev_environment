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
  setStateOnNextRefresh: boolean;

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
    this.setStateOnNextRefresh = false;
  }

  componentDidUpdate() {
    if (this.setStateOnNextRefresh) {
      this.lesson.setState();
    }
  }
  refresh(htmlText: string) {
    this.setStateOnNextRefresh = true;
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

  addPrevButton() {
    if (this.type === 'multiPage') {
      return <Button label="" id="lesson__button-previous" className=" -multi-page-lesson"/>;
    }
    return <div />;
  }
  addNextButton() {
    if (this.type === 'multiPage') {
      return <Button label="" id="lesson__button-next" className=" -multi-page-lesson"/>;
    }
    return <div />;
  }

  addGoToButton() {
    if (this.type === 'multiPage') {
      return <div className="dropdown lesson__button-goto_container">
        <button className="btn btn-secondary dropdown-toggle lesson__button-goto" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Go to
        </button>
        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
        {this.addListOfSections()}
        </div>
      </div>;
    }
    return <div />;
  }

  belongsTo(index: number) {
    let i = index;
    while (i > 0) {
      const { title } = this.lesson.content.sections[i];
      if (title) {
        break;
      }
      i -= 1;
    }
    return i;
  }

  clickList(index: number) {
    this.lesson.goToSection(index);
  }

  addListOfSections() {
    const output = [];
    const activeSection = this.belongsTo(this.lesson.currentSectionIndex);
    this.lesson.content.sections.forEach((section, index) => {
      if (section.title) {
        let classNames = 'dropdown-item';
        if (index === activeSection) {
          classNames += ' active';
        }
        this.key += 1;
        output.push(<div
          className={classNames}
          onClick={this.clickList.bind(this, index)}
          key={this.key}>
            {section.title}
          </div>);
      }
    });
    return output;
  }

  addPageNumber() {
    if (this.type === 'multiPage') {
      return <div id="lesson__page_number">
      {`${this.lesson.currentSectionIndex + 1} / ${this.lesson.content.sections.length}`}
      </div>;
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
      <div className='lesson__title'>
              {this.lesson.content.title}
      </div>
      <div id="lesson__container_name" className="lesson__container">
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
            {this.addPageNumber()}
            {this.addGoToButton()}
            {this.addNextButton()}
      </div>
    </div>;
  }
}
