import React from 'react';
import {Icon, Column, Grid, Progress} from '../helper';
import TagListenButton from '../general/tagListenButton.jsx';

const TagsCard = (props, context) => {
    const {suggestions} = props;

    const tags = suggestions? suggestions.tags: null;
    const loading = suggestions.loading || tags.loading;

    return (
        <section className="si-card">
            <div className="card-header">
                <h3>suggested tags</h3>
            </div>
            {loading?
                <Progress />
                :
                tags.list && tags.list.map((tag, idx) => {
                    return (
                        <Grid fluid={true} key={`card-tag-${idx}`}>
                            <Column fluid={true} clear={true} size="3" className="card-list-img">
                                <Icon name="tag" className="tag-card-icon"/>
                            </Column>
                            <Column fluid={true} size="9" className="card-list-item">
                                <span>{tag.name}</span>
                            </Column>
                            <Column fluid={true} size="3" >
                                <TagListenButton hasTitle={false} tag={tag} flux={context.flux}/>
                            </Column>
                        </Grid>
                    );
                })
            }
        </section>
    );
};

// Getting flux from context
TagsCard.contextTypes = {
    flux: React.PropTypes.object
};

export default TagsCard;