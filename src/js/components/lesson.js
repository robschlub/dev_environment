// @flow

import * as React from 'react';
import '../../css/style.scss';
import Lesson from '../Lesson/Lesson';
// import Canvas from './canvas';
import Button from './button';
// import LessonTile from './lessonTile';
import LessonNavigator from './lessonNavigator';
import LessonTile from './lessonTile';

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
  // setStateOnNextRefresh: boolean;
  componentUpdateCallback: ?() => void;
  centerLessonFlag: boolean;
  lessonNavigator: ?LessonNavigator;
  showNavigator: boolean;

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
    this.lesson.refresh = this.refreshText.bind(this);
    // this.lesson.refreshPageOnly = this.refreshPageOnly.bind(this);
    // this.lesson.blank = this.blank.bind(this);
    // this.setStateOnNextRefresh = false;
    this.componentUpdateCallback = null;
    this.centerLessonFlag = false;
    this.showNavigator = false;
  }

  componentDidUpdate() {
    // if (this.setStateOnNextRefresh) {
    //   this.lesson.setState();
    //   this.setStateOnNextRefresh = false;
    // }
    if (this.componentUpdateCallback) {
      const callback = this.componentUpdateCallback;
      this.componentUpdateCallback = null;
      callback();
    }
  }

  refreshText(htmlText: string, page: number, callback: ?() => void = null) {
    if (htmlText !== this.state.htmlText || page !== this.state.page) {
      this.componentUpdateCallback = callback;
      this.setState({ htmlText, page });
    } else if (callback) {
      callback();
    }

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

    window.addEventListener('resize', this.centerLesson.bind(this));
    window.addEventListener('orientationchange', this.orientationChange.bind(this));
    // const nav = document.getElementById('id_navigator__container');
    // if (nav) {
    //   nav.addEventListener('mouseover', this.expandLessonNavigator.bind(this));
    // }
    // const title = document.getElementById('id_navigator__scroll_container');
    // if (title) {
    //   // title.onclick = this.titleToNav.bind(this);
    //   title.addEventListener('mouseover', this.test.bind(this));
    //   console.log("asdf");
    //   // title.onclick = this.test()
    // }
    // const angle = document.getElementById('id_lesson__navigator_tile_circle');
    // if (angle) {
    //   angle.onclick = this.test.bind(this);
    // }
    // if (this.lessonNavigator) {
    //   this.lessonNavigator.showSelectedImediately();
    // }
    // const nav = document.getElementById('id_navigator__scroll_container');
    // if (nav) {
    //   nav.onclick = this.showHideNavigator.bind(this);
    // }

    // uncomment this if the lesson should be centered on going to it
    this.orientationChange();
    this.centerLessonFlag = !this.centerLessonFlag;
    this.centerLesson();
  }

  showHideNavigator() {
    if (this.showNavigator) {
      if (this.lessonNavigator) {
        this.lessonNavigator.selectTitle();
      }
      this.showNavigator = false;
    } else {
      if (this.lessonNavigator) {
        this.lessonNavigator.showNavigator();
      }
      this.showNavigator = true;
    }
  }

  test() {
    const { lessonNavigator } = this;
    if (lessonNavigator) {
      lessonNavigator.selectTitle();
      setTimeout(() => { lessonNavigator.showNavigator(); }, 2000);
      // this.lessonNavigator.zoomInSelected();
    }
    // console.log("1");
  }
  // eslint-disable-next-line class-methods-use-this
  titleScaleDown() {
    const title = document.getElementById('id_lesson__title_tile');
    if (title) {
      title.style.borderRadius = '13px';
      title.style.width = '180px';
      title.style.height = '40px';
      title.style.fontSize = '12px';
      title.style.left = 'calc(50% - 90px)';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  titleToNav() {
    this.titleScaleDown();
    setTimeout(this.expandLessonNavigator, 1000);
    const nav = document.getElementById('id_navigator__scroll_container');
    // const title_container = document.getElementById('id_lesson__title_container');
    // const title = document.getElementById('id_lesson__title_tile');
    if (this.lessonNavigator && nav) {
      const { x, y } = this.lessonNavigator.selectedLesson.location;
      nav.scrollTop = y;
      nav.scrollLeft = x - nav.clientWidth / 2 + 90;
      // title.style.height = '0';
      // title_container.style.height = '0';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  expandLessonNavigator() {
    const nav = document.getElementById('master_containter');
    const container =
      document.getElementById('id_lesson__title_navigator_container');
    if (nav && container) {
      nav.style.height = '30vh';
      container.style.height = '30vh';
    }
  }

  orientationChange() {
    const doc = document.documentElement;
    if (doc) {
      // if currently in portrait, then want to center.
      if (doc.clientHeight > doc.clientWidth) {
        this.centerLessonFlag = true;
      }
    }
  }

  centerLesson() {
    // console.log("Asdf1");
    if (this.centerLessonFlag) {
      const lesson = document.getElementById('lesson__container_name');
      if (lesson) {
        const y = this.centerLessonPosition(lesson);
        // setTimeout(function center() { window.scroll(0, a); }, 500);
        setTimeout(() => window.scroll(0, y), 500);
      }
    }
    this.centerLessonFlag = false;
  }

  // eslint-disable-next-line class-methods-use-this
  centerLessonPosition(element: HTMLElement) {
    const doc = document.documentElement;
    if (element != null && doc != null) {
      const r = element.getBoundingClientRect();
      const top = r.top + window.pageYOffset;
      const { height } = r;
      const windowHeight = doc.clientHeight;
      if (windowHeight >= height) {
        return top - (windowHeight - height) / 2;
      }
      return top;
    }
    return 0;
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.centerLesson.bind(this));
  }
  renderTitle(title: string) {
    this.key += 1;
    return <div className='lesson__title' key={this.key}>
        {title}
      </div>;
  }

  renderContent(content: string) {
    this.key += 1;
    return <div key={this.key} className='lesson__diagram_text'
      dangerouslySetInnerHTML={ {
        __html: content.slice(0, content.length - 1),
      } }
      />;
  }

  // eslint-disable-next-line class-methods-use-this
  addPrevButton() {
    return <Button label="" id="lesson__button-previous" className=" lesson__np_button lesson__button-prev-enabled"/>;
  }

  // eslint-disable-next-line class-methods-use-this
  addNextButton() {
    return <Button label="" id="lesson__button-next" className=" lesson__np_button lesson__button-next-enabled"/>;
  }

  addGoToButton() {
    return <div className="dropdown lesson__button-goto_container">
      <button className="btn btn-secondary dropdown-toggle lesson__button-goto" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {`${this.state.page + 1} / ${this.state.numPages}`}
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

  titleAsTile() {
    return <div id="id_lesson__title_tile" className="lesson__title_tile">
      <img src={'/static/'} className="navigator__lesson_tile_image" />
      <div className="lesson__title_tile_containter lesson__title_tile_shadow">
        <div className="lesson__title_tile_title">
          {this.lesson.content.title}
        </div>
      </div>
    </div>;
  }
  render() {
    return <div>
      <div className='lesson__title'>
      <LessonTile id={'id_lesson__title_container'} link={this.lesson.content.iconLink} key='1' label={this.lesson.content.title} state={'selected'}/>
      </div>
      <div className="lesson__widescreen_backdrop">
        <div id="lesson__container_name" className="lesson__container">
              {this.addPrevButton()}
              <div id={this.lesson.content.diagramHtmlId} className="diagram__container lesson__diagram">
                <canvas className='diagram__text'>
                </canvas>
                <canvas className='diagram__gl'>
                </canvas>
                
                <div id="dd" className='diagram__html'>
                  {this.renderContent(this.state.htmlText)}
                </div>
              </div>
              {this.addGoToButton()}
              {this.addNextButton()}
        </div>
      </div>
      <div className='lesson__white_spacer'/>
      <LessonNavigator
          selected={this.lesson.content.title}
          ref={(lessonNavigator) => { this.lessonNavigator = lessonNavigator; }}
        />
      <div className='lesson__white_spacer'/>
    </div>;
  }
}
