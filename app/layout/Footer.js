import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { connect } from 'react-redux';

import LocaleSwitcher from '../widgets/LocaleSwitcher';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import { getCurrentLocation } from '../reducers/currentLocation';

import { facebookLink, twitterLink, instagramLink } from '../config';

import './Footer.scss';

export function Footer({ currentLocation }) {
  return (
    <div className="Footer">
      <ResponsiveLayout size="small">

        <div className="Footer-wrapper">
          <div className="Footer-links">
            <h3>
              <FormattedMessage
                id="layout.Footer.discover.title"
                defaultMessage="Discover"
              />
            </h3>
            <Link to="/search">
              <FormattedMessage
                id="layout.Footer.discover.browse"
                defaultMessage="Browse Shouts"
              />
            </Link>
            <Link to={ `/discover/${currentLocation.country.toLowerCase()}` }>
              <FormattedMessage
                id="layout.Footer.discover.discover"
                defaultMessage="Discover"
              />
            </Link>
            <Link to="/signup">
              <FormattedMessage
                id="layout.Footer.discover.register"
                defaultMessage="Sign Up"
              />
            </Link>
            <Link to="/login">
              <FormattedMessage
                id="layout.Footer.discover.login"
                defaultMessage="Log In"
              />
            </Link>
          </div>
          <div className="Footer-links">
            <h3>
              <FormattedMessage
                id="layout.Footer.language.title"
                defaultMessage="Language"
              />
            </h3>
            <LocaleSwitcher />
          </div>
        </div>
        <div className="Footer-links social">
          <h3>
            <FormattedMessage
              id="layout.Footer.social.title"
              defaultMessage="Join us on"
            />
          </h3>
        </div>

        <div className="Footer-copyright">
          <FormattedMessage
            id="footer.copyright"
            defaultMessage="Copyright © {year} Shoutit – All Rights Reserved."
            values={ { year: <FormattedDate value={ new Date() } year="numeric" /> } }
          />
        </div>
      </ResponsiveLayout>
    </div>
  );
}

Footer.propTypes = {
  currentLocation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentLocation: getCurrentLocation(state),
});

export default connect(mapStateToProps)(Footer);

