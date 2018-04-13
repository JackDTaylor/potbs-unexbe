import {Hidden} from "material-ui";
import {Drawer} from "material-ui";

const DesktopDrawer = props => (
	<Hidden smDown implementation="css">
		<Drawer className="drawer drawer-permanent" variant="permanent" open>
			{props.children}
		</Drawer>
	</Hidden>
);

export default DesktopDrawer;