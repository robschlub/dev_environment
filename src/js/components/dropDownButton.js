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
  id: string;
  constructor(props: Props) {
    super(props);
    this.id = '';
  }

  toggle(event: MouseEvent | TouchEvent) {
    // console.log(event)
    const itemList = document.getElementById(`${this.id}_list`);
    const button = document.getElementById(this.id);
    if (itemList && button) {
      itemList.classList.toggle('drowdownbutton_list_show');
      const rect = button.getBoundingClientRect();
      itemList.style.top = `${rect.bottom}px`;
      const { body } = document;
      if (body) {
        if (itemList.classList.contains('drowdownbutton_list_show')) {
          console.log('adding')
          body.addEventListener('mousedown', this.toggle.bind(this), true);
          // body.addEventListener('touchstart', toggle, true);
        } else {
          console.log('removing')
          body.removeEventListener('mousedown', this.toggle.bind(this), true);
          // body.removeEventListener('touchstart', toggle, true);
        }
      }
    }
    event.preventDefault();
  };

  componentDidMount() {
    const button = document.getElementById(this.id);
    if (button) {
      button.addEventListener('mousedown', this.toggle.bind(this));
    }
  }

  render() {
    const props = Object.assign({}, this.props);
    // const Tag = props.href ? 'a' : 'button';
    const label = props.label || '';
    const xAlign = props.xAlign || 'left';
    const direction = props.direction || 'down';
    this.id = props.id || generateUniqueId('id__drop_down_button');
    // const toggle = (event) => {
    //   console.log(event)
    //   const itemList = document.getElementById(`${id}_list`);
    //   const button = document.getElementById(id);
    //   if (itemList && button) {
    //     itemList.classList.toggle('drowdownbutton_list_show');
    //     const rect = button.getBoundingClientRect();
    //     itemList.style.top = `${rect.bottom}px`;
    //     const { body } = document;
    //     if (body) {
    //       if (itemList.classList.contains('drowdownbutton_list_show')) {
    //         console.log('adding')
    //         body.addEventListener('mousedown', toggle, true);
    //         // body.addEventListener('touchstart', toggle, true);
    //       } else {
    //         console.log('removing')
    //         body.removeEventListener('mousedown', toggle, true);
    //         // body.removeEventListener('touchstart', toggle, true);
    //       }
    //     }
    //   }
    //   return true;
    // };
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
           id={this.id}>
        <div className="dropdownbutton_label">
          {label}
        </div>
        <div className="dropdownbutton_arrow dropdownbutton_arrow_up">
        </div>
      </div>
      <div className="drowdownbutton_list"
           id={`${this.id}_list`}>
        {listContent}
      </div>
    </div>;
  }
}
