import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link as ScrollLink, Element } from 'react-scroll';
import { getCurrentLocale } from '../reducers/i18n';

import Card from '../layout/Card';
import AppBadge from '../widgets/AppBadge';
import { getVariation } from '../utils/APIUtils';
import Helmet from '../utils/Helmet';

import { imagesPath } from '../config';

import './Homepage.scss';

export class Homepage extends Component {

  static propTypes = {
    categories: PropTypes.array.isRequired,
    locale: PropTypes.string.isRequired,
  };

  static layoutSettings = {
    stickyHeader: false,
  };

  render() {
    return (
      <div className="Homepage">
        <Helmet meta={ [
          { name: 'twitter:card', content: 'app' },
        ] } />
        <div className="Homepage-hero">
          <div className="Homepage-hero-bg" />

          <div className="Homepage-hero-copy">
            <h1>
              <FormattedMessage
                id="homepage.header-1"
                defaultMessage="Buy and Sell while Chatting!"
              />
            </h1>
            <h2>
              <FormattedMessage
                id="homepage.header-2"
                defaultMessage="Chat with buyers and sellers in your area or anywhere in the world!"
              />
            </h2>
            <ScrollLink
              to="explore"
              className="Button secondary size-huge"
              smooth
              duration={ 800 }
              offset={ 0 }>
              <span className="Button-label">
                <FormattedMessage
                  id="homepage.exploreButton"
                  defaultMessage="Explore"
                />
              </span>
            </ScrollLink>
            <ScrollLink to="how-it-works" className="Button primary size-huge" smooth duration={ 800 } offset={ 0 } style={ { marginLeft: '1rem' } }>
              <span className="Button-label">
                <FormattedMessage
                  id="homepage.howItWorksButton"
                  defaultMessage="How it works"
                />
              </span>
            </ScrollLink>
          </div>

          <div className="Homepage-hero-apps">
            <div className="Homepage-hero-download-copy">
              <img alt="App Icon" src={ `${imagesPath}/app-icon.png` } height="50" />
              <h3>
                <FormattedMessage
                  id="homepage.app.download-1"
                  defaultMessage="Download the App now"
                />
                <br />
                <FormattedMessage
                  id="homepage.app.download-2"
                  defaultMessage="Shoutit for Android or iOS"
                />
              </h3>
            </div>
            <div>
              <AppBadge appstore="appStore" height={ 50 } />
              <AppBadge appstore="googlePlay" height={ 50 } />
            </div>
          </div>
        </div>

        <Element name="explore" className="Homepage-explore htmlResponsiveLayout">
          <h2>
            <FormattedMessage
              id="homepage.header-explore"
              defaultMessage="Explore shouts"
            />
          </h2>
          <div className="Homepage-cards">
          { this.props.categories.slice(0, 8).map(category =>
            <Link key={ category.slug } to={ `/interest/${category.slug}` }>
              <Card size="small" title={ category.name } image={ category.image ? getVariation(category.image, 'small') : null } />
            </Link>
          ) }
          </div>
        </Element>

        <Element name="how-it-works" className="Homepage-how-it-works">
          <h2>
            <FormattedMessage
              id="homepage.header-howItWorks"
              defaultMessage="How it works"
            />
          </h2>
          <img alt="" src={ `${imagesPath}/home-how-it-works-${this.props.locale}.png` } height="500" width="1000" />
        </Element>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories.shuffled.map(id => state.entities.categories[id]),
  locale: getCurrentLocale(state),
});

export default connect(mapStateToProps)(Homepage);
