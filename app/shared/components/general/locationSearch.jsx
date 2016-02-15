import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Input} from 'react-bootstrap';

export default React.createClass({
    displayName: "SearchBar",
    mixins: [new StoreWatchMixin("locations")],

    getDefaultProps() {
        return {
            ref: 'location'
        }
    },

    getInitialState() {
        return {
            locTerm: "",
            selectedLoc: '',
            showList: true
        };
    },

    getStateFromFlux() {
        let flux = this.props.flux;
        return {
            locations: flux.store('locations').getState()
        };
    },

    onLocInputChange(ev) {
        let newTerm = ev.target.value;
        this.setState({locTerm: newTerm});
        this.props.flux.actions.loadPredictions(newTerm);
    },

    onLocationSelect(prediction) {
        return function () {
            // get lat lng 
            if (window.google) {
                let geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({placeId: prediction.id}, (res, status) => {
                    if (status == window.google.maps.GeocoderStatus.OK) {
                        prediction.latLng = res[0].geometry.location;
                        this.setState({selectedLoc: prediction.description, showList: false});
                        this.props.onSelect(prediction.latLng);
                    } else {
                        console.log('Location is not supported for geocoding');
                    }
                });
            }    
        }.bind(this);
    },

    renderAutoComplete() {
        let placePredictions = this.state.locations.locations[this.state.locTerm];

        return placePredictions && placePredictions.length && this.state.showList ? (
                <div className="loc-search-list">
                    {placePredictions.map((prediction, i) => (
                        <div className="item" onClick={this.onLocationSelect(prediction)} key={"loc" + i}>
                            {prediction.description}
                        </div>
                    ))}
                </div>
                ): null;
    },

    onKeyCheck(ev) {
        if(ev.keyCode === 8) { // Backspace
            this.setState({showList: true, selectedLoc: '', locTerm: ''});
        }
    },

    render() {
        return(
            <div className="si-loc-search">
                <Input
                    type="text"
                    ref={this.props.ref}
                    placeholder="Enter Your Location"
                    onChange={this.onLocInputChange}
                    value={this.state.selectedLoc || this.state.locTerm}
                    onKeyDown={this.onKeyCheck}
                    className={this.state.showList? "loc-search-input": "loc-search-input selected"}
                    />
                {this.renderAutoComplete()}
            </div>

        );
    }
});