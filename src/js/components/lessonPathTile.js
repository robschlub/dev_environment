// @flow

import * as React from 'react';
import '../../css/style.scss';

type Props = {
  label: ?string,
  id: ?string,
  // left?: ?string,
  // top?: ?string,
  right: ?boolean,
  link: ?string,
  state: '' | 'disabled' | 'selected',
};

export default class LessonTilePath extends React.Component
                                    <Props> {
  render() {
    const props = Object.assign({}, this.props);
    // const Tag = props.href ? 'a' : 'button';
    const label = props.label || '';
    const id = props.id || '';
    let style = {};
    // if (props.left != null || props.top != null) {
    //   const left = props.left || 0;
    //   const top = props.top || 0;
    //   style = {
    //     left,
    //     top,
    //   };
    // }

    const link = props.link || '/';
    let classText = 'lesson__path_tile';
    if (props.state === 'disabled') {
      classText = `${classText} navigator__lesson_tile_disabled`;
    }
    if (props.state === 'selected') {
      classText = `${classText} navigator__lesson_tile_selected`;
    }
    const right = props.right || false;
    if (right) {
      classText = `${classText} lesson__path_tile_right`;
    }
    // return <a
    //     href={link}
    //     id={id}
    //     style={style}
    //     className="navigator__lesson_tile_path">
    //   <div className={classText}>
    //     <div className="navigator__lesson_tile_path_container">
    //       <div className="navigator__lesson_tile_title">
    //         {label}
    //       </div>
    //     </div>
    //   </div>
    // </a>;
    // console.log(style)
    return <a
        href={link}
        id={id}
        // style={style}
        className={classText}>
          <div className="lesson__path_tile_label_container">
            <div className="lesson__path_tile_label">
              {label}
            </div>
          </div>
        </a>;
  }
}
