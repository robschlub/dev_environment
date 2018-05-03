// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../../css/style.scss';
import Navbar from '../../components/navbar';
import LessonComponent from '../../components/lesson';
import lesson from '../../../Lessons/shapesAndCorners/shapesAndCorners';

const lessonSinglePage = () => {
  const lessonId:HTMLElement | null = document.getElementById('single-page-lesson');

  if (lessonId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active='Single Page Lesson'/>
        <LessonComponent type="single" lesson={lesson}/>
      </div>,
      lessonId,
    );
  }
};

export default lessonSinglePage;
