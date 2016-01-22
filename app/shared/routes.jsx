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
import ProfileHome from './components/profile/profileHome.jsx';
import Profile from './components/profile/profile.jsx';
import Page from './components/profile/page/pageProfile.jsx';
import Search from './components/search/search.jsx';
import TagProfile from './components/tag/tagProfile.jsx';
import TagProfileShouts from './components/tag/tagProfileShouts.jsx';
import TagProfileOffers from './components/tag/tagProfileOffers.jsx';
import TagProfileRequest from './components/tag/tagProfileRequests.jsx';
import TagProfileListeners from './components/tag/tagProfileListeners.jsx';
import Chat from './components/chat/Chat.jsx';
import Conversation from './components/chat/Conversation.jsx';
import DiscoverHome from './components/discover/discoverHome.jsx';
import Discover from './components/discover/discover.jsx';
import DiscoverPage from './components/discover/discoverPage.jsx';

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
						<Route path="/tag/:tagName" component={TagProfile}>
							<Route path="tagrequests" component={TagProfileRequest}/>
							<Route path="taglisteners" component={TagProfileListeners}/>
							<IndexRoute component={TagProfileShouts}/>
						</Route>
						<Route path="/search/:shouttype/:category(/:term)" component={Search}>
							<IndexRoute component={Search}/>
						</Route>
						<IndexRoute component={All}/>
					</Route>
					<Route path="/user/:username" component={ProfileHome} >
						<Route path="/page/:username" component={Page} />
						<IndexRoute component={Profile}/>
					</Route>
					<Route path="/discover/:country" component={DiscoverHome}>
						<Route path="/discover/:country/:pk" component={DiscoverPage} />
						<IndexRoute component={Discover} />
					</Route>
				</Route>
				<Route path="/chat" component={ Chat }>
					<Route path="/chat/:id" component={ Conversation } />
				</Route>
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
