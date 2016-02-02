import React from 'react';
import {Icon, Column, Grid} from '../helper';

export default function TagsCard(props) {
    const {suggestions} = props;
    const tags = suggestions? suggestions.tags: null;

    return (
        <section className="si-card">
            <div className="card-header">
                <h3>suggested tags</h3>
            </div>
            {tags.loading?
                <Progress />
                :
                tags.list.map((tag, idx) => {
                    return (
                        <Grid fluid={true} key={`card-tag-${idx}`}>
                            <Column fluid={true} clear={true} size="3" className="card-list-img">
                                <Icon name="tag" className="tag-card-icon"/>
                            </Column>
                            <Column fluid={true} size="9" className="card-list-item">
                                <span>{tag.name}</span>
                            </Column>
                            <Column fluid={true} size="3" >
                                <Icon name="listen" className="card-listen-btn"/>
                            </Column>
                        </Grid>
                    );
                })
            }
        </section>
    );
}