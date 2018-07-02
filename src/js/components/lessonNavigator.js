// @flow

import * as React from 'react';
import '../../css/style.scss';
import LessonTile from './lessonTile';
import { lessonIndex, LessonDescription } from '../../Lessons/lessonIndex';
import { Point } from '../diagram/tools/g2';

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

  constructor(props: Props) {
    super(props);
    this.lessonIndex = lessonIndex;
    let viewPortWidth = 0;
    const doc = document.documentElement;
    if (doc) {
      viewPortWidth = doc.clientWidth;
    }
    const y = 200;
    const width = 200;
    const height = 40;
    const vSpace = 10;
    let x = viewPortWidth / 2 - 180 / 2;
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
    this.key = 0;
    this.selected = props.selected || '';
  }

  showNavigator() {
    console.log("got here");
    this.showAllTiles();
    this.zoomOutSelected();
    const nav2 = document.getElementById('id_navigator__container');
    // console.log()
    if (nav2) {
      nav2.style.height = '500px';
    }
  }
  selectTitle() {
    this.hideAllTilesButSelected();
    this.zoomInSelected();
    // const nav1 = document.getElementById('id_lesson__title_navigator_container');
    // if (nav1) {
    //   nav1.style.height = '90px';
    // }
    const nav2 = document.getElementById('id_navigator__container');
    if (nav2) {
      nav2.style.height = '90px';
    }
    // const nav = document.getElementById('id_navigator__scroll_container');
    // if (nav) {
    //   const { x, y } = this.selectedLesson.location;
    //   nav.scrollTop = y - 17;
    //   nav.scrollLeft = x - nav.clientWidth / 2 + 125;
    // }
  }

  hideAllTilesButSelected() {
    this.lessonArray.forEach((lesson) => {
      const elem = document.getElementById(lesson.id);
      if (elem && lesson.id !== this.selectedLesson.id) {
        elem.style.opacity = '0';
      }
    });
    const nav = document.getElementById('id_navigator__scroll_container');
    if (nav) {
      nav.style.overflow = 'hidden';
    }
  }

  zoomOutSelected() {
    const tile = document.getElementById(this.selectedLesson.id);
    if (tile) {
      const { x, y } = this.selectedLesson.location;
      tile.style.borderRadius = '13px';
      tile.style.width = '180px';
      tile.style.height = '40px';
      tile.style.fontSize = '12px';
      tile.style.top = '12px';
      tile.style.left = `${x}px`;
      tile.style.top = `${y}px`;
    }
  }

  zoomInSelected() {
    const tile = document.getElementById(this.selectedLesson.id);
    if (tile) {
      tile.style.borderRadius = '18px';
      tile.style.width = '250px';
      tile.style.height = '56px';
      tile.style.fontSize = '18px';
      tile.style.top = '17px';
      tile.style.left = 'calc(50% - 125px)';
      // tile.style.left = 'calc(50% - 125px)';
    }
  }

  showAllTiles() {
    this.lessonArray.forEach((lesson) => {
      const elem = document.getElementById(lesson.id);
      if (elem && lesson.id !== this.selectedLesson.id) {
        elem.style.opacity = '1';
      }
    });
  }

  createLessonJsx(lesson: LessonDescription) {
    this.key += 1;
    let state = '';
    if (lesson.name === this.selected) {
      state = 'selected';
      this.selectedLesson = lesson;
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
              left={`${lesson.location.x}px`}
              top={`${lesson.location.y}px`}
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
    return <div id="id_navigator__container" className="naviagator__container">
      <div className="navigator__left_side" />
      <div className="navigator__right_side" />
      <div id="id_navigator__scroll_container" className="navigator__scroll_container">
        {this.lessons()}
      </div>
    </div>;
  }
}
