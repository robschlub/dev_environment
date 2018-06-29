// @flow

import * as React from 'react';
import '../../css/style.scss';

type Props = {
  label: ?string,
  id: ?string,
  left: ?number,
  top: ?number,
};

export default class LessonTile extends React.Component
                                    <Props> {
  render() {
    const props = Object.assign({}, this.props);
    // const Tag = props.href ? 'a' : 'button';
    const label = props.label || '';
    const id = props.id || '';
    const left = props.left || 0;
    const top = props.top || 0;
    const style = {
      left: left,
      top: top,
    }
    return <div 
        id={id} 
        style={style}
        className="navigator__lesson_position">
      <div className="navigator__lesson_containter navigator__lesson_shadow">
        <div className="navigator__lesson_title">
          {label}
        </div>
      </div>
    </div>
  }
}
