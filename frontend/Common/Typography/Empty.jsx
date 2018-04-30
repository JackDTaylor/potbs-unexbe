import {Typography} from "material-ui";


export default class Empty extends ReactComponent {
	render() {
		return (
			<Typography {...this.cls} variant="caption">
				{this.props.children || '(нет)'}
			</Typography>
		);
	}
}