// @flow

import * as React from 'react';
import '../../css/style.scss';

type Props = {
  // className?: string,
  // children?: React.Node,
  active?: string
};


export default class Navbar extends React.Component
                                    <Props> {
  render() {
    const props = Object.assign({}, this.props);
    const nav1 = 'Introduction';
    const nav2 = 'About';
    const nav3 = 'Single Page Lesson';
    const nav4 = 'Multi Page Lesson';
    const nav1Class = `nav-link ${props.active === nav1 ? 'active' : ''}`;
    const nav2Class = `nav-link ${props.active === nav2 ? 'active' : ''}`;
    const nav3Class = `nav-link ${props.active === nav3 ? 'active' : ''}`;
    const nav4Class = `nav-link ${props.active === nav4 ? 'active' : ''}`;

    delete props.active;

    const body =
      <nav className="navbar navbar-expand-md nav-responsive navbar-dark bg-dark">

        <a className="navbar-brand" href="/">
          <img src="/static/icon-lg.png" width="30" height="30" className="d-inline-block align-top homeicon" alt=""/>
        </a>

        {/* Hidden button for when navbar collapses */}
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

      {/* Collapsable content */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className={nav1Class}
                 href={`/${nav1.toLowerCase().replace(/ /g, '')}`}>
                  { nav1 }
              </a>
            </li>
            <li className="nav-item">
              <a className={nav2Class}
                 href={`/${nav2.toLowerCase().replace(/ /g, '')}`}>
                  { nav2 }
              </a>
            </li>
            <li className="nav-item">
              <a className={nav3Class}
                 href={`/${nav3.toLowerCase().replace(/ /g, '')}`}>
                  { nav3 }
              </a>
            </li>
            <li className="nav-item">
              <a className={nav4Class}
                 href={`/${nav4.toLowerCase().replace(/ /g, '')}`}>
                  { nav4 }
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

          <form className="form-inline">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>;

    return <div {...props}>
      {body}
    </div>;
  }
}
