import {Typography} from "material-ui";

export default class Header extends ReactComponent {
	@prop variant;

	render() {
		return (
			<Typography variant={this.variant||"headline"}>{this.props.children}</Typography>
		);
	}
}