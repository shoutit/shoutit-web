import React from 'react';
import TopBar from './topBar.jsx';

export default React.createClass({
    displayName: "Header",

    render() {
        return (
            <header>
                <TopBar flux={this.props.flux}/>
            </header>
        );
    }
});
