import React, { PropTypes } from 'react';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

export default function ServerError({ error }) {
  const title = 'Cannot display this page';
  return (
    <Page title="Error loading this page">
      <Frame title={ title } transparent>

        <div className="Frame-body">
          This page is not available right now. Please try again later.

          { process.env.NODE_ENV === 'development' &&
            <pre style={{ fontSize: '.75em' }}>
              { error.message }<br />
              { error.developer_message }<br />
              { error.code }<br />
              { error.stack }<br />
            </pre>
          }

        </div>
      </Frame>
    </Page>
  );

}

ServerError.propTypes = {
  error: PropTypes.object.isRequired,
};
