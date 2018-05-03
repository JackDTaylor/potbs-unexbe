import {Typography} from "material-ui";

export default class Caption extends ReactComponent {
	render() {
		return (
			<Typography variant="caption">{this.props.children}</Typography>
		);
	}
}