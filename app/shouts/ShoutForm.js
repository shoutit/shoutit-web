import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';

import CategoryFiltersPicker from '../forms/CategoryFiltersPicker';
import CategoryPicker from '../forms/CategoryPicker';
import PriceField from '../forms/PriceField';
import Form from '../forms/Form';
import LocationField from '../forms/LocationField';
import TextArea from '../forms/TextArea';
import TextField from '../forms/TextField';
import FileUploadField from '../forms/FileUploadField';
import PublishToFacebook from '../forms/PublishToFacebook';

import { canPublishToFacebook } from '../reducers/session';
import { getCurrentLocation } from '../reducers/currentLocation';

import './ShoutForm.scss';

const MESSAGES = defineMessages({
  editPhotos: {
    id: 'shoutForm.editPhotos.label',
    defaultMessage: 'Edit photos',
  },
  addPhotos: {
    id: 'shoutForm.addPhotos.label',
    defaultMessage: 'Add photos',
  },
  title: {
    id: 'shoutForm.title.placeholder',
    defaultMessage: 'Title',
  },
  description: {
    id: 'shoutForm.description.placeholder',
    defaultMessage: 'Description',
  },
  price: {
    id: 'shoutForm.price.placeholder',
    defaultMessage: 'Type a price',
  },
  location: {
    id: 'shoutForm.location.label',
    defaultMessage: 'Shout location',
  },
  category: {
    id: 'shoutForm.category.placeholder',
    defaultMessage: 'Category',
  },
  mobilePlaceholder: {
    id: 'shoutForm.mobile.placeholder',
    defaultMessage: 'Enter your mobile number',
  },
  mobileLabel: {
    id: 'shoutForm.mobile.label',
    defaultMessage: 'Let people contact you',
  },
});

export class ShoutForm extends Component {

  static propTypes = {
    shout: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(['update', 'create']),
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    onUploadStart: PropTypes.func,
    onUploadEnd: PropTypes.func,
    inputRef: PropTypes.func,
    currentLocation: PropTypes.object,
    intl: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    canPublishToFacebook: PropTypes.bool,
    error: PropTypes.object,
  };

  static defaultProps = {
    mode: 'create',
    isUploadingFiles: false,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleUploadEnd = this.handleUploadEnd.bind(this);
    this.state = this.getStateFromProps(props);
  }

  getStateFromProps(props) {
    const filters = {};
    if (props.shout.filters) {
      props.shout.filters.forEach(filter => {
        filters[filter.slug] = filter.value.id;
      });
    }
    return {
      shout: {
        ...props.shout,
        category: props.shout.category ? (props.shout.category.slug || props.shout.category) : null,
      },
      filters,
      publishToFacebook: props.canPublishToFacebook,
    };
  }

  /**
   * Get the selected filters in the form our API requires them.
   * @return {Array}
   */
  getFiltersFromState() {
    const filtersArray = Object.keys(this.state.filters).map(key => ({
      slug: key,
      value: {
        id: this.state.filters[key],
      },
    })).filter(filter => !!filter.value.id);
    return filtersArray;
  }

  getShout() {
    const shout = {
      ...this.state.shout,
      filters: this.getFiltersFromState(),
      publish_to_facebook: this.state.publishToFacebook,
    };
    return shout;
  }

  submit() {
    this.props.onSubmit(this.getShout());
  }

  handleChange(state) {
    this.setState(state, () => {
      if (this.props.onChange) {
        this.props.onChange(this.getShout());
      }
    });
  }

