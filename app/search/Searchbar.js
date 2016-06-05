import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import trim from 'lodash/trim';
import throttle from 'lodash/throttle';
import { invalidateSearch, searchShouts, searchTags, searchProfiles } from '../actions/search';

import { openModal } from '../actions/ui';

import { formatLocation } from '../utils/LocationUtils';
import Button from '../ui/Button';
import LocationModal from '../location/LocationModal';
import SearchOverlay from '../search/SearchOverlay';

if (process.env.BROWSER) {
  require('./Searchbar.scss');
}

export class Searchbar extends Component {

  static propTypes = {
    currentLocation: PropTypes.object.isRequired,
    searchTags: PropTypes.func.isRequired,
    searchProfiles: PropTypes.func.isRequired,
    searchShouts: PropTypes.func.isRequired,
    invalidateSearch: PropTypes.func.isRequired,
    onLocationClick: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.startSearch = throttle(this.startSearch, 1000).bind(this);
  }

  state = {
    showOverlay: false,
    isFocused: false,
    query: '',
  };

  submit(e) {
    e.preventDefault();
    const query = trim(this.refs.searchField.value).toLowerCase();
    if (query) {
      this.setState({
        showOverlay: false,
      });
      this.refs.searchField.blur();
      this.props.onSubmit(query);
    }
  }

  handleChange() {
    const query = this.refs.searchField.value;
    if (query.length <= 2) {
      this.props.invalidateSearch();
    } else {
      this.startSearch(trim(query));
    }
    this.setState({ query });
  }

  startSearch(query) {
    this.setState({
      showOverlay: true,
    });
    const params = {
      search: query,
      page_size: 5,
    };
    this.props.searchShouts(this.props.currentLocation, params);
    this.props.searchTags(params);
    this.props.searchProfiles(params);
  }

  handleLocationClick(e) {
    e.preventDefault();
    e.target.blur();
    this.props.onLocationClick();
  }

  render() {
    const locationLabel = formatLocation(this.props.currentLocation, { showCountry: false }) || 'Anywhere';
    return (
      <form ref="form" onSubmit={ this.submit } className="Searchbar">
        <Button
          type="button"
          dropdown
          onClick={ e => this.handleLocationClick(e) }>
          { locationLabel }
        </Button>
        <input
          autoComplete="off"
          ref="searchField"
          name="query"
          placeholder="Search Shoutit"
          className="htmlInput"
          value={ this.state.query }
          type="text"
          onChange={ this.handleChange }
          onBlur={ () => this.setState({ isFocused: false }) }
          onFocus={ () => this.setState({ isFocused: true, showOverlay: true }) }
        />
        <SearchOverlay
          query={ this.state.query.length <= 2 ? '' : this.state.query }
          rootClose
          show={ this.state.hasFocus || this.state.showOverlay }
          onHide={ () => {
            if (!this.state.isFocused) {
              this.setState({ showOverlay: false });
            }
          } }
          style={ { width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 } }
          placement="bottom"
          container={ this }
          onMoreShoutsClick={ this.submit }
          target={ () => this.refs.searchField }
         />
        {/* <Overlay
          rootClose

        >

          { !hasResults && !isFetching &&
            <p style={ { margin: 0, padding: '1rem', fontSize: '0.875rem', textAlign: 'center' } }>
              { q ? 'Nothing found' : 'Type something to start search' }
            </p>
          }

          { !hasResults && isFetching &&
            <div style={ { margin: '.5rem' } }>
              <Progress spaced={ false } animate label="Searching…" />
            </div>
          }

          { hasResults &&
            <SearchbarResults
              search={ q }
              onShowMoreShoutsClick={ this.submit }
              hasMoreShouts={ false }
              onResultClick={ () => this.setState({ showOverlay: false }) }
              tags={ tags }
              shouts={ shouts }
              profiles={ profiles }
            />
          }

        </Overlay>*/}
      </form>
    );
  }
}

const mapStateToProps = state => ({
  currentLocation: state.currentLocation,
});

const mapDispatchToProps = dispatch => ({
  invalidateSearch: () => dispatch(invalidateSearch()),
  searchTags: params => dispatch(searchTags(params)),
  searchProfiles: params => dispatch(searchProfiles(params)),
  searchShouts: (location, params) => dispatch(searchShouts(location, params)),
  onSubmit: query => dispatch(push(`/search?search=${encodeURIComponent(query)}`)),
  onLocationClick: () => dispatch(openModal(<LocationModal />)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Searchbar);
