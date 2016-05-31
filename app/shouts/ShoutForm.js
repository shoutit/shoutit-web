import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import CategoryPicker from '../ui/CategoryPicker';
import CurrencyField from '../ui/CurrencyField';
import Form from '../ui/Form';
import LocationField from '../ui/LocationField';
import Picker from '../ui/Picker';
import TextArea from '../ui/TextArea';
import TextField from '../ui/TextField';
import FileUploadField from '../ui/FileUploadField';

if (process.env.BROWSER) {
  require('./ShoutForm.scss');
}

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
    disabled: PropTypes.bool,
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

  handleChange(data) {
    if (this.props.onChange) {
      this.props.onChange(data);
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
          label={ mode === 'update' ? 'Edit photos' : 'Add photos' }
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
          placeholder="Title"
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
            placeholder="Description"
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
          placeholder="Type a price"
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
              <option value="">Currency</option>
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
          label="Category"
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
          label="Location"
          error={ error }
          disabled={ disabled }
          inputRef={ el => { this.locationField = el; } }
          placeholder="Location"
          location={ shout.location }
          name="location"
          type="text"
        />

        <TextField
          ref={ el => { this.mobileField = el; } }
          type="text"
          name="mobile"
          label="Let people contact you"
          placeholder="Enter your mobile number"
          disabled={ disabled }
          value={ shout.mobile }
          onChange={ mobile => this.handleChange({ mobile }) }
          error={ error }
        />

      </Form>
    );
  }
}

const mapStateToProps = state => {
  const { currencies, entities, currentLocation } = state;
  return {
    currentLocation,
    currencies: currencies.map(code => entities.currencies[code]),
  };
};

export default connect(mapStateToProps)(ShoutForm);
