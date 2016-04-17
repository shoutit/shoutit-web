import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import CategoryPicker from '../ui/CategoryPicker';
import CurrencyField from '../ui/CurrencyField';
import Form from '../ui/Form';
import LocationField from '../ui/LocationField';
import Picker from '../ui/Picker';
import TextArea from '../ui/TextArea';
import TextField from '../ui/TextField';
import UploadField from '../ui/UploadField';

if (process.env.BROWSER) {
  require('./ShoutForm.scss');
}

export class ShoutModal extends Component {

  static propTypes = {
    shout: PropTypes.object.isRequired,
    actions: PropTypes.node.isRequired,
    currencies: PropTypes.array.isRequired,
    mode: PropTypes.oneOf(['update', 'create']),
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    inputRef: PropTypes.func,
    currentLocation: PropTypes.object,
    disabled: PropTypes.bool,
    error: PropTypes.object,
  };

  static defaultProps = {
    mode: 'create',
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getShout() {
    const { mode } = this.props;
    const category = this.categoryPicker.getSelectedCategory();
    return {
      category: category ? category.slug : null,
      filters: mode === 'update' ? this.categoryPicker.getSelectedFilters() : null,
      currency: this.currencyPicker.getValue() || null,
      images: this.imageUploadField.getValue(),
      location: this.locationField.getValue(),
      mobile: this.mobileField.getValue(),
      price: this.priceField.getValue(),
      text: mode === 'update' ? this.textField.getValue() : null,
      title: this.titleField.getValue(),
    };
  }

  categoryPicker = null;
  currencyPicker = null;
  form = null;
  imageUploadField = null;
  locationField = null;
  mobileField = null;
  priceField = null;
  textField = null;
  titleField = null;

  handleSubmit() {
    this.props.onSubmit(this.getShout());
  }

  handleChange(data) {
    if (this.props.onChange) {
      this.props.onChange(data);
    }
  }

  render() {
    const { currencies, error, shout, disabled, actions, inputRef, mode } = this.props;
    return (
      <Form
        ref={ el => {
          if (inputRef) {
            inputRef(el);
          }
        }} onSubmit={ this.handleSubmit } error={ error } actions={ actions }>

        <UploadField
          ref={ el => { this.imageUploadField = el; }}
          name="images"
          resourceType="shout"
          label={ mode === 'update' ? 'Edit photos' : 'Add photos' }
          disabled={ disabled }
          urls={ shout.images }
          onChange={ images => this.handleChange({ images }) }
          error={ error }
        />

        <TextField
          ref={ el => { this.titleField = el; }}
          type="text"
          name="title"
          placeholder="Title"
          disabled={ disabled }
          block
          style={{ fontSize: '1.25rem' }}
          defaultValue={ shout.title }
          onChange={ title => this.handleChange({ title }) }
          error={ error }
        />

        { mode === 'update' &&
          <TextArea
            ref={ el => { this.textField = el; }}
            name="text"
            placeholder="Description"
            disabled={ disabled }
            block
            defaultValue={ shout.text }
            onChange={ text => this.handleChange({ text }) }
            error={ error }
          />
        }

        <CurrencyField
          ref={ el => { this.priceField = el; }}
          type="text"
          name="price"
          placeholder="Type a price"
          disabled={ disabled }
          block
          defaultValue={ shout.price }
          onChange={ price => {
            this.handleChange({ price });
          }}
          error={ error }
          startElement={
            <Picker
              name="currency"
              ref={ el => { this.currencyPicker = el; }}
              tooltipPlacement="left"
              defaultValue={ shout.currency }
              onChange={ currency => this.handleChange({ currency }) }
              error={ error }>
                <option value="">Currency</option>
                { currencies.map(currency =>
                  <option key={ currency.code } value={ currency.code }>
                    { currency.code } { currency.name }
                  </option>
                )}
            </Picker>
          } />

        <CategoryPicker
          inputRef={ el => { this.categoryPicker = el; }}
          showFilters={ mode === 'update' }
          label="Category"
          filtersClassName="Form-inset-small"
          name="category.slug"
          disabled={ disabled }
          block
          selectedCategorySlug={ shout.category ? (shout.category.slug || shout.category) : '' }
          selectedFilters={ shout.filters }
          onChange={ category =>
            this.handleChange({ category, filters: this.categoryPicker.getSelectedFilters() })
          }
          error={ error } />

        <LocationField
          onChange={ location => this.handleChange({ location }) }
          label="Location"
          error={ error }
          disabled={ disabled }
          inputRef={ el => { this.locationField = el; }}
          placeholder="Location"
          location={ shout.location }
          block
          name="location"
          type="text"
        />

        <TextField
          ref={ el => { this.mobileField = el; }}
          type="text"
          name="mobile"
          label="Let people contact you"
          placeholder="Enter a mobile number"
          disabled={ disabled }
          block
          defaultValue={ shout.mobile }
          onChange={ mobile => this.handleChange({ mobile }) }
          error={ error }
        />


      </Form>
    );
  }
}

const mapStateToProps = state => {
  const { currencies, entities } = state;
  return {
    currencies: currencies.map(code => entities.currencies[code]),
  };
};

export default connect(mapStateToProps)(ShoutModal);
