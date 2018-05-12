import {Chip} from "material-ui";
import {Manager, Popper, Reference} from 'react-popper';
import SelectControlDropdown from "./SelectControlDropdown";
import ErrorSign from "../../../Typography/ErrorSign";
import SelectDropdownBehavior from "./SelectDropdownBehavior";

export default class SelectControlInput extends ReactComponent {
	@prop field;

	@state activeChip = false;
	@state activeDropdownItem = false;

	@state isInputFocused = false;
	@state isDropdownFocused = false;
	@state isFocusHolderFocused = false;

	pageSize = 10;

	get dataSource() {
		return this.field.dataSource;
	}

	@state options = [];
	@state nextOffset = 0;
	@state optionsLoading = false;

	@prop value = [];
	@prop onChange = fn => console.warn('SelectControlInput.onChange was not passed with props');
	@prop onLabelShrinkChange = fn => {};

	@state searchValue = '';
	@state labelShrink = false;

	inputEl;
	innerEl;

	dropdownMenuEl;
	dropdownPopupEl;

	focusHolderEl;

	get $dropdownMenuEl() {
		return jQuery(ReactDOM.findDOMNode(this.dropdownMenuEl));
	}

	popperBoundaryEl;

	get popperConfig() {
		return {
			placement: "bottom-start",
			eventsEnabled: true,
			positionFixed: false,
			modifiers: {
				dropdownBehavior: new SelectDropdownBehavior,
				preventOverflow: { enabled: true, boundariesElement: this.popperBoundaryEl },
				keepTogether: true,
				flip: { behavior: ['bottom', 'top'] },
			},
			children: props => this.renderDropdown({
				placement:  props.placement,
				elementRef: props.ref,
				style:      props.style,
			}),
		};
	}

	updateLabelShrink() {
		let labelShrink = (
			this.value.length > 0
			|| this.isInputFocused
			|| this.isDropdownFocused
			|| this.isFocusHolderFocused
		);

		if(labelShrink != this.labelShrink) {
			this.labelShrink = labelShrink;
			this.onLabelShrinkChange(labelShrink);
		}
	}

	async componentWillMount() {
		this.popperBoundaryEl = document.getElementById('contentWrapper');
		this.nextOffset = 0;
	}

	async fetchOptions() {
		if(this.nextOffset === false) {
			return;
		}

		this.optionsLoading = true;

		let loadedOptions = await this.dataSource.queryRecords({
			search: this.searchValue || undefined,
			paging: {
				offset: this.nextOffset,
				count: this.pageSize
			}
		});

		this.nextOffset = this.dataSource.nextOffset;
		this.options = [...this.options, ...loadedOptions];
		this.optionsLoading = false;
		this.commitState();
	}

	async onRequestMoreOptions() {
		if(this.optionsLoading == false && this.nextOffset !== false) {
			await this.fetchOptions();
		}
	}

	changeSearchValuePromise = null;

	async changeSearchValue(newValue) {
		if(this.searchValue == newValue) {
			return;
		}

		this.searchValue = newValue;

		if(this.changeSearchValuePromise) {
			this.changeSearchValuePromise.cancel();
		}

		this.changeSearchValuePromise = delay(150).then(async() => {
			this.options = [];
			this.nextOffset = 0;

			await this.fetchOptions();
		});
	}

	get isInputLeftmost() {
		return this.inputEl.selectionStart == 0 && this.inputEl.selectionEnd == 0;
	}

	focusLastChip() {
		if(this.value.length > 0) {
			this.activeChip = this.value.length - 1;
			this.focusChip(this.activeChip);
		} else {
			this.focusInput();
		}
	}

	moveCursorLeft() {
		if(this.value.length <= 0) {
			return this.focusInput();
		}

		if(this.activeChip === 0) {
			// This is the first chip, do nothing
			return;
		}

		if(this.activeChip === false) {
			if(this.isInputFocused) {
				// No chips selected, but input is focused
				// If the cursor is at its leftmost position, select last chip

				if(this.isInputLeftmost) {
					this.focusLastChip();
				}
			}

			return;
		}

		this.activeChip--;
		this.focusChip(this.activeChip);
	}

	moveCursorRight() {
		if(this.value.length <= 0) {
			// No chips, focus input (just in case it's not active)
			return this.focusInput();
		}

		if(this.activeChip + 1 >= this.value.length) {
			// This is the last chip, focus input
			return this.focusInput();
		}

		if(this.activeChip === false) {
			// No chip selected, do nothing
			return;
		}

		this.activeChip++;
		this.focusChip(this.activeChip);
	}

	async deleteValue(i) {
		let newValues = [...this.value];
		newValues.splice(i, 1);
		this.onChange(newValues);

		await delay();

		if(newValues.length == 0 || newValues.length <= this.activeChip) {
			this.focusInput();
		} else {
			this.focusChip(this.activeChip);
		}
	}

