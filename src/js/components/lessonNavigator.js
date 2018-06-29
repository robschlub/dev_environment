// @flow

import * as React from 'react';
import '../../css/style.scss';
import LessonTile from './lessonTile';

type Props = {
};

export default class LessonNavigator extends React.Component
                                    <Props> {
  componentDidMount() {
    const navigator = document.getElementById('id_navigator__container');
    if (navigator) {
      console.log("asdf1");
      navigator.scrollLeft = 100;
      navigator.addEventListener('mousedown', this.mdh.bind(this), false);
      navigator.addEventListener('mousemove', this.mdh.bind(this), false);
    }
    const navigator1 = document.getElementById('master_containter');
    if (navigator1) {
      console.log("asdf2");
      navigator1.addEventListener('mousedown', this.mdh.bind(this), false);
      navigator1.addEventListener('mousemove', this.mdh.bind(this), false);
    }
  }

  mdh(event: MouseEvent) {
    console.log("Asdfasdf")
    console.log(event);
  }

  render() {
    return <div id="master_containter" className="naviagator__container">
      <div className="navigator__left_side" />
      <div className="navigator__right_side" />
      <div id="id_navigator__container"  className="navigator__scroll_container">
        <LessonTile id="id_test1" label='Angles' left='100px' top='100px' />
        <LessonTile id="id_test2" label='Circles' left='300px' top='100px' />
        <LessonTile id="id_test3" label='Measure' left='500px' top='70px' />
        <LessonTile id="id_test4" label='Triangles' left='500px' top='150px' />
        <LessonTile id="id_test4" label='Test1' left='700px' top='150px' />
        <LessonTile id="id_test4" label='Test2' left='900px' top='150px' />
        <LessonTile id="id_test5" label='Test3' left='1100px' top='150px' />
      </div>
    </div>
  }
}
