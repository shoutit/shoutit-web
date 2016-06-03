import React from 'react';

if (process.env.BROWSER) {
  require('./RangeField.scss');
}
export default function RangeField(props) {
  return (
    <input {...props}
      className="RangeField"
      type="range" />
  );
}
