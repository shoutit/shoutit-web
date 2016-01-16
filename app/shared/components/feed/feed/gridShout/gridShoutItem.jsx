import React from 'react';
import {History} from 'react-router';
import {Image, Column} from '../../../helper';
import {ItemProp} from '../../../helper/microdata';
import currency from '../../../../consts/currencies';


export default React.createClass({
    displayName: "GridShout",
    mixins: [History],

    getDefaultProps() {
        return {
            className: '',
            index: 1,
            clearOn: 3
        }
    },

    renderThumbnail(shout) {
        return shout.thumbnail ?
            <div className="img"
                    style={{backgroundImage:`url(${shout.thumbnail.replace(/\.jpg$/i, '_medium.jpg')})`}}></div>
            : <div className="img"></div>;
    },

    onItemClick() {
        const shout = this.props.shout;
        const city = encodeURIComponent(shout.location.city);
        const title = encodeURIComponent(shout.title.replace(/\s+/g, '-'));
        this.history.pushState(null, `/shout/${shout.id}/${city}/${title}`);
    },

    render() {
        const shout = this.props.shout;
        const creator = this.props.creator;
        const currencySign = currency[shout.origCurrency]? currency[shout.origCurrency].sign: shout.origCurrency;
        const className = this.props.className || '';

        return (
            <Column size="3" clear={this.props.index % this.props.clearOn === 0}>
                <div onClick={this.onItemClick} className={className + ' si-shout-grid'}>
                    {this.renderThumbnail(shout)}
                    <ItemProp property="name">
                        <h3>{shout.title}</h3>
                    </ItemProp>
                    <span className="subtitle">{creator.name}</span>
                    <span className="price">{currencySign}&nbsp;{shout.price}</span>
                </div>
            </Column>
        );
    }
});