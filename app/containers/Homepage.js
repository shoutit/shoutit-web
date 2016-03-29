import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Footer from '../layout/Footer';

import { imagesPath, appStoreLink, playStoreLink } from '../config';

if (process.env.BROWSER) {
  require('./Homepage.scss');
}

export function Homepage({ categories }) {
  return (
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
            <Button href="#explore" primary size="huge" label="Explore" />
            <Button href="#how-it-works" inverted size="huge" label="How it works" />
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

      <a name="explore" />
      <div className="Homepage-explore htmlContentWidth">
        <h2>Explore shouts</h2>
        <div className="Homepage-cards">
        { categories.slice(0, 8).map(category =>
          <Link to={`/interests/${category.slug}`}>
            <Card size="small" title={ category.name} image={ category.image } />
          </Link>
        )}
        </div>
      </div>

      <a name="how-it-works" />
      <div className="Homepage-how-it-works">
        <h2>How it works</h2>
        <img src={`${imagesPath}/home-how-it-works.png`} height="500" width="1000" />
      </div>

      <Footer />
    </div>
  );
}

Homepage.layoutSettings = {
  stickyHeader: false,
};

const mapStateToProps = state => ({
  categories: state.categories.shuffled.map(id => state.entities.categories[id]),
});

export default connect(mapStateToProps)(Homepage);
