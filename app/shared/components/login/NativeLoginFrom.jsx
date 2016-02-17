import React from "react";
import { Input } from "react-bootstrap";

import Button from "../helper/Button.jsx";

export default function NativeLoginFrom({ loading, onSubmit, errorFields }) {

  const handleSubmit = (e) => {

    if (loading) {
      return;
    }

    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const pass = form.pass.value;

    if (email && pass) {
      form.email.blur();
      form.pass.blur();
      onSubmit && onSubmit({ email, pass});
    }
  };

  return(
    <div>
      { errorFields &&
        <ul style={ { color: "red", padding: 0 }}>
          { Object.keys(errorFields).map(field =>
              errorFields[field].map((error, i) =>
                <li key={`${field}-${i}`}>{ error }</li>
              )
            )
          }
        </ul>
      }

      <form onSubmit={ handleSubmit } noValidate>
        <Input
          name="email"
          type="email"
          placeholder="Email or Username"
          className="input-email"
        />
        <Input
          name="pass"
          type="password"
          placeholder="Password"
          className="input-pass"
        />

        <Button
          primary
          block
          disabled={ loading }
          label={loading ? "Logging in…": "Log in" } />

        <Input type="checkbox" defaultChecked label="Keep me logged in" />

      </form>
    </div>
  );
}
