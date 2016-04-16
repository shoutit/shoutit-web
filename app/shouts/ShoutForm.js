import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Form from '../ui/Form';
import LocationField from '../ui/LocationField';
import Picker from '../ui/Picker';
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
    categories: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    inputRef: PropTypes.func,
    currentLocation: PropTypes.object,
    disabled: PropTypes.bool,
    error: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getShout() {
    return {
      price: this.refs.priceField.getValue() * 100,
      currency: this.refs.currencyPicker.getValue(),
      location: this.locationField.getValue(),
      images: this.refs.imageUploadField.getValue(),
      category: this.refs.categoryPicker.getValue(),
    };
  }

  locationField = null;
  form = null;

  handleSubmit() {
    this.props.onSubmit(this.getShout());
  }

  handleChange(data) {
    if (this.props.onChange) {
      this.props.onChange(data);
    }
  }

  render() {
    const { currencies, categories, error, shout, disabled, actions, inputRef } = this.props;
    return (
      <Form
        ref={ el => {
          this.form = el;
          if (inputRef) {
            inputRef(el);
          }
        }} onSubmit={ this.handleSubmit } error={ error } actions={ actions }>

          <UploadField
            ref="imageUploadField"
            name="images"
            resourceType="shout"
            label="Add photos"
            disabled={ disabled }
            value={ shout.images }
            onChange={ images => this.handleChange({ images }) }
            error={ error }
          />

        <TextField
          ref="titleField"
          type="text"
          name="title"
          placeholder="Title"
          disabled={ disabled }
          block
          style={{ fontSize: '1.25rem' }}
          value={ shout.title }
          onChange={ title => this.handleChange({ title }) }
          error={ error }
        />

        <TextField
          ref="priceField"
          type="text"
          name="price"
          placeholder="Type a price"
          disabled={ disabled }
          block
          value={ shout.price }
          onChange={ price => this.handleChange({ price }) }
          error={ error }
          startElement={
            <Picker
              name="currency"
              ref="currencyPicker"
              tooltipPlacement="left"
              value={ shout.currency }
              onChange={ currency => this.handleChange({ currency }) }
              error={ error }>
                <option>Currency</option>
                { currencies.map(currency =>
                  <option key={ currency.code } value={ currency.code }>
                    { currency.name }
                  </option>
                )}
            </Picker>
          } />

        <Picker
          ref="categoryPicker"
          name="category.slug"
          disabled={ disabled }
          block
          value={ shout.category }
          onChange={ category => this.handleChange({ category }) }
          error={ error }>
            <option value="other">Choose a category</option>
            { categories.map(({ slug, name }) =>
              <option value={ slug } key={ slug }>
                { name }
              </option>
            )}
        </Picker>

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
          ref="mobileField"
          type="text"
          name="mobile"
          label="Let people contact you"
          placeholder="Enter a mobile number"
          disabled={ disabled }
          block
          value={ shout.mobile }
          onChange={ mobile => this.handleChange({ mobile }) }
          error={ error }
        />


      </Form>
    );
  }
}

const mapStateToProps = state => {
  const { categories, currencies, entities } = state;
  return {
    categories: categories.ids.map(id => entities.categories[id]),
    currencies: currencies.map(code => entities.currencies[code]),
  };
};

export default connect(mapStateToProps)(ShoutModal);
