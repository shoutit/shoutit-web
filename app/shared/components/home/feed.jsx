var React = require('react'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin,
    Col = require('react-bootstrap').Col,
    Shout = require('./feed/shout.jsx'),
    Loader = require('../helper/loader.jsx');

var types = {
    requests: "request",
    offers: "offer"
};


module.exports = React.createClass({
    mixins: [FluxMixin, new StoreWatchMixin("shouts")],

    displayName: "Feed",

    getStateFromFlux: function () {
        let flux = this.getFlux();
        return {
            shouts: flux.store("shouts").getState()
        };
    },

    getFilteredShouts: function () {
        var type = this.props.type;
        return this.state.shouts.shouts.filter(function (shout) {
            return type === "" || types[type] === shout.type;
        });
    },

    renderShouts: function () {
        var shouts = this.getFilteredShouts(),
            onLastVisibleChange = this.onLastVisibleChange;
        var shoutEls = shouts
            .map(function (shout, i) {
                return <Shout key={"shout-" + i} shout={shout} index={i}
                              last={i === shouts.length - 1 ? onLastVisibleChange : null}/>;
            });

        if (this.state.shouts.loading && typeof window !== 'undefined') {

            shoutEls.push(
                <section key={"shout-" + shouts.length}>
                    <Col xs={12} md={12}>
                        <Loader/>
                    </Col>
                </section>);
        }

        return shoutEls;
    },

    render: function () {
        return (
            <Col xs={12} md={8}>
                {this.renderShouts()}
            </Col>
        );
    },

    loadMore: function () {
        this.getFlux().actions.loadMore();
    },

    onLastVisibleChange: function (isVisible) {
        if (isVisible) {
            this.loadMore();
        }
    },

    componentDidMount: function () {
        if (this.getFilteredShouts().length === 0) {
            this.loadMore();
        }
    },

    componentDidUpdate: function () {
        if (this.getFilteredShouts().length < 5 && !this.state.shouts.loading && !this.state.shouts.nextPage) {
            setTimeout(this.loadMore, 200);
        }
    }
});
