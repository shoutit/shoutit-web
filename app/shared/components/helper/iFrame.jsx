import React from 'react';

export default React.createClass({
    displayName: "iFrame",

    propTypes: {
        staticName: React.PropTypes.string
    },

    render(){
        var src = "/static/" + this.props.staticName + ".html";

        return (
            <iframe src={src}
                    style={{
                        border: "none",
                        minHeight: "800px",
                        backgroundColor: "transparent"
                    }}
                ></iframe>
        );
    }

});
