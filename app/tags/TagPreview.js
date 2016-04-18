import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getStyleBackgroundImage } from '../utils/DOMUtils';

import { loadTagIfNeeded } from '../actions/tags';
import Icon from '../ui/Icon';
import TagListenersListItem from '../tags/TagListenersListItem';
import TagActions from '../tags/TagActions';
if (process.env.BROWSER) {
  require('./TagPreview.scss');
}

const properties = ['listenersCount', 'isListening'];

export class TagPreview extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    tag: PropTypes.object.isRequired,
    style: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };
  componentDidMount() {
    const { tag, dispatch } = this.props;
    dispatch(loadTagIfNeeded(tag, properties));
  }
  render() {
    const { tag, style } = this.props;
    return (
      <div className="TagPreview" style={ style }>
        <div className="TagPreview-cover" style={ getStyleBackgroundImage(tag.image, 'medium') } />
        <div className="TagPreview-header">
          <div className="TagPreview-icon">
            <Icon name="tag" size="large" active />
          </div>
          <h2>{ tag.name }</h2>
        </div>
        <div className="TagPreview-body">
          <TagListenersListItem tag={ tag } size="small" />
        </div>
        <div className="TagPreview-actions">
          <TagActions tag={ tag } size="small" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  const tag = state.entities.tags[id];
  return {
    tag,
  };
};

export default connect(mapStateToProps)(TagPreview);
