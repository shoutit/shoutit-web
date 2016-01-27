import React from 'react';
import {Link, History} from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import DocumentTitle from 'react-document-title';
import {Link as ScrollLink, Element, Button} from 'react-scroll';
import SearchBar from '../header/searchBar.jsx';
import {Icon, Grid, Column} from '../helper';
import Explore from './explore.jsx';
import Footer from './footer.jsx';
import {ANDROID_LINK, IOS_LINK} from '../../consts/defaults';

import { imagesPath } from "../../../../config";

if (process.env.BROWSER) {
    require("styles/pages/mainpage.scss");
}

export default React.createClass({
    displayName: "MainPage",
    mixins: [new StoreWatchMixin("users"), History],

    getStateFromFlux() {
        let flux = this.props.flux;

        return {
            users: flux.store("users").getState(),
            locations: flux.store("locations").getState(),
            categories: flux.store('shouts').getState().categories
        };
    },

    componentWillMount() {
        if(this.state.users.user) {
            this.history.replaceState(null, '/home');
        }
    },

    render() {
        return (
            <DocumentTitle title="ShoutIt - Find The Best Deals You Can Have!">
                <Column className="mainpage">
                    <Grid>
                        <Element name="nav" className="mainpage-nav">
                            <Column clear={true} size="8" className="nav-left">
                                <Link to="/"><Icon name="logo" /></Link>
                            </Column>
                            <Column size="7" className="nav-right">
                                <Link to="/login"><span className="btn-login">Login</span></Link>
                                <Link to="/signup"><span className="btn-d">Signup</span></Link>
                                <span className="btn-d">About</span>
                            </Column>
                        </Element>
                    </Grid>
                    <Grid className="mainpage-cover" style={{backgroundImage: `url(${imagesPath}/m_cover.png)`}}>
                        <Grid fluid={true} className="mainpage-cover-opacity">
                            <Grid fluid={true} className="hero">
                                <Column size="7" offset="2">

                                    <h1>Everything Much Cheaper!</h1>
                                    <p>
                                        Lorem ipsum dolor sit amet, quo ad adhuc debet munere. Harum congue ne his, suas viris constituam ne cum, sonet mandamus at his.
                                    </p>
                                    <ScrollLink to="explore" className="btn-explore" smooth={true}
                                            offset={0} duration={800} >Explore</ScrollLink>

                                    <ScrollLink to="how" className="btn-how" smooth={true}
                                            offset={-20} duration={1000} >How It Works</ScrollLink>
                                </Column>
                                <Column size="3" offset="1">
                                    <a href={IOS_LINK} target="_blank"><Icon name="app_store" /></a>
                                    <a href={ANDROID_LINK} target="_blank"><Icon name="google_play" /></a>
                                </Column>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid className="mainpage-search">
                        <Column size="9" offset="3" >
                            <SearchBar height="45" flux={this.props.flux}/>
                        </Column>
                    </Grid>

                    <Grid>
                        <Element name="explore" className="mainpage-explore">
                            <Explore categories={this.state.categories} />
                        </Element>
                    </Grid>

                    <Grid>
                        <Element name="how" className="mainpage-how">
                            <h2>How It Works</h2>
                        </Element>
                    </Grid>

                    <Footer />
                    {this.props.children}

                </Column>
            </DocumentTitle>
        );
    }
});
