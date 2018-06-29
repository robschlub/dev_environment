// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import './home.scss';
import Button from '../../components/button';
import Jumbotron from '../../jumbotron';
import Navbar from '../../components/navbar';
import LessonNavigator from '../../components/lessonNavigator';

const homePage = () => {
  const id:HTMLElement | null = document.getElementById('home');

  if (id instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active=''/>

        <Jumbotron className="jumbotron -fluid views-home"
                    containerFluid={false}
                    >
          <div className="col-6">
            <h1 className="display-4">I Get It!</h1>
            <p className="lead">The greatest thing ever.</p>
            <hr className="my-4" style={{ borderColor: 'lightGrey' }}/>
            <p>Everything is great.</p>
            <p className="lead">
              <Button label="Learn More" className="-primary -lg" href="#"/>
            </p>
          </div>
      </Jumbotron>
      <LessonNavigator/>
      {/*
      <div className="naviagator__container">
        <div className="navigator__left_side">
        </div>
        <div className="navigator__right_side">
        </div>
        <LessonTile id="id_test1" label='Angles' left='100px' top='100px' />
        <LessonTile id="id_test2" label='Circles' left='300px' top='100px' />
        <LessonTile id="id_test3" label='Measure' left='500px' top='70px' />
        <LessonTile id="id_test4" label='Triangles' left='500px' top='150px' />
        <LessonTile id="id_test4" label='Test1' left='700px' top='150px' />
        <LessonTile id="id_test4" label='Test2' left='900px' top='150px' />
      </div>
      */}
      </div>,
      id,
    );
  }
};

export default homePage;
