import React from 'react';

export default React.createClass({
    displayName: 'Loader',

    render() {
        return (
            <div className="loader">
                <div className="dot"/>
                <div className="dot"/>
                <div className="dot"/>
                <div className="dot"/>
                <div className="dot"/>
            </div>
        );
    }
});
