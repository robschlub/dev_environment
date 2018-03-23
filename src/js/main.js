// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../css/style2.css';
import '../css/style.css';
import '../css/style3.scss';
import Button from './button';

const myId:HTMLElement | null = document.getElementById('intro');

if (myId instanceof HTMLElement) {
  ReactDOM.render(
    <div className="jumbotron jumbotron-fluid text-xs-center"
    style={{
             backgroundImage: 'url(static/flower.jpg',
             backgroundSize: 'cover',
             backgroundPosition: 'top',
           }}>
      <div className="container">

        <h1>Helloooooo</h1>

        <Button text={'This is a button'}/>
        <Button text={'button 2'}/>
        <Button text={'b3'}/>

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
    </div>,
    myId,
  );
}
