/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import isEqual from 'lodash/isEqual';

import { getCurrentLocale, getAvailableLocales, isRtl, getIntlMessages } from '../reducers/i18n';
import { getCurrentUrl, getRoutingError } from '../reducers/routing';
import { getCurrentLocation } from '../reducers/currentLocation';

import Helmet from '../utils/Helmet';
import { identifyOnMixpanel, trackWithMixpanel } from '../utils/mixpanel';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import ResponsiveLayout from '../layout/ResponsiveLayout';

import { ModalHost } from '../modals';
import ConversationsHost from '../chat/ConversationsHost';
import ServerError from './ServerError';
import NotFound from './NotFound';

import { loadCategories, loadCurrencies, loadSortTypes } from '../actions/misc';
import { loadSuggestions } from '../actions/location';
import { loadListeningProfiles } from '../actions/users';
import { clientLogin, updateLinkedAccount, logout } from '../actions/session';

import { getLoggedUser } from '../reducers/session';

import Device from '../utils/Device';
import OpenInApp from '../widgets/OpenInApp';

import * as FacebookUtils from '../utils/FacebookUtils';

import * as config from '../config';

import './Application.scss';

const fetchData = (dispatch, state) => {
  const promises = [];
  promises.push(dispatch(loadCategories()));
  promises.push(dispatch(loadSortTypes()));
  promises.push(dispatch(loadCurrencies()));
  const loggedUser = getLoggedUser(state); // logged user comes from rehydrated state
  if (loggedUser) {
    promises.push(dispatch(loadListeningProfiles(loggedUser)));
  }
  return Promise.all(promises);
};

export class Application extends Component {

  static propTypes = {
    loggedUser: PropTypes.object,
    currentLocation: PropTypes.object,
    error: PropTypes.object,
    children: PropTypes.element.isRequired,
    dispatch: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    rtl: PropTypes.bool.isRequired,
    messages: PropTypes.object.isRequired,
    availableLocales: PropTypes.array.isRequired,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, currentLocation, loggedUser } = this.props;

    dispatch(loadSuggestions(currentLocation));

