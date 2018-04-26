// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../css/style.scss';
// import Button from './../components/button';
// import Jumbotron from './../jumbotron';
import Navbar from './../components/navbar';
// import Content from './../components/content';
import LessonPage from '../components/lessonPage';
// import testgl from '../diagram/testwebgl';
// import { shapesDiagram } from '../Lesson/shapesDiagram';

const lessonPage = () => {
  const lessonId:HTMLElement | null = document.getElementById('lesson');

  if (lessonId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active='Lesson'/>
        <LessonPage />
      </div>,
      lessonId,
    );
    //
    // console.log("Asdf");
    // testgl('my_Canvas');
  }
};

export default lessonPage;
