import React from 'react';
import {Grid, Column, Icon, Flag} from '../../helper';
import Separator from '../../general/separator.jsx';
import moment from 'moment';

export default React.createClass({
    displayName: "ProfileBioCard",

    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    render() {
        let {bio, date_joined, location: {city}, location: {country}} = this.props.user;
        // mock url
        let url = 'www.shoutit.com';

        return (
            <Grid fluid={true} className="si-card">
                <p>
                    {bio}
                    <Separator />
                </p>
                
                <Column fluid={true} clear={true} size="2" >
                    <Icon name="browse" className="pull-right" />
                </Column>
                <Column className="profile-bio-item" fluid={true} size="13">
                    <span>{url}</span>
                </Column>
                <Column fluid={true} clear={true} size="2" >
                    <Icon name="date" className="pull-right"/>
                </Column>
                <Column className="profile-bio-item" fluid={true} size="13">
                    <span>Joined: {moment.unix(date_joined).calendar()}</span>
                </Column>
                <Column fluid={true} clear={true} size="2" >
                    <Flag country={country} size="16" className="pull-right"/>
                </Column>
                <Column className="profile-bio-item" fluid={true} size="13">
                    <span>{city}</span>
                </Column>
            </Grid>
        );
    }
});