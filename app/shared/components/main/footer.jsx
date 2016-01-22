import React from 'react';
import {Link} from 'react-router';
import {Link as ScrollLink} from 'react-scroll';
import {ANDROID_LINK, IOS_LINK} from '../../consts/defaults';

export default React.createClass({
    displayName: 'footer',

    render() {
        return (
            <div className="mainpage-footer si-container">
                <div className="logo-section clear grid-4">
                    <div className="icon res1x-footer_logo"></div>
                    <span className="copyright">Copyright © 2015 Shoutit All rights reserved.</span>
                </div>
                <div className="links-section grid-2">
                    <h3>Explore</h3>
                    <Link to="policy">Shouts</Link>
                    <Link to="policy">Tags</Link>
                    <Link to="policy">Users</Link>
                </div>
                <div className="links-section grid-2">
                    <h3>About</h3>
                    <Link to="policy">The Company</Link>
                    <Link to="policy">History</Link>
                    <Link to="policy">Vision</Link>
                </div>
                <div className="links-section grid-2">
                    <h3>Follow Us</h3>
                    <Link to="policy">Facebook</Link>
                    <Link to="policy">Google+</Link>
                    <Link to="policy">Twitter</Link>
                </div>
                <div className="links-section grid-2">
                    <h3>Contact</h3>
                    <Link to="policy">Basic Info</Link>
                    <Link to="policy">Map</Link>
                    <Link to="policy">Contact Form</Link>
                    <ScrollLink to="nav" className="btn-explore" spy={true} smooth={true}
                                offset={-100} duration={500} >Go to top</ScrollLink>
                </div>
                <div className="links-section grid-3">
                    <h3>Mobile</h3>
                    <a href={ANDROID_LINK} target="_blank">
                        <div className="icon res1x-app-store-small"></div>
                    </a>
                    <a href={IOS_LINK} target="_blank">
                        <div className="icon res1x-google-play-small"></div>
                    </a>
                </div>
            </div>
        );
    }
})
