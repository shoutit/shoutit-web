import React from "react";

import Button from "../helper/Button.jsx";

export default function HeaderLoggedOut({  }) {
  return (
    <div>
      <Button to="/login" label="Login" />
      <Button to="/signup" label="Signup" primary  />
    </div>
  );
}
