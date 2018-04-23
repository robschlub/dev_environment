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
        <Content />
        <div className='container main_page'>
          <div className='row'>
            <Button label="Prev" className="-primary -lesson" />
            <Button label="Go To" className="-primary -lesson" />
            <Button label="Next" className="-primary -lesson" />
          </div>
          <div className = 'row'>
            <div className='container'>
              <div className='row'>
                <div className='col-2'></div>
                <Canvas id="my_Canvas" didMountFn={testgl} className="lesson-canvas"/>
                <div className='col-2'></div>
                <Canvas id="my_Canvas1" didMountFn={testgl}/>
              </div>
            </div>
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
