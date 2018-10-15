// @flow

import * as React from 'react';
import '../../css/style.scss';
// import { classify } from '../tools/tools';

type Props = {
  label?: string;
  list?: Array<{
    label: string;
    link: string;
    active?: boolean;
  }>;
};

export default class DropDownButton extends React.Component
                                    <Props> {
  render() {
    const props = Object.assign({}, this.props);
    // const Tag = props.href ? 'a' : 'button';
    const label = props.label || '';
    // const className = classify('btn', props.className || '');
    // delete props.label;

    return <div className="dropdownbutton_container">
      <div className="dropdownbutton_label">
        {label}
      </div>
      <div className="dropdownbutton_arrow dropdownbutton_arrow_up">
      </div>
    </div>;
  }
}
