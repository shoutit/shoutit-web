import React from 'react';
import {Grid, Column, Icon} from '../../helper';
import Separator from '../../general/separator.jsx';
import {Input} from 'react-bootstrap';
import LocationSearch from '../../general/locationSearch.jsx';

export default React.createClass({
    displayName: "ProfileEditorCard",

    contextTypes: {
        flux: React.PropTypes.object
    },

    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    onFieldChange(fieldName) {
        let action = this.context.flux.actions.profileChange;

        return (ev) => {
            if(fieldName === "location") {
                // ev is equal to latLng here
                action({
                    location: {
                        latitude: ev.lat(),
                        longitude: ev.lng()
                    }
                });
            } else if (fieldName === "name") {
                // separate first an last name
                let name = ev.target.value;
                action({
                    first_name: name.substr(0, name.indexOf(' ')),
                    last_name: name.substr(name.indexOf(' ') + 1, name.length)
                });
            } else {
                action({[fieldName]: ev.target.value});
            }
        }
    },

    render() {
        const user = this.props.user;
        const flux = this.context.flux;

        return (
            <Grid fluid={true} className="si-card profile-edit-card">
                <Input type="text" onChange={this.onFieldChange("name")} defaultValue={user.name} className="user-name-editbox"/>
                <Input type="textarea" onChange={this.onFieldChange("bio")} rows="4" defaultValue={user.bio} bsSize="small"/>
                <Input type="text" onChange={this.onFieldChange("website")} defaultValue={user.website || 'www.shoutit.com'} className="user-website-editbox"/>
                <LocationSearch onSelect={this.onFieldChange("location")} ref="location" flux={flux} />
            </Grid>
        );
    }
});