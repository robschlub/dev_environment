// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../css/style.scss';
import Navbar from './../components/navbar';
import LessonPage from '../components/lessonPage';
import page from '../Lesson/content';

const lessonPage = () => {
  const lessonId:HTMLElement | null = document.getElementById('lesson');

  if (lessonId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active='Lesson'/>
        <LessonPage page={page}/>
      </div>,
      lessonId,
    );
  }
};

export default lessonPage;
