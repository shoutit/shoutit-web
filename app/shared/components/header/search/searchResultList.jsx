import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
    displayName: "SearchResultList",

    render() {
        let term = this.props.term,
            searchParams = {term: term},
            results = this.props.results;

        let onBlurSearch = this.props.onBlur;

        let shoutResults = results.shouts,
            shoutSearchResults = shoutResults ? shoutResults.slice(0, 3) : [];

        let shoutResultList = shoutSearchResults && shoutSearchResults.length ?
            shoutSearchResults.map(function (shout, i) {
                return (
                    <li key={"search-header-shout-" + i}>
                        <Link to="shout" params={{shoutId: shout.id, location: shout.location.city, title: shout.title}} onClick={onBlurSearch}>
                            {shout.title}
                        </Link>
                    </li>);
            }) : [];

        let tagResults = results.tags,
            tagSearchResults = tagResults ? tagResults.slice(0, 3) : [];

        let tagResultList = tagSearchResults && tagSearchResults.length ?
            tagSearchResults.map(function (tag, i) {
                return (
                    <li key={"search-header-tag-" + i}>
                        <Link to="tag" params={{tagName: tag.name}} onClick={onBlurSearch}>
                            {tag.name}
                        </Link>
                    </li>);
            }) : [];

        let userResults = results.users,
            userSearchResults = userResults ? userResults.slice(0, 3) : [];

        let userResultList = userSearchResults && userSearchResults.length ?
            userSearchResults.map(function (user, i) {
                return (
                    <li key={"search-header-user-" + i}>
                        <Link to="user" params={{username: user.username}} onClick={onBlurSearch}>
                            {user.name}
                        </Link>
                    </li>);
            }) : [];

        return (<div className="list-search">
            <ul>
                <li>
                    <Link to="search" params={searchParams} onClick={onBlurSearch}>Shouts</Link>
                    <ul className="list-search-sub">
                        {shoutResultList}
                    </ul>
                </li>
                <li>
                    <Link to="searchTags" params={searchParams} onClick={onBlurSearch}>Tags</Link>
                    <ul className="list-search-sub">
                        {tagResultList}
                    </ul>
                </li>
                <li>
                    <Link to="searchUsers" params={searchParams} onClick={onBlurSearch}>Users</Link>
                    <ul className="list-search-sub">
                        {userResultList}
                    </ul>
                </li>
            </ul>
        </div>);
    }
});
