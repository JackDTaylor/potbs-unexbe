import {
	ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, MenuItem,
	Typography
} from "material-ui";

import ContextIconButton from "../../Common/ContextIconButton";

const HideButton = props => (
	<ContextIconButton
		className="notification-menu-button"
		icon={icon('expand less')}
		children={[
			<MenuItem onClick={fn => console.log('hide', props)}>Скрыть</MenuItem>
		]}
	/>
);


export default class NotificationPanel extends ReactComponent {
	static CssClasses = ['NotificationPanel', 'DrawerContents'];

	render() {
		return (
			<div {...this.cls} id="notificationPanel">
				<Typography variant="title">Последние уведомления</Typography>

				{[1,2,3,4,5,6,7,8,9,10].map(fn => (
					<ExpansionPanel className="notification" expanded key={fn}>
						<ExpansionPanelSummary expandIcon={<HideButton />}>
							<Typography variant="body1">В системе зарегистрирован новый подрядчик.</Typography>
						</ExpansionPanelSummary>

						<ExpansionPanelDetails>
							<Typography variant="caption">23 октября 2017 в 18:37</Typography>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				))}

				{/*{this.props.notifications && this.props.notifications.map(notification => (*/}
					{/*<p>{notification.message}</p>*/}
				{/*))}*/}
			</div>
		);
	}
}