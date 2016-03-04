import React from "react";
import {StoreWatchMixin} from "fluxxor";
import {Input, Button} from "react-bootstrap";
import Icon from "../helper/icon.jsx";


export default React.createClass({
  displayName: "SearchInput",

  mixins: [
    new StoreWatchMixin("locations")
  ],

  getStateFromFlux() {
    return {
      locations: this.props.flux.store("locations").getState()
    };
  },

  renderSubmitButton() {
    return (
      <Button
        className="search-button"
        onClick={ this.props.onSubmit }
        bsStyle="link"
        tabIndex={ 2 } >
        <Icon name="search-icon"/>
      </Button>
    );
  },

  onKeyUp(ev) {
    if (ev.which === 13) {
      this.props.onSubmit();
    } else if (ev.which === 27) {
      this.props.onBlur();
    }
  },

  render() {
    const currentCity = this.state.locations.current.city;
    const btnStyle = currentCity ?
        {height: this.props.height + "px", padding: "0 20px"} : {height: this.props.height + "px"};
    const beforeButton =
        <div className="selectpicker">
          <Button
            onClick={this.props.onFocus(2)}
            key="countrySelect"
            style={btnStyle}
            className="dropdown-toggle">
            {currentCity || <Icon name="location_bar"/>}
          </Button>
        </div>;
    return (
      <div>
        <Input
          placeholder="Search Shoutit"
          ref="searchInput"
          type="text"
          buttonBefore={beforeButton}
          onChange={this.props.onChangeSearch}
          onFocus={this.props.onFocus(1)}
          onKeyUp={this.onKeyUp}
          value={this.props.term}
          tabIndex={1}
          accessKey="s"
          style={{height: this.props.height + "px"}}
        />
        {this.renderSubmitButton()}
      </div>
    );
  }
});
