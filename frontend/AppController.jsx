import SystemLayout from "./Layout/SystemLayout";
import Endpoint from "./Application/Endpoint/Endpoint";
import ContentWrapper from "./Common/ContentWrapper";
import EndpointBundle from "./Application/Endpoint/EndpointBundle";
import routes from "./routes";

const URL = window.URL;

export default class FrontendAppController {
	page = null;
	layout = null;

	@observable onNavigate;

	errorEndpoint = new Endpoint('ErrorPage');

	rootEndpoint = routes();

	navigation = [
		{url: '/acl/user',                  icon: 'person', title: 'Пользователи'},
		{url: '/craft/resource',            icon: 'stars', title: 'Ресурсы'},
		{url: '/craft/resource-ingredient', icon: 'share', title: 'Ингредиенты'},
		{url: '/craft/factory',             icon: 'industry', title: 'Постройки'},
		{url: '/craft/project',             icon: 'project',  title: 'Проекты'},

		{url: '/settings',                  icon: 'settings', title: 'Настройки' },
	];

	constructor(Frontend) {}

	async prepare() {
		// const config = await API.fetch(RequestType.GET, 'frontend');

		await delay(5); // Init delay
	}

	async initialize() {
		window.onpopstate = ev => this.route(location.href);

		try {
			console.warn('Initializing to', location.href);

			let context = { url: location.href, method: 'replace' };
			let data = await this.route(location.href, context);

			if(location.href != context.url) {
				this.changeHistoryState(context, data);
			}
		} catch(error) {
			console.error(error);

		}
	}

	changeHistoryState(context, data) {
		console.log('History state', context.method.toUpperCase(), context.url);

		if(context.method == 'replace') {
			history.replaceState(/*data || */{}, this.pageTitle, context.url);
		} else {
			history.pushState(/*data || */{}, this.pageTitle, context.url);
		}
	}

	async routeError(errorCode, message = '', additionalParams = null) {
		// Allow both `routeError(code, message, params)` and `routeError(code, params)`
		if(valueType(message) !== String) {
			if(message instanceof React.Component == false) {
				additionalParams = message;
			}
		}

		return await this.routeEndpoint(this.errorEndpoint, {error: errorCode, ...additionalParams});
	}

	async routeEndpoint(endpoint, params) {
		return await endpoint.execute(params);
	}

	async route(url, context) {
		const parsedUrl = URL.parse(url);
		const originalPath = parsedUrl.pathname;

		let cleanPath = parsedUrl.pathname
			.replace(/\/+/g, '/') // No multislashes
			.replace(/\/+$/, '')  // No trailing slashes
		;

		if(cleanPath == '') {
			cleanPath = '/';
		}

		if(cleanPath != originalPath) {
			return await this.redirect(cleanPath, context);
		}

		let params = {context, subroute:cleanPath};
		let endpoint = this.rootEndpoint;

		while(endpoint instanceof EndpointBundle) {
			endpoint = await endpoint.route(params.subroute, params);
		}

		if(endpoint instanceof Endpoint == false && endpoint != false) {
			console.log(endpoint);
			throw new Error('Routing result resolved to unknown type');
		}

		if(endpoint == false || params.subroute) {
			return await this.routeError(404);
		}

		return await this.routeEndpoint(endpoint, params);
	}

	async redirect(url, context = null) {
		console.warn('Redirecting to', url);

		let isInitiator = (context == null);

		context = context || { url, method: 'replace' };
		context.url = url;

		let data = await this.route(url, context);

		if(isInitiator) {
			console.log('history.replaceState', context, url);
			this.changeHistoryState(context, data);
		}

		return data;
	}

	async navigate(url, context = null) {
		console.warn('Navigating to', url);

		let isInitiator = context == null;

		context = context || { url, method: 'push' };
		context.url = url;
		context.method = 'push';

		let data = await this.route(url, context);

		if(isInitiator) {
			this.changeHistoryState(context, data);
		}

		return data;
	}

	get pageTitle() {
		return document.title;
	}

	set pageTitle(value) {
		document.title = value;
		this.layout.pageTitle = value;
	}

	async getLayoutState() {
		return {
			navigation: this.navigation,
			/*[
				{icon: 'work',           title: 'Корабли', url: '/ships' },
				{icon: 'gavel',          title: 'Рецепты крафта', url: '/craft' },
				{icon: 'account circle', title: 'Статус победы', url: '/victory' },
				{icon: 'settings',       title: 'Настройки', url: '/settings' },
			]*/
		};
	}

	async renderLayout() {
		let layoutState = await this.getLayoutState();

		return (
			<SystemLayout ref={x => this.layout=x} state={layoutState} />
		);
	}

	async renderContent() {
		return (
			<ContentWrapper ref={x => this.content=x} />
		);
	}
}
/** @type {typeof FrontendAppController} */
global.AppController = null;
