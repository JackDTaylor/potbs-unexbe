import {Paper} from "material-ui";
import Text from "../../Typography/Text";
import Header from "../../Typography/Header";

export default class GridFilter extends ReactComponent {
	get cssClass() { return [...super.cssClass, 'GridFilter'] };

	@prop proxy;

	render() {
		return (
			<Paper {...this.cls} style={{ width: '33%', padding: 16, marginBottom: 18,}}>
				<Header variant="title">Поиск</Header>
				<Text>{JSON.stringify(this.proxy.filter)}</Text>
			</Paper>
		);
	}
}