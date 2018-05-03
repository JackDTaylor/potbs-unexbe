const utils = _decoratorUtils;

global.column  = column => defineKey('column',  column);
global.labeled = label  => defineKey('label',  label);
global.widget =  type   => {
	return function(p, f, d) {
		p.constructor.WidgetNames = p.constructor.WidgetNames || [];
		p.constructor.WidgetNames.push(f);

		return defineKey('type', type)(p, f, d);
	};
};

global.RenderComponent = function(config) {
	const {type, ...props} = config;
	const Component = type;

	return <Component key={props.name} {...props} />;
};