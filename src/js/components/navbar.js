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
    // const nav1 = 'Login';
    // const nav2 = 'Lea';
    // const nav3 = 'Single';
    // const nav4 = 'Multi';
    // const nav1Class = `nav-link ${props.active === nav1 ? 'active' : ''}`;
    // const nav2Class = `nav-link ${props.active === nav2 ? 'active' : ''}`;
    // const nav3Class = `nav-link ${props.active === nav3 ? 'active' : ''}`;
    // const nav4Class = `nav-link ${props.active === nav4 ? 'active' : ''}`;

    delete props.active;

    const body =
    <div>
      <div className="navbar-container">
        <a className="navbar-icon-container"
           href="/">
          <img className="navbar-icon"
               src="/static/icon-lg.png"/>
        </a>
        <div className="navbar-text navbar-left">
          Login
        </div>
        <div className="navbar-search-container">
          <div className="navbar-search-icon-container">
            <img className="navbar-search-icon-image"
                 src="/static/searchdark.png"/>
          </div>
          <input className="navbar-input navbar-right"
                 type="text"
                 placeholder="search lessons"/>
        </div>
      </div>
    </div>;
      // <nav className="navbar navbar-expand-md nav-responsive navbar-color">

      //   <a className="navbar-brand" href="/">
      //     <img src="/static/icon-lg.png" width="30" height="30" className="d-inline-block align-top nav__home-icon" alt=""/>
      //   </a>

      //   {/* Hidden button for when navbar collapses */}
      //   <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      //     <span className="navbar-toggler-icon"></span>
      //   </button>

      // {/* Collapsable content */}
      //   <div className="collapse navbar-collapse" id="navbarSupportedContent">
      //     <ul className="navbar-nav mr-auto">
      //       <li className="nav-item">
      //         <a className={nav1Class}
      //            href={''/* `/${nav1.toLowerCase().replace(/ /g, '') */}>
      //             { nav1 }
      //         </a>
      //       </li>
      //       {
      //       <li className="nav-item">
      //         <a className={nav2Class}
      //            href={`/${nav2.toLowerCase().replace(/ /g, '')}`}>
      //             { nav2 }
      //         </a>
      //       </li>
      //       <li className="nav-item">
      //         <a className={nav3Class}
      //            href={'/Lessons/Math/Introduction'}>
      //             { nav3 }
      //         </a>
      //       </li>
      //       <li className="nav-item">
      //         <a className={nav4Class}
      //            href={'/Lessons/Math/ShapesAndCornersTest'}>
      //             { nav4 }
      //         </a>
      //       </li>
      //       }
      //       <li className="nav-item dropdown">
      //         <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      //           Learn
      //         </a>
      //         <div className="dropdown-menu" aria-labelledby="navbarDropdown">
      //           <a className="dropdown-item" href="/Lessons/Math/Introduction">1 - Why study shapes?</a>
      //           <a className="dropdown-item" href="/Lessons/Math/Circle">2 - Circle</a>
      //           <a className="dropdown-item" href="/Lessons/Math/Angle">3 - Angles</a>
      //           <a className="dropdown-item" href="/Lessons/Math/MeasuringAngles">4 - Measuring Angles</a>
      //           <div className="dropdown-divider"></div>
      //           <a className="dropdown-item" href="/Lessons/Math/ShapesAndCornersTest">Test</a>
      //         </div>
      //       </li>
      //     </ul>

      //     <form className="form-inline">
      //       <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
      //     </form>
      //   </div>
      // </nav>;

    return <div>
      {body}
    </div>;
  }
}
