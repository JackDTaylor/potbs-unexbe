import {ListItem} from "material-ui";
import {ListItemIcon} from "material-ui";
import {ListItemText} from "material-ui";

export default class NavItem extends ReactComponent {
	@prop onClick;
	@prop item;

	handleClick(ev) {
		if(this.item.blank) {
			return; // Handle with <a href>
		}

		ev.preventDefault();

		if(this.props.onClick) {
			return this.props.onClick(ev);
		}
	}

	get itemProps() {
		return {
			component: 'a',
			button:    true,
			href:      this.item.url,
			target:    this.item.blank ? '_blank' : undefined,
			onClick:   ev => this.handleClick(ev),
		}
	}

	render() {
		return (
			<ListItem {...this.cls} {...this.itemProps}>
				<ListItemIcon>{icon(this.item.icon)}</ListItemIcon>
				<ListItemText primary={this.item.title} />
				{this.item.blank && <ListItemIcon>{icon('open in new')}</ListItemIcon>}
			</ListItem>
		);
	}
}