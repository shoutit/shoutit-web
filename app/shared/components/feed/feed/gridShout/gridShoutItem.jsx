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
            index: 1
        }
    },

    renderThumbnail(shout) {
        return shout.thumbnail ?
            <div className="img"
                    style={{backgroundImage:`url(${shout.thumbnail.replace(/\.jpg$/i, '_medium.jpg')})`}}></div>
            : <div className="img"></div>;
    },

    onItemClick() {
        let shout = this.props.shout;
        let city = encodeURIComponent(shout.location.city);
        let title = encodeURIComponent(shout.title.replace(/\s+/g, '-'));
        this.history.pushState(null, `/shout/${shout.id}/${city}/${title}`);
    },

    render() {
        let shout = this.props.shout;
        let creator = this.props.creator;
        let currencySign = currency[shout.origCurrency]? currency[shout.origCurrency].sign: shout.origCurrency;

        return (
            <Column size="3" clear={this.props.index % 3 === 0}>
                <div onClick={this.onItemClick} className={this.props.className + ' si-shout-grid'}>
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