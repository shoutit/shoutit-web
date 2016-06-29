import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';

import CategoryPicker from '../ui/CategoryPicker';
import PriceField from '../ui/PriceField';
import Form from '../ui/Form';
import LocationField from '../ui/LocationField';
import TextArea from '../ui/TextArea';
import TextField from '../ui/TextField';
import FileUploadField from '../ui/FileUploadField';
import PublishToFacebook from '../ui/PublishToFacebook';

import { canPublishToFacebook } from '../reducers/session';

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
    this.state = {
      publish_to_facebook: props.canPublishToFacebook,
    };
  }

  getShout() {
    const { mode } = this.props;
    const category = this.categoryPicker.getSelectedCategory();
    const shout = {
      title: this.titleField.getValue(),
      text: mode === 'update' ? this.textField.getValue() : null,
      location: this.locationField.getValue(),
      mobile: this.mobileField.getValue(),

      category: category ? category.slug : null,
      filters: mode === 'update' ? this.categoryPicker.getSelectedFilters() : [],

      currency: this.state.currency || null,
      price: this.priceField.getValue(),

      images: this.imageFileUploadField.getValue(),
      removedImages: this.imageFileUploadField.getFilesToDelete(),
      publish_to_facebook: this.state.publish_to_facebook,
    };
    console.log(shout);
    return shout;
  }

  categoryPicker = null;
  currencySelect = null;
  form = null;
  imageFileUploadField = null;
  locationField = null;
  mobileField = null;
  priceField = null;
  textField = null;
  titleField = null;

  submit() {
    this.props.onSubmit(this.getShout());
  }

  handleChange(state) {
    this.setState(state);
    if (this.props.onChange) {
      console.log(state);
      this.props.onChange(state);
    }
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
    const { error, shout, disabled, inputRef, mode } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Form
        className="ShoutForm"
        ref={ inputRef ? () => inputRef(this) : null }
        onSubmit={ this.submit }
        error={ error }>

        <FileUploadField
          ref={ el => { this.imageFileUploadField = el; } }
          name="images"
          resourceType="shout"
          label={ mode === 'update' ?
            formatMessage(MESSAGES.editPhotos) :
            formatMessage(MESSAGES.addPhotos)
          }
          disabled={ disabled }
          initialFileUrls={ shout.images }
          onChange={ images => this.handleChange({ images }) }
          onUploadStart={ this.handleUploadStart }
          onUploadEnd={ this.handleUploadEnd }
          error={ error }
        />

        <TextField
          ref={ el => { this.titleField = el; } }
          type="text"
          name="title"
          placeholder={ formatMessage(MESSAGES.title) }
          disabled={ disabled }
          value={ shout.title }
          onChange={ title => this.handleChange({ title }) }
          error={ error }
        />

        { mode === 'update' &&
          <TextArea
            autosize
            rows={ 2 }
            maxRows={ 10 }
            ref={ el => { this.textField = el; } }
            name="text"
            placeholder={ formatMessage(MESSAGES.description) }
            disabled={ disabled }
            value={ shout.text }
            onChange={ text => this.handleChange({ text }) }
            error={ error }
          />
        }

        <PriceField
          showCurrencies
          ref={ el => { this.priceField = el; } }
          type="text"
          name="price"
          errorLocation={ ['currency', 'price'] }
          placeholder={ formatMessage(MESSAGES.price) }
          disabled={ disabled }
          value={ shout.price }
          currencyValue={ shout.currency }
          onChange={ price => this.handleChange({ price }) }
          onCurrencyChange={ currency => this.handleChange({ currency }) }
          error={ error }
        />

        <CategoryPicker
          inputRef={ el => { this.categoryPicker = el; } }
          showFilters={ mode === 'update' }
          label={ formatMessage(MESSAGES.category) }
          filtersClassName="Form-inset-small"
          name="category.slug"
          disabled={ disabled }
          selectedCategorySlug={ shout.category ? (shout.category.slug || shout.category) : '' }
          selectedFilters={ shout.filters }
          onChange={ category =>
            this.handleChange({ category, filters: this.categoryPicker.getSelectedFilters() })
          }
          error={ error } />

        <LocationField
          updatesUserLocation={ false }
          onChange={ location => this.handleChange({ location }) }
          error={ error }
          disabled={ disabled }
          inputRef={ el => { this.locationField = el; } }
          label={ formatMessage(MESSAGES.location) }
          location={ shout.location }
          name="location"
          type="text"
        />

        <TextField
          ref={ el => { this.mobileField = el; } }
          type="text"
          name="mobile"
          label={ formatMessage(MESSAGES.mobileLabel) }
          placeholder={ formatMessage(MESSAGES.mobilePlaceholder) }
          disabled={ disabled }
          value={ shout.mobile }
          onChange={ mobile => this.handleChange({ mobile }) }
          error={ error }
        />

        { !shout.id &&
          <div style={ { marginTop: '1em' } }>
            <PublishToFacebook
              disabled={ this.props.disabled }
              defaultChecked={ this.props.canPublishToFacebook }
              onChange={ publish_to_facebook => this.handleChange({ publish_to_facebook }) }
            />
          </div>
        }

      </Form>
    );
  }
}

const mapStateToProps = state => ({
  canPublishToFacebook: canPublishToFacebook(state),
  currentLocation: state.currentLocation,
});

export default connect(mapStateToProps)(injectIntl(ShoutForm));
