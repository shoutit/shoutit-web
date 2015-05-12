var React = require('react'),
    Link = require('react-router').Link,
    Col = require('react-bootstrap').Col,
    TagList = require('./tags.jsx'),
    Actions = require('./actions.jsx'),
    Mui = require('./../../../helper/mui.jsx'),
    Image = require('../../../helper/image.jsx'),
    moment = require('moment'),
    currencies = require('../../../../consts/currencies');

var ItemProp = require('../../../helper/microdata/itemprop.jsx');

var types = {
    offer: "Offer",
    request: "Request"
};

module.exports = React.createClass({
    displayName: "ShoutBody",

    getDefaultProps: function () {
        return {
            logoRight: false
        };
    },

    renderBottom: function (shout) {
        return this.props.listType === "small" ?
            (
                <div className="ctn-offerpro-bottom">
                    <ul>
                        <li className="postby">
                            {"Posted by : " + shout.user.name + ", " +
                            moment.unix(shout.date_published).format('L')}
                        </li>
                    </ul>
                </div>
            ) :
            (
                <div className="btn-bottom">
                    <Actions/>
                    <TagList tags={shout.tags}/>
                </div>
            );
    },

    renderOffer: function (shout) {
        if (shout.type === "offer" && shout.price && shout.currency) {
            return (
                <ItemProp property="offers">
                    <div className="price-offer">
                        <div className="price">
                            <ItemProp property="price">
                                <span>{shout.price}</span>
                            </ItemProp>
                            &nbsp;
                            <ItemProp property="priceCurrency">
                                <span>{currencies[shout.currency].name}</span>
                            </ItemProp>
                        </div>
                    </div>
                </ItemProp>
            );
        }
    },

    renderSubtitle: function (shout) {
        var link = shout.user.is_activated ?
            <Link to="user" params={{username: shout.user.username}}>
                {shout.user.name}
            </Link> : shout.user.name;

        return (
            <h5>{types[shout.type]} by&nbsp;
				<span className="poster">
					{link}
				</span>
                &nbsp;-&nbsp;
                {moment.unix(shout.date_published).fromNow()}
                &nbsp;-&nbsp;in&nbsp;
                <Link to="tag" params={{tagName: shout.category.main_tag.name}}>
                    {shout.category.name}
                </Link>
                &nbsp;-&nbsp;near&nbsp;
                {shout.location.city}
            </h5>
        );
    },

    renderThumbnail: function (shout) {
        return shout.thumbnail ?
            <div className="section-right-img">
                <ItemProp property="image">
                    <Image src={shout.thumbnail}/>
                </ItemProp>
            </div> :
            "";
    },

    renderTitle: function (shout) {
        return (
            <h4>
                <ItemProp property="url">
                    <Link to="shout" params={{shoutId: shout.id,  location: shout.location.city, title: shout.title}}>
                        <ItemProp property="name">
                            <span>{shout.title}</span>
                        </ItemProp>
                    </Link>
                </ItemProp>
            </h4>
        );
    },

    renderDescription: function (shout) {
        return (
            <ItemProp property="description">
                <p>{shout.text}</p>
            </ItemProp>
        );
    },

    render: function () {
        var shout = this.props.shout;

        return (
            <Col xs={12} md={10} mdPull={this.props.logoRight ? 2 : 0} className="section-right">
                <Mui right={this.props.logoRight}/>
                {this.renderTitle(shout)}
                {this.renderSubtitle(shout)}
                {this.renderThumbnail(shout)}
                {this.renderDescription(shout)}
                {this.renderOffer(shout)}
                {this.renderBottom(shout)}
            </Col>
        );
    }
});