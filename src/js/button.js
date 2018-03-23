// @flow

import React from 'react';
import '../css/style3.scss';

// import ReactDOM from 'react-dom';

type Props = {
  text: string,
};

export default class Button extends React.Component
                                    <Props> {
  render() {
    return <div className="btn btn-primary">
      <p>{this.props.text}</p>
    </div>;
  }
}

