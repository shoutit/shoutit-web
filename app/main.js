/**
 * Created by Philip on 12.01.2015.
 */

var React = require('react');
var App = require('./components/app.jsx');

var mountNode = document.getElementById('main-mount');

React.render(React.createElement(App), mountNode, function() {
	console.log('client mounted!');
});