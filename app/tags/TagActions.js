import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { listenToTag, stopListeningToTag } from '../actions/tags';
import { Link } from 'react-router';

import RequiresLogin from '../auth/RequiresLogin';
import { LISTEN_TAG } from '../auth/loginActions';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import { getLoggedUser } from '../reducers/session';

export class TagActions extends Component {

  static propTypes = {
    tag: PropTypes.object.isRequired,
    category: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isUpdatingListening: PropTypes.bool,
    loggedUser: PropTypes.object,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
  };

  static defaultProps = {
    size: 'medium',
  }

  constructor(props) {
    super(props);
    this.handleListenClick = this.handleListenClick.bind(this);
  }

  handleListenClick() {
    const { tag, dispatch, loggedUser } = this.props;
    if (tag.isListening) {
      dispatch(stopListeningToTag(loggedUser, tag));
    } else {
      dispatch(listenToTag(loggedUser, tag));
    }
  }

  render() {
    const { tag, category, size, isUpdatingListening } = this.props;

    const name = category ? category.name : tag.name;

    return (
      <div className="TagActions">
        <ul className="htmlNoList">
          <li>
            <RequiresLogin event="onClick" loginAction={ LISTEN_TAG } actionParams={ tag.name }>
              <ListItem
                size={ size }
                disabled={ isUpdatingListening }
                onClick={ this.handleListenClick }
                start={ <Icon size={ size } name="listen" active={ !tag.isListening } on={ tag.isListening } /> }
              >
                <FormattedMessage
                  id="tagActions.listen"
                  defaultMessage="{isListening, select,
                      true {Stop listening to {tagName}}
                      false {Listen to {tagName}}
                  }"
                  values={ {
                    isListening: tag.isListening,
                    tagName: name,
                  } }
                />
              </ListItem>
            </RequiresLogin>
          </li>
          <li>
            <Link to={ `/interest/${tag.name}` }>
              <ListItem
                size={ size }
                start={ <Icon active size={ size } name="tag" /> }
              >
                <FormattedMessage
                  id="tagActions.viewShouts"
                  defaultMessage="View Shouts"
                />
              </ListItem>
            </Link>
          </li>
        </ul>
      </div>
    );
  }

}

export default connect(state => ({ loggedUser: getLoggedUser(state) }))(TagActions);
