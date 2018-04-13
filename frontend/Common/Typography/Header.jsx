import {Typography} from "material-ui";

export default class Header extends ReactComponent {
	get cssClass() { return [...super.cssClass, 'Header'] };

	@prop variant;

	render() {
		return (
			<Typography variant={this.variant||"headline"}>{this.props.children}</Typography>
		);
	}
}