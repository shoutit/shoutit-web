import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getStyleBackgroundImage } from '../utils/DOMUtils';

import { loadTagIfNeeded } from '../actions/tags';
import Icon from '../ui/Icon';
import TagListenersListItem from '../tags/TagListenersListItem';
import TagActions from '../tags/TagActions';
import CategoryIcon from '../shouts/CategoryIcon';

import './TagPreview.scss';

const properties = ['listenersCount', 'isListening'];

export class TagPreview extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    tag: PropTypes.object.isRequired,
    category: PropTypes.object,
    style: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };
  componentDidMount() {
    const { tag, dispatch } = this.props;
    dispatch(loadTagIfNeeded(tag, properties));
  }
  render() {
    const { tag, style, category } = this.props;
    let className = 'TagPreview';
    if (!tag.image) {
      className += ' no-cover';
    }
    return (
      <div className={ className } style={ style }>
        { tag.image && <div className="TagPreview-cover" style={ getStyleBackgroundImage(tag.image, 'medium') } /> }
        <div className="TagPreview-header">
          <div className="TagPreview-icon">
            { category ?
              <CategoryIcon category={ category } size="large" />
              :
              <Icon name="tag" size="large" active />
            }
          </div>
          <h2>{ category ? category.name : tag.name }</h2>
        </div>
        <div className="TagPreview-body">
          <TagListenersListItem category={ category } tag={ tag } size="small" />
        </div>
        <div className="TagPreview-actions">
          <TagActions tag={ tag } category={ category } size="small" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  const tag = state.entities.tags[id];
  const category = state.entities.categories[tag.name];
  return {
    tag,
    category,
  };
};

export default connect(mapStateToProps)(TagPreview);
