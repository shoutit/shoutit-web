var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	Container = require('react-bootstrap/Grid'),
	Col = require('react-bootstrap/Col'),
	Shout = require('./feed/shout.jsx');

module.exports = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("shouts")],

	displayName: "Feed",

	getStateFromFlux: function () {
		var flux = this.getFlux();
		return flux.store("shouts").getState();
	},

	render: function () {
		var shouts = this.state.shouts.length > 0 ? this.state.shouts.map(function (shout, i) {
			return <Shout key={"shout-" + i} shout={shout} index={i}/>
		}) : <h1>No shouts loaded</h1>;

		return (
			<Col xs={12} md={8}>
			{shouts}
			</Col>
		)
	}
});