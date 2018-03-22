// @flow


import React from 'react';
import ReactDOM from 'react-dom';
import '../css/style2.css';
import '../css/style.css';
import '../css/style3.scss';
import * as tools from './tools/tools';

tools.Console(tools.add(4, 6).toString());
tools.Console(tools.mulToString(3, 7).toString());

const myId:HTMLElement | null = document.getElementById('intro');

if (myId instanceof HTMLElement) {
  ReactDOM.render(
    <div className="test"><h1>Hello world, from react using css!</h1></div>,
    myId,
  );
}
