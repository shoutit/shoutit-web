import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
    displayName: "Tag",

    render() {
        let tag = this.props.tag;

        return (
            
            <Link to={`/tag/${encodeURIComponent(tag.name)}`}>
                <span key={this.props.key} className="si-tag">
                    {tag.name}
                </span>
            </Link>
            
        );
    }
});