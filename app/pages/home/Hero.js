import React, { Component } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

// import { imagesPath } from '../../config';

import Searchbar from '../../search/Searchbar';

import './Hero.scss';

class HomePageHero extends Component {
  render() {
    return (
      <div className="HomePageHero">
        <div className="HomePageHero-backdrop" />
        <div className="HomePageHero-content">
          <h1>
            <FormattedMessage
              id="pages.home.hero.header"
              defaultMessage="Buy & Sell anything while Chatting"
            />
          </h1>
          <h3>
            <FormattedMessage
              id="pages.home.hero.subtitle"
              defaultMessage="Shout Offers and Requests in your area or anywhere in the world!"
            />
          </h3>

          <div className="HomePageHero-search">
            <Searchbar />
          </div>
          <div className="HomePageHero-categoryLink">
            <Link to="/search">
              <FormattedMessage
                id="pages.home.hero.categoryLink"
                defaultMessage="Search by Category"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePageHero;
