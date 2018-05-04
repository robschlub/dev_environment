// @flow

import * as React from 'react';
import '../../css/style.scss';

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
    return <div id={`${id}_container`} className="diagram__container">
        <canvas className='diagram__gl'>
        </canvas>
        <div className='diagram__html'>
        </div>
        <canvas className='diagram__text'>
        </canvas>
      </div>;
  }
}
