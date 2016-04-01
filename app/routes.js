import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Application from './containers/Application';
import Chat from './containers/Chat';
import Conversation from './containers/Conversation';
import Dashboard from './containers/Dashboard';
import Discover from './containers/Discover';
import Homepage from './containers/Homepage';
import Search from './containers/Search';
import User from './containers/User';
import Interest from './containers/Interest';
import Shout from './containers/Shout';

// import MainPage from './shared/components/main/mainPage.jsx';
import NotFound from './shared/components/misc/notfound.jsx';
// import Discover from './shared/components/discover/discover.jsx';
// import DiscoverHome from './shared/components/discover/discoverHome.jsx';
// import DiscoverPage from './shared/components/discover/discoverPage.jsx';
// import FeedListContainer from './shared/components/feed/feedListContainer.jsx';

// import Page from './shared/components/profile/page/pageProfile.jsx';
// import Profile from './shared/components/profile/profile.jsx';
// import ProfileContainer from './shared/components/profile/profileContainer.jsx';
// import SearchContainer from './search/searchContainer.jsx';
// // import Search from './search/search.jsx';
// import ShoutContainer from './shared/components/shout/shoutContainer.jsx';
// import Shout from './shared/components/shout/shoutDetail.jsx';
// import TagProfileContainer from './shared/components/tag/tagProfileContainer.jsx';
// import TagProfile from './shared/components/tag/tagProfile.jsx';
// import TagProfileListeners from './shared/components/tag/tagProfileListeners.jsx';
// import TagProfileRequest from './shared/components/tag/tagProfileRequests.jsx';
// import TagProfileShouts from './shared/components/tag/tagProfileShouts.jsx';
import VerifyEmail from './shared/components/user/verifyEmail.jsx';

import ModalHost from './shared/components/helper/ModalHost';

const routes = (store) =>
  <Route component={ Application }>
      <Route component={ ModalHost }>

        <Route path="/"
          getComponent={ (location, callback) => {
            const Component = store.getState().session.user ? Dashboard : Homepage;
            callback(null, Component);
            return Component;
          }}
        />
        {/*<Route path="/login" component={ MainPage } />
        <Route path="/login/password" component={ MainPage } />
        <Route path="/signup" component={ MainPage } />*/}
        <Route path="/search(/:shoutType)(/:category)" component={ Search } />
        <Route path="/shout(/:shoutId)" component={ Shout } />
        <Route path="/interest(/:tagName)" component={ Interest } />
        <Route path="/user(/:username)" component={ User } />
        <Route path="/discover" component={ Discover } />

        {/* <Route path="/home" component={ HomePage }>
          <Route path="/all/:country/:state/:city(/:page)"
            component={ new FeedListContainer('all') } />
          <Route path="/offers/:country/:state/:city(/:page)"
            component={ new FeedListContainer('offer') } />
          <Route path="/requests/:country/:state/:city(/:page)"
            component={ new FeedListContainer('request')} />
          <IndexRoute component={ new FeedListContainer('all') } />
        </Route>*/}
        {/*<Route path="/search" component={ SearchContainer} >
          <Route path="/search(/:shouttype)/:category(/:term)" component={ Search } />
        </Route>*/}
        {/*<Route component={ ShoutContainer } >
          <Route path="/shout/:shoutId(/:location)(/:title)" component={ Shout } />
        </Route>
        <Route component={ TagProfileContainer }>
          <Route path="/interest/:tagName(/:countryCode)" component={ TagProfile }>
            <Route path="tagrequests" component={ TagProfileRequest } />
            <Route path="taglisteners" component={ TagProfileListeners } />
            <IndexRoute component={ TagProfileShouts } />
          </Route>
        </Route>
        <Route path="/user/:username" component={ ProfileContainer} >
          <Route path="/page/:username" component={ Page} />
          <IndexRoute component={ Profile } />
        </Route>
        <Route path="/discover(/:country)" component={ DiscoverHome }>
          <Route path="/discover/:country/:pk" component={ DiscoverPage} />
          <IndexRoute component={ Discover} />
        </Route>*/}
        <Route path="/messages" component={ Chat }>
          <Route path="/messages/:id" component={ Conversation } />
        </Route>
        <Route path="/auth/verify_email" component={ VerifyEmail } />
        <Route path="*" component={ NotFound } />
      </Route>
  </Route>;

export default routes;
