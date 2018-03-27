// @flow

import * as React from 'react';
import '../../css/style.scss';
import { classify } from '../tools/tools';

type Props = {
  label?: string,
  href?: string,
  className?: string,
  children?: React.Node,
};

export default class Button extends React.Component
                                    <Props> {
  render() {
    const props = Object.assign({}, this.props);
    const Tag = props.href ? 'a' : 'button';
    const label = props.label || props.children || 'Button';
    const className = classify('btn', props.className || '');
    delete props.label;

    return <Tag {...props} className={className}>
      {label}
    </Tag>;
  }
}
