import React, { PropTypes } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import Helmet from '../utils/Helmet';

import Page from '../layout/Page';
import Frame from '../layout/Frame';

const MESSAGES = defineMessages({
  pageTitle: {
    id: 'serverError.page.title',
    defaultMessage: 'Cannot display this page',
  },
  title: {
    id: 'serverError.title',
    defaultMessage: 'Cannot display this page',
  },
  details: {
    id: 'serverError.details',
    defaultMessage: 'This page is not available right now. Please try again later.',
  },
});

export function ServerError({ error, intl }) {
  return (
    <Page>
      <Helmet title={ intl.formatMessage(MESSAGES.pageTitle) } />
      <Frame title={ intl.formatMessage(MESSAGES.title) } transparent>

        <div className="Frame-body">
          { intl.formatMessage(MESSAGES.details) }
          { process.env.NODE_ENV === 'development' &&
            <pre style={ { fontSize: '.75em' } }>
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
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ServerError);
