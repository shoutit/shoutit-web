import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { IntlProvider, FormattedDate } from 'react-intl';

import Helmet from '../utils/Helmet';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
// import UINotificationsHost from '../ui/UINotificationsHost';
import ModalHost from '../ui/ModalHost';
// import VideoCallHost from '../videoCalls/VideoCallHost';
import ConversationsHost from '../chat/ConversationsHost';
import ServerError from './ServerError';
import NotFound from './NotFound';

import { loadCategories, loadCurrencies } from '../actions/misc';
import { loadSuggestions } from '../actions/location';
import { loadListening } from '../actions/users';
import { loginUser } from '../actions/session';

import { getLoggedUser } from '../selectors';

import * as config from '../config';

if (process.env.BROWSER) {
  require('./Application.scss');
}

const fetchData = (dispatch, state) => {
  const promises = [];
  promises.push(dispatch(loadCategories()));
  promises.push(dispatch(loadCurrencies()));
  const loggedUser = getLoggedUser(state); // logged user comes from rehydrated state
  if (loggedUser) {
    promises.push(dispatch(loadListening(loggedUser)));
  }
  return Promise.all(promises);
};

export class Application extends React.Component {

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, currentLocation, loggedUser } = this.props;
    dispatch(loadSuggestions(currentLocation));
    if (loggedUser) {
      dispatch(loginUser(loggedUser));
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, currentLocation, loggedUser } = this.props;

    // Update suggestions if location change

    if (currentLocation.slug !== nextProps.currentLocation.slug) {
      dispatch(loadSuggestions(nextProps.currentLocation));
    }
    if (!nextProps.loggedUser && loggedUser) {
      // Fetch application data again when logged user changed (e.g. has been logged out)
      fetchData(dispatch, { session: { user: undefined } });
    }
  }

  render() {
    const { children, error, ...props } = this.props;
    let className = 'App';

    let layout = {
      stickyHeader: !error || error.statusCode === 404,
      showHeader: true,
      showFooter: !!error,
    };

    if (props.routes) {
      const lastRoute = props.routes[props.routes.length - 1];
      if (lastRoute.getApplicationLayout) {
        layout = {
          ...layout,
          ...lastRoute.getApplicationLayout(),
        };
      }
    }

    if (layout.showHeader && layout.stickyHeader) {
      className += ' stickyHeader';
    }
    if (layout.className) {
      className += ` ${layout.className}`;
    }


    return (
      <IntlProvider locale={ this.props.locale }>
      <IntlProvider locale={ this.props.locale } messages={ this.props.messages }>
        <div className={ className }>
          <FormattedDate
            value={ new Date(1459913574887) }
            year="numeric"
            month="long"
            day="numeric"
            weekday="long"
          />
          <Helmet
            htmlAttributes={ { lang: props.locale, dir: props.locale === 'ar' ? 'rtl' : 'ltr' } }
            meta={ [
              { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=yes' },
              { name: 'keywords', content: 'shoutit' },
              { property: 'fb:app_id', content: config.facebookId },
              { property: 'og:url', content: `${config.siteUrl}${props.currentUrl}` },
              { property: 'og:locale', content: 'en_US' },
              { property: 'og:site_name', content: 'Shoutit' },
              { property: 'og:type', content: 'website' },
              { name: 'twitter:site', content: '@Shoutitcom' },
              { name: 'twitter:card', content: 'summary' },
              { name: 'twitter:app:name:iphone', content: 'Shoutit' },
              { name: 'twitter:app:name:ipad', content: 'Shoutit' },
              { name: 'twitter:app:name:googleplay', content: 'Shoutit' },
              { name: 'twitter:app:id:iphone', content: '947017118' },
              { name: 'twitter:app:id:ipad', content: '947017118' },
              { name: 'twitter:app:id:googleplay', content: 'com.shoutit.app.android' },
            ] }
            link={ [
              { rel: 'shortcut icon', href: `${config.publicUrl}/images/favicons/favicon.ico` },
              { rel: 'apple-touch-icon', sizes: '256x256', href: `${config.publicUrl}/images/favicons/apple-touch-icon.png` },
            ] }
          />
          { layout.showHeader &&
            <div className="App-header">
              <Header
                history={ props.history }
                flux={ props.flux }
                chat={ props.chat }
                conversations={ props.conversations }
                location={ props.location }
              />
            </div>
          }
          <div className="App-content">
            { !error ? // eslint-disable-line
              React.cloneElement(children, props) :
              (error.statusCode === 404 ?
                <NotFound /> :
                <ServerError error={ error } />)
            }
          </div>
          { layout.showFooter &&
            <div className="App-footer">
              <Footer />
            </div>
          }
          <ModalHost />
          { /* <UINotificationsHost />*/ }
          { /* { props.videoCallState && props.videoCallState.currentConversation &&*/ }
            { /* <VideoCallHost conversation={ props.videoCallState.currentConversation } /> }*/ }
          <ConversationsHost />

        </div>
      </IntlProvider>
    );
  }
}

Application.propTypes = {
  loggedUser: PropTypes.object,
  currentLocation: PropTypes.object,
  error: PropTypes.object,
  children: PropTypes.element.isRequired,
  dispatch: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    loggedUser: getLoggedUser(state),
    currentLocation: state.currentLocation,
    currentUrl: state.routing.currentUrl,
    error: state.routing.error,
    locale: state.i18n.locale,
    messages: state.i18n.messages,
  };
}

export default connect(mapStateToProps)(Application);
