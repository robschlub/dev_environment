// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../css/style2.css';
import '../css/style.css';
import '../css/style3.scss';


const myId:HTMLElement | null = document.getElementById('intro');

if (myId instanceof HTMLElement) {
  ReactDOM.render(
    <div className="test"><h1>Hello world, from react using css!</h1></div>,
    myId,
  );
}
