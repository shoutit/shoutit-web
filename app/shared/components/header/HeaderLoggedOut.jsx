import React from "react";
import { Link } from "react-router";

export default function HeaderLoggedOut({  }) {
  return (
    <div>
      <Link to="/login">
        Login
      </Link>
    </div>
  );
}
