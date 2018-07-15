// // @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../../css/style.scss';
import Navbar from '../../../js/components/navbar';
import LessonComponent from '../../../js/components/lesson';
import Lesson from '../../../js/Lesson/Lesson';
import { LessonContent } from '../../../js/Lesson/LessonContent';
import NavbarSpacer from '../../components/navbarSpacer';
import Footer from '../../components/footer';

const renderLesson = (content: LessonContent) => {
  const lessonId: HTMLElement | null = document.getElementById('single-page-lesson');
  const lesson = new Lesson(content);

  if (lessonId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active='Single Page Lesson'/>
        <NavbarSpacer/>
        <div className="container-fluid">
          <div className="row">
            <div className="col lesson__padding_override">
              <LessonComponent lesson={lesson}/>
            </div>
          </div>
        </div>
        <Footer/>
      </div>,
      lessonId,
    );
  }
};

export default renderLesson;
