import SequelizeEx from "../core/Mysql";

// const utils = _decoratorUtils;
// const prepareScopeDeclaration = function(scope) {
// 	let isInversion = false;
//
// 	if(valueType(scope) === String) {
// 		if(scope[0] == '!') {
// 			isInversion = true;
// 			scope = scope.slice(1);
// 		}
//
// 		scope = scope.split(',').map(f => f.trim());
// 	}
//
// 	if(valueType(scope) === Array) {
// 		scope = {
// 			attributes: isInversion ? { exclude: scope } : scope
// 		}
// 	}
//
// 	return scope;
// };
//
// global.defaultScope = (scope) => utils.valueDecorator(value => {
// 	utils.defineKey('defaultScope', value, prepareScopeDeclaration(scope));
// });
//
// global.scope = (name, scope) => utils.valueDecorator(value => {
// 	utils.defineKey('scopes', value);
//
// 	value.scopes[name] = prepareScopeDeclaration(scope);
// });

// global.virtual = (name, expr, type = SequelizeEx.STRING) => utils.valueDecorator(value => {
// 	console.warn(type);
// 	if(valueType(expr) === String) {
// 		value[name] = SequelizeEx.VIRTUAL(type, [`${expr} as \`${name}\``]);
// 	} else {
// 		value[name] = SequelizeEx.VIRTUAL(type, expr);
// 	}
// });

// API decorators
// global.requestMethod = function requestMethod(method) {
// 	return function(p, f, d) {
// 		const original = d.value;
//
// 		return {
// 			...d,
// 			value: function() {
// 				if(this.request.method != method) {
// 					throw {
// 						code: 1001,
// 						message: `${method} request is required`,
// 					};
// 				}
//
// 				return original.apply(this, arguments);
// 			}
// 		};
// 	}
// };
// global.requestParams = function requestParams(...params) {
// 	return function(p, f, d) {
// 		const original = d.value;
//
// 		return {
// 			...d,
// 			value: function() {
// 				let query = this.request.query;
//
// 				if(this.request.method != 'GET') {
// 					query = this.request.post;
// 				}
//
// 				params.forEach(param => {
// 					if(!query[param]) {
// 						throw {
// 							code: 1002,
// 							message: `${param} parameter is required`,
// 						};
// 					}
// 				});
//
// 				return original.apply(this, arguments);
// 			}
// 		};
// 	}
// };