import React from 'react';
import {Link} from 'react-router';

import {Icon} from '../../../helper';

export default React.createClass({
	displayName: "Tag",

	render() {
		let tag = this.props.tag;

		return (
			<li key={this.props.key}>
				<Link to="tag" params={{tagId: tag.id, tagName: encodeURIComponent(tag.name)}}>
					<Icon name="tag"/>
					{tag.name}
				</Link>
			</li>
		);

	}
});
