import React from 'react';
import {Grid, Column} from '../helper';

// TODO: Change it to shoutit default cover (for discover page)
var defaultDiscoverCoverImage = 'http://luminous-landscape.com/articleImages/KWR_Home_Page_Images/Whats_New_Images/V10-DSF1668-Flat.jpg'

var CoverImage = (props) => {
    const image = props.image || defaultDiscoverCoverImage;
    const style = {
        backgroundImage: `url(${image})`
    };
    return (
        <Grid fluid={true} style={style} className="discover-cover">
            <div className={image? "title with-image": "title"}>
                {props.title}
            </div>
        </Grid>
    );
}

export default CoverImage;