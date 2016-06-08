import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Link } from 'react-router';

import CardWithList from '../ui/CardWithList';

const MESSAGES = defineMessages({
  title: {
    id: 'setting.navigation.title',
    defaultMessage: 'Profile Setting',
  },
});

export function SettingsNavigation({ intl }) {
  return (
    <CardWithList title={ intl.formatMessage(MESSAGES.title) }>
      <Link to="/settings/profile" activeClassName="active">
        <FormattedMessage id="settings.navigation.profile" defaultMessage="Public Profile" />
      </Link>
      <Link to="/settings/account" activeClassName="active">
        <FormattedMessage id="settings.navigation.menu.account" defaultMessage="Your Account" />
      </Link>
    </CardWithList>
  );
}

SettingsNavigation.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SettingsNavigation);
