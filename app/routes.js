import React from 'react';
import { Route } from 'react-router';

import Application from './containers/Application';
import Chat from './containers/Chat';
import Dashboard from './containers/Dashboard';
import Discover from './containers/Discover';
import Heartbeat from './containers/Heartbeat';
import Homepage from './containers/Homepage';
import Interest from './containers/Interest';
import Login from './containers/Login';
import NotFound from './containers/NotFound';
import Profile from './containers/Profile';
import ResetPassword from './containers/ResetPassword';
import Search from './containers/Search';
import SetPassword from './containers/SetPassword';
import Shout from './containers/Shout';
import Signup from './containers/Signup';
import VerifyEmail from './containers/VerifyEmail';

const authAppLayout = () => ({
  className: 'pattern-background',
  showHeader: false,
  showFooter: false,
});

const routes = (store) =>
  <Route component={ Application }>
    <Route path="/"
      getApplicationLayout={ () => ({
        stickyHeader: store.getState().session.user,
        showFooter: true,
      }) }
      getComponent={ (location, callback) => {
        const Component = store.getState().session.user ? Dashboard : Homepage;
        callback(null, Component);
        return Component;
      } }
    />
    <Route path="/login" component={ Login } getApplicationLayout={ authAppLayout } />
    <Route path="/login/password" component={ ResetPassword } getApplicationLayout={ authAppLayout } />
    <Route path="/login/password/:resetToken" component={ SetPassword } getApplicationLayout={ authAppLayout } />
    <Route path="/signup" component={ Signup } getApplicationLayout={ authAppLayout } />
    <Route path="/signup/verify/:token" component={ VerifyEmail } getApplicationLayout={ authAppLayout } />

    <Route path="/search(/:shout_type)(/:category)" component={ Search } />
    <Route path="/shout/:id(/:city)(/:description)" component={ Shout } getApplicationLayout={ () => ({ showFooter: true }) } />
    <Route path="/interest/:name" component={ Interest } />
    <Route path="/user/:username(/:shout_type)" component={ Profile } getApplicationLayout={ () => ({ showFooter: true }) } />
    <Route path="/heartbeat" component={ Heartbeat } getApplicationLayout={ () => ({ showFooter: true }) } />
    <Route path="/discover/:countryName(/:id)" component={ Discover } />
    <Route path="/messages(/:conversationId)" component={ Chat } />
    <Route path="*" component={ NotFound } getApplicationLayout={ () => ({ showFooter: true }) } />
  </Route>;

export default routes;
