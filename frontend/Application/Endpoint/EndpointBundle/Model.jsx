import EndpointBundle from "../EndpointBundle";
import Endpoint from "../Endpoint";
import ModelProxy from "../../Proxy/Model";

export default class ModelEndpointBundle extends EndpointBundle {
	constructor(model) {
		const commonParams = function() {
			return {
				proxy: new ModelProxy(model),
			};
		};

		super({
			'/':          new Endpoint('Model/ListPage',       {...commonParams()}),
			'/add':       new Endpoint('Model/CreateFormPage', {...commonParams()}),
			'/#id#/edit': new Endpoint('Model/EditFormPage',   {...commonParams()}),
			'/#id#':      new Endpoint('Model/ViewPage',       {...commonParams()}),
		})
	}

	//  '/craft/resource': new Endpoint('ListPage', {
	//  	proxy: new ModelProxy('Craft/Resource')
	//  }),
	//
	//  '/craft/resource/add': new Endpoint('CreateFormPage', {
	//  	proxy: new ModelProxy('Craft/Resource')
	//  }),
	//
	//  '/craft/resource/{id}': new Endpoint('EditFormPage', {
	//  	proxy: new ModelProxy('Craft/Resource')
	//  }),
}