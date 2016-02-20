import React from "react";
import { Link } from "react-router";

import ReplyShoutForm from "./ReplyShoutForm.jsx";
import UserAvatar from "../user/UserAvatar.jsx";
import {Image, Column, Grid, Icon} from "../helper";
import Separator from "../general/separator.jsx";
import TagList from "../general/tagList.jsx";

import CountryFlag from "../helper/CountryFlag.jsx";
import CategoryIcon from "../helper/CategoryIcon.jsx";

import moment from "moment";
import currencyFormatter from "currency-formatter";
import { kebabCase, trunc } from "lodash/string";

import { ItemScope, ItemProp } from "../helper/microdata";

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
          <Column fluid={true} size="12" clear>
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
          <Column size="3" fluid={true}>
            <div className="ShoutPreview-price bold">
              { currencyFormatter.format(shout.price, { code: currency } )}
            </div>
          </Column>
        </Grid>
        <Grid fluid={true} className="ShoutPreview-body">


          <Column fluid={true} clear size="9">
            <ItemProp property="image">
              <div className={shout.thumbnail? `ShoutPreview-image`: `ShoutPreview-image default`}
                 style={{backgroundImage: `url(${ thumbnail })`}}>
              </div>
            </ItemProp>
          </Column>


          <Column fluid={true} size="6">
            <ItemProp property="description">
              <p>{ trunc(shout.text, 150) }</p>
            </ItemProp>
            <TagList tags={shout.tags}/>

            <Separator />

            <Grid fluid className="ShoutPreview-footnote">
              <Column fluid clear size="7">
                <CountryFlag
                  code={ shout.location.country }
                  size="normal"
                />
              </Column>
              <Column fluid size="7">
                <CategoryIcon
                  slug={ shout.category.slug }
                  tooltip={ shout.category.name }
                  icon={ shout.category.icon }
                />
              </Column>
            </Grid>

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

