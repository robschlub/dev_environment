// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../css/style.scss';
import Button from './../components/button';
// import Jumbotron from './../jumbotron';
import Navbar from './../components/navbar';
import Content from './../components/content';
import Canvas from '../components/canvas';
import testgl from '../diagram/testwebgl';

const lessonPage = () => {
  const lessonId:HTMLElement | null = document.getElementById('lesson');

  if (lessonId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active='Lesson'/>
          <div className='main_page'>
            <div className='lesson_container'>
              <div className='lesson_title'>
                Shapes and Corners
              </div>
              <p className='lesson_text'>
                Many shapes have corners.
              </p>
              <p className='lesson_text'>
                The sharpness of the corner is a property that can describe a
                shape. This is a long sentence
              </p>
              <Canvas id="my_Canvas" didMountFn={testgl} />
              {/* 
              <div className='button_container'>
                <Button label="Prev" className="-primary -lesson" />
                <Button label="Go To" className="-primary -lesson" />
                <Button label="Next" className="-primary -lesson" />
              </div>
              */}
            </div>
          </div>
      </div>,
      lessonId,
    );
    //
    // console.log("Asdf");
    // testgl('my_Canvas');
  }
};

export default lessonPage;
