import {Typography} from "material-ui";

export default class Text extends ReactComponent {
	get cssClass() { return [...super.cssClass, 'Text'] };

	render() {
		return (
			<Typography gutterBottom>{this.props.children}</Typography>
		);
	}
}