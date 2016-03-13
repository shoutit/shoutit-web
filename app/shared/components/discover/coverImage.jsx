import React from 'react';
import {Grid, Column} from '../helper';

import { imagesPath } from "../../../../config";
import { getVariation } from "../../../utils/APIUtils";

var defaultDiscoverCoverImage = `${imagesPath}/pattern@2x.png`;

var CoverImage = (props) => {
    const image = props.image ? getVariation(props.image, "large") : defaultDiscoverCoverImage;
    const style = {
        backgroundImage: `url(${image})`
    };
    return (
        <Grid fluid={true} style={style} className="discover-cover">
            <div className={props.image? "title with-image": "title"}>
                {props.title}
            </div>
        </Grid>
    );
};

export default CoverImage;
