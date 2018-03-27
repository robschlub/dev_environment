// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../css/style.scss';
import Button from './../components/button';
import Jumbotron from './../jumbotron';
import Navbar from './../components/navbar';

const homePage = () => {
  const id:HTMLElement | null = document.getElementById('home');

  if (id instanceof HTMLElement) {
    ReactDOM.render(
      <div>
        <Navbar active=''/>

        <Jumbotron className="jumbotron -fluid home"
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
      </div>,
      id,
    );
  }
};

export default homePage;
