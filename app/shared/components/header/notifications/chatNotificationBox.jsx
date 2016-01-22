import React from 'react';
import {Icon, Column, Grid} from '../../helper';
import Separator from '../../general/separator.jsx';
import UserImage from '../../user/userImage.jsx';

export default React.createClass({
    displayName: 'ChatNotificationBox',

    render() {
        // mock data
        let name = "John Smith",
            username = "john",
            image = "http://goo.gl/TdBdpF",
            image2 = "http://goo.gl/AoUK08",
            msg = "Hello, How are you?";

        return (
            <div className="topbar-notification-holder">
                <div className="topbar-notification-box">
                    <Grid fluid={true}>
                        <Column fluid={true} clear={true} size="8">
                            <span className="notif-box-btn pull-left">Inbox (12)</span>
                        </Column>
                        <Column fluid={true} size="7">
                            <span className="notif-box-btn-mark pull-right">Mark all as read</span>
                        </Column>
                    </Grid>
                    <Grid fluid={true} className="notifbox-item">
                        <Column fluid={true} clear={true} size="3" className="notifbox-item-image">
                             <UserImage image={image} size="50" type="square"/>
                        </Column>
                        <Column fluid={true} size="12" className="notifbox-item-info">
                            <h3>{name}</h3>
                            <span>{msg}</span>
                        </Column>
                    </Grid>
                    <Grid fluid={true} className="notifbox-item">
                        <Column fluid={true} clear={true} size="3" className="notifbox-item-image">
                             <UserImage image={image} size="50" type="square"/>
                        </Column>
                        <Column fluid={true} size="12" className="notifbox-item-info">
                            <h3>{name}</h3>
                            <span>Just checking with you</span>
                        </Column>
                    </Grid>
                    <Grid fluid={true} className="notifbox-item">
                        <Column fluid={true} clear={true} size="3" className="notifbox-item-image">
                             <UserImage image={image} size="50" type="square"/>
                        </Column>
                        <Column fluid={true} size="12" className="notifbox-item-info">
                            <h3>{name}</h3>
                            <span>{msg}</span>
                        </Column>
                    </Grid>
                    <Grid fluid={true} className="notifbox-see-all">
                        See All
                    </Grid>
                </div>
            </div>
        );
    }
});