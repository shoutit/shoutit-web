import React from 'react';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

export default function NotFound() {
  const title = 'Not found';
  return (
    <Page title={ title }>
      <Frame title={ title } transparent />
    </Page>
  );

}
