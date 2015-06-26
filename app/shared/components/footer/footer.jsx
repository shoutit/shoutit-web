import React from 'react';
import {Link} from 'react-router';
import {Grid, Col} from 'react-bootstrap';
import Icon from '../helper/icon.jsx';

export default React.createClass({
	displayName: "Footer",

	render() {
		return (
			<footer>
				<Grid>
					<Col xs={12} md={6} className="foo-left">
						<p>
							<span>Shoutit &copy; 2015</span>
							&nbsp;|&nbsp;
							<Link to="rules">Marketplace Rules</Link>
							&nbsp;|&nbsp;
							<Link to="tos">Terms of Service</Link>
							&nbsp;|&nbsp;
							<Link to="policy">Privacy</Link>
						</p>
					</Col>

					<Col xs={12} md={6} className="foo-center">
						<ul>
							<li>
								<a href="https://play.google.com/store/apps/details?id=com.shoutit.app.android">
									<Icon name="playstore"/>
								</a>
							</li>
							<li>
								<a href="https://itunes.apple.com/us/app/shoutit-app/id947017118?mt=8&uo=6&at=&ct="
								   target="itunes_store">
									<Icon name="appstore"/>
								</a>
							</li>
							<li>
								<a href="https://mixpanel.com/f/partner">
									<img src="https://cdn.mxpnl.com/site_media/images/partner/badge_light.png"
										 alt="Mobile Analytics"/>
								</a>
							</li>
						</ul>
					</Col>
				</Grid>
			</footer>
		);
	}
});
