export default class Loader extends ReactComponent {
	get cssClass() { return [...super.cssClass, 'Loader'] };

	render() {
		return (
			<div {...this.cls} />
		);
	}
}