// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../css/style2.css';
import '../css/style.css';
import '../css/style3.scss';
import Button from './button';
import Jumbotron from './jumbotron';

const myId:HTMLElement | null = document.getElementById('intro');

if (myId instanceof HTMLElement) {
  ReactDOM.render(
    <div>
      <Jumbotron className="jumbotron -fluid splash"
                  containerFluid={false}
                  >
        <div className="col-6">
          <h1 className="display-4">Hello, world!</h1>
          <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
          <hr className="my-4"/>
          <p>It uses utility classes for typography and spacing to space
             content out within the larger container.
          </p>
          <p className="lead">
            <Button label="Learn More" className="-primary -lg" href="#"/>
          </p>
        </div>
    </Jumbotron>
    <Jumbotron className="jumbotron -fluid text-center"
                style={{
                  backgroundImage: 'url(static/flower.jpg',
                  backgroundSize: 'cover',
                  backgroundPosition: 'bottom',
                }}
                containerFluid={false}
                >


        <h1>This is a title</h1>
        <p>With a subtitle</p>

        <Button type='button' label='Go' className="-primary"/>
        <Button type='button' label='Stop' className="-primary -danger"/>
        <Button label='Big button' className="-outline-primary -danger -block"/>
        <Button label={'b3'}/>

        <div className="row">
          <div className="col test">
            hello1
          </div>
          <div className="col-6">
            hello2</div>
          <div className="col redbox">
            hello3
          </div>
        </div>
        <div className="row">
          <div className="btn btn-primary">
            <p>Hello world, from react using css!</p>
          </div>
        </div>
        <div className="row">
          <div className="btn btn-primary redbox">
            <p>Test</p>
          </div>
        </div>

    </Jumbotron>
    </div>,
    myId,
  );
}
