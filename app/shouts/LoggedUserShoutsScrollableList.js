import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getLoggedUser } from '../selectors';

import ShoutsScrollableList from './ShoutsScrollableList';

export function LoggedUserShoutsScrollableList({ loggedUser, ...props }) {
  return <ShoutsScrollableList profile={ loggedUser } {...props} />;
}

LoggedUserShoutsScrollableList.propTypes = {
  loggedUser: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ loggedUser: getLoggedUser(state) });

export default connect(mapStateToProps)(LoggedUserShoutsScrollableList);
