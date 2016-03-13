import React from 'react';
import {Icon} from '../helper';
// import Sticky from 'react-sticky';

const DropDownMenu = require('material-ui/lib/drop-down-menu');

export default React.createClass({
    displayName: "SearchFilters",

    getInitialState() {
        return {
            min: this.props.min,
            max: this.props.max,
            tags: this.props.tags,
            shouttype: this.props.shouttype || 'all',
            cat: this.props.category || 'all'
        }
    },

    onKeyUp(ev) {
        if (ev.which === 13) {
            this.onSubmit();
        }
    },

    getIndexOfObject(array, attr, value) {
        for(var i = 0; i < array.length; i++) {
            if(array[i].hasOwnProperty(attr) && array[i][attr] === value) {
                return i;
            }
        }
        return 0;
    },

    renderFilters() {
        let categories = this.props.search.categories;
        let catItems = categories.length? categories.map(function(item,idx) {
            return {payload: item.slug, text: item.name}}): [];

      catItems.unshift({payload: 'all', text: 'All Categories'});

        let shouttypeItems = [
           { payload: 'all', text: 'All' },
           { payload: 'offer', text: 'Offers' },
           { payload: 'request', text: 'Request' }
        ];

        let shouttypeIdx = this.getIndexOfObject(shouttypeItems, 'payload', this.state.shouttype);
        let catIdx = this.getIndexOfObject(catItems, 'payload', this.state.cat);

        let dropdownStyle = {
            style: {
                border: '1px solid #989899',
                width: '100%',
                borderRadius:'3px',
                height: '30px'
            },
            menuItemStyle: {
                paddingLeft: '10px',
                lineHeight:'27px',
                fontSize: '13px',
                paddingTop: '5px'
            },
            labelStyle: {
                lineHeight:'27px',
                fontSize: '13px',
                paddingLeft: '10px',
                color: '#989899'
            },
            iconStyle: {
                top: '0',
                right: '0',
                fill: '#989899'
            },
            underlineStyle: {
                display: 'none'
            }
        }

        return (
            <div>
                <div>
                    <DropDownMenu menuItems={shouttypeItems}
                                  onChange={this.handleTypeChange}
                                  autoWidth={false}
                                  selectedIndex={shouttypeIdx}
                                  {...dropdownStyle}
                                   />
                    <DropDownMenu menuItems={catItems}
                                  className="search-card-catselect"
                                  onChange={this.handleCategoryChange}
                                  selectedIndex={catIdx}
                                  autoWidth={false}
                                  {...dropdownStyle}
                                   />
                    <div>
                        <h4>Price range:</h4>
                        <span>
                            <input type="number" placeholder="0" min="0" defaultValue={this.state.min}
                                    name="min" ref="min" onInput={this.handlePrice}/>
                            <span style={{marginRight: '10px'}}>To</span>
                            <input type="number" placeholder="100" min="0" defaultValue={this.state.max}
                                    name="max" ref="max" onInput={this.handlePrice}/>
                        </span>
                    </div>

                </div>
                <span className="search-card-btn" onClick={this.onSubmit} block>Go</span>
            </div>
        );
    },

    handleTypeChange(ev, idx, item) {
        this.setState({shouttype: item.payload});
    },

    handleCategoryChange(ev, idx, item) {
        this.setState({cat: item.payload});
    },

    // In case needed to manipulate data entry instantly
    handlePrice(elm) {
        let price = elm.target.value,
            name = elm.target.name;

        if(name === "min") {
            this.setState({min: price});
        } else if (name === "max") {
            this.setState({max: price});
        }
    },

    onSubmit() {
        let min = this.state.min,
            max = this.state.max,
            tags = this.state.tags,
            category = this.state.cat,
            shouttype = this.state.shouttype;

        // send back to owner module for processing
        this.props.onSubmit({shouttype, category, tags, min, max});
    },

    render() {
        return (
            <div className="search-filters">
                <p>What kind of information you need?</p>
                {this.renderFilters()}
            </div>
        );
    }
});
