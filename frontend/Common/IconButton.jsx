import {IconButton as MuiIconButton} from "material-ui";

export default class IconButton extends ReactComponent {
	get buttonProps() {
		let props = this.props;

		if(props.active) {
			props = addStyle(props, {
				color: this.props.activeColor || 'rgba(255,255,255, 0.85)'
			});
		}

		return Object.without(props, [ 'active', 'activeColor' ]);
	}

	render() {
		return <MuiIconButton {...this.buttonProps} />;
	}
}