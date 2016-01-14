import React from 'react';
import {Grid, Column} from '../helper';
import RightBoard from './rightboard.jsx';
import Header from '../header/header.jsx';

export default React.createClass({
    displayName: "DiscoverHome",

    childContextTypes: {
        flux: React.PropTypes.object,
        params: React.PropTypes.object,
        location: React.PropTypes.object
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
                <div className="discover-holder">
                    <Grid >
                        <Column size="12" clear={true}>
                            {this.props.children}
                        </Column>
                        <Column size="3">
                            {/*<RightBoard />*/}
                        </Column>
                    </Grid>
                </div>
            </div>
        );
    }
});
