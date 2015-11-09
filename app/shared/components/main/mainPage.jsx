import React from 'react';
import {Link} from 'react-router';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Link as ScrollLink, Element, Button} from 'react-scroll';
import SearchBar from '../header/searchBar.jsx';
import Explore from './explore.jsx';
import Footer from './footer.jsx';

export default React.createClass({
    displayName: "MainPage",
    mixins: [new StoreWatchMixin("users")],

    getStateFromFlux() {
        let flux = this.props.flux;

        return {
            users: flux.store("users").getState(),
            locations: flux.store("locations").getState(),
            categories: flux.store('shouts').getState().categories
        };
    },

    render() {
        return (
            <div className="mainpage">
                <Element name="nav" className="mainpage-nav si-container">
                    <div className="nav-left clear grid-8">
                        <Link to="app"><div className="res1x-logo"></div></Link>
                    </div>
                    <div className="nav-right grid-7">
                        <span className="btn-login">Login</span>
                        <span className="btn-d">Signup</span>
                        <span className="btn-d">About</span>
                    </div>
                </Element>
                <div className="mainpage-cover si-container">
                    <div className="mainpage-cover-opacity">
                        <div className="hero si-container">
                            <div className="grid-9">
                                <h1>Everything Much Cheaper!</h1>
                                <p>
                                    Lorem ipsum dolor sit amet, quo ad adhuc debet munere. Harum congue ne his, suas viris constituam ne cum, sonet mandamus at his.
                                </p>
                                <ScrollLink to="explore" className="btn-explore" smooth={true}
                                        offset={0} duration={800} >Explore</ScrollLink>

                                <ScrollLink to="how" className="btn-how" smooth={true}
                                        offset={-20} duration={1000} >How It Works</ScrollLink>
                            </div>
                            <div className="grid-2">
                                <div className="icon res1x-app_store"></div>
                                <div className="icon res1x-google_play"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mainpage-search si-container">
                    <div className="grid-9">
                        <SearchBar/>
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
