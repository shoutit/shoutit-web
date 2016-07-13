import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import Header from './Header';
import Hero from './Hero';
import Button from '../../forms/Button';
import { imagesPath } from '../../config';
import AppBadge from '../../widgets/AppBadge';
import Logo from '../../widgets/Logo';

import { loadShoutSamples } from '../../actions/shouts';

import './HomePage.scss';

import { getCurrentLocation } from '../../reducers/currentLocation';
import { getShoutSamples } from '../../reducers/shoutSamples';

const fetchData = dispatch => dispatch(loadShoutSamples());

class HomePage extends Component {

  static propTypes = {
    currentLocation: PropTypes.object.isRequired,
    shouts: PropTypes.array.isRequired,
  }

  static fetchData = fetchData;

  render() {
    console.log(this.props.shouts);
    return (
      <div className="HomePage">
        <section className="HomePage-hero">
          <Header />
          <Hero />
        </section>
        <section className="HomePage-section">
          <div className="HomePage-sectionContent">
            <h3>
              <FormattedMessage
                id="pages.home.shouts.title"
                defaultMessage="Offers & Requests"
              />
            </h3>
            <p>
              <FormattedMessage
                id="pages.home.shouts.description"
                defaultMessage="There are two different types of Shouts (listings). {colouredOfferText} any product or a service on Shoutit marketplace. Do you need anything? {colouredRequestText} it and wait to be contacted by someone who has it."
                values={ {
                  colouredOfferText: <span className="offer"><FormattedMessage id="pages.home.shouts.description.colouredOfferText" defaultMessage="Offer" /></span>,
                  colouredRequestText: <span className="request"><FormattedMessage id="pages.home.shouts.description.colouredRequestText" defaultMessage="Request" /></span>,
                } }
              />
            </p>

            <div className="HomePage-section-action">
              <Button kind="primary">
                <FormattedMessage
                  id="pages.home.shouts.action.button"
                  defaultMessage="Create a Shout"
                />
              </Button>
              <p>
                <em>
                  <FormattedMessage
                    id="pages.home.shouts.action.description"
                    defaultMessage="It’s free!"
                  />
                </em>
              </p>
            </div>
          </div>
        </section>
        <section className="HomePage-section">
          <div className="HomePage-sectionContent">
            <h3>
              <FormattedMessage
                id="pages.home.publicChats.title"
                defaultMessage="Public Chats"
              />
            </h3>
            <p>
              <FormattedMessage
                id="pages.home.publicChats.description"
                defaultMessage="Talk about products and services with others in your area. Share videos, photos and Shouts or ask for an advice while looking for something. Join existing public chats in your city or create your own."
              />
            </p>
            <div className="HomePage-sectionImage">
              <img alt="" height="267" width="260" src={ `${imagesPath}/home-public-chat-mobile.png` } />
            </div>

            { true &&
              <Button kind="primary">
                <FormattedMessage
                  id="pages.home.publicChats.action.button"
                  defaultMessage="Explore Public Chats in { city }"
                  values={ {
                    city: this.props.currentLocation.city,
                  } }
                />
              </Button>
            }

            <div className="HomePage-sectionSeparator" />

            <h3>
              <FormattedMessage
                id="pages.home.shoutitCredit.title"
                defaultMessage="Shoutit Credit"
              />
            </h3>
            <p>
              <FormattedMessage
                id="pages.home.shoutitCredit.description"
                defaultMessage="Is a virtual currency you can earn and spend on Shoutit. Use your Shoutit credit to promote your Shouts and business pages. You can buy Shoutit credit or earn it by inviting friends."
              />
            </p>
            <div className="HomePage-sectionImage">
              <img alt="" height="267" width="259" src={ `${imagesPath}/home-credit-mobile.png` } />
            </div>
          </div>
        </section>
        <section className="HomePage-section">
          <div className="HomePage-sectionContent">
            <Logo type="business" />
            <p>
              <FormattedMessage
                id="pages.home.business.description"
                defaultMessage="Every great business needs to stay close to its customers. Use Shoutit to sell and grow your customer base at the same time."
              />
            </p>
            <div className="HomePage-sectionImage">
              <img alt="" height="267" width="259" src={ `${imagesPath}/home-pages-mobile.png` } />
            </div>
            <h4>
              <FormattedMessage
                id="pages.home.business.pages.title"
                defaultMessage="Pages"
              />
            </h4>
            <p>
              <FormattedMessage
                id="pages.home.business.pages.description"
                defaultMessage="Create a personalised page for your company product, brand or a cause. Let your customers and supporters know who you are."
              />
            </p>
            <h4>
              <FormattedMessage
                id="pages.home.business.plans.title"
                defaultMessage="Plans"
              />
            </h4>
            <p>
              <FormattedMessage
                id="pages.home.business.plans.description"
                defaultMessage="Is one admin for your business page not enough? Do you have a lot to list to on Shoutit? Then we have something extra for you. Shoutit business plans coming soon."
              />
            </p>
            <div className="HomePage-section-action">
              <Button kind="alternate">
                <FormattedMessage
                  id="pages.home.business.action.button"
                  defaultMessage="Get Started with Shoutit for Business"
                />
              </Button>
              <p>
                <em>
                  <FormattedMessage
                    id="pages.home.business.action.description"
                    defaultMessage="It’s free to set up."
                  />
                </em>
              </p>
            </div>

          </div>
        </section>
        <section className="HomePage-section">
          <div className="HomePage-sectionContent">
            <h3>
              <FormattedMessage
                id="pages.home.apps.title"
                defaultMessage="Download Shoutit Apps"
              />
            </h3>
            <p>
              <FormattedMessage
                id="pages.home.apps.description"
                defaultMessage="Buy and Sell anything while chatting. Shout Offers and Requests in your area or anywhere in the world!"
              />
            </p>

            <AppBadge appstore="appStore" height={ 40 } />
            <AppBadge appstore="googlePlay" height={ 40 } />

          </div>
        </section>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentLocation: getCurrentLocation(state),
  shouts: getShoutSamples(state),
});
export default connect(mapStateToProps)(HomePage);
