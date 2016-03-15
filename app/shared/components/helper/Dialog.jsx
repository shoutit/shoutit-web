import React from "react";
import { Dialog as MaterialUIDialog } from "material-ui";

import { imagesPath } from "../../../config";

if (process.env.BROWSER) {
  require("styles/components/Dialog.scss");
}

// Our wrapper for Dialogs. For now, it supports adding a title + shoutit icon
export default function Dialog({children, titleWithIcon, ...props}) {

  return (
    <MaterialUIDialog { ...props }>
      { titleWithIcon &&
        <div style={{ textAlign: "center"}}>
          <img src={ `${imagesPath}/mark.svg` } height={ 44 } />
          <h1 className="Dialog-titleIcon"> { titleWithIcon } </h1>
        </div>
      }
      <div>
        { children }
      </div>
    </MaterialUIDialog>
  );
}
