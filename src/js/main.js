// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../css/bootstrap.css';
import '../css/style2.css';
import '../css/style.css';
import '../css/style3.scss';


const myId:HTMLElement | null = document.getElementById('intro');

if (myId instanceof HTMLElement) {
  ReactDOM.render(
    <div className="container-fluid">
      <div className="row">
        <div className="col test">
          hello1
        </div>
        <div className="col-6">
          hello2</div>
        <div className="col">
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
    // </div>,
    myId,
  );
}
