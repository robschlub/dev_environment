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
    const props = Object.assign({}, this.props);
    const Tag = props.href ? 'a' : 'button';
    const label = props.label || 'Button';
    const className = classify('btn', props.className || '');
    delete props.label;

    return <Tag {...props} className={className}>
      {label}
    </Tag>;
  }
}
