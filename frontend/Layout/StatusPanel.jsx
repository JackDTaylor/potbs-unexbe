import {Toolbar, Typography} from "material-ui";
import AccountMenu from "./status/AccountMenu";
import NotificationButton from "./notification/NotificationButton";
import SystemClock from "./SystemClock";
import IconButton from "../Common/IconButton";

export default class StatusPanel extends ReactComponent {
	get cssClass() { return [...super.cssClass, 'StatusPanel'] };

	@prop backButtonHandler;
	@prop showBackButton;

	@prop notificationsHandler;
	@prop notificationsOpened;
	@prop notificationsCount;

	render() {
		return (
			<Toolbar {...this.cls} id="statusPanel" ref="clock" disableGutters>

				{/* if(showBackButton): */}
					{this.showBackButton && <IconButton className="back-icon" onClick={this.backButtonHandler} active>{icon('arrow back')}</IconButton>}
					{this.showBackButton && <Typography className="back-title" onClick={this.backButtonHandler} variant="title">Назад</Typography>}
				{/* else: */}
					{!this.showBackButton && <SystemClock />}
				{/* endif; */}

				<NotificationButton
					handler={this.notificationsHandler}
					opened={this.notificationsOpened}
					count={this.notificationsCount}
				/>

				<AccountMenu />
			</Toolbar>
		);
	}
}