	addValue(value) {
		if(this.value.has(value)) {
			return this.deleteValue(this.value.indexOf(value)).then(fn => {

				this.clearSearchValue();
				this.focusInput();
			});
		}

		if(this.field.isMultiple) {
			this.onChange([...this.value, value]);
		} else {
			this.onChange([value]);
		}

		this.clearSearchValue();
		this.focusFocusHolder();
	}

	clearSearchValue() {
		this.inputEl.value = "";
		return this.changeSearchValue("");
	}

	onChipKeyDown(ev) {
		const initialIndex = this.activeChip;

		if(ev.keyCode == Keyboard.LEFT) {
			return this.moveCursorLeft();
		}

		if(ev.keyCode == Keyboard.RIGHT) {
			return this.moveCursorRight();
		}

		if(ev.keyCode == Keyboard.BACKSPACE) {
			// No deleteValue() here because MUI is too smart
			// this.deleteValue(initialIndex);
			this.moveCursorLeft();
		}

		if(ev.keyCode == Keyboard.DELETE) {
			return this.deleteValue(initialIndex);
		}

		if(ev.keyCode == Keyboard.ESCAPE) {
			return this.focusFocusHolder();
		}
	}

	onInputKeyDown(ev) {
		if(ev.keyCode == Keyboard.LEFT) {
			return this.moveCursorLeft();
		}

		if(ev.keyCode == Keyboard.RIGHT) {
			return this.moveCursorRight();
		}

		if(ev.keyCode == Keyboard.UP) {
			return this.focusDropdownLast();
		}

		if(ev.keyCode == Keyboard.DOWN) {
			return this.focusDropdownFirst();
		}

		if(ev.keyCode == Keyboard.BACKSPACE) {
			if(this.isInputLeftmost) {
				this.moveCursorLeft();
			}

			return;
		}

		if(ev.keyCode == Keyboard.ENTER) {
			if(this.field.allowQuickCreate) {
				// dataSource.createRecord(...)
				this.addValue(this.searchValue);

				// noinspection JSIgnoredPromiseFromCall
				this.changeSearchValue('');
			} else if(this.options.length) {
				this.addValue(this.options.first.id);
			}

			this.focusFocusHolder();
		}

		if(ev.keyCode == Keyboard.ESCAPE) {
			return this.focusFocusHolder();
		}
	}

	onFocusHolderKeyDown(ev) {
		if(ev.keyCode == Keyboard.LEFT) {
			return this.focusLastChip();
		}

		if(ev.keyCode == Keyboard.RIGHT) {
			return this.focusInput();
		}

		if(ev.keyCode == Keyboard.ENTER) {
			return this.focusInput();
		}

		if(this.isRegularKeyboardKey(ev.key)) {
			return this.focusInput();
		}
	}

	onDropdownKeyDown(ev) {
		if(ev.keyCode == Keyboard.ESCAPE) {
			return this.focusFocusHolder();
		}

		if(ev.keyCode == Keyboard.UP) {
			if(this.activeDropdownItem === 0) {
				this.focusInput();
			}

			return;
		}

		if(this.isRegularKeyboardKey(ev.key)) {
			this.focusInput();
		}
	}

	isRegularKeyboardKey(key) {
		return key.length == 1 && /[-_A-ZА-ЯЁ0-9]/i.test(key);
	}

	get isDropdownVisible() {
		return this.isInputFocused || this.isDropdownFocused;
	}

	dropdownLoseFocusPromise;
	inputLoseFocusPromise;
	focusHolderLoseFocusPromise;

	onDropdownReceiveFocus() {
		if(this.dropdownLoseFocusPromise) {
			this.dropdownLoseFocusPromise.cancel();
			this.dropdownLoseFocusPromise = null;
		}

		this.isDropdownFocused = true;
	}

	onInputReceiveFocus() {
		if(this.inputLoseFocusPromise) {
			this.inputLoseFocusPromise.cancel();
			this.inputLoseFocusPromise = null;
		}

		this.isInputFocused = true;
	}

	onFocusHolderReceiveFocus() {
		if(this.focusHolderLoseFocusPromise) {
			this.focusHolderLoseFocusPromise.cancel();
			this.focusHolderLoseFocusPromise = null;
		}

		this.isFocusHolderFocused = true;
	}

	onDropdownLoseFocus() {
		this.dropdownLoseFocusPromise = delay().then(fn => this.isDropdownFocused = false);
	}

	onInputLoseFocus() {
		this.inputLoseFocusPromise = delay().then(fn => this.isInputFocused = false);
	}

