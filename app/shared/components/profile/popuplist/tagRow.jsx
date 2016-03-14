import React from 'react';
import {Link} from 'react-router';
import {Grid, Column} from '../../helper';
import TagListenButton from '../../general/tagListenButton.jsx';
import UserImage from '../../user/userImage.jsx';

export default function TagRow(props) {
  const tag = JSON.parse(JSON.stringify(props.tag));
  const { onListenTag, onStopListenTag, flux, countryCode } = props;

  return (
    <Grid fluid={true} className="popuplist-row">
      <Column fluid={true} clear={true} size="2">
        <Link to={`/interest/${ tag.slug }/${ countryCode }`}>
          <UserImage size="32" image={tag.image} type="circle"/>
        </Link>
      </Column>
      <Column fluid={true} size="10" className="popuplist-text-row">
        <Link to={`/interest/${tag.slug}/${ countryCode }`}>
          {tag.name}
        </Link>
      </Column>
      <Column fluid={true} size="3" style={{paddingTop: "5px"}}>
        <TagListenButton
          tag={ tag }
          hasTitle={ false }
          flux={ flux }
          onListenTag={ onListenTag }
          onStopListenTag={ onStopListenTag }
        />
      </Column>
    </Grid>
  );
}
