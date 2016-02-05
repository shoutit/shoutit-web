import React from "react";
import { Route, IndexRoute } from "react-router";

import App from "./components/App";
import Chat from "./components/chat/Chat.jsx";
import Conversation from "./components/chat/Conversation.jsx";
import Discover from "./components/discover/discover.jsx";
import DiscoverHome from "./components/discover/discoverHome.jsx";
import DiscoverPage from "./components/discover/discoverPage.jsx";
import FeedListContainer from "./components/feed/feedListContainer.jsx";
import HomePage from "./components/feed/home.jsx";
import Login from "./components/login/login.jsx";
import MainPage from "./components/main/mainPage.jsx";
import NotFound from "./components/misc/notfound.jsx";
import Page from "./components/profile/page/pageProfile.jsx";
import Profile from "./components/profile/profile.jsx";
import ProfileContainer from "./components/profile/profileContainer.jsx";
import Reduced from "./components/reduced/reduced.jsx";
import Search from "./components/search/search.jsx";
import Shout from "./components/shout/shoutDetail.jsx";
import Signup from "./components/login/signup.jsx";
import Static from "./components/helper/static.jsx";
import TagProfile from "./components/tag/tagProfile.jsx";
import TagProfileListeners from "./components/tag/tagProfileListeners.jsx";
import TagProfileRequest from "./components/tag/tagProfileRequests.jsx";
import TagProfileShouts from "./components/tag/tagProfileShouts.jsx";
import VerifyEmail from "./components/user/verifyEmail.jsx";

const routes = (
  <Route component={ App }>
    <Route path="/" component={ MainPage }>
      <Route path="login" component={ Login } xyz={false} />
      <Route path="signup" component={ Signup } />
    </Route>
    <Route path="/home" component={ HomePage }>
      <Route path="/all/:country/:state/:city(/:page)"
        component={ new FeedListContainer("all") } />
      <Route path="/offers/:country/:state/:city(/:page)"
        component={ new FeedListContainer("offer") } />
      <Route path="/requests/:country/:state/:city(/:page)"
        component={ new FeedListContainer("request")} />
      <Route path="/shout/:shoutId(/:location)(/:title)" component={ Shout }/>
      <Route path="/tag/:tagName" component={ TagProfile }>
        <Route path="tagrequests" component={ TagProfileRequest }/>
        <Route path="taglisteners" component={ TagProfileListeners }/>
        <IndexRoute component={ TagProfileShouts }/>
      </Route>
      <Route path="/search/:shouttype/:category(/:term)" component={ Search }>
        <IndexRoute component={ Search }/>
      </Route>
      <IndexRoute component={ new FeedListContainer("all") }/>
    </Route>
    <Route path="/user/:username" component={ ProfileContainer} >
      <Route path="/page/:username" component={ Page} />
      <IndexRoute component={ Profile }/>
    </Route>
    <Route path="/discover/:country" component={ DiscoverHome }>
      <Route path="/discover/:country/:pk" component={ DiscoverPage} />
      <IndexRoute component={ Discover} />
    </Route>
    <Route path="/messages" component={ Chat  }>
      <Route path="/messages/:id" component={ Conversation } />
    </Route>
    <Route path="static" component={ Reduced }>
      <Route path="/tos" component={ Static }/>
      <Route path="/rules" component={ Static }/>
      <Route path="/policy" component={ Static }/>
    </Route>
    <Route path="/auth/verify_email" component={ VerifyEmail }/>
    <Route path="*" component={ NotFound }/>
  </Route>
);

export default routes;
