import {
	FormControl, FormHelperText, Input, InputAdornment,
	InputLabel
} from "material-ui";
import FormContext from "./FormContext";

export default class Control extends ReactComponent {
	@prop label;
	@prop description;
	@prop multiline;
	@prop onChange;
	@prop formContext;
	@prop isContexted;

	get name() {
		return `${this.props.name}`;
	}

	get defaultControlledValue() {
		return '';
	}

	get formContextName() {
		return this.formContext ? this.formContext.fieldId : 'forms';
	}

	get fieldId() {
		return `${this.formContextName}-${this.name}`;
	}

	// For label shrink
	get value() {
		return this.contextValue;
	}

	get contextValue() {
		if(this.formContext) {
			return this.formContext.contextValue[this.name] || this.defaultControlledValue;
		}

		return this.props.value || this.defaultControlledValue;
	}

	set contextValue(value) {
		if(this.formContext) {
			let newValue;

			if(this.formContext.isArray) {
				let index = parseInt(this.name);

				if(isNaN(index) || index < 0) {
					throw new Error(`Wrong index for field ${this.fieldId}`);
				}

				newValue = [ ...this.formContext.contextValue ];
				newValue[index] = value;
			} else {
				newValue = {
					...this.formContext.contextValue,
					[this.name]: value
				};
			}

			this.formContext.contextValue = newValue;
		} else if(this.onChange) {
			this.onChange(value);
		} else {
			console.warn('No onChange handler defined for global field', this.name);
		}
	}

	valueFromChangeHandler(ev) {
		return ev.target.value;
	}

	get wire() {
		return {
			value: this.contextValue,
			onChange: (...args) => this.contextValue = this.valueFromChangeHandler(...args)
		}
	}

	get controlProps() {
		return {
			style: {marginTop:'0.5em'},
		};
	}

	get labelProps() {
		return {};
	}

	get fieldProps() {
		return {
			id: this.fieldId,
			name: this.name,

			...this.wire,

			multiline: !!this.multiline,
			startAdornment: this.startAdornment && <InputAdornment position="start">{this.startAdornment}</InputAdornment>,
			endAdornment: this.endAdornment && <InputAdornment position="end">{this.endAdornment}</InputAdornment>,
		}
	}

	@hook Label() {
		if(!this.label) {
			return '';
		}

		return (
			<InputLabel htmlFor={this.fieldId} {...this.labelProps}>{this.label}</InputLabel>
		);
	}

	@hook Field() {
		return (
			<Input {...this.fieldProps} />
		);
	}

	@hook Description() {
		return (
			<FormHelperText>{this.description}</FormHelperText>
		);
	}

	get controlEl() {
		return ReactDOM.findDOMNode(this);
	}

	focus() {
		this.controlEl.focus();
	}

	blur() {
		this.controlEl.blur();
	}

	contextualRender() {
		return (
			<FormControl {...this.cls} {...this.controlProps}>
				{this.Label}
				{this.Field}
				{this.Description}
			</FormControl>
		);
	}

	render() {
		if(this.isContexted) {
			return this.contextualRender();
		}

		return <FormContext.Consumer children={formContext => {
			const Constructor = this.constructor;
			return <Constructor {...this.props} isContexted formContext={formContext} />
		}} />;
	}
}