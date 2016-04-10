import React from 'react';
import { Route } from 'react-router';

import Application from './containers/Application';
import Chat from './containers/Chat';
import Conversation from './containers/Conversation';
import Dashboard from './containers/Dashboard';
import Discover from './containers/Discover';
import Homepage from './containers/Homepage';
import Search from './containers/Search';
import Profile from './containers/Profile';
import Login from './containers/Login';
import ResetPassword from './containers/ResetPassword';
import SetPassword from './containers/SetPassword';
import Signup from './containers/Signup';
import VerifyEmail from './containers/VerifyEmail';
import Interest from './containers/Interest';
import Shout from './containers/Shout';
import Heartbeat from './containers/Heartbeat';

const routes = (store) =>
  <Route component={ Application }>
    <Route path="/"
      getComponent={ (location, callback) => {
        const Component = store.getState().session.user ? Dashboard : Homepage;
        callback(null, Component);
        return Component;
      }}
    />
    <Route path="/login" component={ Login } getApplicationLayout={ () => ({ className: 'pattern-background' }) } />
    <Route path="/login/password" component={ ResetPassword } getApplicationLayout={ () => ({ className: 'pattern-background' }) } />
    <Route path="/login/password/:resetToken" component={ SetPassword } getApplicationLayout={ () => ({ className: 'pattern-background' }) } />
    <Route path="/signup" component={ Signup } getApplicationLayout={ () => ({ className: 'pattern-background' }) } />
    <Route path="/signup/verify/:token" component={ VerifyEmail } getApplicationLayout={ () => ({ className: 'pattern-background' }) } />

    <Route path="/search(/:shout_type)(/:category)" component={ Search } />
    <Route path="/shout(/:shoutId)" component={ Shout } />
    <Route path="/interest(/:tagName)" component={ Interest } />
    <Route path="/user(/:username)" component={ Profile } />
    <Route path="/heartbeat" component={ Heartbeat } />
    <Route path="/discover(/:countryName)(/:id)" component={ Discover } />

    <Route path="/messages" component={ Chat }>
      <Route path="/messages/:id" component={ Conversation } />
    </Route>
  </Route>;

export default routes;
