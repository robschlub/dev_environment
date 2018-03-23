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
    <Jumbotron className="jumbotron jumbotron-fluid text-xs-center"
    style={{
             backgroundImage: 'url(static/flower.jpg',
             backgroundSize: 'cover',
             backgroundPosition: 'bottom',
           }}>
      <div className="container">

        <h1>Helloooooo</h1>

        <Button label='This is a normal button' className="-secondary"/>
        <Button label='Big button' className="-primary -lg -block"/>
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
      </div>,
    </Jumbotron>,
    myId,
  );
}
