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

    onLocationSelect(latlng) {
        console.log(latlng);
    },

    render() {
        const user = this.props.user;
        let flux = this.context.flux;

        return (
            <Grid fluid={true} className="si-card profile-edit-card">
                <Input type="text" defaultValue={user.name} className="user-name-editbox"/>
                <Input type="textarea" rows="4" defaultValue={user.bio} bsSize="small"/>
                <Input type="text" defaultValue={user.website || 'www.shoutit.com'} className="user-website-editbox"/>
                <LocationSearch onSelect={this.onLocationSelect} ref="location" flux={flux} />
            </Grid>
        );
    }
});