import React from "react";
import { Link } from "react-router";
import moment from "moment";
import ReplyShoutForm from "./ReplyShoutForm.jsx";
import UserAvatar from "../user/UserAvatar.jsx";
import currencyFormatter from "currency-formatter";
import {Image, Column, Grid, Icon} from "../helper";
import Separator from "../general/separator.jsx";
import CountryFlag from "../helper/CountryFlag.jsx";
import TagList from "../general/tagList.jsx";

import { ItemScope, ItemProp } from "../helper/microdata";
import { kebabCase } from "lodash/string";

import { imagesPath } from "../../../../config";

if (process.env.BROWSER) {
  require("styles/components/ShoutPreview.scss");
  require("styles/components/ShoutGridview.scss");
}

export default function ShoutPreview({ gridview = false, shout, index}) {
  const publishedDate = moment.unix(shout.date_published).fromNow();

  const city = encodeURIComponent(shout.location.city);
  const title = encodeURIComponent(kebabCase(shout.title));
  const currency = shout.origCurrency || shout.currency;

  const thumbnail = shout.thumbnail && shout.thumbnail.replace(/\.jpg$/i, "_medium.jpg").replace("https", "http") ||
    `${imagesPath}/pattern@2x.png`;

  let content;

  if(gridview) {
    content = (
      <Column size="3" clear={index % 3 === 0} className="ShoutGridview">
        <Link to={ `/shout/${shout.id}/${city}/${title}` }>
          <div>
            <div className={shout.thumbnail? `ShoutGridview-image`: `ShoutGridview-image default`} style={{
              backgroundImage: `url(${ thumbnail })`
            }}>
            </div>
            <ItemProp property="name">
              <h3>{shout.title}</h3>
            </ItemProp>
            <span className="subtitle">{ shout.user.name }</span>
            <span className="price">
              { currencyFormatter.format(shout.price, { code: currency } )}
            </span>
          </div>
        </Link>
      </Column>
    );
  } else {
    content = (
      <Grid fluid={true} className="ShoutPreview">
        <div className="ShoutPreview-heading">
          <UserAvatar user={ shout.user } linkToUserPage />
          <h3 className="ShoutPreview-user">{ shout.user.name }</h3>
          <span className="ShoutPreview-date">{ publishedDate }</span>
        </div>
        <Grid fluid={true} className="ShoutPreview-caption">
          <Column fluid={true} size="13" clear>
            <ItemProp property="name">
              <Link to={ `/shout/${shout.id}/${city}/${title}` } className="ShoutPreview-title bold">
                { shout.title }
              </Link>
            </ItemProp>
            <Icon name="drop_down" style={{
              transform: "rotate(270deg)", margin:"2px 10px",display:"inline-block"
            }} />
            <Link to={ `/tag/${encodeURIComponent(shout.category.slug)}` } className="ShoutPreview-cat bold">
              { shout.category.name }
            </Link>
          </Column>
          <Column size="2" fluid={true}>
            <span className="ShoutPreview-price bold">
              { currencyFormatter.format(shout.price, { code: currency } )}
            </span>
          </Column>
        </Grid>
        <Grid fluid={true} className="ShoutPreview-body">

          {shout.thumbnail &&
          <Column fluid={true} clear size="9">
            <ItemProp property="image">
              <div className="ShoutPreview-image" style={{backgroundImage: `url(${ thumbnail })`}}>
              </div>
            </ItemProp>
          </Column>
          }

          <Column fluid={true} size={shout.thumbnail? 6: 14}>
            <ItemProp property="description">
              <p>{ shout.text }</p>
            </ItemProp>
            <TagList tags={shout.tags}/>
            <Separator />
            <div className="shout-footnote">
              { shout.user.location  && shout.user.location.country &&
                <CountryFlag code={ shout.user.location.country } />
              }
              <span>
                <img src={ shout.category.icon } />
              </span>
            </div>
          </Column>

        </Grid>
      </Grid>
    );
  }

  return (
    <ItemScope type="Product">
      { content }
    </ItemScope>
  );

}

