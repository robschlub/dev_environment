// @flow

import * as React from 'react';
import '../../css/style.scss';
// import '../../css/diagram.scss';

type Props = {
  id?: string;
  didMountFn?: (string) => mixed;
};

export default class Canvas extends React.Component
                                    <Props> {
  componentDidMount() {
    if (this.props.didMountFn) {
      const id = this.props.id || '';
      this.props.didMountFn(id);
    }
  }

  render() {
    const id = this.props.id || '';
    return <div id={`${id}_container`} className="canvas_container">
        <canvas className='diagram_gl'>
        </canvas>
        <div className='diagram_html'>
        </div>
        <canvas className='diagram_text'>
        </canvas>
      </div>;
  }
}
