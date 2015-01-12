/**
 * Created by Philip on 12.01.2015.
 */

var React = require('react'),
	App = require('./components/app.jsx'),
	GPlus = require('./vendor/gplus');

// Init G+ Button
GPlus.init(window);

// Render App
React.render(React.createElement(App), document.getElementById('main-mount'), function() {
	console.log('client mounted!');
});

