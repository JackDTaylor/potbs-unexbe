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
		return (
			<Typography {...this.cls} variant="caption">
				<Tooltip title={this.errorMessage} children={icon('error', 'error')} />

				{this.props.children || '(ошибка)'}
			</Typography>
		);
	}
}