    if (loggedUser) {
      // Login the user client-side
      dispatch(clientLogin(loggedUser));
      identifyOnMixpanel(loggedUser);
      // Get a new Facebook token if it expired
      if (FacebookUtils.didTokenExpire(loggedUser)) {
        FacebookUtils.getLoginStatus(response => {
          if (response.status === 'connected') {
            dispatch(updateLinkedAccount({
              account: 'facebook',
              facebook_access_token: response.authResponse.accessToken,
            }));
            return;
          }
          dispatch(logout()).then(window.location.reload());
        });
      }
    }
    trackWithMixpanel('app_open', { signed_user: !!loggedUser });
  }

  componentWillUpdate(nextProps) {
    const { dispatch, currentLocation, loggedUser } = this.props;

    // Update suggestions if location change

    if (!isEqual(currentLocation, nextProps.currentLocation)) {
      dispatch(loadSuggestions(nextProps.currentLocation));
    }
    if (!nextProps.loggedUser && loggedUser) {
      // Fetch application data again when logged user changed (e.g. has been logged out)
      fetchData(dispatch, { session: { user: undefined } });
    }
    if (!loggedUser && nextProps.loggedUser) {
      identifyOnMixpanel(nextProps.loggedUser);
    }
  }

  render() {
    const { children, error, ...props } = this.props;
    let className = 'Application';

    let applicationLayout = {
      stickyHeader: !error || error.statusCode === 404,
      showHeader: true,
      fullHeight: false,
      showFooter: !!error,
      responsiveLayout: {},
    };

    let responsiveLayoutProps = {};

    if (props.routes) {
      const lastRoute = props.routes[props.routes.length - 1];
      if (lastRoute.getApplicationLayout) {
        applicationLayout = {
          ...applicationLayout,
          ...lastRoute.getApplicationLayout(),
        };
      }
      if (lastRoute.getResponsiveLayout) {
        responsiveLayoutProps = {
          ...responsiveLayoutProps,
          ...lastRoute.getResponsiveLayout(),
        };
      }
    }

    if (applicationLayout.fullHeight) {
      className += ' fullHeight';
    } else {
      if (applicationLayout.showHeader && applicationLayout.stickyHeader) {
        className += ' stickyHeader';
      }
    }
    if (applicationLayout.className) {
      className += ` ${applicationLayout.className}`;
    }

    let { currentLocale } = this.props;
    if (currentLocale === 'ar') {
      // Make sure we use latin numbers in arabic
      currentLocale = 'ar-u-nu-latn';
    }

    let content;

    if (!error) {
      content = React.cloneElement(children, props);
    } else {
      content = (error.statusCode === 404 ?
        <NotFound /> :
        <ServerError error={ error } />
      );
    }

    const url = `${config.siteUrl}${props.currentUrl}`.replace(/\/$/, '');

    const meta = [

      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' },
      { name: 'keywords', content: 'shoutit' },

      { property: 'fb:app_id', content: config.facebookId },

      { property: 'og:url', content: url },
      { property: 'og:locale', content: this.props.currentLocale },
      { property: 'og:site_name', content: 'Shoutit' },
      { property: 'og:type', content: 'website' },

      { name: 'twitter:site', content: '@Shoutitcom' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:app:name:iphone', content: config.iosAppName },
      { name: 'twitter:app:name:ipad', content: config.iosAppName },
      { name: 'twitter:app:name:googleplay', content: 'Shoutit' },
      { name: 'twitter:app:id:iphone', content: config.iosAppId },
      { name: 'twitter:app:id:ipad', content: config.iosAppId },
      { name: 'twitter:app:id:googleplay', content: config.androidPackage },

      { property: 'al:ios:app_store_id', content: config.iosAppId },
      { property: 'al:ios:app_name', content: config.iosAppName },
      { property: 'al:android:package', content: config.androidPackage },
      { property: 'al:android:app_name', content: config.androidAppName },
      { property: 'al:web:url', content: url },
      { property: 'al:web:should_fallback', content: 'true' },
    ];

    const link = [
      { rel: 'canonical', href: url },
      { rel: 'shortcut icon', href: `${config.publicUrl}/images/favicons/favicon.ico` },
      { rel: 'apple-touch-icon', sizes: '256x256', href: `${config.publicUrl}/images/favicons/apple-touch-icon.png` },
    ];

    this.props.availableLocales.forEach(locale => {
      if (locale !== this.props.currentLocale) {
        link.push({
          rel: 'alternate',
          href: `${url}?hl=${locale}`,
          hrefLang: locale,
        });
        meta.push({
          property: 'og:locale:alternate',
          content: locale,
        });
      }
    });

    const htmlAttributes = {
      lang: this.props.currentLocale,
      dir: props.rtl ? 'rtl' : 'ltr',
    };

    return (
      <IntlProvider locale={ currentLocale } messages={ this.props.messages }>
        <div className={ className }>
          <Helmet htmlAttributes={ htmlAttributes } meta={ meta } link={ link } />
          <Device type="smartphone,tablet" operatingSystem="ios,android">
            <OpenInApp />
          </Device>
          <div className="Application-top">
            { applicationLayout.showHeader &&
              <div className="Application-header">
                <ResponsiveLayout { ...responsiveLayoutProps }>
                  <Header />
                </ResponsiveLayout>
              </div>
            }
            <div className="Application-content">
              <ResponsiveLayout
                { ...responsiveLayoutProps }
                fullHeight={ applicationLayout.fullHeight }
                >
                { content }
              </ResponsiveLayout>
            </div>
          </div>
          { applicationLayout.showFooter &&
            <div className="Application-bottom">
              <ResponsiveLayout { ...responsiveLayoutProps }>
                <Footer />
              </ResponsiveLayout>
            </div>
          }
          <ModalHost />
          <ConversationsHost />

        </div>
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => ({
  currentLocation: getCurrentLocation(state),
  currentUrl: getCurrentUrl(state),
  error: getRoutingError(state),
  currentLocale: getCurrentLocale(state),
  loggedUser: getLoggedUser(state),
  messages: getIntlMessages(state),
  rtl: isRtl(state),
  availableLocales: getAvailableLocales(state),
});

const Wrapped = connect(mapStateToProps)(Application);

Wrapped.fetchData = Application.fetchData;

export default Wrapped;
