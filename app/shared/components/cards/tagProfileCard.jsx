import React from 'react';
import {Icon, Grid, Column, Progress } from '../helper';
import Separator from '../general/separator.jsx';
import TagProfileImage from '../tag/tagProfileImage.jsx';
import TagListenButton from '../general/tagListenButton.jsx';
import TagListenersButton from '../general/tagListenersButton.jsx';

export default React.createClass({

    renderProfile() {
        let tagName = this.props.params.tagName,
            tagEntry = this.props.tags[tagName];

        if (tagEntry) {
            let tag = JSON.parse(JSON.stringify(tagEntry.tag));
            const { flux } = this.props;

            return (
                <Grid fluid={true}>
                    <div className="tag-logo">
                        <Icon name="tag" />
                    </div>
                    <h3 className="tag-name">{tag.name}</h3>
                    <Separator />
                    <Column fluid={true} clear={true} size={7}>
                        <TagListenersButton tag={tag} />
                    </Column>
                    <Column fluid={true} size={7}>
                        <TagListenButton
                          tag={tag}
                          flux={ flux }
                          onListenTag={ flux.actions.listenTag }
                          onStopListenTag={ flux.actions.stopListenTag }
                        />
                    </Column>
                </Grid>
            );
        } else if (!this.props.loading && tagEntry === null) {
            return (
                <Grid fluid={true}>
                    <h3>Tag not found!</h3>
                </Grid>
            );
        } else {
            return (
                <Grid fluid={true}>
                    <Progress />
                </Grid>
            );
        }
    },

    componentDidUpdate() {
        this.loadTag();
    },

    componentDidMount() {
        this.loadTag();
    },

    loadTag() {
        let tagName = this.props.params.tagName,
            tagEntry = this.props.tags[tagName];

        if (!this.props.loading && !tagEntry && tagEntry !== null) {
            this.props.flux.actions.loadTag(tagName);
        }
    },

    render() {
        let isTagProfile = this.props.params.tagName;

        if(isTagProfile) {
            return (
                <section className="si-card tag-profile-card">
                    {this.renderProfile()}
                </section>
                );
        } else {
            return null;
        }
    }
});
