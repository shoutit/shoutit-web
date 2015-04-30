import React from 'react';
import DocumentTitle from 'react-document-title';

export default React.createClass({
    displayName: "NotFound",

    title: "Not Found - Shout It",

    render() {
        return (
            <DocumentTitle title={this.title}>
                <div>
                    Page not Found!
                </div>
            </DocumentTitle>
        );
    }
});

