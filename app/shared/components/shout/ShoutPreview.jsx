import React from "react";
import { Link } from "react-router";

import ReplyShoutForm from "./ReplyShoutForm.jsx";
import UserAvatar from "../user/UserAvatar.jsx";
import {Image, Column, Grid, Icon} from "../helper";
import Separator from "../general/separator.jsx";
import TagButtons from "../general/TagButtons.jsx";

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

/**
 * This component shows individual shouts in lists. Also supports shouts in grid view
 *
 * @param gridView - present the shout in grid mode if true
 * @param shout - the shout object retrieved from the API
 * @param index - the index of the shout in list (usually the second parameter from array.map())
 * @param columnsPerRow - only used for grid view items
 * @returns {component}
 */
export default function ShoutPreview({ gridView = false, shout, index, columnsPerRow = 3}) {
  const publishedDate = moment.unix(shout.date_published).fromNow();

  const city = encodeURIComponent(shout.location.city);
  const title = encodeURIComponent(kebabCase(shout.title));
  const currency = shout.origCurrency || shout.currency;

  const thumbnail = shout.thumbnail && shout.thumbnail.replace(/\.jpg$/i, "_medium.jpg") ||
    `${imagesPath}/pattern@2x.png`;

  let content;

  if(gridView) {
    content = (
      <Column size="3" clear={index % columnsPerRow === 0} className="ShoutGridview">
        <Link to={ `/shout/${shout.id}/${city}/${title}` }>
          <div>
            <div className={shout.thumbnail? `ShoutGridview-image`: `ShoutGridview-image default`} style={{
              backgroundImage: `url(${ thumbnail })`
            }}>
            </div>
            <ItemProp property="name">
              <h3 className="ShoutGridview-title">{shout.title}</h3>
            </ItemProp>
            <span className="ShoutGridview-subtitle">{ shout.user.name }</span>
            <span className="ShoutGridview-price">
              { currencyFormatter.format(shout.price/100, { code: currency } )}
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
          <Link className="ShoutPreview-user" to={ `/user/${ shout.user.username }` }>{ shout.user.name }</Link>
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
            <Link to={ `/tag/${encodeURIComponent(shout.category.slug)}` } className="ShoutPreview-cat">
              { shout.category.name }
            </Link>
          </Column>
          <Column size="3" fluid={true}>
            <div className="ShoutPreview-price bold">
              { currencyFormatter.format(shout.price/100, { code: currency } )}
            </div>
          </Column>
        </Grid>
        <Grid fluid={true}>
          <Column fluid={true} clear size="9">
            <Link to={ `/shout/${shout.id}/${city}/${title}` }>
              <ItemProp property="image">
                <div className={shout.thumbnail? `ShoutPreview-image`: `ShoutPreview-image default`}
                   style={{backgroundImage: `url(${ thumbnail })`}}>
                </div>
              </ItemProp>
            </Link>
          </Column>


          <Column fluid={true} size="6">
            <ItemProp property="description">
              <p className="ShoutPreview-text">{ trunc(shout.text, 250) }</p>
            </ItemProp>
            <TagButtons tags={shout.filters} linear/>

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
        { !gridView &&
          <ReplyShoutForm shout={shout} />
        }
      </Grid>
    );
  }

  return (
    <div>
      <ItemScope type="Product">
        { content }
      </ItemScope>
    </div>
  );
}

