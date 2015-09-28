import React from 'react';
import DocumentTitle from 'react-document-title';
import Loader from '../helper/loader.jsx';

export default React.createClass({
    displayName: "Simple",

    title: "Not implemented yet - Shoutit",

    render() {
        return (
            <DocumentTitle title={this.title}>
                <div>
                    <Loader/>
                </div>
            </DocumentTitle>
        );
    }
});
