import React from 'react';
import {Link, History} from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import {Link as ScrollLink, Element, Button} from 'react-scroll';
import SearchBar from '../header/searchBar.jsx';
import Explore from './explore.jsx';
import Footer from './footer.jsx';
import {ANDROID_LINK, IOS_LINK} from '../../consts/defaults';

import { imagesPath } from "../../../../config";

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
            <div className="mainpage">
                <Element name="nav" className="mainpage-nav si-container">
                    <div className="nav-left clear grid-8">
                        <Link to="/"><div className="res1x-logo"></div></Link>
                    </div>
                    <div className="nav-right grid-7">
                        <Link to="/login"><span className="btn-login">Login</span></Link>
                        <Link to="/signup"><span className="btn-d">Signup</span></Link>
                        <span className="btn-d">About</span>
                    </div>
                </Element>
                <div className="mainpage-cover si-container">
                    <div className="mainpage-cover-opacity si-container">
                        <div className="hero si-container">
                            <div className="grid-7 offset-2">
                                <img src={ `${imagesPath}/aww.jpg` } width={300} />

                                <h1>Everything Much Cheaper!</h1>
                                <p>
                                    Lorem ipsum dolor sit amet, quo ad adhuc debet munere. Harum congue ne his, suas viris constituam ne cum, sonet mandamus at his.
                                </p>
                                <ScrollLink to="explore" className="btn-explore" smooth={true}
                                        offset={0} duration={800} >Explore</ScrollLink>

                                <ScrollLink to="how" className="btn-how" smooth={true}
                                        offset={-20} duration={1000} >How It Works</ScrollLink>
                            </div>
                            <div className="grid-3 offset-1">
                                <a href={IOS_LINK} target="_blank"><div className="icon res1x-app_store" ></div></a>
                                <a href={ANDROID_LINK} target="_blank"><div className="icon res1x-google_play" ></div></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mainpage-search si-container">
                    <div className="grid-9 offset-3">

                        <SearchBar height="45" flux={this.props.flux}/>
                    </div>
                </div>

                <Element name="explore" className="mainpage-explore si-container">
                    <Explore categories={this.state.categories} />
                </Element>

                <Element name="how" className="mainpage-how si-container">
                    <h2>How It Works</h2>
                </Element>

                <Footer />
                {this.props.children}

            </div>
        );
    }

});
