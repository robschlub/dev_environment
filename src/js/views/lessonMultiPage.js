// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../css/style.scss';
import Navbar from './../components/navbar';
import SinglePageLesson from '../components/singlePageLesson';
import lesson from '../../Lessons/shapesAndCorners/shapesAndCorners';

const lessonSinglePage = () => {
  const lessonId:HTMLElement | null = document.getElementById('multi-page-lesson');

  if (lessonId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active='Multi Page Lesson'/>
        <SinglePageLesson lesson={lesson}/>
      </div>,
      lessonId,
    );
  }
};

export default lessonSinglePage;
