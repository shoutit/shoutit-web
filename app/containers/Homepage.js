import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Link as ScrollLink, Element } from 'react-scroll';
import Card from '../ui/Card';
import DocumentTitle from '../ui/DocumentTitle';
import { getVariation } from '../utils/APIUtils';

import { imagesPath, appStoreLink, playStoreLink } from '../config';

if (process.env.BROWSER) {
  require('./Homepage.scss');
}

export function Homepage({ categories }) {
  return (
    <DocumentTitle title="Buy and sell while chatting!">
      <div className="Homepage">
        <div className="Homepage-hero">
          <div className="Homepage-hero-bg" />

          <div className="Homepage-hero-wrapper htmlContentWidth">
            <div className="Homepage-hero-copy">
              <h1>Buy and sell while chatting!</h1>
              <h2>
                Shoutit is the fastest way to list and share what you want to sell or
                buy. Chat with buyers and sellers in your area or anywhere in the world!
              </h2>
              <ScrollLink to="explore" className="Button primary size-huge" smooth duration={ 800 } offset={ 0 }>
                <span className="Button-label">Explore</span>
              </ScrollLink>
              <ScrollLink to="how-it-works" className="Button inverted size-huge" smooth duration={ 800 } offset={ 0 }>
                <span className="Button-label">How it works</span>
              </ScrollLink>
            </div>

            <div className="Homepage-hero-apps">
              <a href={appStoreLink} target="_blank">
                <img src={`${imagesPath}/app-store-badge.png`} height="60" />
              </a>
              <a href={playStoreLink} target="_blank">
                <img src={`${imagesPath}/google-play-badge.png`} height="60" />
              </a>
            </div>
          </div>

        </div>

        <Element name="explore" className="Homepage-explore htmlContentWidth">
          <h2>Explore shouts</h2>
          <div className="Homepage-cards">
          { categories.slice(0, 8).map(category =>
            <Link key={ category.slug } to={`/interest/${category.slug}`}>
              <Card size="small" title={ category.name} image={ category.image ? getVariation(category.image, 'small') : null } />
            </Link>
          )}
          </div>
        </Element>

        <Element name="how-it-works" className="Homepage-how-it-works">
          <h2>How it works</h2>
          <img src={`${imagesPath}/home-how-it-works.png`} height="500" width="1000" />
        </Element>
      </div>
    </DocumentTitle>
  );
}

Homepage.propTypes = {
  categories: PropTypes.array.isRequired,
};

Homepage.layoutSettings = {
  stickyHeader: false,
};

const mapStateToProps = state => ({
  categories: state.categories.shuffled.map(id => state.entities.categories[id]),
});

export default connect(mapStateToProps)(Homepage);
