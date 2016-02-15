import React from 'react';
import {Link} from 'react-router';
import assign from 'lodash/object/assign';

export default React.createClass({
  displayName: "UserImage",

  proprTypes: {
    height: React.PropTypes.string,
    width: React.PropTypes.string,
    size: React.PropTypes.string,
    // Choice (circle, rounded, rounded2x, square)
    type: React.PropTypes.string,
    // no need to specify image if user object is already passed
    image: React.PropTypes.string,
    user: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      size: '32',
      type: "circle",
      clickable: false,
      classname: ''
    }
  },

  getSmallUrl(imageUrl) {
    let sizedUrl = imageUrl;

    sizedUrl = sizedUrl.replace("http://", "https://");

    if (sizedUrl.indexOf("user-image.static.shoutit") > -1) {
      sizedUrl = sizedUrl
        .replace(".jpg", "_small.jpg")
        .replace(".jpeg", "_small.jpeg");
    } else if (sizedUrl.indexOf("hqdefault") > -1) {
      sizedUrl = sizedUrl.replace("hqdefault", this.props.ytSize + "default");
    }
    return sizedUrl;
  },

  generateStyle() {
    const img = this.props.user? this.props.user.image: this.props.image;
    const url = this.props.size <= 64? this.getSmallUrl(img): img;
    let style = {
      "height": this.props.height ? this.props.height + "px":
          this.props.size? this.props.size + "px": "32px",
      "width": this.props.width ? this.props.width + "px":
          this.props.size? this.props.size + "px": "32px",
      "backgroundColor": "#edefed",
      "backgroundImage": "url(" + url + ")",
      "backgroundSize": "cover",
      "backgroundRepeat": "no-repeat"
    };

    if(this.props.style) {
      assign(style, this.props.style);
    }

    if(this.props.type === 'circle') {
      style.borderRadius = this.props.height? (this.props.height / 2) + "px" : "16px";
    } else if(this.props.type === 'rounded') {
      style.borderRadius = "5px";
    } else if(this.props.type === 'rounded2x') {
      style.borderRadius = "10px";
    } if(this.props.type === 'square') {
      style.borderRadius = "0";
    }

    return style;
  },

  render() {
    const style = this.generateStyle();
    const {className, clickable, user} = this.props;

    if(user) {
      return (
        <Link to={`/user/${user.username}`}>
          <div className={className + " user-image"} style={style}/>
        </Link>
        );
    } else {
      return (
        <div className={className + " user-image"} style={style}/>
      );
    }
    
  }
});
