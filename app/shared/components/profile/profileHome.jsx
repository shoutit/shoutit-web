import React from 'react';
import {Grid, Column} from '../helper';
import RightBoard from '../feed/rightboard.jsx';
import Header from '../header/header.jsx';
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
            <div>
                <Header flux={this.props.flux} />
                <div className="profile-holder">
                    <Grid >
                        <Column size="12" clear={true}>
                            {this.props.children}
                        </Column>
                        <Column size="3">
                            <RightBoard />
                        </Column>
                    </Grid>
                </div>
            </div>
        );
    }
});
