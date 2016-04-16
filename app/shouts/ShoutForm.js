import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Frame from '../layout/Frame';

import Button from '../ui/Button';
import LocationField from '../ui/LocationField';
import Picker from '../ui/Picker';
import SegmentedControl from '../ui/SegmentedControl';
import TextField from '../ui/TextField';
import UploadField from '../ui/UploadField';

import { createShout } from '../actions/shouts';
import { getUnixTime } from '../utils/DateUtils';

if (process.env.BROWSER) {
  require('../styles/Form.scss');
  require('./ShoutForm.scss');
}

export class ShoutModal extends Component {

  static propTypes = {
    shout: PropTypes.object,
    shoutId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    onCancelClick: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool,
    currentLocation: PropTypes.object,
    error: PropTypes.object,
    loggedUser: PropTypes.object.isRequired,
    currencies: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  locationField = null;

  handleSubmit(e) {
    e.preventDefault();

    const { dispatch, loggedUser, shoutId, shout, onSuccess } = this.props;

    if (shout && shout.isCreating) {
      return;
    }

    const newShout = {
      id: shoutId,
      createdAt: getUnixTime(),
      profile: loggedUser.id,
      title: this.refs.titleField.getValue(),
      price: this.refs.priceField.getValue() * 100,
      currency: this.refs.currencyPicker.getValue(),
      location: this.locationField.getValue(),
      images: this.refs.imageUploadField.getValue(),
      type: this.refs.shoutTypePicker.getValue(),
      category: this.refs.categoryPicker.getValue(),
    };

    dispatch(createShout(loggedUser, newShout)).then(payload => {
      if (onSuccess) {
        onSuccess();
      }
      dispatch(push(`/shout/${payload.result}?create=success`));
    });

  }

  render() {
    const { onCancelClick, currencies, currentLocation, categories, error } = this.props;
    return (
      <Frame className="ShoutForm" transparent style={{ width: '100%', margin: 0, padding: '0 .875rem' }} title="New shout">
        <form style={{ marginTop: '1rem' }} onSubmit={ this.handleSubmit } className="Form">

          <SegmentedControl error={ error } ref="shoutTypePicker" name="type" options={ [
            { label: 'Offer', value: 'offer', checked: true },
            { label: 'Request', value: 'request' },
          ]} />

          <UploadField error={ error } resourceType="shout" name="images" ref="imageUploadField" label="Add photos" />

          <TextField error={ error } style={{ fontSize: '1.25rem' }} block placeholder="Describe what you are shouting" type="text" ref="titleField" />

          <Picker error={ error } block ref="categoryPicker" name="category.slug">
            <option value="other">Choose a category</option>
            { categories.map(({ slug, name }) =>
              <option value={ slug } key={ slug }>
                { name }
              </option>
            )}
          </Picker>

          <TextField name="price" error={ error } block placeholder="Type a price" type="text" ref="priceField"
            startElement={ <Picker tooltipPlacement="left" error={ error }
              ref="currencyPicker"
              name="currency">
              <option>Currency</option>
              { currencies.map(currency =>
                <option key={ currency.code } value={ currency.code }>
                  { currency.name }
                </option>
              )}
              </Picker>
          } />

          <LocationField
            error={ error }
            inputRef={ el => { this.locationField = el; }}
            placeholder="Location"
            initialValue={ currentLocation }
            block
            name="location"
            type="text" />

          <div className="ShoutForm-buttons">
            <Button type="button" label="Cancel" onClick={ onCancelClick } />
            <Button primary label="Publish" />
          </div>

        </form>
      </Frame>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { currentLocation, categories, currencies, entities, session } = state;

  const shout = entities.shouts[ownProps.shoutId];
  const error = shout ? (shout.createError || shout.updateError) : null;

  return {
    shout,
    error,
    currentLocation,
    loggedUser: session.user,
    categories: categories.ids.map(id => entities.categories[id]),
    currencies: currencies.map(code => entities.currencies[code]),
  };
};

export default connect(mapStateToProps)(ShoutModal);
