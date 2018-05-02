import {
	MenuItem, Paper, Table, TableBody, TableCell, TableRow,
	Typography
} from "material-ui";
import WidgetHandle from "./WidgetHandle";

export default class WidgetWrapper extends ReactComponent {
	@prop widget;
	render() {
		if(!this.widget) {
			return '[no widget provided]';
		}

		return (
			<Paper {...this.cls} key={widget.name} data-name={widget.name}>
				<WidgetHandle>
					<MenuItem onClick={fn => console.log('hide widget')}>Скрыть виджет</MenuItem>
				</WidgetHandle>

				<Table>
					<TableBody>
						{this.widget.label && (
							<TableRow>
								<TableCell>
									<Typography variant="headline">{this.widget.label}</Typography>
								</TableCell>
							</TableRow>
						)}

						<TableRow>
							<TableCell>{RenderComponent(this.widget)}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Paper>
		);
	}
}