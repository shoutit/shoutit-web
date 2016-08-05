import React, { PropTypes } from 'react';
import capitalize from 'lodash/capitalize';
import { connect } from 'react-redux';

import { formatLocation } from '../../utils/LocationUtils';
import Helmet from '../../utils/Helmet';
import { getCurrentLocale } from '../../reducers/i18n';

export function ShoutPageHelmet({ shout, locale }) {
  const price = shout.price / 100;

  return (
    <Helmet
      title={ shout.title }
      description={ shout.text }
      images={ shout.images }
      appUrl={ shout.appUrl }
      meta={ [
        { property: 'og:type', content: `ogPrefix:${shout.type}` },
        { property: 'ogPrefix:price', content: price },
        { property: 'ogPrefix:username', content: shout.profile.username },
        { name: 'twitter:card', content: 'product' },
        { name: 'twitter:label1', content: capitalize(shout.type) },
        { name: 'twitter:data1', content: price },
        { name: 'twitter:label2', content: 'Location' },
        { name: 'twitter:data2', content: formatLocation(shout.location, { locale }) },
      ] }
    />
  );
}

ShoutPageHelmet.propTypes = {
  shout: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getCurrentLocale(state),
});

export default connect(mapStateToProps)(ShoutPageHelmet);
