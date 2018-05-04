// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../../css/style.scss';
import Navbar from '../../components/navbar';
import LessonComponent from '../../components/lesson';
import content from '../../../Lessons/shapesAndCorners/shapesAndCorners';
import Lesson from '../../Lesson/Lesson';

const lessonSinglePage = () => {
  const lessonId:HTMLElement | null = document.getElementById('single-page-lesson');
  const lesson = new Lesson(content, 'singlePage');

  if (lessonId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <div className="container">
          <div className="row align-items-center">
            <Navbar active='Single Page Lesson'/>
          </div>
          <div className="row">
            <LessonComponent type="singlePage" lesson={lesson}/>
          </div>
        </div>
      </div>,
      lessonId,
    );
  }
};

export default lessonSinglePage;
