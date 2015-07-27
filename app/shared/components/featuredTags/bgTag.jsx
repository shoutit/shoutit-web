import React from 'react';
import {Col, Row} from 'react-bootstrap';
import {Link} from 'react-router';

export default React.createClass({
	display: "BgTagStage",

	render() {
		let style = {
			"height": this.props.height + "px",
			"width": this.props.width + "px",
			"backgroundImage": "url(" + this.props.image + ")",
			"backgroundPosition": "-" + this.props.x + "px -" + this.props.y + "px",
			"backgroundRepeat": "no-repeat"
		};

		let size = this.props.size;

		return (
			<Col md={size} xs={size} className="tagStage text-center">
				<Link to="tag" params={{tagName: this.props.tag.name}}>
					<Row>
						<Col md={12} xs={12}>
							{this.props.tag.title}
						</Col>
					</Row>
					<div style={style}/>
				</Link>
			</Col>
		);
	}
});
