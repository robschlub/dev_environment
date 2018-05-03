// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../css/style.scss';
import '../../css/multipagelesson.scss';
import Navbar from './../components/navbar';
// import MultiPageLesson from '../components/multiPageLesson';
import LessonComponent from '../components/lesson';
import lesson from '../../Lessons/shapesAndCorners/shapesAndCorners';

const lessonMultiPage = (section: number) => {
  const lessonId:HTMLElement | null = document.getElementById('multi-page-lesson');

  if (lessonId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active='Multi Page Lesson'/>
        <LessonComponent type="multi" lesson={lesson} section={section}/>
      </div>,
      lessonId,
    );
  }
};

export default lessonMultiPage;
