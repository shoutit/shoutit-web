import React from 'react';
import {Link} from 'react-router';
import {Grid, Column} from '../../helper';
import TagListenButton from '../../general/tagListenButton.jsx';
import UserImage from '../../user/userImage.jsx';

export default React.createClass({
    displayName: "TagRow",

    contextTypes: {
        flux: React.PropTypes.object
    },

    onButtonChange(ev) {
        if(this.props.onChange) {
            this.props.onChange(ev);
        }
    },

    render() {
        let tag = JSON.parse(JSON.stringify(this.props.tag));
        let flux = this.context.flux;

        if(tag.name) {
            return (
                <Grid fluid={true} className="popuplist-row">
                    <Column fluid={true} clear={true} size="2" >
                        <Link to={`/tag/${encodeURIComponent(tag.name)}`}>
                            <UserImage size="32" image={tag.image} type="circle"/>
                        </Link>
                    </Column>
                    <Column fluid={true} size="10" className="popuplist-text-row">
                        <Link to={`/tag/${encodeURIComponent(tag.name)}`}>
                            {tag.name}
                        </Link>
                    </Column>
                    <Column fluid={true} size="3" style={{paddingTop: "5px"}}>
                        <TagListenButton tag={tag}
                                         hasTitle={false}
                                         onChange={this.}
                                         flux={flux}
                                         />
                    </Column>
                </Grid>
            );
        } else {
            return null;
        }
    }
});
