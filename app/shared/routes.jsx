import {Route, DefaultRoute, NotFoundRoute, RedirectRoute} from 'react-router';
import React from 'react';

import Root from './components/root.jsx';
import Login from './components/login/login.jsx';
import Signup from './components/login/signup.jsx';
import VerifyEmail from './components/user/verifyEmail.jsx';
import App from './components/app.jsx';
import Reduced from './components/reduced/reduced.jsx';

import Feed from './components/feed/feed.jsx';
import FeedListContainer from './components/feed/feedListContainer.jsx';
import Static from './components/helper/static.jsx';
import NotFound from './components/misc/notfound.jsx';
import Shout from './components/shout/shoutDetail.jsx';
import Profile from './components/profile/profile.jsx';
import Search from './components/search/search.jsx';
import SearchShouts from './components/search/searchShouts.jsx';
import SearchUsers from './components/search/searchUsers.jsx';
import SearchTags from './components/search/searchTags.jsx';
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
import MessageList from './components/chat/message/list.jsx';
import EmptyMessageList from './components/chat/message/empty.jsx';
import Discover from './components/featuredTags/discover.jsx';

let All = new FeedListContainer("all"),
	Offers = new FeedListContainer("offer"),
	Requests = new FeedListContainer("request");
export default function (envData) {
	return (
		<Route name="root" path="/" handler={Root}>
			<Route name="app" path="/" handler={App}>
				<Route name="feed" path="/" handler={Feed}>
					<Route name="all" path="/all/?:country?/?:state?/?:city?/?:page?" handler={All}/>
					<Route name="offers" path="/offers/?:country?/?:state?/?:city?/?:page?" handler={Offers}/>
					<Route name="requests" path="/requests/?:country?/?:state?/?:city?/?:page?" handler={Requests}/>
					<DefaultRoute name="default" handler={All}/>
				</Route>
				<Route name="user" path="/user/:username" handler={Profile}>
					<Route name="listeners" handler={ProfileListeners}/>
					<Route name="listening" handler={ProfileListening}/>
					<Route name="listeningTags" handler={ProfileListeningTags}/>
					<Route name="useroffers" path="offers" handler={ProfileOffers}/>
					<Route name="userrequests" path="requests" handler={ProfileRequests}/>
					<DefaultRoute name="settings" handler={ProfileSettings}/>
				</Route>
				<Route name="shout" path="/shout/:shoutId/?:location?/?:title?" handler={Shout}/>
				<Route name="discover" path="/discover/?:country?/?:state?/?:city?/?:page?" handler={Discover}/>
				<Route name="tag" path="/tag/:tagName" handler={TagProfile}>
					<Route name="tagrequests" handler={TagProfileRequest}/>
					<Route name="taglisteners" handler={TagProfileListeners}/>
					<DefaultRoute name="tagoffers" handler={TagProfileOffers}/>
				</Route>
				<Route name="chat" path="/chat" handler={new Chat(envData)}>
					<Route name="messages" path=":chatId" handler={MessageList}/>
					<DefaultRoute handler={EmptyMessageList}/>
				</Route>
				<Route name="search" path="/search/:shouttype/:category/?:term?" handler={Search}>
					<Route name="searchUsers" path="users" handler={SearchUsers}/>
					<Route name="searchTags" path="tags" handler={SearchTags}/>
					<DefaultRoute name="searchShouts" handler={SearchShouts}/>
				</Route>
			</Route>
			<Route name="static" path="/" handler={Reduced}>
				<Route name="tos" handler={Static}/>
				<Route name="rules" handler={Static}/>
				<Route name="policy" handler={Static}/>
			</Route>
			<Route name="login" handler={Login}/>
			<Route name="signup" handler={Signup}/>
			<Route name="verifyEmail" path="/auth/verify_email" handler={VerifyEmail}/>
			<NotFoundRoute handler={NotFound}/>
		</Route>
	);
}
