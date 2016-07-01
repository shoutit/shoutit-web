import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import Card, { CardList, CardTitle } from '../ui/Card';

export function SettingsNavigation() {
  return (
    <Card block>
      <CardTitle>
        <FormattedMessage id="setting.navigation.title" defaultMessage="Profile Settings" />
      </CardTitle>
      <CardList>
        { [
          <Link to="/settings/profile" activeClassName="active">
            <FormattedMessage id="settings.navigation.profile" defaultMessage="Public Profile" />
          </Link>,
          <Link to="/settings/account" activeClassName="active">
            <FormattedMessage id="settings.navigation.menu.account" defaultMessage="Your Account" />
          </Link>,
        ]
        }
      </CardList>
    </Card>
  );
}

export default SettingsNavigation;
