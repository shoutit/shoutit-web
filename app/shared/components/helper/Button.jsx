import React from "react";
import { Link } from "react-router";

if (process.env.BROWSER) {
  require("styles/components/Button.scss");
}

export default function Button({
  children,
  label,
  size, // Optional, `small` or `large`
  leftIcon, // Optional
  primary=false, // filled green
  secondary=false, // filled orange
  destructive=false, // danger thing
  outline=false, // bordered
  block=false,
  className,
  ...attributes
}) {
  let Element;
  if (attributes.disabled) {
    Element = "span";
  } else if (attributes.to) {
    Element = Link;
  } else if (attributes.href) {
    Element = "a";
  } else {
    Element = "button";
  }
  let elClassName = "Button";

  if (leftIcon) {
    elClassName += " with-icon";
  }
  
  if (block) {
    elClassName += " block";
  }


  if (primary) {
    elClassName += " primary";
  } else if (secondary) {
    elClassName += " secondary";
  } else if (destructive) {
    elClassName += " destructive";
  } else if (outline) {
    elClassName += " outline";
  }

  if (attributes.disabled) {
    elClassName += " disabled";
  }
  if (size) {
    elClassName += ` size-${size}`;
  }
  if (className) {
    elClassName += ` ${className}`;
  }

  return (
    React.createElement(
      Element,
      { ...attributes, className: elClassName},
      [
        leftIcon ? <span key="button-icon" className="Button-icon">{ leftIcon }</span>  : null,
        label ? <span key="button-label" className="Button-label">{ label }</span> : children
      ]
    )
  );
}
