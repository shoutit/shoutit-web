import React from 'react';
import {Grid, Column} from '../helper';
import Profile from './profile.jsx';

export default React.createClass({
    displayName: "Home",

    childContextTypes: {
        flux: React.PropTypes.object,
        params: React.PropTypes.object,
        location: React.PropTypes.object
    },

    statics: {
        fetchId: 'user',
        fetchData(client, session, params) {
            return client.users().get(session, params.username);
        }
    },

    getChildContext() {
        return {
            flux: this.props.flux,
            params: this.props.params,
            location: this.props.location
        }
    },

    render() {
        return (
            <div className="profile-holder">
                <Grid >
                    <Column size="12" clear={true}>
                        {this.props.children}
                    </Column>
                    <Column size="3">

                    </Column>
                </Grid>
            </div>
        );
    }
});
