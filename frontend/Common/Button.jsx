import {Button as MuiButton} from "material-ui";

export default class Button extends ReactComponent {
	render() {
		const {className, ...props} = this.props;

		return <MuiButton {...this.cls} {...props} />
	}
}