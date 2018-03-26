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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Home</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Select Topic
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">Shapes</a>
                <a className="dropdown-item" href="#">Circles</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">Glossary</a>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">Disabled</a>
            </li>
          </ul>
        </div>
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
          <span className="caret"></span></button>
          <ul className="dropdown-menu">
            <li><a href="#">HTML</a></li>
            <li><a href="#">CSS</a></li>
            <li><a href="#">JavaScript</a></li>
          </ul>
        </div>
      </nav>

      <Jumbotron className="jumbotron -fluid splash"
                  containerFluid={false}
                  >
        <div className="col-6">
          <h1 className="display-4">Hello, world!</h1>
          <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
          <hr className="my-4" style={{ borderColor: 'lightGrey' }}/>
          <p>It uses utility classes for typography and spacing to space
             content out within the larger container.
          </p>
          <p className="lead">
            <Button label="Learn More" className="-primary -lg" href="#"/>
          </p>
        </div>
    </Jumbotron>
    <Jumbotron className="jumbotron -fluid text-center splash1"
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
