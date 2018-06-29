// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import './home.scss';
// import Button from '../../components/button';
// import Jumbotron from '../../jumbotron';
import HomeBanner from './banner';
import Navbar from '../../components/navbar';
import LessonNavigator from '../../components/lessonNavigator';

const homePage = () => {
  const id:HTMLElement | null = document.getElementById('home');

  if (id instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active=''/>
        <div className="navbar__spacer"/>
        <HomeBanner/>
        <LessonNavigator/>
      </div>,
      id,
    );
  }
};

export default homePage;
