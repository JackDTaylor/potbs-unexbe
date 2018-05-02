import {Toolbar} from "material-ui";
import {AppBar} from "material-ui";
import {Typography} from "material-ui";
import {Hidden} from "material-ui";
import StatusPanel from "./StatusPanel";
import NavPanel from "./nav/NavPanel";
import MobileDrawer from "./drawer/MobileDrawer";
import DesktopDrawer from "./drawer/DesktopDrawer";
import IconButton from "../Common/Button/IconButton";
import NotificationPanel from "./notification/NotificationPanel";

// @style(theme => ({
// 	root: {},
// 	nested: {
// 		paddingLeft: theme.spacing.unit * 4,
// 	},
// }))

export default class SystemLayout extends ReactComponent {
	handleChangePage() {
		console.log(this, arguments);
	}

	componentWillMount() {
		this.setState(this.props.state);
	}

	@state pageTitle;

	@state currentPage;
	@state navigation = [];

	@state notifications = [
		{message: 'test set notification mesage'},
		{message: 'another test set notification mesage'},
		{message: 'notification mesage lorem ipsum dolor sit amet shold be multiline'},
		{message: 'test set notification mesage'},
		{message: 'another test set notification mesage'},
		{message: 'notification mesage lorem ipsum dolor sit amet shold be multiline'},
		{message: 'test set notification mesage'},
	];

	@state openNotifications = false;
	@state openMobileDrawer = false;

	async onNavigate(item) {
		try {
			await AppController.navigate(item.url);
		} catch(e) {
			console.error(e.message);
		}
	}

	render() {

		const statusPanel = (
			<StatusPanel
				showBackButton={this.openNotifications == true}
				backButtonHandler={fn => this.openNotifications = false}

				notificationsHandler={fn => this.openNotifications = !this.openNotifications}
				notificationsOpened={this.openNotifications}
				notificationsCount={3}
			/>
		);

		let content;

		if(this.openNotifications) {
			content = (
				<NotificationPanel
					shown={this.openNotifications == true}
					items={this.notifications}
				/>
			);
		} else {
			content = (
				<NavPanel
					shown={this.openNotifications == false}
					items={this.navigation}
					onNavigate={item => this.onNavigate(item)}
				/>
			);
		}

		return (
			<div {...this.cls}>
				<AppBar position="fixed" id="applicationHeader">
					<Toolbar disableGutters>
						<Hidden mdUp implementation="css">
							<IconButton active onClick={fn => this.openMobileDrawer = !this.openMobileDrawer}>{icon('menu')}</IconButton>
						</Hidden>

						<Typography variant="title" color="inherit" id="applicationTitle">
							{this.pageTitle || document.title}
						</Typography>

						<IconButton active>{icon('date range')}</IconButton>
						<IconButton active>{icon('gps fixed')}</IconButton>
					</Toolbar>
				</AppBar>

				<MobileDrawer open={this.openMobileDrawer} close={fn => this.openMobileDrawer = false}>
					{statusPanel}
					{content}
				</MobileDrawer>

				<DesktopDrawer>
					{statusPanel}
					{content}
				</DesktopDrawer>
			</div>
		);
	}
}