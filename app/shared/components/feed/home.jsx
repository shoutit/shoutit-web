import React from 'react';
import {Grid, Column} from '../helper';
import LeftBoard from './leftboard.jsx';
import RightBoard from './rightboard.jsx';
import Header from '../header/header.jsx';

export default React.createClass({
    displayName: "Home",

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
                <div className="homepage-holder">
                    <Grid >
                        <Column size="3" clear={true}>
                            <LeftBoard />
                        </Column>
                        <Column size="9">
                            {React.cloneElement(this.props.children, {flux: this.props.flux})}
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
