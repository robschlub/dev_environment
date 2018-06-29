import * as React from 'react';
import './banner.scss';

export default class HomeBanner extends React.Component
                                    <> {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return <div className="home__banner">
      <div className="home__banner_logo_spacer"/>
      <div className="home__banner_logo">
        <div className="home__banner_logo_text_container">
          <div className="home__banner_logo_text">
            get it
          </div>
        </div>
      </div>
      <div className="home__banner_sub_title">
        <div className="home__banner_sub_title_text">
          Interact
        </div>
        <div className="home__banner_sub_title_text">
          ●
        </div>
        <div className="home__banner_sub_title_text">
          Intuit
        </div>
        <div className="home__banner_sub_title_text">
          ●
        </div>
        <div className="home__banner_sub_title_text">
          Learn
        </div>
      </div>
    </div>;
  }
}
