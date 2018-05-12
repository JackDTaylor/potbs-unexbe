import Control from "../Control";
import {DateTimePicker, MuiPickersUtilsProvider} from "material-ui-pickers";
import ruLocale from 'date-fns/locale/ru';

class DateTimeControlUtils extends MaterialUI_pickersUtil {
	getDateTimePickerHeaderText(date) {
		return date.format('j M');
	}
}

export default class DateTimeControl extends Control {
	get defaultControlledValue() {
		return null;
	}

	inputEl;

	valueFromChangeHandler(value) {
		return value;
	}

	get pickerMessages() {
		return {
			maxDateMessage:     'Дата не должна быть позже максимальной даты',
			minDateMessage:     'Дата не должна быть раньше минимальной даты',
			invalidDateMessage: 'Неправильный формат даты',

			okLabel:      'OK',
			cancelLabel:  'Отмена',
			clearLabel:   'Очистить',
			todayLabel:   'Сегодня',
			invalidLabel: 'Ошибка',
		};
	}

	get isInputFocused() {
		// TODO: Determine whether input element is focused or not
		return false;
	}

	get labelProps() {
		return {
			...super.labelProps,
			focused: false,
		}
	}

	contextualRender() {
		return (
			<MuiPickersUtilsProvider utils={DateTimeControlUtils} locale={ruLocale}>
				<DateTimePicker
					{...this.cls}
					{...this.wire}
					{...this.pickerMessages}

					autoOk
					clearable
					ampm={false}
					label={this.label}
					labelFunc={d => d ? d.format() : ''}
					helperText={this.description}
					InputLabelProps={this.labelProps}
				/>
			</MuiPickersUtilsProvider>
		);
	}
}