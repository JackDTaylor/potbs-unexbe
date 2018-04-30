class ReadableListItem extends ReactComponent {
	render() {
		return <div {...this.cls}>{this.props.children}</div>
	}
}

export default class ReadableList extends ReactComponent {
	get items() {
		return this.props.items || this.props.children;
	}

	render() {
		return (
			<div {...this.cls}>
				{this.items.map((item, i) => <ReadableListItem key={i}>{item}</ReadableListItem>)}
			</div>
		);
	}
}