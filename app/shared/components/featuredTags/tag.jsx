import React from 'react';
import {Col, Row} from 'react-bootstrap';
import {Link} from 'react-router';

import Image from '../helper/image.jsx';

export default React.createClass({
	display: "TagStage",

	render() {
		let size = this.props.size,
			imageSize = this.props.imageSize;
		return (
			<Col md={size} xs={size} className="tagStage text-center">
				<Link to="tag" params={{tagName: this.props.tag.name}}>
					<Row>
						<Col md={12} xs={12}>
							{this.props.tag.title}
						</Col>
					</Row>
					<Image infix="tag" size={imageSize} src={this.props.tag.image}/>
				</Link>
			</Col>
		);
	}
});
