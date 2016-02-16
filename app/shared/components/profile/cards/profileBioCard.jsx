import React from 'react';
import {Grid, Column, Icon} from '../../helper';
import Separator from '../../general/separator.jsx';
import CountryFlag from '../../helper/CountryFlag.jsx';
import SVGIcon from '../../helper/SVGIcon';
import moment from 'moment';

export default React.createClass({
    displayName: "ProfileBioCard",

    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    render() {
        let {bio, date_joined, website, location: {city}, location: {country}} = this.props.user;

        return (
            <Grid fluid={true} className="si-card">
                <p>
                    {bio}
                    <Separator />
                </p>

                {website?
                    <Grid fluid={true}>
                        <Column fluid={true} clear={true} size="2" >
                            <Icon name="browse" className="pull-right" />
                        </Column>
                        <Column fluid={true} size="13">
                            <a className="profile-bio-item" href={ website } target="_blank">{website}</a>
                        </Column>
                    </Grid>
                    : null}
                <Column fluid={true} clear={true} size="2" >
                    <SVGIcon name="clock" active={true} className="pull-right"/>
                </Column>
                <Column className="profile-bio-item" fluid={true} size="13">
                    <span>Joined: {moment.unix(date_joined).calendar()}</span>
                </Column>
                <Column fluid={true} clear={true} size="2" >
                  <span className="pull-right">
                    <CountryFlag code={country} />
                  </span>
                </Column>
                <Column className="profile-bio-item" fluid={true} size="13">
                    <span>{city}</span>
                </Column>
            </Grid>
        );
    }
});
