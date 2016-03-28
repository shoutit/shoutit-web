import React from "react";
import CircularProgress from "material-ui/lib/circular-progress";

if (process.env.BROWSER) {
  require("styles/components/Progress.scss");
}

export default function Progress({ centerVertical=false, centerHorizontal=true, ...otherProps }) {

  let className = "Progress";

  if (centerVertical) {
    className = `${className} isCenteredVertically`;
  }
  if (centerHorizontal) {
    className = `${className} isCenteredHorizontally`;
  }

  return (
    <div className={ className }>
      Loading...
    </div>
  );
}
