import "./Application/Routing/RouteManager";
import ModelGridEndpoint from "./Application/Endpoint/Model/ModelGridEndpoint";

RouteManager.modelBundles();

RouteManager.scope('/', scope => {
	scope.index(new ModelGridEndpoint('Acl/User'));

	scope.redirect('/r{id:numeric}', '/craft/resource/{id}');

	scope('craft', scope => {
		scope('resource', scope => {
			scope.redirect('/id{id}/edit', '/');
			scope.redirect('/id{id}/{param}', '/');
			scope.redirect('/{id}/{param}', '/');
		});

		scope('factory', scope => {
			scope.redirect('/{a:numeric}_{b:literal}/{id}/edit', '/');
			scope.redirect('/{a:numeric}_{b:literal}/{id}', '/');
			scope.redirect('/{a:numeric}_{b:literal}/edit', '/');
		});
	})
});

export default RouteManager.compile();