// @flow

import * as React from 'react';
import '../../css/style.scss';
import LessonTile from './lessonTile';
import { lessonIndex, LessonDescription } from '../../Lessons/lessonIndex';
import { Point, Rect } from '../diagram/tools/g2';

type Props = {
  selected?: ?string;
};

export default class LessonNavigator extends React.Component
                                    <Props> {
  selected: string;
  lessonIndex: Array<Array<LessonDescription> | LessonDescription>;
  key: number;
  selectedLesson: LessonDescription;
  lessonArray: Array<LessonDescription>;
  asTitle: boolean
  lessonTilesBounds: Rect;

  constructor(props: Props) {
    super(props);
    this.lessonIndex = lessonIndex;
    this.layoutLessonTiles();
    this.getLessonTilesBounds();
    // let viewPortWidth = 0;
    // const doc = document.documentElement;
    // if (doc) {
    //   viewPortWidth = doc.clientWidth;
    // }
    // const y = 200;
    // const width = 200;
    // const height = 40;
    // const vSpace = 10;
    // let x = viewPortWidth / 2 - 180 / 2;
    // this.lessonArray = [];
    // this.lessonIndex.forEach((lesson) => {
    //   if (Array.isArray(lesson)) {
    //     const len = lesson.length;
    //     const totalHeight = len * height + (len - 1) * vSpace;
    //     let yStart = y - totalHeight / 2 + height / 2;
    //     if (yStart < y - 2 * height - 2 * vSpace) {
    //       yStart = y - 2 * height - 2 * vSpace;
    //     }
    //     lesson.forEach((parallelLesson, index) => {
    //       const yLocation = yStart + index * (height + vSpace);
    //       // eslint-disable-next-line no-param-reassign
    //       parallelLesson.location = new Point(x, yLocation);
    //       this.lessonArray.push(parallelLesson);
    //     });
    //   } else {
    //     // eslint-disable-next-line no-param-reassign
    //     lesson.location = new Point(x, y);
    //     this.lessonArray.push(lesson);
    //   }
    //   x += width;
    // });
    this.key = 0;
    this.selected = props.selected || '';
    this.asTitle = false;
    if (this.selected !== '') {
      this.asTitle = true;
    }
  }

  layoutLessonTiles() {
    this.lessonArray = [];
    const y = 100;
    const width = 200;
    const height = 40;
    const vSpace = 10;
    let x = 0;
    this.lessonArray = [];
    this.lessonIndex.forEach((lesson) => {
      if (Array.isArray(lesson)) {
        const len = lesson.length;
        const totalHeight = len * height + (len - 1) * vSpace;
        let yStart = y - totalHeight / 2 + height / 2;
        if (yStart < y - 2 * height - 2 * vSpace) {
          yStart = y - 2 * height - 2 * vSpace;
        }
        lesson.forEach((parallelLesson, index) => {
          const yLocation = yStart + index * (height + vSpace);
          // eslint-disable-next-line no-param-reassign
          parallelLesson.location = new Point(x, yLocation);
          this.lessonArray.push(parallelLesson);
        });
      } else {
        // eslint-disable-next-line no-param-reassign
        lesson.location = new Point(x, y);
        this.lessonArray.push(lesson);
      }
      x += width;
    });
  }
  componentDidUpdate() {
    if (this.asTitle) {
      this.hideAllTilesButSelected();
    }
  }
  showNavigator() {
    this.enableTransitions();
    this.showAllTiles();
    this.zoomOutSelected();
    const nav2 = document.getElementById('id_navigator__container');

    if (nav2) {
      nav2.style.height = '60vh';
    }
    const nav = document.getElementById('id_navigator__scroll_container');
    if (nav) {
      nav.style.overflow = 'scroll';
    }
  }
  // eslint-disable-next-line class-methods-use-this
  enableTransition(id: string, enable: boolean = false) {
    const element = document.getElementById(id);
    if (element) {
      if (enable) {
        element.style.transition = 'all 1.0s ease';
      } else {
        element.style.transition = 'none';
      }
    }
  }

  disableTransitions() {
    this.enableTransition('id_lesson__title_navigator_container', false);
    this.enableTransition('id_navigator__container', false);
    this.enableTransition('id_navigator__scroll_container', false);
    // this.enableTransition('navigator__lesson_tile', false);
  }

  enableTransitions() {
    // this.enableTransition('id_lesson__title_navigator_container', true);
    this.enableTransition('id_navigator__container', true);
    // this.enableTransition('id_navigator__scroll_container', true);
    // this.enableTransition('navigator__lesson_tile', true);
  }

  selectTitle() {
    this.hideAllTilesButSelected();
    this.zoomInSelected();

    const nav2 = document.getElementById('id_navigator__container');
    if (nav2) {
      nav2.style.height = '90px';
    }
  }

  showSelectedImediately() {

    this.disableTransitions();
    // this.hideAllTilesButSelected();
    this.selectTitle();
    // this.enableTransitions();
    // setTimeout(this.enableTransitions.bind(this), 100);
  }

  hideAllTilesButSelected() {
    this.lessonArray.forEach((lesson) => {
      const elem = document.getElementById(lesson.id);
      if (elem) {
        if (lesson.id !== this.selectedLesson.id) {
          elem.style.opacity = '0';
        }
        elem.style.pointerEvents = 'none';
      }
    });
    const nav = document.getElementById('id_navigator__scroll_container');
    if (nav) {
      nav.style.overflow = 'hidden';
    }
  }

  zoomOutSelected() {
    const nav = document.getElementById('id_navigator__scroll_container');
    if (nav) {
      const { x, y } = this.selectedLesson.location;
      // nav.style.transform = 'scale(1, 1)';
      nav.scrollLeft = x - nav.clientWidth / 2 + 1.39 * 180 / 2;
      nav.scrollTop = y - nav.clientHeight / 2 + 1.39 * 40 / 2.7;
    }
  }

  zoomInSelected() {
    const nav = document.getElementById('id_navigator__scroll_container');
    if (nav) {
      const { x, y } = this.selectedLesson.location;
      nav.scrollLeft = x - nav.clientWidth / 2 + 1.39 * 180 / 2;
      nav.scrollTop = y - 90 / 2 + 1.39 * 40 / 2.7;
    }
  }

  showAllTiles() {
    this.lessonArray.forEach((lesson) => {
      const elem = document.getElementById(lesson.id);
      if (elem && lesson.id !== this.selectedLesson.id) {
        elem.style.opacity = '1';
        elem.style.pointerEvents = 'auto';
      }
    });
  }

  createLessonJsx(lesson: LessonDescription) {
    this.key += 1;
    let state = '';
    const { x, y } = lesson.location;
    if (lesson.name === this.selected) {
      state = 'selected';
      this.selectedLesson = lesson;
      // const nav = document.getElementById('id_navigator__scroll_container');
      // if (nav) {
      //   x = `${nav.scrollLeft + nav.clientWidth / 2 - 125}px`;
      //   y = `${nav.scrollTop + 90 / 2 - 28}px`;
      // }
    }
    if (lesson.link === '') {
      state = 'disabled';
    }
    return <LessonTile
              id={lesson.id}
              link={lesson.link}
              key={this.key}
              label={lesson.name}
              state={state}
              left={`${x}px`}
              top={`${y}px`}
            />;
  }

  lessons() {
    const lessons = [];
    this.lessonIndex.forEach((lesson) => {
      if (Array.isArray(lesson)) {
        lesson.forEach((parallelLesson) => {
          lessons.push(this.createLessonJsx(parallelLesson));
        });
      } else {
        lessons.push(this.createLessonJsx(lesson));
      }
    });
    return lessons;
  }

  componentDidMount() {
    console.log("asdf")
    this.centerLessons();
  }

  // eslint-disable-next-line class-methods-use-this
  centerLessons() {
    const nav =
      document.getElementById('id_lesson__title_navigator_container');
    const lessonsContainer =
      document.getElementById('id_navigator__lessons_positions_container');
    if (nav && lessonsContainer) {
      const xMargin = nav.clientWidth / 2 - 180 / 2;
      const yMargin = window.innerHeight * 0.6 / 2;
      lessonsContainer.style.left = `${xMargin}px`;
      lessonsContainer.style.top = `${yMargin - 40 / 2}px`;
      lessonsContainer.style.width = `${this.lessonTilesBounds.width + xMargin}px`;
      lessonsContainer.style.height = `${this.lessonTilesBounds.height + yMargin + 40 / 2}px`;
      // console.log(yMargin, lessonsContainer.style.height, this.lessonTilesBounds);
    }
  }

  getLessonTilesBounds() {
    // const elem =
    //   document.getElementById('id_navigator__lessons_positions_container');
    // if (elem) {
    let xMax = 0;
    let yMax = 0;
    let yMin = 0;
    let firstElement = true;
    this.lessonArray.forEach((lesson) => {
      if (firstElement) {
        xMax = lesson.location.x + 180;
        yMin = lesson.location.y;
        yMax = lesson.location.y + 40;
        firstElement = false;
      } else {
        if (lesson.location.x + 180 > xMax) {
          xMax = lesson.location.x + 180;
        }
        if (lesson.location.y + 40 > yMax) {
          yMax = lesson.location.y + 40;
        }
        if (lesson.location.y + 40 < yMin) {
          yMin = lesson.location.y + 40;
        }
      }
    });
    this.lessonTilesBounds = new Rect(0, yMin, xMax, yMax - yMin);
    // } else {
    //   this.lessonTilesBounds = new Rect(0, 0, 1, 1);
    // }
  }
  // componentDidMount() {
  //   const navigator = document.getElementById('id_navigator__container');

  //   if (navigator) {
  //   //   navigator.scrollLeft = 100;
  //   //   navigator.addEventListener('mousedown', this.mdh.bind(this), false);
  //   //   navigator.addEventListener('mousemove', this.mdh.bind(this), false);
  //     // navigator.scrollWidth = 1500;
  //   }
  //   // const navigator1 = document.getElementById('master_containter');
  //   // if (navigator1) {
  //   //   navigator1.addEventListener('mousedown', this.mdh.bind(this), false);
  //   //   navigator1.addEventListener('mousemove', this.mdh.bind(this), false);
  //   // }
  // }

  // eslint-disable-next-line class-methods-use-this
  render() {
    let classStr = 'naviagator__container';
    if (this.asTitle) {
      classStr = `${classStr} navigator__container_as_title`;
    }
    return <div id="id_navigator__container" className={classStr}>
      <div className="navigator__left_side" />
      <div className="navigator__right_side" />
      <div id="id_navigator__scroll_container" className="navigator__scroll_container">
        <div id='id_navigator__lessons_positions_container'>
            {this.lessons()}
        </div>
      </div>
    </div>;
  }
}
