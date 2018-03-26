// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../css/style2.css';
import '../../css/style.css';
import '../../css/style3.scss';
import Button from './../button';
import Jumbotron from './../jumbotron';
import Navbar from './../navbar';

const aboutPage = () => {
  const aboutId:HTMLElement | null = document.getElementById('about');

  if (aboutId instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar>
        </Navbar>

        <Jumbotron className="jumbotron -fluid splash"
                    containerFluid={false}
                    >
          <div className="col-6">
            <h1 className="display-4">About It Get I</h1>
            <p className="lead">This is so you can understand.</p>
            <hr className="my-4" style={{ borderColor: 'lightGrey' }}/>
            <p>Everything is from the ground up.
            </p>
            <p className="lead">
              <Button label="Learn More" className="-primary -lg" href="#"/>
            </p>
          </div>
      </Jumbotron>
      </div>,
      aboutId,
    );
  }
};

export default aboutPage;
