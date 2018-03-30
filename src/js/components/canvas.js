// @flow

import * as React from 'react';
import '../../css/style.scss';

type Props = {
  id?: string;
  didMountFn?: () => mixed;
};

export default class Canvas extends React.Component
                                    <Props> {
  componentDidMount() {
    if (this.props.didMountFn) {
      this.props.didMountFn();
    }
  }

  render() {
    const id = this.props.id || '';
    return <canvas id={id}>
    </canvas>;
  }
}
