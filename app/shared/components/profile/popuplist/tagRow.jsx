import React from 'react';
import {Link} from 'react-router';
import {Grid, Column} from '../../helper';
import TagListenButton from '../../general/tagListenButton.jsx';
import UserImage from '../../user/userImage.jsx';

export default function TagRow(props) {
  const tag = JSON.parse(JSON.stringify(this.props.tag));
  const { onListenTag, onStopListenTag } = this.props;

  return (
    <Grid fluid={true} className="popuplist-row">
      <Column fluid={true} clear={true} size="2">
        <Link to={`/tag/${encodeURIComponent(tag.name)}`}>
          <UserImage size="32" image={tag.image} type="circle"/>
        </Link>
      </Column>
      <Column fluid={true} size="10" className="popuplist-text-row">
        <Link to={`/tag/${encodeURIComponent(tag.name)}`}>
          {tag.name}
        </Link>
      </Column>
      <Column fluid={true} size="3" style={{paddingTop: "5px"}}>
        <TagListenButton
          tag={ tag }
          hasTitle={ false }
          onListenTag={ onListenTag }
          onStopListenTag={ onStopListenTag }
        />
      </Column>
    </Grid>
  );
}
