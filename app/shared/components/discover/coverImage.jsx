import React from 'react';
import {Grid, Column} from '../helper';

import { imagesPath } from "../../../../config";

var defaultDiscoverCoverImage = `${imagesPath}/pattern.png`;

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
};

export default CoverImage;
