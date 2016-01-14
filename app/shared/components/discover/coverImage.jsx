import React from 'react';
import {Grid, Column} from '../helper';

var CoverImage = (props) => {
    // TODO: Remove the temporary image placeholder
    let image = props.image || 'http://luminous-landscape.com/articleImages/KWR_Home_Page_Images/Whats_New_Images/V10-DSF1668-Flat.jpg';
    const style = {
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        height: '120px'
    };
    return (
        <Grid fluid={true} style={style}>
            {props.title}
        </Grid>
    );
}

export default CoverImage;