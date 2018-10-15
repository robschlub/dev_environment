// @flow

import * as React from 'react';
// import '../../css/style.scss';
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
  buttonElement: HTMLElement;
  bodyElement: HTMLElement;
  itemList: HTMLElement;
  xAlign:  'left' | 'right' | 'middle';
  direction: 'up' | 'down';
  constructor(props: Props) {
    super(props);
    this.id = '';
  }

  offButtonEvent(event: MouseEvent | TouchEvent) {
    if (event.target instanceof HTMLElement) {
      if (event.target.parentElement instanceof HTMLElement) {
        if (event.target !== this.buttonElement
          && event.target.parentElement.parentElement !== this.itemList
        ) {
          this.close();
        }
      }
    }
  }

  close() {
    this.itemList.classList.remove('drop_down_button_list_show');
  }

  toggle() {
    this.itemList.classList.toggle('drop_down_button_list_show');
    const rect = this.buttonElement.getBoundingClientRect();
    this.itemList.style.top = `${window.scrollY + rect.bottom}px`;
    this.itemList.style.left = `${window.scrollX + rect.left}px`;
  }

  componentDidMount() {
    const button = document.getElementById(this.id);
    const { body } = document;
    const itemList = document.getElementById(`${this.id}_list`);
    if (button != null && body != null && itemList != null) {
      this.buttonElement = button;
      this.bodyElement = body;
      this.itemList = itemList;
      button.addEventListener('mousedown', this.toggle.bind(this));
      body.addEventListener('mousedown', this.offButtonEvent.bind(this), true);
    }
  }

  render() {
    const props = Object.assign({}, this.props);
    const label = props.label || '';
    this.xAlign = props.xAlign || 'left';
    this.direction = props.direction || 'down';
    this.id = props.id || generateUniqueId('id__drop_down_button');
    const listContent = [];
    props.list.forEach((listItem, index) => {
      let activeClass = '';
      if (listItem.active) {
        activeClass = ' drop_down_button_list_item_active';
      }

      listContent.push(
        <div className={`drop_down_button_list_item${activeClass}`}
             key={index}>
          <a href={listItem.link}>
            {listItem.label}
          </a>
        </div>,
      );
    });

    return <div className="drop_down_button_container">
      <div className="drop_down_button_button_container"
           id={this.id}>
        <div className="drop_down_button_label">
          {label}
        </div>
        <div className="drop_down_button_arrow drop_down_button_arrow_up">
        </div>
      </div>
      <div className="drop_down_button_list"
           id={`${this.id}_list`}>
        {listContent}
      </div>
    </div>;
  }
}
