import {Hidden} from "material-ui";
import {Drawer} from "material-ui";

export default class MobileDrawer extends ReactComponent {
	get cssClass() { return [...super.cssClass, 'MobileDrawer'] };

	@prop open = false;
	@prop close = fn => {};

	get drawerProps() {
		return {
			className:       "drawer drawer-temporary",
			variant:         "temporary",
			anchor:          "left",

			ModalProps:      { keepMounted: true },

			open:            this.open,
			onClose:         fn => this.close(),
		};
	}



	componentWillMount() {
		this.props.handler && this.props.handler(x => this.open = x);
	}

	render() {
		return (
			<Hidden mdUp>
				<Drawer {...this.drawerProps}>
					{this.props.children}
				</Drawer>
			</Hidden>
		);
	}
}