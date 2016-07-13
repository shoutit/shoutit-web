import React from 'react';
import { Route, Redirect } from 'react-router';

import Application from './containers/Application';

import AccountSettings from './containers/AccountSettings';
import ProfileSettings from './containers/ProfileSettings';

import Chat from './containers/Chat';
import Dashboard from './containers/Dashboard';
import Discover from './containers/Discover';
import Heartbeat from './containers/Heartbeat';
import Homepage from './pages/home';
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

const settingsAppLayout = () => ({
  showFooter: true, stickyHeader: false,
});

const routes = (store) =>
  <Route component={ Application }>
    <Route path="/"
      getApplicationLayout={ () => ({
        stickyHeader: !!store.getState().session.user,
        showFooter: true,
        showHeader: false,
      }) }
      getResponsiveLayout={ () => ({
        constrainMaxWidth: false,
        horizontalSpace: false,
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

    <Route
      path="/search(/:country)(/:state)(/:city)"
      component={ Search }
      getApplicationLayout={ () => ({
        showFooter: true,
      }) }
      getResponsiveLayout={ () => ({ constrainMaxWidth: false }) }
    />
    <Route path="/shout/:id(/:city)(/:description)" component={ Shout } getApplicationLayout={ () => ({ showFooter: true }) } />
    <Route path="/interest/:name" component={ Interest } />
    <Route path="/user/:username(/:shout_type)" component={ Profile } getApplicationLayout={ () => ({ showFooter: true }) } />
    <Route path="/heartbeat" component={ Heartbeat } getApplicationLayout={ () => ({ showFooter: true }) } />
    <Route path="/discover/:country(/:id)" component={ Discover } />
    <Route path="/messages(/:conversationId)" component={ Chat } />
    <Redirect from="/settings" to="/settings/profile" />
    <Route path="/settings/profile" component={ ProfileSettings } getApplicationLayout={ settingsAppLayout } />
    <Route path="/settings/account" component={ AccountSettings } getApplicationLayout={ settingsAppLayout } />
    <Route path="*" component={ NotFound } getApplicationLayout={ () => ({ showFooter: true }) } />
  </Route>;

export default routes;
