// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import '../../css/style.scss';
import Button from './../components/button';
import Jumbotron from './../jumbotron';
import Navbar from './../components/navbar';
import Content from './../components/content';
import Canvas from '../components/canvas';
import testgl from '../diagram/testwebgl';

const introPage = () => {
  // const globalVars = GlobalVariables.getInstance();
  // // let lesson;
  // let nextButton = document.getElementById("next_link");
  // let prevButton = document.getElementById("prev_link");
  // let selectButton = document.getElementById("select_link");

  // const lesson = new Lesson2();
  // lesson.director.updateState();
  // nextButton.onclick = lesson.director.next.bind(lesson.director);
  // prevButton.onclick = lesson.director.prev.bind(lesson.director);
  // selectButton.onclick = lesson.director.select.bind(lesson.director);
  // globalVars.animateNextFrame();
  // console.log(styles.colorCornersMoreSharp);
  // console.log(styles.colorStick);
  // console.log(styles.colorGreek);
  // console.log(styles);
  // getColors();

  const introId:HTMLElement | null = document.getElementById('intro');

  if (introId instanceof HTMLElement) {
    // let content;
    // fetch('/lessons/chapter1')
    //   .then((response) => { content = response; });

    ReactDOM.render(
      <div>
        <Navbar active='Introduction'/>

        <Jumbotron className="jumbotron -fluid views-intro"
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
      <Jumbotron className="jumbotron -fluid text-center views-intro1"
                  containerFluid={false}
                  >
          <h1>This is a title</h1>
          <p>With a subtitle</p>

          <Button type='button' className="-primary">Goo</Button>
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
      <Content />
      <div className='container'>
        <div className='row'>
          <div className='col-2'></div>
          <Canvas id="my_Canvas" didMountFn={testgl}/>
          <div className='col-2'></div>
          <Canvas id="my_Canvas1" didMountFn={testgl}/>
        </div>
      </div>
      </div>,
      introId,
    );
    //
    // console.log("Asdf");
    // testgl('my_Canvas');
  }
};

export default introPage;
