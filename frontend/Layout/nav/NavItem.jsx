import {ListItem} from "material-ui";
import {ListItemIcon} from "material-ui";
import {ListItemText} from "material-ui";

export default class NavItem extends ReactComponent {
	render() {
		const {item, onClick} = this.props;

		return (
			<ListItem onClick={onClick} button>
				<ListItemIcon>{icon(item.icon)}</ListItemIcon>
				<ListItemText primary={item.title} />
			</ListItem>
		);
	}
}