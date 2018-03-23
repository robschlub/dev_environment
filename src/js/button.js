// @flow

import React from 'react';
import '../css/style3.scss';
import { classify } from './tools/tools';
// import ReactDOM from 'react-dom';

type Props = {
  label: string,
  href?: string,
  className?: string,
};

export default class Button extends React.Component
                                    <Props> {
  render() {
    const Tag = this.props.href ? 'a' : 'button';
    const label = this.props.label || 'Button';
    const className = classify('btn', this.props.className || '');

    return <Tag {...this.props} className={className}>
      <p>{label}</p>
    </Tag>;
  }
}
