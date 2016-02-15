import React from "react";
import currencyFormatter from "currency-formatter";

if (process.env.BROWSER) {
  require("styles/components/ShoutItem.scss");
}

export default function ShoutItem({
  shout,
  outline=false,            // show a border instead of a shadow
  thumbnailRatio=4/3,       // 4/3, 16/9 etc.
  alwaysShowThumbnail=true  // show thumbnail also when not available
}) {
  const { price, currency: code, title, user, thumbnail } = shout;

  let className = "ShoutItem";
  if (outline) {
    className += ` ${outline}`;
  }
  if (!thumbnail) {
    className += " no-thumbnail";
  }

  let thumbnailStyle, thumbWrapperStyle;
  if (alwaysShowThumbnail || thumbnail) {
    thumbnailStyle = {
      backgroundImage: `url("${thumbnail}")`
    };
    thumbWrapperStyle = {
      paddingBottom: `${100/thumbnailRatio}%`
    };
  }

  return (
    <div className={ className }>

      { (alwaysShowThumbnail || thumbnail) &&
        <div className="ShoutItem-thumbwrapper" style={ thumbWrapperStyle }>
          <div className="ShoutItem-thumb"
            style={ thumbnailStyle } />
        </div>
      }

      <div className="ShoutItem-detail">
        <span className="ShoutItem-title">
          { title }
        </span>
        <span className="ShoutItem-name">
          { user.name }
        </span>
        <span className="ShoutItem-price">
          { currencyFormatter.format(price, { code } )}
        </span>
      </div>
    </div>
  );
}
