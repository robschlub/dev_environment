// @flow

import * as React from 'react';
import '../../css/style.scss';

type Props = {
  label: ?string,
  id: ?string,
  left: ?string,
  top: ?string,
  link: ?string,
  state: '' | 'disabled' | 'selected',
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
      left,
      top,
    };
    const link = props.link || '/';
    let classText = 'navigator__lesson_tile_containter navigator__lesson_shadow';
    if (props.state === 'disabled') {
      classText = `${classText} navigator__lesson_tile_disabled`;
    }
    if (props.state === 'selected') {
      classText = `${classText} navigator__lesson_tile_selected`;
    }
    let imgLink = '/static/defaultTile.png';
    if (link !== '/') {
      imgLink = `/static${link}/tile.png`;
    }
    return <a
        href={link}
        id={id}
        style={style}
        className="navigator__lesson_tile">
      <div className={classText}>
        <img src={imgLink} className="navigator__lesson_tile_image" />
        <div className="navigator__lesson_tile_title_container">
          <div className="navigator__lesson_tile_title">
            {label}
          </div>
        </div>
      </div>
    </a>;
  }
}
