// @flow

import * as React from 'react';
import '../../css/style.scss';
// import img from '../../tile.png';

type Props = {
  label: ?string,
  id: ?string,
  left?: ?string,
  top?: ?string,
  link: ?string,
  imgLink: ?string,
  state: '' | 'disabled' | 'selected',
};

export default class LessonTile extends React.Component
                                    <Props> {
  render() {
    const props = Object.assign({}, this.props);
    // const Tag = props.href ? 'a' : 'button';
    const label = props.label || '';
    const id = props.id || '';
    let style = {};
    if (props.left != null || props.top != null) {
      const left = props.left || 0;
      const top = props.top || 0;
      style = {
        left,
        top,
      };
    }

    const link = props.link || '/';
    let classText = 'navigator__lesson_tile_containter navigator__lesson_shadow';
    if (props.state === 'disabled') {
      classText = `${classText} navigator__lesson_tile_disabled`;
    }
    if (props.state === 'selected') {
      classText = `${classText} navigator__lesson_tile_selected`;
    }
    let imgLink = '/static/defaultTile.png';
    if (props.imgLink != null) {
      imgLink = `${'/static/dist'}${props.imgLink}`;
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
