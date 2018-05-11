import Control from "../Control";
import SelectControlInput from "./SelectControl/SelectControlInput";

export default class SelectControl extends Control {
	@prop multiple;
	@prop allowNonUnique;

	@prop dataSource;
	@prop allowQuickCreate = false;

	@observable onKeyDown;

	inputEl;

	@state labelShrink;

	get isMultiple() {
		return !!this.multiple;
	}

	get isUnique() {
		return !this.allowNonUnique;
	}

	get isFocused() {

		return true;
	}

	get labelProps() {
		return {
			shrink: this.labelShrink,
			...super.labelProps,
		}
	}

	get defaultControlledValue() {
		return this.isMultiple ? [] : null;
	}

	get inputValue() {
		if(this.isMultiple) {
			if(this.isUnique) {
				return this.contextValue.unique();
			}

			return this.contextValue;
		}

		return undefinedOrNull(this.contextValue) ? [] : [this.contextValue];
	}

	onInputChange(newValue) {
		if(this.isUnique) {
			newValue = newValue.unique();
		}

		if(this.isMultiple) {
			this.contextValue = newValue || [];
		} else {
			this.contextValue = newValue[0] || null;
		}
	}

	get fieldProps() {
		return {
			className: 'dmi dmi-select-control-input',
			inputComponent: SelectControlInput,
			inputRef: e => this.inputEl = e,
			inputProps: {
				field: this,
				value: this.inputValue,
				onChange: v => this.onInputChange(v),
				onLabelShrinkChange: v => this.labelShrink = v,
			},

			onKeyDown: (...args) => this.onKeyDown.invoke(...args),
		}
	}
}
