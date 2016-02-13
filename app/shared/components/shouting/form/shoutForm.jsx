import React from 'react';
import Router from 'react-router';
import {History} from 'react-router';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import {Button, Input, DropdownButton, MenuItem, Tooltip} from 'react-bootstrap';
import Overlay from 'react-overlays/lib/Overlay';
import TagsInput from 'react-tagsinput';
import DropzoneComponent from 'react-dropzone-component';
import {ReactVisible, Column, Grid, Icon} from '../../helper';
import UserImage from '../../user/userImage.jsx';
import LocationSearch from '../../general/locationSearch.jsx';
import map from 'lodash/collection/map';
import Clearfix from '../../helper/clearFix.jsx';

const shoutTypes = {
  offer: "Offers",
  request: "Requests"
};

export default React.createClass({
  displayName: "ShoutForm",
  mixins: [History],

  getInitialState() {
    return {
      gmap: null,
      marker: null,
      files: [],
      touched: {}
    };
  },

  componentDidMount() {
    this.props.flux.actions.changeShoutDraft("latLng", this.props.current.location);
  },

  renderUserImage() {
    return (
      <UserImage image={this.props.user.image} type="circle" height={40} width={40} />
      );
  },

  renderTitleInput() {
    let userImage = this.props.collapsed? this.renderUserImage(): null;

    return (
      <div>
        {userImage}
        <Input type="text"
             className="shout-form-title"
             placeholder="What are you Shouting ..."
             value={this.props.draft.title}
             ref="title"
             onFocus={ () => {
               this.props.onUserFocus && this.props.onUserFocus({focused: true });
             }}
             onChange={this.onTextChange("title")}
          />
        <ReactVisible condition={this.props.collapsed}>
          <Icon name="upload_image" className="shout-form-title-icon" />
        </ReactVisible>
      </div>
    );
  },

  onTextChange(key) {

    return function (event) {
      this.props.flux.actions.changeShoutDraft(key, event.target.value);
      this.onTouch(key);
    }.bind(this);
  },

  renderPriceInput() {
    return (
      <Input type="number"
           className="shout-form-price"
           ref="price"
           placeholder="Type Price..."
           min="0"
           value={this.props.draft.price}
           onChange={this.onTextChange('price')}
        />
    );
  },

  renderCurrencyDropdown() {
    let currencies = map(this.props.currencies, (currency) => (
        <MenuItem  eventKey={"currency:" + currency.code} key={currency.code}>
          {currency.name + "(" + currency.code + ")"}
        </MenuItem>

        )
    );

    let selected = this.props.draft.currency,
      title = selected ? selected.name : "Select a currency";

    return (
      <DropdownButton
        className="shout-form-dropdown"
        style={{marginLeft: '17px'}}
        ref="currency"
        onSelect={this.onCurrencySelect}
        title={title}>
        {currencies}
      </DropdownButton>
    );
  },

  renderCategoryDropdown() {
    let categories = map(this.props.categories, (category, i) => (
        <MenuItem  eventKey={"category:" + i} key={i} className="shout-form-cat">
          {category.name}
        </MenuItem>)
    );

    let selected = this.props.draft.category,
      title = selected ? selected.name : "Select a category";

    return (
      <DropdownButton
        className="shout-form-dropdown"
        block
        ref="category"
        onSelect={this.onCategorySelect}
        title={title}>
        {categories}
      </DropdownButton>
    );
  },

  renderImageUpload() {
    let componentConfig = {
      allowedFiletypes: ['.jpg', '.png'],
      showFiletypeIcon: true,
      postUrl: '/services/image_upload'
    };
    let eventHandlers = {
      init: null,
      addedfile: null,
      removedfile: this.onImageRemoved,
      uploadprogress: null,
      sending: null,
      success: this.onImageUploaded,
      complete: null,
      maxfilesexceeded: null
    };
    var djsConfig = {
      paramName: "shout_image",
      maxFilesize: 5, // 5 MB
      addRemoveLinks: true,
      maxFiles: 7,
      dictCancelUpload:'',
      method: "POST"
    };
    return <DropzoneComponent config={componentConfig}
                       eventHandlers={eventHandlers}
                       djsConfig={djsConfig}/>;
  },


  onImageUploaded(file, resp) {
    let files = this.state.files.slice(),
      filesList=[];

    files.push({name: file.name,remoteName: resp});
    filesList = files.map((item)=>item.remoteName);

    this.setState({files:files});
    this.props.flux.actions.changeShoutDraft("images", filesList);
    this.onTouch('images');
  },

  onImageRemoved(file) {
    let files = this.state.files.slice(),
      cleanedFiles,
      deletedImageName,
      filesList=[];

    // getting the name of the image on s3 server and removing url part
    deletedImageName = files.filter((item)=> item.name === file.name)[0]
        .remoteName.match(/[^\/]*$/)[0];
    cleanedFiles = files.filter((val) => val.name !== file.name);
    filesList = cleanedFiles.map((item)=>item.remoteName);

    this.setState({files:cleanedFiles});
    this.props.flux.actions.changeShoutDraft("images", filesList);
    this.props.flux.actions.removeShoutImage(deletedImageName);
  },

  onCurrencySelect(ev, key) {
    this.onTouch('currency');
    let code = key.split(":")[1];
    this.props.flux.actions.changeShoutDraft("currency", this.props.currencies[code]);
  },

  onCategorySelect(ev, key) {
    this.onTouch('category');
    let index = key.split(":")[1];
    this.props.flux.actions.changeShoutDraft("category", this.props.categories[index]);
  },

  renderDescTextArea() {
    return (
      <Input type='textarea'
           rows="3"
           ref="text"
           onChange={this.onTextChange('text')}
           value={this.props.draft.text}
           placeholder="Description"/>
    );
  },

  renderTypeSelect() {
    let options = map(shoutTypes, (value, key) => {
      return (
        <MenuItem key={key} eventKey={"type:" + key}>
          {value}
        </MenuItem>
      );
    });


    let title = shoutTypes[this.props.draft.type];

    return (
      <div>
        {this.renderUserImage()}
        <DropdownButton
          className="shout-form-dropdown shout-form-type"
          onSelect={this.onTypeSelect}
          title={title}>
          {options}
        </DropdownButton>
      </div>
    );
  },

  onTypeSelect(ev, key) {
    let type = key.split(":")[1];
    this.props.flux.actions.changeShoutDraft("type", type);
  },

  renderTagInput() {
    return (
      <div className="form-group">
        <TagsInput ref='tags' value={this.props.draft.tags}
               onChange={this.onTagsChange}
               placeholder="Add a key word" addKeys={[9, 13, 32]}>
        </TagsInput>
      </div>
    );
  },

  onTagsChange(newTags) {
    this.props.flux.actions.changeShoutDraft("tags", newTags);
  },

  componentDidUpdate(prevProps) {
    let status = this.props.status || {};
    if(status.id && !prevProps.status.id) {
      // Shout sent successfully
      let shoutPath = status.web_url.match(/\/[^\/]*\/[^\/]*$/)[0];
      if(this.props.onUserFocus) {
        this.props.onUserFocus({focused: false});
      }
      if(this.props.onShoutSent) {
        this.props.onShoutSent(true);
      }
      this.clearForms();
      setTimeout(() => {
        this.history.pushState(null, shoutPath);
      },1000);
    }
  },

  clearForms() {
    let {title, text, price} = this.refs;

    title.value = '';
    text.value =  '';
    price.value = '';
  },

  getErrorTooltip(errorField) {
    let status = this.props.status;
    return <Tooltip>{status[errorField]}</Tooltip>;
  },

  getErrorProps(errorField) {
    if(this.props.status[errorField]) {
      return {
        show: !this.state.touched[errorField],
        container: this,
        target: () => ReactDOM.findDOMNode(this.refs[errorField]),
        placement: 'bottom'
      }
    }
  },

  onTouch(elm) {
    // flag element as touched
    let touched = this.state.touched;
    touched[elm] = true;
    this.setState({touched:touched});
  },

  clearTouches() {
    this.setState({touched:{}});
  },

  renderAlerts() {
    if(!this.props.status.id && !this.props.collapsed) {
      return (
        <section>
          <Overlay {...this.getErrorProps('title')} >
            {this.getErrorTooltip('title')}
          </Overlay>
          <Overlay {...this.getErrorProps('text')} >
            {this.getErrorTooltip('text')}
          </Overlay>
          <Overlay {...this.getErrorProps('currency')} >
            {this.getErrorTooltip('currency')}
          </Overlay>
          <Overlay {...this.getErrorProps('price')} >
            {this.getErrorTooltip('price')}
          </Overlay>
          <Overlay {...this.getErrorProps('category')} >
            {this.getErrorTooltip('category')}
          </Overlay>
          <Overlay {...this.getErrorProps('location')} >
            {this.getErrorTooltip('location')}
          </Overlay>
        </section>
      );
    }
  },

  onLocationSelect(newLatLng) {
    this.onTouch('location');
    this.props.flux.actions.changeShoutDraft("latLng", newLatLng);
  },


  render() {
    let collapsed = this.props.collapsed;

    return (
      <div className={collapsed? 'shout-form collapsed': 'shout-form'} >
        <form>
          {this.renderAlerts()}
          <Grid fluid={true} >
            <ReactVisible condition={!collapsed}>
              <Column fluid={true} clear={true} size="4" className="shout-form-type">
                {this.renderTypeSelect()}
              </Column>
            </ReactVisible>
            <Column fluid={true} size={collapsed? '0': '11'}>
              {this.renderTitleInput()}
            </Column>
          </Grid>
          <ReactVisible condition={!collapsed}>
            <Grid fluid={true} className="shout-form-desc">
              {this.renderDescTextArea()}
            </Grid>

            <Grid fluid={true}>
              <Column fluid={true} clear={true} size="5">
                {this.renderCategoryDropdown()}
              </Column>
              <Column fluid={true} size="6">
                {this.renderPriceInput()}
              </Column>
              <Column fluid={true} size="4">
                {this.renderCurrencyDropdown()}
              </Column>
            </Grid>

            <Grid fluid={true}>
              {this.renderImageUpload()}
            </Grid>
            <Grid fluid={true} style={{marginTop:'20px'}}>
              <Column fluid={true} clear={true} size="11">
                <LocationSearch onSelect={this.onLocationSelect} ref="location" flux={this.props.flux} />
              </Column>
              <Column fluid={true} size="4">
                <Button onClick={this.onSubmit} style={{float:'right'}} disabled={this.props.waiting} className="shout-btn">
                  {this.props.waiting? "Loading...": "Create Shout"}
                </Button>
              </Column>
            </Grid>
          </ReactVisible>

        </form>
      </div>
    );
  },

  onSubmit() {
    this.props.flux.actions.sendShout();
    this.clearTouches();

  }
});

/*
<LocationSelection
  onChange={this.onLocationSelectionChange}
  flux={this.props.flux}
  ref="location"
  selected={this.props.draft.latLng || this.props.current.location}
  startLocation={this.props.current.location}
  />onBlurCapture={this.onUserFocus({focused: false})}
*/
