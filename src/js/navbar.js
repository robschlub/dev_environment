// @flow

import * as React from 'react';
import '../css/style.scss';

type Props = {
  className?: string,
  children?: React.Node,
  containerFluid?: boolean
};

type State = {
  active: string;
};

export default class Navbar extends React.Component
                                    <Props, State> {
  constructor(props: Props) {
    super(props);

    (this: any).activatePage = this.activate.bind(this);
    this.state = {
      active: 'Home',
    };
  }

  activate(page: string) {
    this.setState({ active: page });
  }

  render() {
    const props = Object.assign({}, this.props);
    const nav1 = 'Introduction';
    const nav2 = 'About';


    const body =
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <a className="navbar-brand" href="/">
          <img src="/static/icon-lg.png" width="30" height="30" className="d-inline-block align-top homeicon" alt=""/>
        </a>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className={`nav-link ${this.state.active === { nav1 } ? 'active' : ''}`}
                 href={`/${nav1.toLowerCase()}`}>
                  { nav1 }
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${this.state.active === { nav2 } ? 'active' : ''}`}
                 href={`/${nav2.toLowerCase()}`}>
                  { nav2 }
              </a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Go to
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">Chapter 1 - shapes</a>
                <a className="dropdown-item" href="#">Chapter 2 - circles</a>
                <a className="dropdown-item" href="#">Chapter 3 - abstraction</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">Glossary</a>
              </div>
            </li>
          </ul>
        </div>

        <form className="form-inline">
          <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </nav>;

    return <div {...props}>
      {body}
    </div>;
  }
}
