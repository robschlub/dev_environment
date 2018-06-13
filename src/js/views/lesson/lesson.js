// // @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../../css/style.scss';
import Navbar from '../../../js/components/navbar';
import LessonComponent from '../../../js/components/lesson';
import Lesson from '../../../js/Lesson/Lesson';
import { LessonContent } from '../../../js/Lesson/LessonContent';

const renderLesson = (content: LessonContent) => {
  const lessonId:HTMLElement | null = document.getElementById('single-page-lesson');
  const lesson = new Lesson(content);

  if (lessonId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active='Single Page Lesson'/>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <LessonComponent lesson={lesson}/>
            </div>
          </div>
        </div>
      </div>,
      lessonId,
    );
  }
};

export default renderLesson;
