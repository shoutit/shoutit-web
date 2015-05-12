import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Row, Input} from 'react-bootstrap';

import Search from './search.jsx';
import SearchResultList from './search/searchResultList.jsx';

export default React.createClass({
    mixins: [new FluxMixin(React), new StoreWatchMixin("search", "locations")],

    displayName: "SearchBar",

    contextTypes: {
        router: React.PropTypes.func
    },

    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            search: flux.store("search").getState(),
            users: flux.store("users").getState(),
            locations: flux.store('locations').getState()
        };
    },

    getInitialState() {
        return {
            showSearch: 0,
            term: "",
            locTerm: ""
        };
    },

    renderSearchList() {
        let term = this.state.term,
            search = this.state.search;
        return (<SearchResultList
            results={{
                users: search.users[term],
                shouts: search.shouts[term],
                tags: search.tags[term]
            }}
            term={term}
            onBlur={this.onBlurSearch}
            />);
    },

    renderLocationList() {
        let placePredictions = this.state.locations.locations[this.state.locTerm];

        let placesList = placePredictions && placePredictions.length ?
            <li>
                <span>Results</span>
                <ul className="list-search-sub">
                    {placePredictions.map((prediction, i) => (
                        <li onClick={this.onLocationSelect(prediction)} key={"prediction" + i}>
                            {prediction.description}
                        </li>))}
                </ul>
            </li> : null;

        return (<div className="list-search">
            <ul>
                <li>
                    <span>Select your Location</span>
                    <ul className="list-search-sub">
                        <Input
                            id="locationSearch"
                            ref="locationInput"
                            type="text"
                            placeholder="Search"
                            onChange={this.onLocInputChange}
                            value={this.state.locTerm}
                            />
                    </ul>
                </li>
                {placesList}
            </ul>
        </div>);

    },

    renderList() {
        switch (this.state.showSearch) {
            case 1:
                return this.renderSearchList();
            case 2:
                return this.renderLocationList();
            default:
                return "";
        }
    },

    render() {
        var backdrop = this.state.showSearch ?
            <div onClick={this.onBlurSearch} className="backdrop"/> : "";

        return (
            <Row className="searchBar">
                <Search
                    flux={this.getFlux()}
                    onFocus={this.onFocusSearch}
                    onChangeSearch={this.onChangeSearch}
                    onSubmitSearch={this.onSubmit}
                    onBlur={this.onBlurSearch}
                    term={this.state.term}
                    />
                {this.renderList()}
                {backdrop}
            </Row>
        );
    },

    onFocusSearch(type) {
        return function () {
            this.setState({showSearch: type});
        }.bind(this);
    },

    onBlurSearch() {
        this.setState({showSearch: false});
    },

    onChangeSearch(ev) {
        var newTerm = ev.target.value;
        this.setState({term: newTerm});
        this.getFlux().actions.searchAll(newTerm);
    },

    onSubmit() {
        this.setState({showSearch: false});
        if (this.state.term.length > 0) {
            this.context.router.transitionTo("search", {term: this.state.term});
        }
    },

    onLocInputChange(ev) {
        let newTerm = ev.target.value;
        this.setState({locTerm: newTerm});
        this.getFlux().actions.loadPredictions(newTerm);
    },

    onLocationSelect(prediction) {
        return function () {
            this.setState({showSearch: false});
            this.getFlux().actions.selectLocation(prediction);
        }.bind(this);
    }
});
