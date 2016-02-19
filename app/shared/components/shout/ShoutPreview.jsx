import React from "react";
import { Link } from "react-router";
import moment from "moment";
import ReplyShoutForm from "./ReplyShoutForm.jsx";
import currencyFormatter from "currency-formatter";
import {Image, Column, Grid} from "../helper";

import { ItemScope, ItemProp } from "../helper/microdata";
import { kebabCase } from "lodash/string";

import { ImagesPath } from "../../../../config";

if (process.env.BROWSER) {
  require("styles/components/ShoutPreview.scss");
  require("styles/components/ShoutGridview.scss");
}

export default function ShoutPreview({ gridview = false, listType, shout, index}) {
  const publishedDate = moment.unix(shout.date_published).fromNow();
  const city = encodeURIComponent(shout.location.city);
  const title = encodeURIComponent(kebabCase(shout.title));
  const countryCode = shout.origCurrency || shout.currency;
  const thumbnail = shout.thumbnail || `${ImagesPath}/pattern.png`;

  let content;

  if(gridview) {
    content = (
      <Column size="3" clear={index % 3 === 0} className="ShoutGridview">
        <Link to={ `/shout/${shout.id}/${city}/${title}` }>
          <div>
            { shout.thumbnail ?
              <div className="img" style={{
                backgroundImage: `url(${ thumbnail.replace(/\.jpg$/i, "_medium.jpg") })`
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
        </Link>
      </Column>
    );
  } else {
    content = (
      <div className="ShoutPreview">
        {/*<ReplyShoutForm shout={shout} flux={this.context.flux} />*/}
      </div>
    );
  }

  return (
    <ItemScope type="Product">
      { content }
    </ItemScope>
  );

}

