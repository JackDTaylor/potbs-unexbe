import {Typography} from "material-ui";

export default class Text extends ReactComponent {
	render() {
		return (
			<Typography gutterBottom>{this.props.children}</Typography>
		);
	}
}