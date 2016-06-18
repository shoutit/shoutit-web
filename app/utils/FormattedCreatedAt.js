import React, { PropTypes } from 'react';
import { toDate } from 'unix-timestamp';
import { FormattedDate } from 'react-intl';

import { isSameDay, isSameWeek, isSameYear } from '../utils/DateUtils';

export default function FormattedCreatedAt({ value }) {
  const date = toDate(value);
  const formattingProps = {
    value: toDate(value),
  };
  const today = new Date();
  if (isSameDay(date, today)) {
    formattingProps.minute = 'numeric';
    formattingProps.hour = 'numeric';
  } else if (isSameWeek(date, today)) {
    formattingProps.week = 'short';
  } else if (isSameYear(date, today)) {
    formattingProps.day = 'numeric';
    formattingProps.month = 'short';
  }
  return <FormattedDate {...formattingProps} />;
}
FormattedCreatedAt.propTypes = {
  value: PropTypes.number.isRequired,
};
