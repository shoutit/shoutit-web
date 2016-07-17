import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import trim from 'lodash/trim';
import throttle from 'lodash/throttle';

import { invalidateSearch, searchShouts, searchTags, searchProfiles } from '../actions/search';

import { getCurrentLocale } from '../reducers/i18n';
import { getQuery } from '../reducers/routing';
import { getCurrentLocation } from '../reducers/currentLocation';
import SearchIcon from '../icons/SearchIcon';

import { openModal } from '../actions/ui';

import { getLocationPath } from '../utils/LocationUtils';
import TextField from '../forms/TextField';
import CountryFlag from '../location/CountryFlag';
import Form from '../forms/Form';
import LocationModal from '../location/LocationModal';
import SearchOverlay from '../search/SearchOverlay';
import './Searchbar.scss';

export class Searchbar extends Component {

  static propTypes = {
    currentLocation: PropTypes.object.isRequired,
    autosuggest: PropTypes.bool,
    showLocation: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    searchTags: PropTypes.func.isRequired,
    searchProfiles: PropTypes.func.isRequired,
    searchShouts: PropTypes.func.isRequired,
    invalidateSearch: PropTypes.func.isRequired,
    onLocationClick: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    autosuggest: true,
    showLocation: true,
  }

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLocationClick = this.handleLocationClick.bind(this);
    this.handleOverlayHide = this.handleOverlayHide.bind(this);
    this.getOverlayTarget = this.getOverlayTarget.bind(this);
    this.startSearch = throttle(this.startSearch, 1000).bind(this);

    this.state = {
      showOverlay: false,
      isFocused: false,
      query: props.query,
    };
  }

  getOverlayTarget() {
    return this.refs.overlayTarget;
  }

  submit(e) {
    e.preventDefault();
    const query = trim(this.searchField.getValue()).toLowerCase();
    if (query) {
      this.setState({
        showOverlay: false,
      });
      this.searchField.blur();
      this.props.onSubmit(query, this.props.currentLocation);
    } else {
      this.searchField.focus();
    }
  }

  handleChange() {
    if (!this.props.autosuggest) {
      return;
    }
    const query = this.searchField.getValue();
    if (query.length <= 2) {
      this.props.invalidateSearch();
    } else {
      this.startSearch(trim(query));
    }
    this.setState({ query });
  }

  startSearch(search) {
    this.setState({
      showOverlay: true,
    });
    const params = {
      search,
      page_size: 5,
    };
    this.props.searchShouts({ ...params, ...this.props.currentLocation });
    this.props.searchTags(params);
    this.props.searchProfiles(params);
  }

  handleLocationClick(e) {
    e.preventDefault();
    e.target.blur();
    this.props.onLocationClick();
  }

  handleOverlayHide() {
    if (!this.state.isFocused) {
      this.setState({ showOverlay: false });
    }
  }

  render() {
    return (
      <Form ref="form" onSubmit={ this.submit } className="Searchbar">
        <div ref="overlayTarget">
          <FormattedMessage
            id="searchbar.input.placeholder"
            defaultMessage="Search Products, Services, Businesses">
            { placeholder =>
              <TextField
                autoComplete="off"
                ref={ el => { this.searchField = el; } }
                name="query"
                placeholder={ placeholder }
                value={ this.state.query }
                startElement={ this.props.showLocation &&
                  <CountryFlag
                    size="small"
                    tooltipPlacement="bottom"
                    code={ this.props.currentLocation.country }
                    onClick={ this.handleLocationClick }
                  />
                }
                endElement={
                  <span onClick={ this.submit }>
                    <SearchIcon colorName={ this.state.isFocused ? 'BORDER_COLOR_HOVER' : 'BORDER_COLOR' } />
                  </span>
                }
                onChange={ this.handleChange }
                onBlur={ () => this.setState({ isFocused: false }) }
                onFocus={ () => this.setState({ isFocused: true, showOverlay: this.props.autosuggest }) }
              />
            }
          </FormattedMessage>
        </div>
        <SearchOverlay
          container={ this }
          target={ this.getOverlayTarget }
          placement="bottom"
          rootClose
          show={ this.state.hasFocus || this.state.showOverlay }
          onHide={ this.handleOverlayHide }
          query={ this.state.query.length <= 2 ? '' : this.state.query }
          onMoreShoutsClick={ this.submit }
         />
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  currentLocation: getCurrentLocation(state),
  locale: getCurrentLocale(state),
  query: getQuery(state).search || '',
});

const mapDispatchToProps = dispatch => ({
  invalidateSearch: () =>
    dispatch(invalidateSearch()),
  searchTags: params =>
    dispatch(searchTags(params)),
  searchProfiles: params =>
    dispatch(searchProfiles(params)),
  searchShouts: (location, params) =>
    dispatch(searchShouts(location, params)),
  onSubmit: (query, location) =>
    dispatch(push(`/search${getLocationPath(location)}?search=${encodeURIComponent(query)}`)),
  onLocationClick: () =>
    dispatch(openModal(<LocationModal />)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Searchbar);
