import React from 'react';
import {Link} from 'react-router';

import { getVariation } from "../../utils/APIUtils";

export default React.createClass({
  displayName: "SearchResultList",

  render() {
    let searchParams = this.props.params,
      results = this.props.results;

    let onBlurSearch = this.props.onBlur;

    let shoutResults = results.shouts,
      shoutSearchResults = shoutResults ? shoutResults.slice(0, 3) : [];

    let shoutResultList = shoutSearchResults && shoutSearchResults.length ?
      shoutSearchResults.map(function (shout, i) {
        let shoutTitle = encodeURIComponent(shout.title.replace(/\s+/g, '-'));
        return (
          <Link to={`/shout/${shout.id}/${shout.location.city}/${shoutTitle}`}
              onClick={onBlurSearch}>
             <div  className="list-search-item" key={"search-header-shout-" + i}>
               <div className="img-search-holder">
                 <img src={getVariation(shout.thumbnail, "small")} size="small" className="img-search-thumb"/>
               </div>
               <div className="text-search-holder">
                {shout.title}
               </div>
             </div>
          </Link>
          );
      }) : [];

    let tagResults = results.tags,
      tagSearchResults = tagResults ? tagResults.slice(0, 3) : [];

    const { countryCode } = this.props;

    let tagResultList = tagSearchResults && tagSearchResults.length ?
      tagSearchResults.map(function (tag, i) {
        return (
          <Link to={ `/interest/${ tag.name }/${ countryCode }` }
                onClick={onBlurSearch}>
            <div  className="list-search-item" key={"search-header-tag-" + i}>
              <div className="img-search-holder">
                 <img src={tag.image} className="img-search-thumb"/>
               </div>
               <div style={{verticalAlign:'10px',display:'inline-block'}}>
                {tag.name}
               </div>
             </div>
          </Link>
          );
      }) : [];

    let userResults = results.users,
      userSearchResults = userResults ? userResults.slice(0, 3) : [];

    let userResultList = userSearchResults && userSearchResults.length ?
      userSearchResults.map(function (user, i) {
        return (
          <Link to={`/user/${encodeURIComponent(user.username)}`}
              onClick={onBlurSearch}>
            <div className="list-search-item" key={"search-header-user-" + i}>
              <div className="img-search-holder">
                 { user.image && <img src={getVariation(user.image, "small")} className="img-search-thumb"/> }
               </div>
               <div style={{verticalAlign:'10px',display:'inline-block'}}>
                {user.name}
               </div>
             </div>
          </Link>
          );
      }) : [];

    return (
    <div className="list-search">
      <Link className="list-search-title" to="search" params={searchParams}
          onClick={onBlurSearch}>Shouts</Link>
      {shoutResultList}

      <Link className="list-search-title" to="searchTags" params={searchParams}
          onClick={onBlurSearch}>Tags</Link>
      {tagResultList}

      <Link className="list-search-title" to="searchUsers" params={searchParams}
          onClick={onBlurSearch}>Users</Link>
      {userResultList}

    </div>);
  }
});
