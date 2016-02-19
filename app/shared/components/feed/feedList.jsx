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
      gridview: false
    };
  },

  renderShouts() {
    let storeState = this.props.shouts,
      collection = storeState[this.props.type],
      shouts = collection.shouts,
      next = collection.next,
      prev = collection.prev,
      isLoading = storeState.loading;

    let loc = this.props.locations,
      city = loc.current.city? encodeURIComponent(loc.current.city): 'all',
      country = loc.current.country? encodeURIComponent(loc.current.country): 'all',
      state = loc.current.state? encodeURIComponent(loc.current.state): 'all',
      path = typeToRoute[this.props.type];

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
          gridview={ this.state.gridview }
          key={ "shout-" + (i + 1) }
          shout={ shout }
          index={ i }
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
    const { gridview } = this.state;
    const sortItems = [
      { payload: '1', text: 'Most Recent' },
      { payload: '2', text: 'Most Relevant'}
    ];

    let gridIcon, listIcon;

    if(gridview) {
      gridIcon = "grid_active";
      listIcon = "list_inactive";
    } else {
      gridIcon = "grid_inactive";
      listIcon = "list_active";
    }

    return (
      <Column size="9" clear={true}>
        <div className=" switch-bar pull-right">
          <Icon name={gridIcon} onSwitchClick={ () => { this.setState({gridview: !gridview}); } }
            className="grid-btn pull-left"/>
          <Icon name={listIcon} onSwitchClick={ () => { this.setState({gridview: !gridview}); } }
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