  handleShoutChange(prop) {
    const shout = Object.assign({}, this.state.shout, prop);
    this.setState({ shout }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.getShout());
      }
    });
  }

  handleUploadStart() {
    this.setState({ isUploadingFiles: true });
    if (this.props.onUploadStart) {
      this.props.onUploadStart();
    }
  }

  handleUploadEnd() {
    this.setState({ isUploadingFiles: false });
    if (this.props.onUploadEnd) {
      this.props.onUploadEnd();
    }
  }

  render() {
    const { error, shout, disabled, mode, intl } = this.props;
    return (
      <Form
        className="ShoutForm"
        onSubmit={ this.submit }
        error={ error }>

        <FileUploadField
          ref={ el => { this.imageFileUploadField = el; } }
          name="images"
          resourceType="shout"
          label={ mode === 'update' ?
            intl.formatMessage(MESSAGES.editPhotos) :
            intl.formatMessage(MESSAGES.addPhotos)
          }
          disabled={ disabled }
          initialFileUrls={ this.state.shout.images }
          onChange={ images => this.handleShoutChange({ images }) }
          onUploadStart={ this.handleUploadStart }
          onUploadEnd={ this.handleUploadEnd }
          error={ error }
        />

        <TextField
          type="text"
          name="title"
          placeholder={ intl.formatMessage(MESSAGES.title) }
          disabled={ disabled }
          value={ this.state.shout.title }
          onChange={ title => this.handleShoutChange({ title }) }
          error={ error }
        />

        { mode === 'update' &&
          <TextArea
            maxLength={ 1000 }
            autosize
            rows={ 2 }
            maxRows={ 10 }
            name="text"
            placeholder={ intl.formatMessage(MESSAGES.description) }
            disabled={ disabled }
            value={ this.state.shout.text }
            onChange={ text => this.handleShoutChange({ text }) }
            error={ error }
          />
        }

        <PriceField
          showCurrencies
          type="text"
          name="price"
          errorLocation={ ['currency', 'price'] }
          placeholder={ intl.formatMessage(MESSAGES.price) }
          disabled={ disabled }
          value={ this.state.shout.price }
          currencyValue={ this.state.shout.currency }
          onChange={ price => this.handleShoutChange({ price }) }
          onCurrencyChange={ currency => this.handleShoutChange({ currency }) }
          error={ error }
        />

        <CategoryPicker
          label={ intl.formatMessage(MESSAGES.category) }
          name="category.slug"
          disabled={ disabled }
          selectedCategorySlug={ this.state.shout.category }
          onChange={ category => {
            this.handleChange({ filters: {} });
            this.handleShoutChange({ category });
          } }
          error={ error } />

        { mode === 'update' && this.state.shout.category &&
          <CategoryFiltersPicker
            name="filters"
            id="ShoutForm_filters"
            selectedFilters={ this.state.filters }
            disabled={ disabled }
            onChange={ filters => this.handleChange({ filters }) }
            categorySlug={ this.state.shout.category.slug || this.state.shout.category }
            error={ error }
          />
        }

        <LocationField
          updatesUserLocation={ false }
          onChange={ location => this.handleShoutChange({ location }) }
          error={ error }
          disabled={ disabled }
          label={ intl.formatMessage(MESSAGES.location) }
          location={ this.state.shout.location }
          name="location"
          type="text"
        />

        <TextField
          type="text"
          name="mobile"
          label={ intl.formatMessage(MESSAGES.mobileLabel) }
          placeholder={ intl.formatMessage(MESSAGES.mobilePlaceholder) }
          disabled={ disabled }
          value={ this.state.shout.mobile }
          onChange={ mobile => this.handleShoutChange({ mobile }) }
          error={ error }
        />

        { !shout.id &&
          <div style={ { marginTop: '1em' } }>
            <PublishToFacebook
              disabled={ this.props.disabled }
              checked={ this.state.publishToFacebook }
              onChange={ publishToFacebook => this.handleChange({ publishToFacebook }) }
            />
          </div>
        }

      </Form>
    );
  }
}

const mapStateToProps = state => ({
  canPublishToFacebook: canPublishToFacebook(state),
  currentLocation: getCurrentLocation(state),
});

export default connect(mapStateToProps)(injectIntl(ShoutForm));
