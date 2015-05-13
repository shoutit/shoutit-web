import {Route, DefaultRoute, NotFoundRoute} from 'react-router';
import React from 'react';

import Root from './components/root.jsx';
import Login from './components/login/login.jsx';
import App from './components/app.jsx';
import Reduced from './components/reduced/reduced.jsx';

import Home from './components/home/home.jsx';
import Simple from './components/misc/simple.jsx';
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
import ProfileOffers from './components/profile/profileOffers.jsx';
import ProfileRequests from './components/profile/profileRequests.jsx';
import TagProfile from './components/tag/tagProfile.jsx';
import TagProfileOffers from './components/tag/tagProfileOffers.jsx';
import TagProfileRequest from './components/tag/tagProfileRequests.jsx';
import TagProfileListeners from './components/tag/tagProfileListeners.jsx';

let Feed = new Home("all"),
	Offers = new Home("offer"),
	Requests = new Home("request");

module.exports = (
	<Route name="root" path="/" handler={Root}>
		<Route name="app" path="/" handler={App}>
			<Route name="feed" path="/feed/?:city?" handler={Feed}/>
			<Route name="offers" path="/offers/?:city?" handler={Offers}/>
			<Route name="requests" path="/requests/?:city?" handler={Requests}/>
			<Route name="user" path="/user/:username" handler={Profile}>
				<Route name="listeners" handler={ProfileListeners}/>
				<Route name="listening" handler={ProfileListening}/>
				<Route name="useroffers" path="offers" handler={ProfileOffers}/>
				<Route name="userrequests" path="requests" handler={ProfileRequests}/>
				<DefaultRoute name="settings" handler={ProfileSettings}/>
			</Route>
			<Route name="shout" path="/shout/:shoutId/?:location?/?:title?" handler={Shout}/>
			<Route name="tag" path="/tag/:tagName" handler={TagProfile}>
				<Route name="tagrequests" handler={TagProfileRequest}/>
				<Route name="taglisteners" handler={TagProfileListeners}/>
				<DefaultRoute name="tagoffers" handler={TagProfileOffers}/>
			</Route>
			<Route name="message" path="/message/:msgId" handler={Simple}/>
			<Route name="search" path="/search/:term" handler={Search}>
				<Route name="searchUsers" path="users" handler={SearchUsers}/>
				<Route name="searchTags" path="tags" handler={SearchTags}/>
				<DefaultRoute name="searchShouts" handler={SearchShouts}/>
			</Route>
			<DefaultRoute name="home" handler={Feed}/>
		</Route>
		<Route name="static" path="/" handler={Reduced}>
			<Route name="tos" handler={Static}/>
			<Route name="rules" handler={Static}/>
			<Route name="policy" handler={Static}/>
		</Route>
		<Route name="login" handler={Login}/>
		<NotFoundRoute handler={NotFound}/>
	</Route>
);

