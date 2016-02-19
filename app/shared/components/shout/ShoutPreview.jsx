import React from "react";
import { Link } from "react-router";
import moment from "moment";
import ReplyShoutForm from "./ReplyShoutForm.jsx";
import currencyFormatter from "currency-formatter";
import {Image, Column, Grid} from "../helper";

import { ItemScope, ItemProp } from "../helper/microdata";
import { kebabCase } from "lodash/string";

if (process.env.BROWSER) {
  require("styles/components/ShoutPreview.scss");
  require("styles/components/ShoutGridview.scss");
}

export default function ShoutPreview({ gridview = false, listType, shout, index}) {
  const publishedDate = moment.unix(shout.date_published).fromNow();
  const city = encodeURIComponent(shout.location.city);
  const title = encodeURIComponent(kebabCase(shout.title));
  const countryCode = shout.origCurrency || shout.currency;

  let content;

  if(gridview) {
    content = (
      <div className="ShoutGridview">
        <Column size="3" clear={3}>
          <div onClick={this.onItemClick} className={className + " si-shout-grid"}>
            { shout.thumbnail ?
              <div className="img" style={{
                backgroundImage: `url(${ shout.thumbnail.replace(/\.jpg$/i, "_medium.jpg") })`
              }}>
              </div>
              :
              <div className="img"></div>
            }
            <ItemProp property="name">
              <h3>{shout.title}</h3>
            </ItemProp>
            <span className="subtitle">{ shout.user.name }</span>
            <span className="price">
              { currencyFormatter.format(shout.price, { countryCode } )}
            </span>
          </div>
        </Column>
      </div>
    );
  } else {
    content = (
      <div className="ShoutPreview">
        {/*<ReplyShoutForm shout={shout} flux={this.context.flux} />*/}
      </div>
    );
  }

  return (
    <section>
      <ItemScope type="Product">
        { content }
      </ItemScope>
    </section>
  );

}

