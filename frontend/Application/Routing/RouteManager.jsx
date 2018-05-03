import Endpoint from "../Endpoint/Endpoint";
import Redirect from "../Endpoint/Redirect";
import Route from "./Route";
import Alias from "../Endpoint/Alias";
import ModelCreateEndpoint from "../Endpoint/Model/ModelCreateEndpoint";
import ModelEditEndpoint from "../Endpoint/Model/ModelEditEndpoint";
import ModelGridEndpoint from "../Endpoint/Model/ModelGridEndpoint";
import ModelViewEndpoint from "../Endpoint/Model/ModelViewEndpoint";

class RouteManager {
	get ParamRegex() {
		return /{[^}]+}/g;
	}

	/** @protected */
	urls = [];

	/** @protected */
	register(url, endpoint) {
		this.urls.push(new Route(url, endpoint))
	}

	/** @protected */
	page(baseUrl, pages) {
		if(pages instanceof Endpoint) {
			pages = {'/': pages};
		}

		Object.keys(pages).forEach(subPath => {
			this.register(`${baseUrl}/${subPath}`, pages[subPath]);
		});
	}

	/** @protected */
	redirect(url, targetUrl) {
		this.page(url, new Redirect(targetUrl));
	}

	/** @protected */
	alias(url, targetUrl) {
		this.page(url, new Alias(targetUrl));
	}

	/** @protected */
	modelBundle(url, modelCode) {
		this.page(url, {
			'/':                  new ModelGridEndpoint(modelCode),
			'/add':               new ModelCreateEndpoint(modelCode),
			'/{id:numeric}':      new ModelViewEndpoint(modelCode),
			'/{id:numeric}/edit': new ModelEditEndpoint(modelCode),
		});
	}

	index(page) {
		this.page('/', page);
	}

	scope(baseUrl, fn) {
		let scope = (url, fn) => this.scope(`${baseUrl}/${url}`, fn);

		scope.index          = (page)        => this.page        (baseUrl, page);
		scope.page           = (url, pages)  => this.page        (`${baseUrl}/${url}`, pages);
		scope.redirect       = (url, target) => this.redirect    (`${baseUrl}/${url}`, target);
		scope.localRedirect  = (url, target) => this.redirect    (`${baseUrl}/${url}`, `${baseUrl}/${target}`);
		scope.alias          = (url, target) => this.alias       (`${baseUrl}/${url}`, target);
		scope.localAlias     = (url, target) => this.alias       (`${baseUrl}/${url}`, `${baseUrl}/${target}`);
		scope.modelBundle    = (url, code)   => this.modelBundle (`${baseUrl}/${url}`, code);

		fn(scope);
	}

	modelBundles() {
		Object.pairs(frontendData.modelBundles).forEach(p => this.modelBundle(p.key, p.value));
	}

	compile() {
		this.urls.sort((a, b) => {
			let partsMin = Math.min(a.parts.length, b.parts.length);

			for(let i = 0; i < partsMin; i += 2) {
				let order = -cmp(a.parts[i].length, b.parts[i].length);

				if(order != 0) {
					return order;
				}
			}

			return cmp(a.parts.length, b.parts.length);
		});

		return this.urls;
	}
}

global.RouteManager = new RouteManager;