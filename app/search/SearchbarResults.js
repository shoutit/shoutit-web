import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { getVariation } from '../utils/APIUtils';

if (process.env.BROWSER) {
  require('./SearchbarResults.scss');
}

function SearchbarResult({ image, label }) {
  return (
    <div className="SearchbarResult">
      <span>
        <span className="SearchbarResult-image" style={{ backgroundImage: image ? `url("${image}")` : null }} />
      </span>
      <span className="SearchbarResult-label">
        { label }
      </span>
    </div>
  );
}

export default function SearchbarResults({ tags = [], shouts = [], profiles = [] }) {
  return (
    <div className="SearchbarResults">
      {
        shouts.length > 0 &&
          <div className="SearchbarResults-list">
            <h3>Shouts</h3>
            <ul className="htmlSelectableList">
            { shouts.map(shout =>
              <li key={ shout.id }>
                <Link to={`/shout/${shout.id}`}>
                  <SearchbarResult label={ shout.title } image={ shout.thumbnail ? getVariation(shout.thumbnail, 'small') : null } />
                </Link>
              </li>
            )}
            </ul>
          </div>
      }
      {
        tags.length > 0 &&
          <div className="SearchbarResults-list">
            <h3>Interests</h3>
            <ul className="htmlSelectableList">
              { tags.map(tag =>
                <li key={ tag.name }>
                  <Link to={`/interest/${tag.name}`}>
                    <SearchbarResult label={ tag.name } image={ tag.image ? getVariation(tag.image, 'small') : null } />
                  </Link>
                </li>
              )}
            </ul>
          </div>
      }
      {
        profiles.length > 0 &&
          <div className="SearchbarResults-list">
            <h3>Profiles</h3>
            <ul className="htmlSelectableList">
            { profiles.map(profile =>
              <li key={profile.username}>
                <Link to={`/${profile.type}/${profile.username}`}>
                  <SearchbarResult label={ profile.name } image={ profile.image ? getVariation(profile.image, 'small') : null } />
                </Link>
              </li>
            )}
            </ul>
          </div>
      }
    </div>

  );
}

SearchbarResults.propTypes = {
  tags: PropTypes.array.isRequired,
  shouts: PropTypes.array.isRequired,
  profiles: PropTypes.array.isRequired,
};
