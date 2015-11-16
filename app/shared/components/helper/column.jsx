import React from 'react';

export default React.createClass({
    displayName: "Column",
    render() {
        let className = "grid-" + this.props.size;
        this.props.className? className += " " + this.props.className: undefined;
        this.props.offset? className += " offset-" + this.props.offset: undefined;
        this.props.clear? className += " clear": undefined;

        return (
            <div className={className}>
                {this.props.children}
            </div>
        )
    }
});