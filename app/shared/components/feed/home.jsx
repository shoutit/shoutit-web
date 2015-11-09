import React from 'react';
import Header from '../header/header.jsx';

export default React.createClass({
    displayName: "Home",

    render() {
        return (
            <div>
                <Header flux={this.props.flux} />
                {this.props.children}
            </div>
        );
    }
});
