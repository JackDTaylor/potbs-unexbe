import SystemLayout from "./Layout/SystemLayout";
import Endpoint from "./Application/Endpoint/Endpoint";
import ContentWrapper from "./Common/ContentWrapper";
import registeredRoutes from "./routes";

const URL = window.URL;

let activeContext = null;
async function lockContext(url, fn) {
	let isInitiator = false;

	if(activeContext == null) {
		isInitiator = true;
		activeContext = {};
	}

	activeContext.url = url;

	let res = await fn();
	if(res) {
		console.log('setting push to true', res);
		activeContext.isPush = true;
	}

	if(isInitiator) {
		console.log(activeContext);
		AppController.changeHistoryState(activeContext.url, activeContext.isPush);

		activeContext = null;
	}
}

// TODO: Hotkeys

export default class FrontendAppController {
	page = null;
	layout = null;

	@observable onNavigate;

	errorEndpoint = new Endpoint('ErrorPage');

	navigation = [
		{url: '/acl/user',                  icon: 'person',   title: 'Пользователи'},
		{url: '/craft/resource',            icon: 'stars',    title: 'Ресурсы'},
		{url: '/craft/resource-ingredient', icon: 'share',    title: 'Ингредиенты'},
		{url: '/craft/factory',             icon: 'industry', title: 'Постройки'},
		{url: '/craft/project',             icon: 'project',  title: 'Проекты'},

		{url: '/settings',                  icon: 'settings', title: 'Настройки' },
	];

	constructor() {}

	async prepare() {
		// const config = await API.fetch(RequestType.GET, 'frontend');

		await delay(5); // Init delay
	}

	async initialize() {
		window.onpopstate = ev => this.route(location.href);

		await this.route(location.href);
	}

	changeHistoryState(url, push = false) {
		console.log('History state', url, push);

		if(push == false) {
			history.replaceState({}, this.pageTitle, url);
		} else {
			history.pushState({}, this.pageTitle, url);
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

	async route(url) {
		const parsedUrl = URL.parse(url);
		const originalPath = parsedUrl.pathname;
		const cleanPath = URL.clean(originalPath);

		if(cleanPath != originalPath) {
			return await this.redirect(cleanPath);
		}

		let endpoint = null;
		let params = {};

		registeredRoutes.some(route => {
			const match = route.regex.exec(cleanPath);

			if(match) {
				endpoint = route.endpoint;
				params = Object.combine(route.paramNames, match.slice(1));

				console.warn('Routed as', route.url, params);
				return true;
			}
		});

		if(endpoint == null) {
			return await this.routeError(404);
		}

		return await this.routeEndpoint(endpoint, params);
	}

	async redirect(url) {
		await lockContext(url, async() => {
			console.warn('Redirecting to', url);

			await this.route(url);

			return false;
		});
	}

	async navigate(url) {
		await lockContext(url, async() => {
			console.warn('Navigating to', url);

			await this.route(url);

			return true;
		});
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
