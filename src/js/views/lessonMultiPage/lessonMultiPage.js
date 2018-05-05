// @flow

import React from 'react';
import ReactDOM from 'react-dom';

// Styles
// import '../../../css/style.scss';
import './lessonMultiPage.scss';

// Components
import Navbar from '../../components/navbar';
import LessonComponent from '../../components/lesson';
import content from '../../../Lessons/shapesAndCorners/shapesAndCorners';
import Lesson from '../../Lesson/Lesson';


const lessonMultiPage = (section: number) => {
  const lessonId:HTMLElement | null = document.getElementById('multi-page-lesson');

  const lesson = new Lesson(content, 'multiPage');

  if (lessonId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active='Multi Page Lesson'/>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <LessonComponent type="multiPage" lesson={lesson} section={section}/>
            </div>
          </div>
        </div>
      </div>,
      lessonId,
    );
  }
};

export default lessonMultiPage;
