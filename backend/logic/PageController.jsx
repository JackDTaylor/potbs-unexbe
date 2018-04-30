import Controller from "../core/Controller";
import {FileSystemAsync} from "../core/FileSystem";
import Application from "../core/Application";
import customIcons from '../../public/assets/fonts/custom-icons.json';

const embedScript = function(code) {
	return `<script type="text/javascript">
		${code.trim()}
	</script>`
};

export default class PageController extends Controller {
	async getPageTemplate(data = {}) {
		const file = Application.path('/public/assets/compiled/template.html');

		let template = await FileSystemAsync.read(file);

		template = template.replace(/<@=([^@]+)@>/g, function() {
			const key = arguments[1].trim();

			if(key in data) {
				return data[key];
			}

			return '';
		});

		return template;
	}

	async getFrontendData() {
		let version = (await this.context.version).full;
		let modelBundles = ModelManager.bundleUrls;

		return { version, customIcons, modelBundles };
	}

	async resolve() {
		const frontendData = await this.getFrontendData();

		this.context.sendResponse(await this.getPageTemplate({
			frontendData: embedScript(`
				window.frontendData = ${JSON.stringify(frontendData)};
			`)
		}));
	}
}