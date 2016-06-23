import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';

import CategoryPicker from '../ui/CategoryPicker';
import CurrencyField from '../ui/CurrencyField';
import Form from '../ui/Form';
import LocationField from '../ui/LocationField';
import Picker from '../ui/Picker';
import TextArea from '../ui/TextArea';
import TextField from '../ui/TextField';
import FileUploadField from '../ui/FileUploadField';
import PublishToFacebook from '../ui/PublishToFacebook';

import { canPublishToFacebook } from '../reducers/session';

if (process.env.BROWSER) {
  require('./ShoutForm.scss');
}

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
  currency: {
    id: 'shoutForm.currency',
    defaultMessage: 'Currency',
  },
});

export class ShoutForm extends Component {

  static propTypes = {
    shout: PropTypes.object.isRequired,
    currencies: PropTypes.array.isRequired,
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

      currency: this.currencyPicker.getValue() || null,
      price: this.priceField.getValue(),

      images: this.imageFileUploadField.getValue(),
      removedImages: this.imageFileUploadField.getFilesToDelete(),
      publish_to_facebook: this.state.publish_to_facebook,
    };
    return shout;
  }

  categoryPicker = null;
  currencyPicker = null;
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
    const { currencies, error, shout, disabled, inputRef, mode } = this.props;
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
          style={ { fontSize: '1.25rem' } }
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

        <CurrencyField
          ref={ el => { this.priceField = el; } }
          type="text"
          name="price"
          placeholder={ formatMessage(MESSAGES.price) }
          disabled={ disabled }
          value={ shout.price }
          onChange={ price => {
            this.handleChange({ price });
          } }
          error={ error }
          startElement={
            <Picker
              name="currency"
              ref={ el => { this.currencyPicker = el; } }
              tooltipPlacement="left"
              value={ shout.currency }
              onChange={ currency => this.handleChange({ currency }) }
              error={ error }>
              <option value="">
                { formatMessage(MESSAGES.currency) }
              </option>
              { currencies.map(currency =>
                <option key={ currency.code } value={ currency.code }>
                  { currency.code } { currency.name }
                </option>
              ) }
            </Picker>
          } />

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

const mapStateToProps = state => {
  const { currencies, entities, currentLocation } = state;
  return {
    canPublishToFacebook: canPublishToFacebook(state),
    currentLocation,
    currencies: currencies.map(code => entities.currencies[code]),
  };
};

export default connect(mapStateToProps)(injectIntl(ShoutForm));
