import React from 'react';
import {Icon, Grid, Column} from '../helper';

export default React.createClass({
    displayName: "relatedTagsCard",

    contextTypes: {
        params: React.PropTypes.object
    },

    render() {
        return (
            <section className="si-card">
                <div className="card-header">
                    <h3>related tags</h3>
                </div>
                <Grid fluid={true}>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <Icon name="tag" className="tag-card-icon"/>
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <span>Lenovo Desktops</span>
                    </Column>
                    <Column fluid={true} size="3" >
                        <Icon name="listen" className="card-listen-btn"/>
                    </Column>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <Icon name="tag" className="tag-card-icon" />
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <span>Lenovo Tablets</span>
                    </Column>
                    <Column fluid={true} size="3" >
                        <Icon name="listen" className="card-listen-btn"/>
                    </Column>
                </Grid>
            </section>
            );

    }
});
