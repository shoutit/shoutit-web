import React from 'react';
import {Icon, Column, Grid} from '../helper';
import UserImage from '../user/userImage.jsx';

export default React.createClass({
    displayName: "listenToCard",

    getInitialState() {
        return {
            more: false
        }
    },

    toggleMore() {
        this.setState({more: !this.state.more});
    },

    render() {
        // image place holder
        let userImg = "http://goo.gl/TdBdpF";
        let userImg2 = "http://goo.gl/AoUK08";

        return (
            <section className="si-card" style={{maxHeight: this.state.more? "initial": "157px"}}>
                <div className="card-header">
                    <h3 className="pull-left">to listen to</h3>
                    <span className="refresh-btn pull-right">Refresh</span>
                    <span onClick={this.toggleMore} className="more-btn pull-right">
                        {this.state.more? "Less": "More"}
                    </span>
                </div>

                <Grid fluid={true}>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <UserImage type="circle" size="26" className="pull-left" image={userImg} />
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <span>Ryan Gosling</span>
                    </Column>
                    <Column fluid={true} size="3" >
                        <Icon name="listen" className="card-listen-btn"/>
                    </Column>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <UserImage type="circle" size="26" className="pull-left" image={userImg2} />
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <span>Eduardo Saverin</span>
                    </Column>
                    <Column fluid={true} size="3" className="card-listen-btn">
                        <Icon name="listen" />
                    </Column>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <UserImage type="circle" size="26" className="pull-left" image={userImg} />
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <span>Ryan Gosling</span>
                    </Column>
                    <Column fluid={true} size="3" className="card-listen-btn">
                        <Icon name="listen" />
                    </Column>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <UserImage type="circle" size="26" className="pull-left" image={userImg2} />
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <span>Eduardo Saverin</span>
                    </Column>
                    <Column fluid={true} size="3" className="card-listen-btn">
                        <Icon name="listen" />
                    </Column>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <UserImage type="circle" size="26" className="pull-left" image={userImg} />
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <span>Ryan Gosling</span>
                    </Column>
                    <Column fluid={true} size="3" className="card-listen-btn">
                        <Icon name="listen" />
                    </Column>

                </Grid>
            </section>
        );
    }
});
