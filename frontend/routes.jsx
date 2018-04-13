import ModelEndpointBundle from "./Application/Endpoint/EndpointBundle/Model";
import ModelProxy from "./Application/Proxy/Model";
import Redirect from "./Application/Endpoint/Redirect";
import Endpoint from "./Application/Endpoint/Endpoint";
import EndpointBundle from "./Application/Endpoint/EndpointBundle";

export default routes => (
	new EndpointBundle({
		'/': new Endpoint('Model/ListPage', {
			proxy: new ModelProxy('Acl/User')
		}),

		'/craft': new EndpointBundle({
			'/': new Redirect('/craft/resource/'),
			'/resource': new ModelEndpointBundle('Craft/Resource'),
			'/resource-ingredient': new ModelEndpointBundle('Craft/Resource/Ingredient'),
			'/factory': new ModelEndpointBundle('Craft/Factory'),
			'/project': new ModelEndpointBundle('Craft/Resource'),
		})
	})
);