import React from 'react';
import Page from '../layout/Page';
import Frame from '../layout/Frame';
import Helmet from '../utils/Helmet';

export default function NotFound() {
  const title = 'Not found';
  return (
    <Page>
      <Helmet title="Not found" />
      <Frame title={ title } transparent />
    </Page>
  );

}
