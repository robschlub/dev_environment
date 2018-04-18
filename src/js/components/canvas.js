// @flow

import * as React from 'react';
import '../../css/style.scss';
import '../../css/diagram.scss';

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
    return <div id={`${id}_container`}>
        <canvas id={id}>
        </canvas>
        <div id={`${id}_overlay`}>
        </div>
      </div>;
  }
}
