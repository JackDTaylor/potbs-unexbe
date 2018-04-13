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
		const file = Application.Instance.path('/public/assets/compiled/template.html');

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

	async resolve() {
		this.context.sendResponse(await this.getPageTemplate({
			frontendConfig: embedScript(`
				window.customIcons = ${JSON.stringify(customIcons)};
			`)
		}));
	}
}