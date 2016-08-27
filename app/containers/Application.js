/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import isEqual from 'lodash/isEqual';

import { getCurrentLanguage, getIntlMessages } from '../reducers/i18n';

import { getCurrentUrl, getRoutingError } from '../reducers/routing';
import { getCurrentLocation } from '../reducers/currentLocation';

import ApplicationHelmet from '../utils/ApplicationHelmet';
import { identifyOnMixpanel, trackWithMixpanel } from '../utils/mixpanel';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import ResponsiveLayout from '../layout/ResponsiveLayout';

import { ModalHost } from '../modals';
import ConversationsHost from '../chat/ConversationsHost';
import ServerError from './ServerError';
import NotFound from './NotFound';

import { loadCategories, loadCurrencies, loadSortTypes } from '../actions/misc';
import { loadSuggestions } from '../actions/suggestions';
import { loadListeningProfiles } from '../actions/users';
import { clientLogin, updateLinkedAccount, logout } from '../actions/session';

import { getLoggedUser } from '../reducers/session';

import Device from '../utils/Device';
import OpenInApp from '../widgets/OpenInApp';

import * as FacebookUtils from '../utils/FacebookUtils';

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
    currentUrl: PropTypes.string.isRequired,
    currentLanguage: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, currentLocation, loggedUser } = this.props;

    dispatch(loadSuggestions({
      query: {
        country: currentLocation.country,
      },
    }));

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
      dispatch(loadSuggestions({
        query: {
          country: nextProps.currentLocation.country,
        },
      }));
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
    } else if (applicationLayout.showHeader && applicationLayout.stickyHeader) {
      className += ' stickyHeader';
    }
    if (applicationLayout.className) {
      className += ` ${applicationLayout.className}`;
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

    let intlLocale = this.props.currentLanguage;
    if (intlLocale === 'ar') {
      // Make sure we use latin numbers in arabic
      intlLocale = 'ar-u-nu-latn';
    }

    return (
      <IntlProvider locale={ intlLocale } messages={ this.props.messages }>
        <div className={ className }>
          <ApplicationHelmet />
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
  loggedUser: getLoggedUser(state),
  error: getRoutingError(state),
  messages: getIntlMessages(state),
  currentLanguage: getCurrentLanguage(state),
});

const Wrapped = connect(mapStateToProps)(Application);

Wrapped.fetchData = Application.fetchData;

export default Wrapped;
