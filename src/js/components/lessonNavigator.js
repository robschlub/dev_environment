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

  constructor(props: Props) {
    super(props);
    this.lessonIndex = lessonIndex;
    const y = 120;
    let x = 50;
    const width = 200;
    const height = 40;
    const vSpace = 10;
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
        });
      } else {
        // eslint-disable-next-line no-param-reassign
        lesson.location = new Point(x, y);
      }
      x += width;
    });
    this.key = 0;
    this.selected = props.selected || '';
  }

  createLessonJsx(lesson: LessonDescription) {
    this.key += 1;
    let state = '';
    if (lesson.name === this.selected) {
      state = 'selected';
    }
    if (lesson.link === '') {
      state = 'disabled';
    }
    return <LessonTile
              id="e"
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
    return <div id="master_containter" className="naviagator__container">
      <div className="navigator__left_side" />
      <div className="navigator__right_side" />
      <div id="id_navigator__container" className="navigator__scroll_container">
        {this.lessons()}
      </div>
    </div>;
  }
}
