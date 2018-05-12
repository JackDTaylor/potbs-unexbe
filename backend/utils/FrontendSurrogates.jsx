(restrictedModule => {
	global.React                  = restrictedModule('React');
	global.ReactDOM               = restrictedModule('ReactDOM');
	global.jQuery                 = restrictedModule('jQuery');
	global.MaterialUI             = restrictedModule('MaterialUI');
	global.MaterialUI_colors      = restrictedModule('MaterialUI_colors');
	global.MaterialUI_styles      = restrictedModule('MaterialUI_styles');
	global.MaterialUI_transitions = restrictedModule('MaterialUI_transitions');
	global.SwipeableViews         = restrictedModule('SwipeableViews');
	global.ReactPopper            = restrictedModule('ReactPopper');
	global.DxReactGrid            = restrictedModule('DxReactGrid');
	global.DxReactGridMaterialUi  = restrictedModule('DxReactGridMaterialUi');
})(name => new Proxy({}, {
	get: function(target, key) {
		if(key == "__esModule") {
			return true;
		}

		throw new Error(`Backend usage of ${name}::${key}`);
	}
}));