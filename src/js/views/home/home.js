// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import './home.scss';
import Button from '../../components/button';
import Jumbotron from '../../jumbotron';
import Navbar from '../../components/navbar';

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
      <div className="naviagator__container">
        <div className="navigator__left_side">
        </div>
        <div className="navigator__right_side">
        </div>
        <div id="navigator__lesson_angle" className="navigator__lesson_position">
          <div className="navigator__lesson_containter navigator__lesson_shadow">
            <div className="navigator__lesson_title">
              Angles
            </div>
          </div>
        </div>
        <div id="navigator__lesson_circles" className="navigator__lesson_position">
          <div className="navigator__lesson_containter navigator__lesson_shadow">
            <div className="navigator__lesson_title">
              Circles
            </div>
          </div>
        </div>
        <div id="navigator__lesson_measuring" className="navigator__lesson_position">
          <div className="navigator__lesson_containter navigator__lesson_shadow">
            <div className="navigator__lesson_title">
              Measure
            </div>
          </div>
        </div>
        <div id="navigator__lesson_triangles" className="navigator__lesson_position">
          <div className="navigator__lesson_containter navigator__lesson_shadow">
            <div className="navigator__lesson_title">
              Triangles
            </div>
          </div>
        </div>
      </div>
      <div className="box effect2">
          <h3>Effect 2</h3>
        </div>
      </div>,
      id,
    );
  }
};

export default homePage;
