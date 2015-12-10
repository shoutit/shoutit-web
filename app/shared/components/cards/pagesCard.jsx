import React from 'react';
import {Icon, Grid} from '../helper';

export default React.createClass({
    displayName: "PagesCard",

    contextTypes: {
        params: React.PropTypes.object
    },

    render() {
        let isShoutPage = Boolean(this.context.params.shoutId);

        if(!isShoutPage) {
            return (
                <section className="si-card gray-card">
                    <div className="card-header">
                        <h3>pages</h3>
                    </div>
                    <Grid fluid={true}>
                        <span className="page-button">Create Page</span>
                    </Grid>
                </section>
            );
        } else {
            return null;
        }
    }
});
