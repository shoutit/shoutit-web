import React from 'react';
import {Icon, Column, Grid} from '../helper';

export default React.createClass({
    displayName: "tagsCard",

    render() {
        return (
            <section className="si-card">
                <div className="card-header">
                    <h3>suggested tags</h3>
                </div>
                <Grid fluid={true}>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <Icon name="tag" className="tag-card-icon"/>
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <span>Cars</span>
                    </Column>
                    <Column fluid={true} size="3" >
                        <Icon name="listen" className="card-listen-btn"/>
                    </Column>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <Icon name="tag" className="tag-card-icon" />
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <span>Gaming</span>
                    </Column>
                    <Column fluid={true} size="3" >
                        <Icon name="listen" className="card-listen-btn"/>
                    </Column>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <Icon name="tag" className="tag-card-icon" />
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <span>Houses</span>
                    </Column>
                    <Column fluid={true} size="3" >
                        <Icon name="listen" className="card-listen-btn"/>
                    </Column>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <Icon name="tag" className="tag-card-icon" />
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <span>Gadgets</span>
                    </Column>
                    <Column fluid={true} size="3" >
                        <Icon name="listen" className="card-listen-btn"/>
                    </Column>
                </Grid>
            </section>
        );
    }
});
