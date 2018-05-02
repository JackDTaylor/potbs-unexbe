import IconButton from "../../Common/Button/IconButton";
import {Badge} from "material-ui";

export default class NotificationButton extends ReactComponent {
	get additionalClasses() {
		return [
			...super.additionalClasses,
			{ opened: this.opened },
		];
	}

	@prop handler;
	@prop opened;
	@prop count;

	get isActive() {
		return this.props.count > 0;
	}

	get counter() {
		return this.props.count <= 99
			? <span>{this.props.count}</span>
			: <span>99<small>+</small></span>;
	}

	get activeColor() {
		return this.opened ? '#FFFFFF' : undefined;
	}

	get children() {
		if(this.count <= 0) {
			return icon('notifications');
		}

		return (
			<Badge color="secondary" badgeContent={this.counter}>
				{icon('notifications')}
			</Badge>
		)
	}

	render() {
		return (
			<IconButton {...this.cls}
				onClick={this.handler}
				children={this.children}

				activeColor={this.activeColor}
				active={this.isActive}
			/>
		);
	}
}