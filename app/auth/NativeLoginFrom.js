import React from "react";
import { Input } from "react-bootstrap";

import Button from "../shared/components/helper/Button.jsx";

export default function NativeLoginFrom({ loading, onSubmit, error }) {

  const handleSubmit = (e) => {

    if (loading) {
      return;
    }

    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    if (email && password) {
      form.email.blur();
      form.password.blur();
      onSubmit && onSubmit({ email, password});
    }
  };

  return(
    <div>
      { error &&
        <ul style={ { color: "red", padding: 0 }}>
          { Object.keys(error).map(field =>
              error[field].map((error, i) =>
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
          name="password"
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
