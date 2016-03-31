import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import throttle from 'lodash/function/throttle';
import stringify from 'json-stable-stringify';

import { searchShouts, searchTags, searchProfiles } from '../actions/search';
import { openModal, closeModal } from '../actions/ui';
import { setUserLocation } from '../actions/users';
import { setCurrentLocation } from '../actions/location';

import { trimWhitespaces } from '../utils/StringUtils';
import SearchbarResults from './SearchbarResults';

import Overlay from '../ui/Overlay';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import SearchLocation from '../location/SearchLocation';

if (process.env.BROWSER) {
  require('./Searchbar.scss');
}

export class Searchbar extends Component {

  static propTypes = {
    currentLocation: PropTypes.object,
    foundTags: PropTypes.array,
    foundShouts: PropTypes.array,
    foundProfiles: PropTypes.array,
  };

  static defaultProps = {
    foundTags: [],
    foundShouts: [],
    foundProfiles: [],
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = throttle(this.handleChange, 1000).bind(this);
  }

  state = {

    shoutsSearchString: null,
    profilesSearchString: null,
    tagsSearchString: null,

    showOverlay: false,
    isFocused: false,

  };

  handleSubmit(e) {
    e.preventDefault();
    const search = trimWhitespaces(this.refs.q.value).toLowerCase();
    if (search) {
      this.setState({
        showOverlay: false,
      });
      this.refs.q.blur();
      this.props.dispatch(push(`/search?q=${encodeURIComponent(search)}`));
    }
  }

  handleChange() {
    const { dispatch, currentLocation } = this.props;
    const search = trimWhitespaces(this.refs.q.value);
    if (search.length < 2) {
      this.setState({
        showOverlay: false,
        searchString: '',
      });
      return;
    }

    const searchParams = {
      search,
      page_size: 5,
    };

    const shoutsSearchParams = {
      ...searchParams,
      country: currentLocation.country,
      city: currentLocation.city,
    };

    const tagsSearchParams = searchParams;
    const profilesSearchParams = searchParams;

    this.setState({
      showOverlay: true,
      shoutsSearchString: stringify(shoutsSearchParams),
      tagsSearchString: stringify(tagsSearchParams),
      profilesSearchString: stringify(profilesSearchParams),
    });

    dispatch(searchShouts(shoutsSearchParams));
    dispatch(searchTags(tagsSearchParams));
    dispatch(searchProfiles(profilesSearchParams));
  }

  handleLocationClick(e) {
    e.preventDefault();
    e.target.blur();
    const { dispatch, loggedUser } = this.props;
    const modal = (
      <Modal title="Set your location" name="search-location">
        <SearchLocation
          onLocationSelect={ location => {
            dispatch(closeModal('search-location'));
            dispatch(setCurrentLocation(location));
            if (loggedUser) {
              dispatch(setUserLocation(location));
            }
          }}
        />
      </Modal>
    );
    this.props.dispatch(openModal(modal));
  }

  render() {
    const { showOverlay, shoutsSearchString, tagsSearchString, profilesSearchString } = this.state;
    const { shouts, tags, profiles, shoutsBySearch, tagsBySearch, profilesBySearch, currentLocation } = this.props;

    let foundShouts = [];
    let foundTags = [];
    let foundProfiles = [];
    if (shoutsSearchString && shoutsBySearch[shoutsSearchString]) {
      foundShouts = shoutsBySearch[shoutsSearchString].ids.map(id => shouts[id]);
    }
    if (tagsSearchString && tagsBySearch[tagsSearchString]) {
      foundTags = tagsBySearch[tagsSearchString].ids.map(id => tags[id]);
    }
    if (profilesSearchString && profilesBySearch[profilesSearchString]) {
      foundProfiles = profilesBySearch[profilesSearchString].ids.map(id => profiles[id]);
    }

    const locationLabel = currentLocation ? currentLocation.city : 'Anywhere';

    return (
      <form ref="form" onSubmit={ this.handleSubmit } className="Searchbar">
        <Button
          type="button"
          dropdown
          size="small"
          className="Searchbar-button-location"
          label={ locationLabel }
          onClick={ e => this.handleLocationClick(e) }
        />
        <input
          ref="q"
          placeholder="Search Shoutit"
          className="htmlInput"
          type="text"
          onChange={ this.handleChange }
          onBlur={ () => this.setState({ isFocused: false }) }
          onFocus={ () => this.setState({ isFocused: true, showOverlay: true })}
        />
        <Overlay
          rootClose
          onHide={ () => {
            if (!this.state.isFocused) {
              this.setState({ showOverlay: false });
            }
          }}
          style={ { width: '100%' }}
          show={ showOverlay && (foundTags.length > 0 || foundShouts.length > 0 || foundProfiles.length > 0) }
          placement="bottom"
          container={ this }
          target={ () => this.refs.q }
        >
          <SearchbarResults tags={ foundTags } shouts={ foundShouts } profiles={ foundProfiles } />
        </Overlay>
      </form>
    );
  }
}

const mapStateToProps = state => (
  {
    loggedUser: state.session.user,
    currentLocation: state.currentLocation,

    shoutsBySearch: state.paginated.shoutsBySearch,
    shouts: state.entities.shouts,

    tagsBySearch: state.paginated.tagsBySearch,
    tags: state.entities.tags,

    profilesBySearch: state.paginated.profilesBySearch,
    profiles: state.entities.users,
  }
);

export default connect(mapStateToProps)(Searchbar);
