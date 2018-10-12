// @flow

import * as React from 'react';
import '../../css/style.scss';
import LessonTile from './lessonTile';
import LessonDescription from '../../Lessons/lessonDescription';
import makeLessonTree from '../../Lessons/lessonTree';
import {
  Point, Rect,
} from '../diagram/tools/g2';
import { getDefinedCSSVariables } from '../tools/getCssVariables';

type Props = {
  topic: string;
  selected?: ?string;
};

export default class LessonNavigator extends React.Component
                                    <Props> {
  selected: string;
  lessonIndex: Array<Array<LessonDescription>>;
  lessonTrees: Object;
  key: number;
  selectedLesson: LessonDescription;
  lessonArray: Array<LessonDescription>;
  asTitle: boolean
  lessonTilesBounds: Rect;
  tileWidth: number;
  tileHeight: number;
  tileVSpace: number;
  tileHSpace: number;
  topic: string;

  constructor(props: Props) {
    super(props);
    this.lessonTrees = makeLessonTree();
    this.lessonIndex = this.lessonTrees[props.topic];
    this.getVariables();
    this.layoutLessonTiles();
    this.key = 0;
    this.selected = props.selected || '';
    this.asTitle = false;
    if (this.selected !== '') {
      this.asTitle = true;
    }
    this.topic = props.topic;
  }

  getVariables() {
    const { body } = document;
    if (body) {
      const vars: Object = getDefinedCSSVariables(
        body,
        [
          '--navigator__tile_width',
          '--navigator__tile_height',
          '--navigator__tile_vSpace',
          '--navigator__tile_hSpace',
        ],
        '--navigator__',
      );
      this.tileWidth = vars.tileWidth;
      this.tileHeight = vars.tileHeight;
      this.tileVSpace = vars.tileVSpace;
      this.tileHSpace = vars.tileHSpace;
    }
  }

  layoutLessonTiles() {
    this.lessonArray = [];
    // const y = this.tileHeight * 2 + vSpace * 2;
    const width = this.tileWidth;
    const height = this.tileHeight;
    const vSpace = this.tileVSpace;
    const hSpace = this.tileHSpace;
    let x = hSpace;
    this.lessonArray = [];
    let maxParallel = 1;
    this.lessonIndex.forEach((lesson) => {
      if (Array.isArray(lesson)) {
        if (lesson.length > maxParallel) {
          maxParallel = lesson.length;
        }
      }
    });
    const yMiddle = (maxParallel * this.tileHeight
                    + (maxParallel - 1) * vSpace
                    + vSpace * 2) / 2;

    this.lessonIndex.forEach((lesson) => {
      if (Array.isArray(lesson)) {
        const len = lesson.length;
        const totalHeight = len * height + (len - 1) * vSpace;
        let yStart = yMiddle - totalHeight / 2 + height / 2;
        if (yStart < yMiddle - 2 * height - 2 * vSpace) {
          yStart = yMiddle - 2 * height - 2 * vSpace;
        }
        lesson.forEach((parallelLesson, index) => {
          const yLocation = yStart + index * (height + vSpace);
          // eslint-disable-next-line no-param-reassign
          parallelLesson.location = new Point(x, yLocation - this.tileHeight / 2);
          this.lessonArray.push(parallelLesson);
        });
      } else {
        // eslint-disable-next-line no-param-reassign
        lesson.location = new Point(x, yMiddle - this.tileHeight / 2);
        this.lessonArray.push(lesson);
      }
      x += width + hSpace;
    });

    this.getLessonTilesBounds();
  }

  // showNavigator() {
  //   // console.log("showing")
  //   this.enableTransitions();
  //   this.showAllTiles();
  //   this.zoomOutSelected();
  //   const nav2 = document.getElementById('id_navigator__container');

  //   if (nav2) {
  //     nav2.style.height = '60vh';
  //   }
  //   const nav = document.getElementById('id_navigator__scroll_container');
  //   if (nav) {
  //     nav.style.overflow = 'scroll';
  //   }
  // }

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

  // disableTransitions() {
  //   this.enableTransition('id_lesson__title_navigator_container', false);
  //   this.enableTransition('id_navigator__container', false);
  //   this.enableTransition('id_navigator__scroll_container', false);
  //   // this.enableTransition('navigator__lesson_tile', false);
  // }

  // enableTransitions() {
  //   // this.enableTransition('id_lesson__title_navigator_container', true);
  //   this.enableTransition('id_navigator__container', true);
  //   // this.enableTransition('id_navigator__scroll_container', true);
  //   // this.enableTransition('navigator__lesson_tile', true);
  // }

  // selectTitle() {
  //   this.hideAllTilesButSelected();
  //   this.zoomInSelected();

  //   const nav2 = document.getElementById('id_navigator__container');
  //   if (nav2) {
  //     nav2.style.height = '90px';
  //   }
  // }

  // showSelectedImediately() {
  //   this.disableTransitions();
  //   // this.hideAllTilesButSelected();
  //   this.selectTitle();
  //   // this.enableTransitions();
  //   // setTimeout(this.enableTransitions.bind(this), 100);
  // }

  // hideAllTilesButSelected() {
  //   this.lessonArray.forEach((lesson) => {
  //     const elem = document.getElementById(lesson.id);
  //     if (elem) {
  //       if (lesson.id !== this.selectedLesson.id) {
  //         elem.style.opacity = '0';
  //       }
  //       elem.style.pointerEvents = 'none';
  //     }
  //   });
  //   const nav = document.getElementById('id_navigator__scroll_container');
  //   if (nav) {
  //     nav.style.overflow = 'hidden';
  //   }
  // }

  // zoomOutSelected() {
  //   const nav = document.getElementById('id_navigator__scroll_container');
  //   if (nav) {
  //     const { x, y } = this.selectedLesson.location;
  //     // nav.style.transform = 'scale(1, 1)';
  //     nav.scrollLeft = x - nav.clientWidth / 2 + 1.39 * this.tileWidth / 2;
  //     nav.scrollTop = y - nav.clientHeight / 2 + 1.39 * this.tileHeight / 2.7;
  //   }
  // }

  // zoomInSelected() {
  //   const nav = document.getElementById('id_navigator__scroll_container');
  //   const lessonsContainer =
  //     document.getElementById('id_navigator__lessons_positions_container');

  //   if (nav && lessonsContainer) {
  //     const { x, y } = this.selectedLesson.location;
  //     nav.scrollLeft = x - nav.clientWidth / 2 + 1 * this.tileWidth / 2
  //                      + parseInt(lessonsContainer.style.left, 10);
  //     nav.scrollTop = y + parseInt(lessonsContainer.style.top, 10);
  //   }
  // }

  // showAllTiles() {
  //   this.lessonArray.forEach((lesson) => {
  //     const elem = document.getElementById(lesson.id);
  //     if (elem && lesson.id !== this.selectedLesson.id) {
  //       elem.style.opacity = '1';
  //       elem.style.pointerEvents = 'auto';
  //     }
  //   });
  // }

  createLessonJsx(lesson: LessonDescription) {
    this.key += 1;
    let state = '';
    const { x, y } = lesson.location;
    if (lesson.name === this.selected) {
      state = 'selected';
      this.selectedLesson = lesson;
    }
    if (lesson.enabled === false) {
      state = 'disabled';
    }
    return <LessonTile
              id={lesson.id}
              link={`${lesson.link}/1`}
              imgLink={lesson.imgLink}
              key={this.key}
              label={lesson.name}
              state={state}
              left={`${x}px`}
              top={`${y}px`}
              title={false}
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
    this.centerLessons();
    // window.addEventListener('resize', this.centerLessons.bind(this));
    this.scrollToSelected();
  }

  scrollToSelected() {
    const navScroll = document
      .getElementById(`id_navigator__scroll_container_${this.topic}`);
    if (navScroll) {
      if (this.selected !== '') {
        navScroll.scrollLeft = this.selectedLesson.location.x + 200
                               - navScroll.clientWidth / 2 + this.tileWidth / 2;
        navScroll.scrollTop = this.selectedLesson.location.y + 100
                               - navScroll.clientHeight / 2 + this.tileHeight / 2;
      } else {
        navScroll.scrollLeft = this.lessonArray[0].location.x + 200
                               - navScroll.clientWidth / 2 + this.tileWidth / 2;
        navScroll.scrollTop = this.lessonArray[0].location.y + 100
                               - navScroll.clientHeight / 2 + this.tileHeight / 2;
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  centerLessons() {
    const navigatorContainer = document
      .getElementById(`id_navigator__container_${this.topic}`);
    const lessonsContainer =
      document.getElementById(`id_navigator__lessons_positions_container_${this.topic}`);
    if (lessonsContainer != null && navigatorContainer != null) {
      const navRect = navigatorContainer.getBoundingClientRect();
      const navHeight = navRect.height;
      // const xMargin = navRect.width / 2 - this.tileWidth / 2;
      const xMargin = Math.min(this.tileWidth, navRect.width / 2 - this.tileWidth / 2);
      lessonsContainer.style.left = `${xMargin}px`;
      lessonsContainer.style.top = `${(navHeight - this.lessonTilesBounds.height) / 2}px`;
      lessonsContainer.style.width = `${this.lessonTilesBounds.width + xMargin}px`;
      lessonsContainer.style.height = `${this.lessonTilesBounds.height}px`;
    }
  }

  getLessonTilesBounds() {
    let xMax = 0;
    let yMax = 0;
    let yMin = 0;
    let xMin = 0;
    let firstElement = true;
    this.lessonArray.forEach((lesson) => {
      if (firstElement) {
        xMin = lesson.location.x;
        xMax = lesson.location.x + this.tileWidth;
        yMin = lesson.location.y;
        yMax = lesson.location.y + this.tileHeight;
        firstElement = false;
      } else {
        if (lesson.location.x + this.tileWidth > xMax) {
          xMax = lesson.location.x + this.tileWidth;
        }
        if (lesson.location.y + this.tileHeight > yMax) {
          yMax = lesson.location.y + this.tileHeight;
        }
        if (lesson.location.y < yMin) {
          yMin = lesson.location.y;
        }
      }
    });
    yMin -= this.tileVSpace;
    yMax += this.tileVSpace;
    xMin -= this.tileHSpace;
    xMax += this.tileHSpace;
    this.lessonTilesBounds = new Rect(xMin, yMin, xMax - xMin, yMax - yMin);
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    const classStr = 'naviagator__container navigator__container_with_shadow';
    return <div>
      <div className='navigator__topic_title'>{this.topic.replace(/_/, ' ')}</div>
      <div id={`id_navigator__container_${this.topic}`} className={classStr}>
        <div className="navigator__left_side" />
        <div className="navigator__right_side" />
        <div id={`id_navigator__scroll_container_${this.topic}`} className="navigator__scroll_container">
          <div id={`id_navigator__lessons_positions_container_${this.topic}`} className="navigator__lessons_positions_container">
              {this.lessons()}
          </div>
        </div>
      </div>
    </div>;
  }
}
