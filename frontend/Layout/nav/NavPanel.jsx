import {List, Divider} from "material-ui";
import NavItem from "./NavItem";

export default class NavPanel extends ReactComponent {
	get cssClass() { return [...super.cssClass, 'NavPanel', 'DrawerContents'] };

	render() {
		const settingsUrl = '/settings';
		const {items, onNavigate} = this.props;
		let i = 0;

		let itemLists = [
			items.filter(item => item.url != settingsUrl),
			items.filter(item => item.url == settingsUrl)
		];

		return (
			<div {...this.cls} id="navigationDrawer">
				<div className="dmi-drawer-header" />
				<Divider />

				<List className="primary-section">
					{itemLists[0].map(item => (
						<NavItem key={i++} item={item} onClick={fn => onNavigate(item)} />
					))}

					{/*
					<CollapsingListItem icon={icon('people')} text={<ListItemText primary="Сотрудники" />}>
						<ListItem button>
							<ListItemIcon>{icon('star border')}</ListItemIcon>
							<ListItemText inset primary="Starred" />
						</ListItem>
						<ListItem button>
							<ListItemIcon>{icon('location on')}</ListItemIcon>
							<ListItemText inset primary="Setwds" />
						</ListItem>
						<CollapsingListItem open icon={icon('people')} text={<ListItemText primary="Test" />}>
							<ListItem button>
								<ListItemIcon>{icon('star border')}</ListItemIcon>
								<ListItemText inset primary="Starred" />
							</ListItem>
							<ListItem button>
								<ListItemIcon>{icon('star border')}</ListItemIcon>
								<ListItemText inset primary="Starred" />
							</ListItem>
						</CollapsingListItem>
					</CollapsingListItem>
					*/}
				</List>

				<Divider />

				<List className="settings-section">
					{itemLists[1].map(item => (
						<NavItem key={i++} item={item} onClick={fn => onNavigate(item)} />
					))}
				</List>
			</div>
		);
	}
}