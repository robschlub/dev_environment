// @flow

import * as React from 'react';
// import '../../css/style.scss';
import { generateUniqueId } from '../tools/tools';
// import { classify } from '../tools/tools';

type Props = {
  label?: string;
  id?: string;
  direction?: 'up' | 'down';
  xAlign?: 'left' | 'right' | 'center';
  list?: Array<{
    label: string;
    link: Function | string;
    active?: boolean;
  }>;
};

export default class DropDownButton extends React.Component
                                    <Props> {
  id: string;
  buttonElement: HTMLElement;
  bodyElement: HTMLElement;
  itemList: HTMLElement;
  xAlign: 'left' | 'right' | 'center';
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
    this.itemList.classList.add('drop_down_button_list_hide');
    this.itemList.style.left = '-200px';
    this.itemList.style.top = '-200px';
  }

  toggle() {
    this.itemList.classList.toggle('drop_down_button_list_hide');
    const rect = this.buttonElement.getBoundingClientRect();
    const listRect = this.itemList.getBoundingClientRect();
    console.log(this.itemList.classList.contains('drop_down_button_list_hide'))
    if (!this.itemList.classList.contains('drop_down_button_list_hide')) {
      if (this.direction === 'down') {
        // this.itemList.style.top = `${window.scrollY + rect.bottom}px`;
        this.itemList.style.top = `${rect.height}px`;
      } else {
        // this.itemList.style.top = `${window.scrollY + rect.top - listRect.height}px`;
        console.log(listRect)
        this.itemList.style.top = `${-listRect.height}px`;
      }
      if (this.xAlign === 'left') {
        // this.itemList.style.left = `${window.scrollX + rect.left}px`;
        this.itemList.style.left = '0px';
      } else if (this.xAlign === 'right') {
        // this.itemList.style.left = `${window.scrollX + rect.right - listRect.width}px`;
        this.itemList.style.left = `${rect.width - listRect.width}px`;
      } else if (this.xAlign === 'center') {
        // this.itemList.style.left = `${window.scrollX + rect.right - rect.width / 2 - listRect.width / 2}px`;
        this.itemList.style.left = `${rect.width / 2 - listRect.width / 2}px`;
      }
    } else {
      this.itemList.style.left = '-200px';
      this.itemList.style.top = '-200px';
    }
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
    let arrowDirectionClass = ' drop_down_button_arrow_down';
    if (this.direction === 'up') {
      arrowDirectionClass = ' drop_down_button_arrow_up';
    }
    this.id = props.id || generateUniqueId('id__drop_down_button');
    const listContent = [];
    props.list.forEach((listItem, index) => {
      let activeClass = '';
      if (listItem.active) {
        activeClass = ' drop_down_button_list_item_active';
      }
      let link = <div onClick={listItem.link}>
        {listItem.label}
        </div>;
      if (typeof listItem.link === 'string') {
        link = <a href={listItem.link}>
          {listItem.label}
        </a>;
      }

      listContent.push(
        <div className={`drop_down_button_list_item${activeClass}`}
             key={index}>
          {link}
        </div>,
      );
    });

    return <div className='drop_down_button_container'>
      <div className="drop_down_button_button_container"
           id={this.id}>
        <div className="drop_down_button_label">
          {label}
        </div>
        <div className={`drop_down_button_arrow${arrowDirectionClass}`}>
        </div>
      </div>
      <div className="drop_down_button_list drop_down_button_list_hide"
           id={`${this.id}_list`}>
        {listContent}
      </div>
    </div>;
  }
}
