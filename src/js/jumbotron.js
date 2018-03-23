// @flow

import * as React from 'react';
import '../css/style3.scss';
import { classify } from './tools/tools';
// import ReactDOM from 'react-dom';

type Props = {
  className?: string,
  children?: React.Node,
};

export default class Jumbotron extends React.Component
                                    <Props> {
  render() {
    const className = classify('jumbotron', this.props.className || '');

    return <div {...this.props} className={className}>
      {this.props.children}
    </div>;
  }
}
