// @flow

import * as React from 'react';
import '../../css/style.scss';
import { generateUniqueId } from '../tools/tools';
// import { classify } from '../tools/tools';

type Props = {
  label?: string;
  id?: string;
  direction?: 'up' | 'down';
  xAlign?: 'left' | 'right' | 'middle';
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
    const xAlign = props.xAlign || 'left';
    const direction = props.direction || 'down';
    const id = props.id || generateUniqueId('id__drop_down_button');
    const toggle = () => {
      console.log('here');
      const itemList = document.getElementById(`${id}_list`);
      const button = document.getElementById(id);
      if (itemList && button) {
        itemList.classList.toggle('drowdownbutton_list_show');
        const rect = button.getBoundingClientRect();
        itemList.style.top = `${rect.bottom}px`;
      }
    };
    // const className = classify('btn', props.className || '');
    // delete props.label;
    const listContent = [];
    // let key = 0;
    props.list.forEach((listItem, index) => {
      let activeClass = '';
      if (listItem.active) {
        activeClass = ' dropdownbutton_list_item_active';
      }

      listContent.push(
        <div className={`dropdownbutton_list_item${activeClass}`}
             key={index}>
          <a href={listItem.link}>
            {listItem.label}
          </a>
        </div>,
      );
    });

    return <div className="dropdownbutton_container">
      <div className="dropdownbutton_button_container"
           onClick={toggle}>
        <div className="dropdownbutton_label">
          {label}
        </div>
        <div className="dropdownbutton_arrow dropdownbutton_arrow_up">
        </div>
      </div>
      <div className="drowdownbutton_list"
           id={`${id}_list`}>
        {listContent}
      </div>
    </div>;
  }
}
