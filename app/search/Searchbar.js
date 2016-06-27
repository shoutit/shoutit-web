import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { getCurrentLocale } from '../reducers/i18n';
import { FormattedMessage } from 'react-intl';

import trim from 'lodash/trim';
import throttle from 'lodash/throttle';
import { invalidateSearch, searchShouts, searchTags, searchProfiles } from '../actions/search';

import { openModal } from '../actions/ui';

import { formatLocation } from '../utils/LocationUtils';
import Button from '../ui/Button';
import LocationModal from '../location/LocationModal';
import SearchOverlay from '../search/SearchOverlay';

import './Searchbar.scss';

export class Searchbar extends Component {

  static propTypes = {
    currentLocation: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
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
    const query = trim(this.searchField.value).toLowerCase();
    if (query) {
      this.setState({
        showOverlay: false,
      });
      this.searchField.blur();
      this.props.onSubmit(query);
    }
  }

  handleChange() {
    const query = this.searchField.value;
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
    const locationLabel = formatLocation(this.props.currentLocation, {
      showCountry: false,
      locale: this.props.locale }) ||
      <FormattedMessage id="searchbar.locationButton.withoutLocation" defaultMessage="Anywhere" />;
    return (
      <form ref="form" onSubmit={ this.submit } className="Searchbar">
        <Button
          type="button"
          dropdown
          onClick={ e => this.handleLocationClick(e) }>
          { locationLabel }
        </Button>
        <FormattedMessage
          id="searchbar.input.placeholder"
          defaultMessage="Search Shoutit">
          { message =>
            <input
              autoComplete="off"
              ref={ el => { this.searchField = el; } }
              name="query"
              placeholder={ message }
              className="htmlInput"
              value={ this.state.query }
              type="text"
              onChange={ this.handleChange }
              onBlur={ () => this.setState({ isFocused: false }) }
              onFocus={ () => this.setState({ isFocused: true, showOverlay: true }) }
            />
          }
        </FormattedMessage>

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
          target={ () => this.searchField }
         />
      </form>
    );
  }
}

const mapStateToProps = state => ({
  currentLocation: state.currentLocation,
  locale: getCurrentLocale(state),
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
