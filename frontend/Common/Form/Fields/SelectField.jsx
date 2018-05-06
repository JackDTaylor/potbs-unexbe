import Field from "../Field";

export default class SelectField extends Field {
	@prop multiple;

	get isMultiple() {
		return !!this.multiple;
	}

	get labelProps() {
		if(1) {
			return {shrink:true};
		}

		return super.labelProps;
	}

	get defaultControlledValue() {
		return this.isMultiple ? [] : "";
	}

	get fieldProps() {
		return {
			className: 'dmi dmi-select-field-input',
			inputComponent: SelectFieldInput,
		}
	}
}

import {Chip, Input} from "material-ui";

class SelectFieldInput extends ReactComponent {
	render() {
		const {inputRef, ...props} = this.props;

		return (
			<___>
				<Chip label={<___>Ящик бронзовых круглых ядер {icon('close', null, {className:'remove-button'})}</___>} />
				<Chip label={<___>Черный порох                {icon('close', null, {className:'remove-button'})}</___>} />
				<Chip label={<___>Ящик книпелей               {icon('close', null, {className:'remove-button'})}</___>} />
				<Chip label={<___>Слиток, латунь              {icon('close', null, {className:'remove-button'})}</___>} />
				<Chip label={<___>Припасы (снаряды)           {icon('close', null, {className:'remove-button'})}</___>} />
				<Chip label={<___>Слиток, латунь              {icon('close', null, {className:'remove-button'})}</___>} />
				<Chip label={<___>Слиток, латунь              {icon('close', null, {className:'remove-button'})}</___>} />
				<Chip label={<___>Ящик бронзовых ядер         {icon('close', null, {className:'remove-button'})}</___>} />
				<Chip label={<___>Черный порох                {icon('close', null, {className:'remove-button'})}</___>} />
				<Chip label={<___>Ящик бронзовых круглых      {icon('close', null, {className:'remove-button'})}</___>} />
				<Chip label={<___>Ящик книпелей               {icon('close', null, {className:'remove-button'})}</___>} />
				<Chip label={<___>Припасы (снаряды)           {icon('close', null, {className:'remove-button'})}</___>} />
				{/*<Chip label={<___>Черный порох                {icon('close', null, {className:'remove-button'})}</___>} />*/}

				<input {...props} ref={inputRef} />
			</___>
		);
	}
}
