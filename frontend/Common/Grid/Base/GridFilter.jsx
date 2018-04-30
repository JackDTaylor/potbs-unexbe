import {Paper} from "material-ui";
import Text from "../../Typography/Text";
import Header from "../../Typography/Header";

export default class GridFilter extends ReactComponent {
	@prop provider;

	render() {
		return (
			<Paper {...this.cls} style={{ width: '33%', padding: 16, marginBottom: 18,}}>
				<Header variant="title">Поиск</Header>
				<Text>{JSON.stringify(this.provider.filter)}</Text>
			</Paper>
		);
	}
}