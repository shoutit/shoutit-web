import React from "react";
import {match} from "react-router";
import routes from "../../routes";
import {Grid, Column} from "../helper";
import Board from "./board.jsx";
import Header from "../header/header.jsx";
import findLast from "lodash/collection/findLast";

export default React.createClass({
  displayName: "Home",

  childContextTypes: {
    flux: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object
  },

  statics: {
    layoutConfig: {
      leftBoard: ["profileCard", "listeningCard", "pagesCard"],
      rightBoard: ["tagsCard", "listenToCard", "suggestShoutCard"]
    }
  },

  getChildContext() {
    return {
      flux: this.props.flux,
      params: this.props.params,
      location: this.props.location
    };
  },

    /**
     * Getting developer's required layout for the path in the tree
     *
     * Component should be defined under /home tree in react router and uses a static object called layoutConfig
     * @returns {OBJECT} latest configured layout object in the routes tree, if any
     */
  getLayoutConfig() {
    let lastConfiguredLayoutRoute;
    match({routes, location: this.props.location.pathname + this.props.location.search},
            (error, redirectLocation, renderProps) => {
              lastConfiguredLayoutRoute = findLast(renderProps.routes, (item) => {
                return item.component.layoutConfig;
              });
            });

        // There is no layoutConfig defined in the whole route tree - NOT GOOD!
    if(!lastConfiguredLayoutRoute) { return null; }

    return lastConfiguredLayoutRoute.component? lastConfiguredLayoutRoute.component.layoutConfig: null;
  },

  render() {
    const {leftBoard, rightBoard} = this.getLayoutConfig();

        // Calculating middle column size (15 is 100%)
    const middleColumnSize = leftBoard && rightBoard? "9": leftBoard || rightBoard? "12" : "15";
    return (
            <div>
                <Header flux={this.props.flux} />
                <Grid className="homepage-holder">
                    {leftBoard &&
                        <Column size="3" clear={true}>
                            <Board items={leftBoard}/>
                        </Column>
                    }

                    <Column size={middleColumnSize} clear={!leftBoard}>
                        {React.cloneElement(this.props.children, {flux: this.props.flux})}
                    </Column>

                    {rightBoard &&
                        <Column size="3">
                            <Board items={rightBoard}/>
                        </Column>
                    }
                </Grid>
            </div>
        );
  }
});
