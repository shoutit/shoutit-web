import React from "react";
import {Link} from "react-router";
import {Grid, Column} from "../../helper";
import ListenButton from "../../general/listenButton.jsx";
import UserAvatar from "../../user/UserAvatar.jsx";

export default function ListenerRow(props) {
  const { flux , user, onListeningChange } = props;

  return (
    <Grid fluid={true} className="popuplist-row">
      <Column fluid={true} clear={true} size="2" >
          <UserAvatar user={ user } linkToUserPage />
      </Column>
      <Column fluid={true} size="10" className="popuplist-text-row">
        <Link to={`/user/${encodeURIComponent( user.username )}`}>
          { user.name }
        </Link>
      </Column>
      <Column fluid={true} size="3" style={{ paddingTop: "5px" }}>
        <ListenButton
          key={ user.id }
          username={ user.username }
          onChange={ onListeningChange }
          hasTitle={ false }
          flux={ flux }
        />
      </Column>
    </Grid>
  );
}