	onFocusHolderLoseFocus() {
		this.focusHolderLoseFocusPromise = delay().then(fn => this.isFocusHolderFocused = false);
	}




	get $dropdownFirst() {
		return this.$dropdownMenuEl.children().first();
	}

	get $dropdownLast() {
		return this.$dropdownMenuEl.children().last();
	}

	focusDropdownFirst() {
		delay().then(fn => this.$dropdownFirst.focus());
	}

	focusDropdownLast() {
		delay().then(fn => this.$dropdownLast.focus());
	}

	focusChip(i) {
		jQuery(this.innerEl).children('div[role="button"]').eq(i).focus();
	}

	onActiveDropdownItemChange(newIndex) {
		// Delay to skip onKeyPress(Keyboard.UP) event to focusing the
		// input as it is triggered after focusing the first item
		delay().then(fn => this.activeDropdownItem = newIndex);
	}

	focusFocusHolder() {
		this.isInputFocused = false;
		this.activeChip = false;

		this.focusHolderEl.focus();
	}

	focusInput() {
		this.activeChip = false;

		if(this.isInputFocused == false) {
			this.inputEl.focus();
		}
	}

	async renderChipLabel(id) {
		let record = await this.dataSource.queryRecord(id);

		if(!record) {
			return <ErrorSign>неизвестная запись</ErrorSign>
		}

		if(record instanceof FrontendModel) {
			return record.toChipLabel();
		}

		return record.name;
	}

	renderValueChips() {
		return this.value.map((id, i) => (
			<Chip
				key={`${id}:${i}`}
				className={(this.activeChip === i) ? 'active' : ''}
				onFocus={ev => this.activeChip = i}
				onBlur={ev => this.activeChip = false}
				onKeyDown={ev => this.onChipKeyDown(ev)}
				onDelete={ev => this.deleteValue(i)}
				onClick={ev => {}}
				label={this.renderChipLabel(id)}
				tabIndex={-1}
			/>
		));
	}

	renderDropdown(props) {
		if(!this.isDropdownVisible) {
			return '';
		}

		return(
			<SelectControlDropdown
				onKeyDown={ev => this.onDropdownKeyDown(ev)}
				onFocus={ev => this.onDropdownReceiveFocus()}
				onBlur={ev => this.onDropdownLoseFocus()}

				ref={e => this.dropdownPopupEl = e}
				menuRef={e => this.dropdownMenuEl = e}
				listRef={e => this.dropdownListEl = e}

				onActiveItemChange={i => this.onActiveDropdownItemChange(i)}
				onItemClick={item => this.addValue(item.id)}
				onRequestMoreOptions={fn => this.onRequestMoreOptions()}

				options={this.options}
				optionsLoaded={this.nextOffset === false}
				optionsLoading={this.optionsLoading}

				selectedOptions={this.value}

				{...props}
			/>
		);
	}

	render() {
		delay().then(fn => this.updateLabelShrink());

		// noinspection JSUnusedLocalSymbols
		const {inputRef, field, onLabelShrinkChange, ...inputProps} = this.props;

		let inputRefOverride = el => {
			inputRef(el);
			this.inputEl = el
		};

		return (
			<Manager>
				<div
					className="dmi dmi-select-control-input-inner"
					ref={e => this.innerEl = e}
				>
					{this.renderValueChips()}

					<div
						ref={e => this.focusHolderEl = e}
						onKeyDown={ev => this.onFocusHolderKeyDown(ev)}
						onFocus={ev => this.onFocusHolderReceiveFocus()}
						onBlur={ev => this.onFocusHolderLoseFocus()}
						tabIndex={-1}
					/>

					<input
						{...inputProps}
						value={undefined}
						onChange={ev => this.changeSearchValue(ev.target.value)}
						ref={inputRefOverride}
						onFocus={ev => this.onInputReceiveFocus()}
						onBlur={ev => this.onInputLoseFocus()}
						onKeyDown={ev => this.onInputKeyDown(ev)}
					/>

					<Reference children={props => (
						<div className="dmi-select-control-input-popper-ref" {...props} />
					)} />

					{ReactDOM.createPortal((
						<pre style={{position:'absolute',right:0,bottom:0,textAlign:'right'}}>
							activeChip: {JSON.stringify(this.activeChip)}{`\n`}
							activeItem: {JSON.stringify(this.activeDropdownItem)}{`\n`}
							isInputFocused: {JSON.stringify(this.isInputFocused)}{`\n`}
							isDropdownFocused: {JSON.stringify(this.isDropdownFocused)}{`\n`}
							optionsLoading: {JSON.stringify(this.optionsLoading)}{`\n`}
						</pre>
					), document.body)}

					{ReactDOM.createPortal((
						<Popper {...this.popperConfig} />
					), document.body)}
				</div>
			</Manager>
		);
	}
}
