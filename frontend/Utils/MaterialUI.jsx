import injectTapEventPlugin from 'react-tap-event-plugin';
import {withStyles} from "material-ui";
import {Icon} from "material-ui";
import {MuiThemeProvider} from "material-ui";
import {colors} from "material-ui";
import {createMuiTheme} from "material-ui";

if(!window.tapPluginInjected) {
	window.tapPluginInjected = true;
	injectTapEventPlugin();
}

window.colors = colors;

window.muiTheme = {
	theme: createMuiTheme({
		palette: {
			primary: colors.blue,
			secondary: colors.deepOrange,
		},
	})
};

window.themed = function themed(component) {
	return (
		<MuiThemeProvider {...muiTheme}>
			{component}
		</MuiThemeProvider>
	);
};

const CustomIcon = props => (
	<span className={`custom-icons ${props.className}`}>{props.children}</span>
);

window.icon = function icon(icon, color) {
	let T = Icon;
	icon = String(icon).replace(/\s+/g, '_');

	if(icon in customIcons) {
		// noinspection JSUnusedAssignment
		T = CustomIcon;
		icon = JSON.parse(`"${customIcons[icon].replace(/^\\/, '\\u')}"`);
	}

	const props = color ? {color} : {};

	return (
		<T {...props}>{icon}</T>
	);
};

window.style = function style(rootStyle) {
	let args = [...arguments];

	if(rootStyle instanceof Function == false) {
		const root = { ...rootStyle };

		rootStyle = () => ({root});

		args = args.slice(1);

		const childStyle = args[0] || (() => ({}));

		args[0] = theme => {
			return {...rootStyle(theme), ...childStyle(theme)};
		};
	}

	return withStyles.apply(this, args);
};

window.addStyle = function addStyle(props, style = {}) {
	return {
		...props,
		style: {
			...props.style,
			...style
		}
	};
};
window.addStyleIf = function addStyleIf(cond, props, style = {}) {
	props = {...props};

	if(!cond(props)) {
		return props;
	}

	return {
		...props,
		style: {
			...props.style,
			...style
		}
	};
};

class Theme extends ReactComponent {
	render() {
		return <MuiThemeProvider {...muiTheme}>{this.props.children}</MuiThemeProvider>;
	}
}

window.Theme = Theme;