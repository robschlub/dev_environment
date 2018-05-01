// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../css/style.scss';
import Navbar from './../components/navbar';
import LessonPage from '../components/lessonPage';
import lesson from '../../Lessons/shapesAndCorners/shapesAndCorners';

const lessonPage = () => {
  const lessonId:HTMLElement | null = document.getElementById('lesson');

  if (lessonId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active='Lesson'/>
        <LessonPage lesson={lesson}/>
      </div>,
      lessonId,
    );
  }
};

export default lessonPage;
