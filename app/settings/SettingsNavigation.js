import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import Panel, { PanelList, PanelTitle } from '../layout/Panel';

export function SettingsNavigation() {
  return (
    <Panel>
      <PanelTitle>
        <FormattedMessage id="setting.navigation.title" defaultMessage="Profile Settings" />
      </PanelTitle>
      <PanelList>
        { [
          <Link to="/settings/profile" activeClassName="active" key="settings-profile">
            <FormattedMessage id="settings.navigation.profile" defaultMessage="Public Profile" />
          </Link>,
          <Link to="/settings/account" activeClassName="active" key="settings-account">
            <FormattedMessage id="settings.navigation.menu.account" defaultMessage="Your Account" />
          </Link>,
        ]
        }
      </PanelList>
    </Panel>
  );
}

export default SettingsNavigation;
