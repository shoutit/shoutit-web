import {Route, IndexRoute} from 'react-router';
import React from 'react';

import Root from './components/root.jsx';
import Login from './components/login/login.jsx';
import Signup from './components/login/signup.jsx';
import VerifyEmail from './components/user/verifyEmail.jsx';
import App from './components/app.jsx';
import Reduced from './components/reduced/reduced.jsx';

import MainPage from './components/main/mainPage.jsx';
import HomePage from './components/feed/home.jsx';
import FeedListContainer from './components/feed/feedListContainer.jsx';
import Static from './components/helper/static.jsx';
import NotFound from './components/misc/notfound.jsx';
import Shout from './components/shout/shoutDetail.jsx';
import Profile from './components/profile/profile.jsx';
import Search from './components/search/search.jsx';
import ProfileSettings from './components/profile/profileSettings.jsx';
import ProfileListeners from './components/profile/profileListeners.jsx';
import ProfileListening from './components/profile/profileListening.jsx';
import ProfileListeningTags from './components/profile/profileListeningTags.jsx';
import ProfileOffers from './components/profile/profileOffers.jsx';
import ProfileRequests from './components/profile/profileRequests.jsx';
import TagProfile from './components/tag/tagProfile.jsx';
import TagProfileOffers from './components/tag/tagProfileOffers.jsx';
import TagProfileRequest from './components/tag/tagProfileRequests.jsx';
import TagProfileListeners from './components/tag/tagProfileListeners.jsx';
import Chat from './components/chat/chat.jsx';
import Messages from './components/chat/message/Messages.jsx';
import MessagesIndex from './components/chat/message/MessagesIndex.jsx';
import Discover from './components/featuredTags/discover.jsx';

let All = new FeedListContainer("all"),
	Offers = new FeedListContainer("offer"),
	Requests = new FeedListContainer("request");


export default function (envData) {
	return (
			<Route component={Root}>
				<Route component={App}>
					<Route path="/" component={MainPage}>
						<Route path="login" component={Login}/>
						<Route path="signup" component={Signup}/>
					</Route>
					<Route path="/home" component={HomePage}>
						<Route path="/all/:country/:state/:city(/:page)" component={All}/>
						<Route path="/offers/:country/:state/:city(/:page)" component={Offers}/>
						<Route path="/requests/:country/:state/:city(/:page)" component={Requests}/>
						<Route path="/shout/:shoutId(/:location)(/:title)" component={Shout}/>
						<Route path="/user/:username" component={Profile}>
							<Route path="listeners" component={ProfileListeners}/>
							<Route path="listening" component={ProfileListening}/>
							<Route path="listeningTags" component={ProfileListeningTags}/>
							<Route path="offers" component={ProfileOffers}/>
							<Route path="requests" component={ProfileRequests}/>
							<IndexRoute component={ProfileSettings}/>
						</Route>

						<Route path="/discover(/:country)(/:state)(/:city)(/:page)" component={Discover}/>
						<Route path="/tag/:tagName" component={TagProfile}>
							<Route path="tagrequests" component={TagProfileRequest}/>
							<Route path="taglisteners" component={TagProfileListeners}/>
							<IndexRoute component={TagProfileOffers}/>
						</Route>
						<Route path="/search/:shouttype/:category(/:term)" component={Search}>
							<IndexRoute component={Search}/>
						</Route>
						<IndexRoute component={All}/>
					</Route>
				</Route>
				<Route path="/chat(/:conversationId)" component={ Chat } />

				<Route path="static" component={Reduced}>
					<Route path="/tos" component={Static}/>
					<Route path="/rules" component={Static}/>
					<Route path="/policy" component={Static}/>
				</Route>

				<Route path="/auth/verify_email" component={VerifyEmail}/>
				<Route path="*" component={NotFound}/>
			</Route>
	);
}
