import React from 'react';
import StaticFrame from './static/iFrame.jsx';

export default React.createClass({
    displayName: "Static",

    contextTypes: {
        router: React.PropTypes.func
    },

    render(){
        var name = this.context.router.getCurrentPathname()
            .replace('\/', '');

        return (
            <StaticFrame staticName={name}/>
        );
    }
});
