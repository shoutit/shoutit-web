import React from 'react';
import { Col } from 'react-bootstrap';
import {Link} from 'react-router';
import ShoutPreview from "../shout/ShoutPreview.jsx";
import Progress from '../helper/Progress.jsx';
import ViewportSensor from '../misc/ViewportSensor.jsx';
import {Icon, Column} from '../helper';
import Separator from '../general/separator.jsx';

const DropDownMenu = require('material-ui/lib/drop-down-menu');

const typeToRoute = {
  "all": "all",
  "offer": "offers",
  "request": "requests"
};

export default React.createClass({
  displayName: "Feed",

  getInitialState() {
    return {
      gridView: false
    };
  },

  renderShouts() {
    const collection = this.props.shouts[this.props.type];

    const { next, prev, shouts } = collection;
    const isLoading = this.props.shouts.loading;

    const { currentLocation } = this.props;

    const city = currentLocation.city || "all";
    const state = currentLocation.state || "all";
    const country = currentLocation.country || "all";

    const path = typeToRoute[this.props.type];

    let shoutEls = [];

    if (prev) {
      shoutEls.push(
        <section key={"shout-0"}>
          <Col xs={12} md={12}>
            <noscript>
              <Link to={`/${path}/${country}/${state}/${city}/${prev}`}>
                Previous Page
              </Link>
            </noscript>
          </Col>
        </section>
      );
    }

    shoutEls.push(shouts.length > 0 ?
      shouts.map((shout, i) => (
        <ShoutPreview
          gridView={ this.state.gridView }
          key={ "shout-" + (i + 1) }
          shout={ shout }
          index={ i }
          currentLocation={ currentLocation }
        />
      ))
    :
      (<h5 key="warning">There are currently no shouts in your country. You may want to select another
        location above.</h5>)
    );

    if (isLoading && typeof window !== 'undefined') {
      shoutEls.push(
        <section key={"shout-" + (shouts.length + 1)}>
          <Col xs={12} md={12}>
            <Progress/>
          </Col>
        </section>);
    } else if (next) {
      shoutEls.push(
        <section key={"shout-" + (shouts.length + 1)}>
          <Col xs={12} md={12}>
            <ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
            <Link to={`/${path}/${country}/${state}/${city}/${next}`}>
              Next Page
            </Link>
          </Col>
        </section>
      );
    }

    return shoutEls;
  },

  renderSwitchBar() {
    const { gridView } = this.state;
    const sortItems = [
      { payload: '1', text: 'Most Recent' },
      { payload: '2', text: 'Most Relevant'}
    ];

    let gridIcon, listIcon;

    if(gridView) {
      gridIcon = "grid_active";
      listIcon = "list_inactive";
    } else {
      gridIcon = "grid_inactive";
      listIcon = "list_active";
    }

    return (
      <Column size="9" clear={true}>
        <div className=" switch-bar pull-right">
          <Icon name={gridIcon} onSwitchClick={ () => { this.setState({gridView: !gridView}); } }
            className="grid-btn pull-left"/>
          <Icon name={listIcon} onSwitchClick={ () => { this.setState({gridView: !gridView}); } }
            className="list-btn pull-left"/>
          <Separator size="20px" vertical={true} />
          <span style={{fontSize:'14px', float:'left', margin: '18px -25px 0 5px', color: '#888888'}}>Sort by:</span>

          <DropDownMenu
              underlineStyle={{display:"none"}}
              menuItems={sortItems}
              labelStyle={{color: "#68ab5a"}}
              menuItemStyle={{lineHeight:"25px", color:"#58585a",height:"auto"}}
              iconStyle={{fill: "#58585a"}}
              style={{fontSize: "14px",width:"155px", float:"left", height: "32px",paddingTop:"0",paddingBottom:"0", right:"-15px"}}
              />
        </div>
      </Column>
    );
  },

  render() {
    return (
      <div>
        {this.renderSwitchBar()}
        {this.renderShouts()}
      </div>
    );
  },

  onLastVisibleChange(isVisible) {
    if (isVisible) {
      this.props.loadMore();
    }
  }
});
