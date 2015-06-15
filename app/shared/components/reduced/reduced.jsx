import {RouteHandler} from 'react-router';
import React from 'react';
import {Grid} from 'react-bootstrap';
import Header from './header.jsx';
import Footer from '../footer/footer.jsx';

export default React.createClass({
    displayName: "Reduced",

    getInitialState() {
        return {
            height: null
        };
    },

    render() {

        var style = {};

        if (this.state.height) {
            style.height = this.state.height + "px";
        }

        return (
            <div>
                <Header ref="header" flux={this.props.flux}/>

                <div className="content" style={style}>
                    <Grid className="padding0">
                        <RouteHandler flux={this.props.flux}/>
                    </Grid>
                </div>
                <Footer ref="footer"/>
            </div>
        );
    },

    componentDidMount() {
        if (window.innerWidth >= 768) {
            this.resize();
        }

        window.onresize = function () {
            this.resize();
        }.bind(this);
    },

    resize() {
        var newHeight = window.innerHeight -
            React.findDOMNode(this.refs.header).offsetHeight -
            React.findDOMNode(this.refs.footer).offsetHeight;

        if (newHeight !== this.state.height) {
            this.setState({
                height: newHeight
            });
        }
    }
});
