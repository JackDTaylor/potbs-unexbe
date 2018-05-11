import {Tooltip, Typography} from "material-ui";


export default class ErrorSign extends ReactComponent {
	@prop error;

	get errorMessage() {
		let message = this.error;

		if(this.error instanceof Error) {
			console.error(this.error);
			message = <pre>{this.error.stack}</pre>;
		}

		return message;
	}

	render() {
		let tooltip = this.errorMessage;

		return (
			<Typography {...this.cls} variant="caption">
				{tooltip ? (
					<Tooltip title={tooltip} children={icon('error', 'error')} />
				) : (
					icon('error', 'error')
				)}

				{this.props.children || '(ошибка)'}
			</Typography>
		);
	}
}