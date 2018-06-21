// @flow

import * as React from 'react';
import '../../css/style.scss';
import Lesson from '../Lesson/Lesson';
// import Canvas from './canvas';
import Button from './button';

type Props = {
  lesson: Lesson;
  section?: number;
};

type State = {
  htmlText: string,
  numPages: number,
  page: number,
  listOfSections: Array<React.Node>,
};

export default class LessonComponent extends React.Component
                                    <Props, State> {
  lesson: Lesson;
  key: number;
  state: State;
  diagrams: Object;
  setStateOnNextRefresh: boolean;

  constructor(props: Props) {
    super(props);
    this.state = {
      htmlText: '',
      numPages: 0,
      page: 0,
      listOfSections: [],
    };
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
  refresh(htmlText: string, page: number) {
    this.setStateOnNextRefresh = true;
    this.setState({ htmlText, page });

    const nextButton = document.getElementById('lesson__button-next');
    if (nextButton) {
      if (this.lesson.currentSectionIndex ===
        this.lesson.content.sections.length - 1) {
        nextButton.classList.add('lesson__button-next-disabled');
      } else {
        nextButton.classList.remove('lesson__button-next-disabled');
      }
    }
    const prevButton = document.getElementById('lesson__button-previous');
    if (prevButton) {
      if (this.lesson.currentSectionIndex === 0) {
        prevButton.classList.add('lesson__button-prev-disabled');
      } else {
        prevButton.classList.remove('lesson__button-prev-disabled');
      }
    }
    // if (this.lesson.currentSectionIndex ===
    //     this.lesson.content.sections.length - 1) {
    //   const nextButton = document.getElementById('lesson__button-next');
    //   if (nextButton) {
    //     nextButton.classList.add('lesson__button-next-disabled');
    //   }
    // }
    // if (this.lesson.currentSectionIndex === 0) {
    //   const prevButton = document.getElementById('lesson__button-previous');
    //   if (prevButton) {
    //     prevButton.classList.add('lesson__button-prev-disabled');
    //   }
    // }
    //  {
    //   const nextButton = document.getElementById('lesson__button-next');
    //   const prevButton = document.getElementById('lesson__button-previous');
    //   if (prevButton) {
    //     prevButton.classList.remove('lesson__button-prev-disabled');
    //   }
    //   if (nextButton) {
    //     nextButton.classList.remove('lesson__button-next-disabled');
    //   }
    // }
  }
  goToNext() {
    this.lesson.nextSection();
  }

  goToPrevious() {
    this.lesson.prevSection();
  }

  componentDidMount() {
    // Instantiate diagram now that the canvas elements have been
    // created.
    this.lesson.initialize();
    this.setState({
      listOfSections: this.addListOfSections(),
      numPages: this.lesson.content.sections.length,
    });
    this.lesson.goToSection(0);

    const nextButton = document.getElementById('lesson__button-next');
    if (nextButton instanceof HTMLElement) {
      nextButton.onclick = this.goToNext.bind(this);
    }
    const prevButton = document.getElementById('lesson__button-previous');
    if (prevButton instanceof HTMLElement) {
      prevButton.onclick = this.goToPrevious.bind(this);
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
        __html: content.slice(0, content.length - 1),
      } }
      />;
  }

  // eslint-disable-next-line class-methods-use-this
  addPrevButton() {
    return <Button label="" id="lesson__button-previous" className=" -multi-page-lesson lesson__button-prev-enabled"/>;
  }

  // eslint-disable-next-line class-methods-use-this
  addNextButton() {
    return <Button label="" id="lesson__button-next" className=" -multi-page-lesson lesson__button-next-enabled"/>;
  }

  addGoToButton() {
    return <div className="dropdown lesson__button-goto_container">
      <button className="btn btn-secondary dropdown-toggle lesson__button-goto" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Go to
      </button>
      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
      {this.state.listOfSections}
      </div>
    </div>;
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
    return <div id="lesson__page_number">
    {`${this.state.page + 1} / ${this.state.numPages}`}
    </div>;
  }

  // // eslint-disable-next-line class-methods-use-this
  // renderMultiPageCanvas() {
  //   return <Canvas id="multipage_diagram"/>;
  // }

  render() {
    return <div>
      <div className='lesson__title'>
              {this.lesson.content.title}
      </div>
      <div className="lesson__widescreen_backdrop">
      <div id="lesson__container_name" className="lesson__container">
            {this.addPrevButton()}
            <div id={this.lesson.content.diagramHtmlId} className="diagram__container multipage_diagram">
              <canvas className='diagram__gl'>
              </canvas>
              <div id="dd" className='diagram__html'>
                {this.renderContent(this.state.htmlText)}
              </div>
              <canvas className='diagram__text'>
              </canvas>
            </div>
            {this.addPageNumber()}
            {this.addGoToButton()}
            {this.addNextButton()}
      </div>
      </div>
    </div>;
  }
}
