import React from 'react';

export default React.createClass({
	displayName: 'ViewportSensor',

	propTypes: {
		onChange: React.PropTypes.func.isRequired,
		active: React.PropTypes.bool,
		delay: React.PropTypes.number
	},

	getDefaultProps() {
		return {
			active: true,
			delay: 1000
		};
	},

	componentDidMount() {
		if (this.props.active) {
			this.startWatching();
		}
	},

	componentWillUnmount() {
		this.stopWatching();
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.active) {
			this.lastValue = null;
			this.startWatching();
		} else {
			this.stopWatching();
		}
	},

	startWatching() {
		if (this.interval) {
			return;
		}
		this.interval = setInterval(this.check, this.props.delay);
	},

	stopWatching() {
		this.interval = clearInterval(this.interval);
	},

	/**
	 * Check if the element is within the visible viewport
	 */
	check() {
		let el = this.getDOMNode();
		let rect = el.getBoundingClientRect();
		let isVisible = (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);

		// notify the parent when the value changes
		if (this.lastValue !== isVisible) {
			this.lastValue = isVisible;
			this.props.onChange(isVisible);
		}
	},

	render() {
		return (<div>{this.props.children}</div>);
	}
});
