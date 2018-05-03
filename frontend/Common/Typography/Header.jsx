import {Typography} from "material-ui";

export default class Header extends ReactComponent {
	@prop small;

	get variant() {
		if(this.props.variant) {
			return this.props.variant;
		}

		return this.small ? 'title' : 'headline';
	}

	render() {
		return (
			<Typography variant={this.variant||"headline"}>{this.props.children}</Typography>
		);
	}
}