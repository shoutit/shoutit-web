import React from 'react';
import DocumentTitle from 'react-document-title';

import {Grid, Column} from '../helper';
import Header from '../header/header.jsx';

const MAIN_COLUMN_SIZE = 9;
const LEFT_COLUMN_SIZE = 3;
const RIGHT_COLUMN_SIZE = 3;

export default function Page({
  flux,
  children,
  leftContent,
  rightContent,
  title='Shoutit',
  header=true
 }) {

  let mainColumnSize = MAIN_COLUMN_SIZE;
  if (!leftContent) {
    mainColumnSize += LEFT_COLUMN_SIZE;
  }
  if (!rightContent) {
    mainColumnSize += RIGHT_COLUMN_SIZE;
  }

  return (
    <DocumentTitle title={ title }>
      <div>
        { header && <Header flux={ flux } /> }
        <Grid>
          { leftContent &&
            <Column fluid size={ LEFT_COLUMN_SIZE }>
              { leftContent }
            </Column>
          }
          <Column clear={ !leftContent } size={ mainColumnSize }>
            { children }
          </Column>
          { rightContent &&
            <Column size={ RIGHT_COLUMN_SIZE }>
              { rightContent }
            </Column>
          }
        </Grid>
      </div>
    </DocumentTitle>
  )
}
