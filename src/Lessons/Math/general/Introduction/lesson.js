// // @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../../../css/style.scss';
import Navbar from '../../../../js/components/navbar';
import LessonComponent from '../../../../js/components/lesson';
import Content from './circlesAndAngles';
import Lesson from '../../../../js/Lesson/Lesson';
import './style.scss';

const lessonSinglePage = () => {
  const lessonId:HTMLElement | null = document.getElementById('single-page-lesson');
  const lesson = new Lesson(new Content('shapes'));

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

lessonSinglePage();
