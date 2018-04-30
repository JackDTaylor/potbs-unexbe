import "./frontend/utils";

import {CssBaseline} from "material-ui";
import FrontendAppController from "./frontend/AppController";
import FrontendAPI from "./frontend/Application/FrontendAPI";

(async function() {
	console.verbose('Loading renderers...');

	await LoadRenderers();

	console.verbose('Preparing...');


	global.AppController = new FrontendAppController();
	global.API = FrontendAPI;

	await AppController.prepare();

	console.verbose('Rendering...');

	let layout = await AppController.renderLayout();
	let content = await AppController.renderContent();

	console.verbose('Mounting...');

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

	console.verbose('Initializing...');

	await AppController.initialize();

	console.log(`Ready in ${Date.now() - StartTime}ms`);
})();