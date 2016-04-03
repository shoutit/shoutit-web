import React from "react";
import { Link } from "react-router";
import { Grid, Column } from "../helper";
import UserAvatar from "../../../users/UserAvatar";
import SVGIcon from "../../../ui/SVGIcon";

export default React.createClass({

  render() {
    const { user } = this.props;
    return (
      <section className="si-card gray-card">
          <Grid fluid={true}>
              <Column fluid={true} clear={true} size="3" className="card-list-img">
                  <UserAvatar user={ user } size="small" linkToUserPage />;
              </Column>
              <Column fluid={true} size="12" className="card-list-item">
                  <Link to={`/user/${user}`}>{user.name}</Link>
              </Column>
              <Column fluid={true} clear={true} size="3" className="card-list-img">
                  <SVGIcon name="pencil" active />
              </Column>
              <Column fluid={true} size="12" className="card-list-item">
                <Link to={`/user/${user.username}`}>Edit profile</Link>
              </Column>
              <Column fluid={true} clear={true} size="3" className="card-list-img">
                  <SVGIcon name="balloon-dots" active />
              </Column>
              <Column fluid={true} size="12" className="card-list-item">
                  <Link to="/messages">Messages</Link>
              </Column>
              <Column fluid={true} clear={true} size="3" className="card-list-img">
                  <SVGIcon name="world-west" active />
              </Column>
              <Column fluid={true} size="12" className="card-list-item">
                  <Link to="/home">Browse</Link>
              </Column>
          </Grid>
      </section>
    );
  }
});
