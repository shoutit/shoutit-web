import React from 'react';
import {Link, History} from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import {Icon, Grid, Column, Flag, ReactVisible} from '../helper';
import Separator from '../general/separator.jsx';

export default React.createClass({
    displayName: "ShoutShareCard",
    mixins: [StoreWatchMixin('users', 'shouts'), History],

    contextTypes: {
        params: React.PropTypes.object,
        flux: React.PropTypes.object
    },

    getStateFromFlux() {
        let flux = this.context.flux;

        return {
            shout: flux.store('shouts').findShout(this.context.params.shoutId),
            users: flux.store('users').getState().users,
            user: flux.store('users').getState().user
        }
    },

    back() {
        if(window.previousLocation) {
            this.history.goBack();
        } else {
           this.history.pushState(null, '/home');
        }
    },

    renderUsersControl() {
        let {shout, user} = this.state;
        try {
            if(shout.shout.user.username !== user) {
                return (
                    <Grid fluid={true} className="user-controls-card">
                        <Column fluid={true} clear={true} size="15" >
                            <span onClick={this.back} className="back-btn">Back to search results</span>
                        </Column>
                        <Column fluid={true} clear={true} size="7">
                            <span className="prev-btn">Previous Shout</span>
                        </Column>
                        <Column fluid={true} size="7">
                            <span className="next-btn">Next Shout</span>
                        </Column>
                    </Grid>
                );
            }

        } catch(e) {}
    },

    renderOwnerControl() {
        let {shout, user} = this.state;
        try {
            if(shout.shout.user.username === user && user) {
                return (
                    <ul className="owner-controls-card">
                        <li>
                            <Icon name="chat" />
                            <span>Messages</span>
                        </li>
                        <li>
                            <Icon name="edit-gray" style={{marginRight: "22px"}}/>
                            <span>Edit Shout</span>
                        </li>
                        <li>
                            <Icon name="delete-gray" style={{marginRight: "24px"}}/>
                            <span>Delete Shout</span>
                        </li>
                    </ul>
                );
            }

        } catch(e) {}

    },

    render() {
        let {shout, user} = this.state;
        let ownerUser = null;
        try {
            ownerUser = shout.shout? shout.shout.user.username: null;
        } catch(e) {}

        return (
            <div>
                <section className="si-card gray-card share-shout-card">
                    <div className="card-header">
                        <Icon name="call-to-action" />
                        <h3>share this shout</h3>
                    </div>
                    <Column fluid={true} clear={true} size="7" className="share-button">
                        <Icon name="facebook" />
                        <Icon name="share-bubble" className="share-bubble"/>
                        <span>0</span>
                    </Column>
                    <Column fluid={true} size="7" className="share-button">
                        <Icon name="twitter" />
                        <Icon name="share-bubble" className="share-bubble"/>
                        <span>2</span>
                    </Column>
                    <Column fluid={true} clear={true} size="7" className="share-button">
                        <Icon name="google-plus" />
                        <Icon name="share-bubble" className="share-bubble"/>
                        <span>0</span>
                    </Column>
                    <Column fluid={true} size="7" className="share-button">
                        <Icon name="mail" />
                        <Icon name="share-bubble" className="share-bubble"/>
                        <span>0</span>
                    </Column>
                    <Column fluid={true} size="15" style={{margin:'10px 15px'}}>
                        <Separator />
                    </Column>
                  {/*
                    <Column fluid={true} size="15" style={{margin:'10px 15px'}}>
                        <ReactVisible condition={user && ownerUser !== user}>
                            <Icon name="report" style={{display: "inline-block"}}/>
                            <span className="report-button">Report this Shout</span>
                        </ReactVisible>
                    </Column> */
                  }
                    {/*this.renderOwnerControl()*/}
                </section>
                {this.renderUsersControl()}
            </div>
        );
    }
});
