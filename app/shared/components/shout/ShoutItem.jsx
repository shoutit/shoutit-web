import React from "react";
import currencyFormatter from "currency-formatter";

if (process.env.BROWSER) {
  require("styles/components/ShoutItem.scss");
}

export default function ShoutItem({
  shout,
  horizontal=false,         // show item horizontally
  shadow=false,             // add a shadow
  outline=false,            // outline with a border
  thumbnailRatio=4/3,       // 4/3, 16/9 etc.
  alwaysShowThumbnail=false // show thumbnail also when not available (only when horizontal is false)
}) {
  const { price, currency: code, title, user, thumbnail } = shout;

  let className = "ShoutItem";
  if (horizontal) {
    alwaysShowThumbnail = true;
    className += " horizontal";
  }
  if (outline) {
    className += " outline";
  }
  if (shadow) {
    className += " shadow";
  }
  if (!thumbnail) {
    className += " no-thumbnail";
  }

  let thumbnailStyle, thumbWrapperStyle;
  if (alwaysShowThumbnail || thumbnail) {
    thumbnailStyle = {
      backgroundImage: `url("${thumbnail}")`
    };
    thumbWrapperStyle = !horizontal ? {
      paddingBottom: `${100/thumbnailRatio}%`
    } : null;
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
          { currencyFormatter.format(price/100, { code } )}
        </span>
      </div>
    </div>
  );
}
