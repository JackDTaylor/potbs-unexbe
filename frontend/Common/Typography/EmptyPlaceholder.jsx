import {Typography} from "material-ui";


export default class EmptyPlaceholder extends ReactComponent {
	get headlineMapping() {
		return {
			body1: 'div'
		};
	}

	render() {
		return (
			<Typography {...this.cls} variant={this.variant || 'body1'} headlineMapping={this.headlineMapping}>
				{this.props.children || 'Ничего не найдено'}
			</Typography>
		);
	}
}