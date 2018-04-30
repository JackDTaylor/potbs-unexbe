import {Typography} from "material-ui";


export default class Loading extends ReactComponent {
	render() {
		return (
			<Typography {...this.cls} variant="caption">{this.props.children || 'Загрузка...'}</Typography>
		);
	}
}