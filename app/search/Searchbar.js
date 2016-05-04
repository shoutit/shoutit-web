import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import trim from 'lodash/string/trim';
import throttle from 'lodash/function/throttle';

import { searchShouts, searchTags, searchProfiles } from '../actions/search';
import { openModal, closeModal } from '../actions/ui';
import { updateCurrentLocation } from '../actions/location';

import { stringifySearchParams } from '../utils/SearchUtils';
import { formatLocation } from '../utils/LocationUtils';
import SearchbarResults from './SearchbarResults';

import Overlay from '../ui/Overlay';
import CountryFlag from '../ui/CountryFlag';
import Progress from '../ui/Progress';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import SearchLocation from '../location/SearchLocation';

if (process.env.BROWSER) {
  require('./Searchbar.scss');
}

export class Searchbar extends Component {

  static propTypes = {
    currentLocation: PropTypes.object,
    tags: PropTypes.object,
    foundTags: PropTypes.array,
    tagsBySearch: PropTypes.object,
    shouts: PropTypes.object,
    foundShouts: PropTypes.array,
    shoutsBySearch: PropTypes.object,
    profiles: PropTypes.object,
    foundProfiles: PropTypes.array,
    profilesBySearch: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
  };

  static defaultProps = {
    foundTags: [],
    foundShouts: [],
    foundProfiles: [],
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.handleChange = throttle(this.handleChange, 1000).bind(this);
  }

  state = {

    shoutsSearchSlug: null,
    profilesSearchSlug: null,
    tagsSearchSlug: null,

    showOverlay: false,
    isFocused: false,

  };

  submit(e) {
    e.preventDefault();
    const search = trim(this.refs.search.value).toLowerCase();
    if (search) {
      this.setState({
        showOverlay: false,
      });
      this.refs.search.blur();
      this.props.dispatch(push(`/search?search=${encodeURIComponent(search)}`));
    }
  }

  handleChange() {
    const { dispatch, currentLocation } = this.props;
    const search = trim(this.refs.search.value);
    if (search.length < 2) {
      this.setState({
        shoutsSearchSlug: false,
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
      searchString: search,
      showOverlay: true,
      shoutsSearchSlug: stringifySearchParams(shoutsSearchParams),
      tagsSearchSlug: stringifySearchParams(tagsSearchParams),
      profilesSearchSlug: stringifySearchParams(profilesSearchParams),
    });

    dispatch(searchShouts(currentLocation, shoutsSearchParams));
    dispatch(searchTags(tagsSearchParams));
    dispatch(searchProfiles(profilesSearchParams));
  }

  handleLocationClick(e) {
    e.preventDefault();
    e.target.blur();
    const { dispatch } = this.props;
    const modal = (
      <Modal title="Set your location" name="search-location">
        <SearchLocation
          onLocationSelect={ location => {
            dispatch(closeModal('search-location'));
            dispatch(updateCurrentLocation(location));
          } }
        />
      </Modal>
    );
    this.props.dispatch(openModal(modal));
  }

  render() {
    const { searchString, showOverlay, shoutsSearchSlug, tagsSearchSlug, profilesSearchSlug, hasFocus } = this.state;
    const {
      shouts,
      tags,
      profiles,
      shoutsBySearch,
      tagsBySearch,
      profilesBySearch,
      currentLocation,
      error,
    } = this.props;

    let foundShouts = [];
    let foundTags = [];
    let foundProfiles = [];

    let hasMoreShouts = false;
    let shoutsCount = 0;
    let isFetchingShouts = false;
    let isFetchingProfiles = false;
    let isFetchingTags = false;

    if (shoutsSearchSlug && shoutsBySearch[shoutsSearchSlug]) {
      foundShouts = shoutsBySearch[shoutsSearchSlug].ids.map(id => shouts[id]);
      isFetchingShouts = shoutsBySearch[shoutsSearchSlug].isFetching;
      hasMoreShouts = shoutsBySearch[shoutsSearchSlug].nextUrl;
      shoutsCount = shoutsBySearch[shoutsSearchSlug].count;
    }
    if (tagsSearchSlug && tagsBySearch[tagsSearchSlug]) {
      foundTags = tagsBySearch[tagsSearchSlug].ids.map(id => tags[id]);
      isFetchingTags = tagsBySearch[tagsSearchSlug].isFetching;
    }
    if (profilesSearchSlug && profilesBySearch[profilesSearchSlug]) {
      foundProfiles = profilesBySearch[profilesSearchSlug].ids.map(id => profiles[id]);
      isFetchingProfiles = profilesBySearch[profilesSearchSlug].isFetching;
    }

    const locationLabel = formatLocation(currentLocation) || 'Anywhere';
    const hasResults = foundTags.length > 0 || foundShouts.length > 0 || foundProfiles.length > 0;
    const isFetching = isFetchingShouts || isFetchingProfiles || isFetchingTags;

    return (
      <form ref="form" onSubmit={ this.submit } className="Searchbar">
        <Button
          type="button"
          dropdown
          onClick={ e => this.handleLocationClick(e) }>
          { currentLocation && <CountryFlag size="small" code={ currentLocation.country } /> }
          { locationLabel }
        </Button>
        <input
          autoComplete="off"
          ref="search"
          name="search"
          placeholder="Search Shoutit"
          className="htmlInput"
          type="text"
          onChange={ this.handleChange }
          onBlur={ () => this.setState({ isFocused: false }) }
          onFocus={ () => this.setState({ isFocused: true, showOverlay: true }) }
        />
        <Overlay
          rootClose
          onHide={ () => {
            if (!this.state.isFocused) {
              this.setState({ showOverlay: false });
            }
          } }
          style={ { width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 } }
          show={ hasFocus || showOverlay }
          placement="bottom"
          container={ this }
          target={ () => this.refs.search }
        >

          { !hasResults && !isFetching &&
            <p style={ { margin: 0, padding: '1rem', fontSize: '0.875rem', textAlign: 'center' } }>
              { searchString ? 'Nothing found' : 'Type something to start search' }
            </p>
          }

          { !hasResults && isFetching &&
            <div style={ { margin: '.5rem' } }>
              <Progress spaced={ false } animate label="Searching…" />
            </div>
          }

          { error && <p className="htmlError">Can't load results right now</p> }

          { hasResults &&
            <SearchbarResults
              search={ searchString }
              onShowMoreShoutsClick={ this.submit }
              shoutsCount={ shoutsCount }
              hasMoreShouts={ hasMoreShouts }
              onResultClick={ () => this.setState({ showOverlay: false }) }
              tags={ foundTags }
              shouts={ foundShouts }
              profiles={ foundProfiles }
            />
          }

        </Overlay>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  currentLocation: state.currentLocation,

  shoutsBySearch: state.paginated.shoutsBySearch,
  isFetchingShouts: state.paginated.shoutsBySearch.isFetching,
  shouts: state.entities.shouts,

  tagsBySearch: state.paginated.tagsBySearch,
  tags: state.entities.tags,
  isFetchingTags: state.paginated.tagsBySearch.isFetching,

  profilesBySearch: state.paginated.profilesBySearch,
  profiles: state.entities.users,
  isFetchingProfiles: state.paginated.profilesBySearch.isFetching,

  error: state.paginated.profilesBySearch.error || state.paginated.tagsBySearch.error || state.paginated.shoutsBySearch.error,

});

export default connect(mapStateToProps)(Searchbar);
