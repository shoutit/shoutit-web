import React from "react";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import {Link as ScrollLink, Element } from "react-scroll";
import SearchBar from "../header/searchBar.jsx";
import {Icon, Grid, Column} from "../helper";
import Explore from "./explore.jsx";
import Footer from "./footer.jsx";
import {ANDROID_LINK, IOS_LINK} from "../../consts/defaults";

import { imagesPath } from "../../../config";

if (process.env.BROWSER) {
  require("styles/pages/mainpage.scss");
}

export default class MainPage extends React.Component {

  componentWillMount() {
    if (this.props.loggedUser) {
      this.props.history.replace("/home");
    }
  }

  render() {
    const { history, currentLocation, flux, shuffledCategories, children, loggedUser } = this.props;
    return (
      <DocumentTitle title="Buy and sell while chatting on Shoutit!">
        <Column className="mainpage">
          <Grid>
            <Element name="nav" className="mainpage-nav">
              <Column clear={true} size="8" className="nav-left">
                <Link to="/"><Icon name="logo"/></Link>
              </Column>
              <Column size="7" className="nav-right">
                <Link to="/login"><span className="btn-login">Log in</span></Link>
                <Link to="/signup"><span className="btn-d">Sign up</span></Link>
                {/* <span className="btn-d">About</span> */}
              </Column>
            </Element>
          </Grid>
          <Grid className="mainpage-cover" style={{backgroundImage: `url(${imagesPath}/m_cover.jpg)`}}>
            <Grid fluid={true} className="mainpage-cover-opacity">
              <Grid fluid={true} className="hero">
                <Column size="7" offset="2">

                  <h1>Buy and Sell while Chatting!</h1>
                  <p>
                    Shoutit is the fastest way to list and share what you want to sell or buy. Chat with buyers and sellers in your area or anywhere in the world!
                  </p>
                  <ScrollLink to="explore" className="btn-explore" smooth={true}
                              offset={0} duration={800}>Explore</ScrollLink>

                  <ScrollLink to="how" className="btn-how" smooth={true}
                              offset={-20} duration={1000}>How It Works</ScrollLink>
                </Column>
                <Column size="3" offset="1">
                  <a href={IOS_LINK} target="_blank"><Icon name="app_store"/></a>
                  <a href={ANDROID_LINK} target="_blank"><Icon name="google_play"/></a>
                </Column>
              </Grid>
            </Grid>
          </Grid>

          <Grid className="mainpage-search">
            <Column size="9" offset="3">
              <SearchBar
                currentLocation={ currentLocation }
                height="45"
                flux={ flux }
                history={ history }
              />
            </Column>
          </Grid>

          <Grid className="mainpage-explore">
            <Element name="explore" >
              <Explore
                categories={ shuffledCategories }
                countryCode={ currentLocation.country }
              />
            </Element>
          </Grid>

          <Grid className="mainpage-how">
            <Element name="how">
              <h2>How It Works</h2>
              <Grid fluid={true} style={{textAlign: "center"}}>
                <img src={`${imagesPath}/m_howto.png`}/>
              </Grid>
            </Element>
          </Grid>

          <Footer />

          {/*{ children && React.cloneElement(children, { loggedUser }) }*/}

        </Column>
      </DocumentTitle>
    );
  }
}
