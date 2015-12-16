import React from 'react';
import {Link} from 'react-router';
import {Image} from '../helper';
import TagListenButton from '../general/tagListenButton.jsx';

export default React.createClass({
    displayName: "TagRow",

    onButtonChange(ev) {
        if(this.props.onChange) {
            this.props.onChange(ev);
        }
    },

    render() {
        let tag = this.props.tag;
        let flux = this.props.flux;

        return (
            <div className="listener-dt">
                <div className="listener-dt-img">
                    <Image infix="user" size="small" src={tag.image}/>
                </div>
                <div className="listener-dt-info">
                    <h4>{tag.name}&nbsp;
                        (
                        <Link to="tag" params={{tagName: encodeURIComponent(tag.name)}}>
                            {tag.name}
                        </Link>
                        )
                    </h4>
                   <TagListenButton tag={JSON.parse(JSON.stringify(tag))} onChange={this.onButtonChange} flux={flux}/>
                </div>
            </div>
        );
    }
});
