// @flow

import * as React from 'react';
import '../../css/style.scss';
import testgl from './testwebgl';

type Props = {
  id: string;
};

export default class Canvas extends React.Component
                                    <Props> {
  componentDidMount() {
    testgl();
  }

  render() {
    return <canvas id={this.props.id}>
    </canvas>;
  }
}
