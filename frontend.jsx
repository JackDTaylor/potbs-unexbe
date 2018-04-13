import Frontend from "./frontend/Application/Frontend";

global = window;

import "./frontend/utils";
import sharedUtils from "./common/utils";
sharedUtils(window);

import {CssBaseline} from "material-ui";
import FrontendAppController from "./frontend/AppController";
import FrontendAPI from "./frontend/Application/FrontendAPI";

(async function() {
	global.AppController = new FrontendAppController(Frontend);
	global.API = FrontendAPI;

	await AppController.prepare();

	let layout = await AppController.renderLayout();
	let content = await AppController.renderContent();

	ReactDOM.render((
		<Theme>
			<CssBaseline />
			{layout}
		</Theme>
	), document.getElementById('layoutWrapper'));

	ReactDOM.render((
		<Theme>
			<CssBaseline />
			{content}
		</Theme>
	), document.getElementById('contentWrapper'));

	await AppController.initialize();
})();