var React = require('react'),
    Col = require('react-bootstrap').Col,
    ShoutHeader = require('./shout/header.jsx'),
    ShoutBody = require('./shout/body.jsx'),
    moment = require('moment'),
    ViewportSensor = require('../../misc/ViewportSensor.jsx');

var ItemScope = require('../../helper/microdata/itemscope.jsx');

module.exports = React.createClass({
    displayName: "Shout",

    alignRight: function () {
        return this.props.index % 2 !== 0;
    },

    agoText: function () {
        return moment.unix(this.props.shout.date_published).fromNow()
    },

    render: function () {
        var shout = this.props.shout,
            ago = this.agoText();

        var body = <ShoutBody listType={this.props.listType} logoRight={this.alignRight()} shout={shout}/>;

        if (this.props.last) {
            body = <ViewportSensor onChange={this.props.last}>{body}</ViewportSensor>;
        }

        return (
            <section>
                <ItemScope type="Product">
                    <Col xs={12} md={12}>
                        <ShoutHeader creator={shout.user} listType={this.props.listType} agoText={ago}
                                     logoRight={this.alignRight()} logoSrc={shout.user.image}/>
                        {body}
                    </Col>
                </ItemScope>
            </section>
        );
    }
});