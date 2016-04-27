import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Link as ScrollLink, Element } from 'react-scroll';
import Card from '../ui/Card';
import { getVariation } from '../utils/APIUtils';
import Helmet from '../utils/Helmet';

import { imagesPath, appStoreLink, playStoreLink } from '../config';

if (process.env.BROWSER) {
  require('./Homepage.scss');
}

export class Homepage extends Component {

  static propTypes = {
    categories: PropTypes.array.isRequired,
  };

  static layoutSettings = {
    stickyHeader: false,
  };

  render() {
    const { categories } = this.props;

    return (
      <div className="Homepage">
        <Helmet meta={ [
          { name: 'twitter:card', content: 'app' },
        ] } />
        <div className="Homepage-hero">
          <div className="Homepage-hero-bg" />

          <div className="Homepage-hero-copy">
            <h1>Buy and Sell while Chatting!</h1>
            <h2>Chat with buyers and sellers in your area or anywhere in the world!
            </h2>
            <ScrollLink to="explore" className="Button action-primary-alt size-huge" smooth duration={ 800 } offset={ 0 }>
              <span className="Button-label">Explore</span>
            </ScrollLink>
            <ScrollLink to="how-it-works" className="Button action-primary size-huge" smooth duration={ 800 } offset={ 0 } style={ { marginLeft: '1rem' } }>
              <span className="Button-label">How it works</span>
            </ScrollLink>
          </div>

          <div className="Homepage-hero-apps">
            <div className="Homepage-hero-download-copy">
              <img alt="App Icon" src={ `${imagesPath}/app-icon.png` } height="50" />
              <h3>Download the App now<br />
              Shoutit for Android or iOS</h3>
            </div>
            <div>
              <a href={ appStoreLink } target="_blank">
                <img alt="App Store" src={ `${imagesPath}/app-store-badge.png` } height="50" />
              </a>
              <a href={ playStoreLink } target="_blank">
                <img alt="Google Play" src={ `${imagesPath}/google-play-badge.png` } height="50" />
              </a>
            </div>
          </div>
{/*
          <div className="Homepage-hero-buttons">
            <ScrollLink to="explore" className="Button action="primary" size-huge" smooth duration={ 800 } offset={ 0 }>
              <span className="Button-label">Explore</span>
            </ScrollLink>
            <ScrollLink to="how-it-works" className="Button inverted size-huge" smooth duration={ 800 } offset={ 0 }>
              <span className="Button-label">How it works</span>
            </ScrollLink>
          </div>*/}
{/*
          <div className="Homepage-hero-download-copy">
            <h2>Download the apps now<br />
            Shoutit for Android or iOS</h2>
          </div>*/}

        </div>

        <Element name="explore" className="Homepage-explore htmlContentWidth">
          <h2>Explore shouts</h2>
          <div className="Homepage-cards">
          { categories.slice(0, 8).map(category =>
            <Link key={ category.slug } to={ `/interest/${category.slug}` }>
              <Card size="small" title={ category.name } image={ category.image ? getVariation(category.image, 'small') : null } />
            </Link>
          ) }
          </div>
        </Element>

        <Element name="how-it-works" className="Homepage-how-it-works">
          <h2>How it works</h2>
          <img alt="How it works" src={ `${imagesPath}/home-how-it-works.png` } height="500" width="1000" />
        </Element>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories.shuffled.map(id => state.entities.categories[id]),
});

export default connect(mapStateToProps)(Homepage);
