import React from 'react';
import ReactDOMServer from 'react-dom/server';
import assign from 'lodash/object/assign';

export default React.createClass({
    displayName: 'Separator',

    propTypes: {
        image: React.PropTypes.string
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

    getProfileSVG() {
        let imageAddr = this.getSmallUrl(this.props.image);
        return {
            __html: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100">\
                        <image xlink:href=${imageAddr} width="100" height="100" preserveAspectRatio="xMidYMid" clip-path="url(#clip)"/>\
                        <defs>\
                            <clipPath id="clip">\
                                <path d="M96.228,74.308 C92.786,80.643 83.583,86.058 77.115,89.716 C69.795,93.856 59.356,99.584 50.835,99.982 C43.307,100.333 33.742,95.509 27.156,92.046 C19.702,88.126 9.232,82.448 4.607,75.674 C0.521,69.69 0.16,59.451 0.041,52.33 C-0.094,44.27 -0.124,32.864 3.772,25.692 C7.214,19.357 16.417,13.942 22.885,10.284 C30.205,6.144 40.644,0.416 49.165,0.018 C56.693,-0.333 66.258,4.491 72.844,7.954 C80.298,11.874 90.768,17.552 95.393,24.326 C99.479,30.31 99.84,40.549 99.959,47.67 C100.094,55.73 100.124,67.136 96.228,74.308 z"/>\
                            </clipPath>\
                        </defs>\ 
                    </svg>`
        }  
    },

    render() {
        let style = {}

        if(this.props.style) {
            assign(style, this.props.style);
        }
        
        return (
            <div className="profile-photo-holder"
                 style={style}
                 onClick={this.props.onUserClick}
                 onMouseDown={this.props.onUserMouseDown}
                 onMouseUp={this.props.onUserMouseUp}
                 dangerouslySetInnerHTML={this.getProfileSVG()}
                 >
            </div>
            );
    }
});