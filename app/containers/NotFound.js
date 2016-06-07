import React, { PropTypes } from 'react';
import { injectIntl, defineMessages } from 'react-intl';

import Page from '../layout/Page';
import Frame from '../layout/Frame';
import Helmet from '../utils/Helmet';

const MESSAGES = defineMessages({
  title: {
    id: 'notfound.title',
    defaultMessage: 'Page not found',
  },
});
export function NotFound({ intl }) {
  const title = intl.formatMessage(MESSAGES.title);
  return (
    <Page>
      <Helmet title={ title } />
      <Frame title={ title } transparent />
    </Page>
  );
}
NotFound.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(NotFound);
