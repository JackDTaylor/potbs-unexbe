import {CircularProgress, MenuItem, MenuList, Paper} from "material-ui";
import EmptyPlaceholder from "../../../Typography/EmptyPlaceholder";
import Loading from "../../../Typography/Loading";
import ErrorSign from "../../../Typography/ErrorSign";

export default class SelectControlDropdown extends ReactComponent {
	@prop elementRef;
	@prop style;
	@prop placement;

	@prop onFocus;
	@prop onBlur;
	@prop onKeyDown;

	@prop menuRef;
	@prop paperRef;

	@prop onActiveItemChange;
	@prop onRequestMoreOptions;
	@prop onItemClick;
	@prop options;
	@prop optionsLoaded;
	@prop optionsLoading;

	@prop selectedOptions;

	itemBlurPromise;

	popupEl;

	componentDidMount() {
		this.popupEl = ReactDOM.findDOMNode(this);

		this.checkScroll();
	}

	onItemFocus(ev) {
		if(this.itemBlurPromise) {
			this.itemBlurPromise.cancel();
			this.itemBlurPromise = null;
		}

		this.onActiveItemChange(jQuery(ev.target).data('index'));
	}

	onItemBlur() {
		this.itemBlurPromise = delay().then(fn => this.onActiveItemChange(false))
	}

	scrollToLoadingPromise;

	checkScroll() {
		delay().then(() => {
			if(this.optionsLoaded) {
				return;
			}

			if(!this.popupEl) {
				console.warn('popupEl is not initialized yet');
				return;
			}

			if(this.scrollBottom < 100) {
				this.onRequestMoreOptions();
			}
		});
	}

	get scrollBottom() {
		let $popup = jQuery(this.popupEl);
		let $paper = jQuery(this.popupEl).children().first();

		// noinspection JSValidateTypes
		return ($paper.outerHeight() - $popup.height()) - $popup.scrollTop();
	}

	async renderMenuItem(option) {
		if(option instanceof Bluebird) {
			return option;
		}

		if(!option) {
			return <ErrorSign>неизвестная запись</ErrorSign>
		}

		if(option instanceof FrontendModel) {
			return option.toMenuItem();
		}

		return option.name;
	}

	render() {
		this.checkScroll();

		return (
			<div
				className="dmi dmi-select-control-dropdown-popup"
				tabIndex={-1}
				ref={this.elementRef}
				data-placement={this.placement}
				style={this.style}
				onKeyDown={this.onKeyDown}
				onFocus={this.onFocus}
				onBlur={this.onBlur}
				onScroll={fn => this.checkScroll()}
			>
				<Paper {...this.cls} elevation={2} ref={this.paperRef}>
					{(this.options.length < 1 && this.optionsLoaded) ? (
						<EmptyPlaceholder />
					) : (
						<MenuList
							role="menu"
							ref={this.menuRef}
							onFocus={ev => this.onItemFocus(ev)}
							onBlur={ev => this.onItemBlur(ev)}
						>
							{this.options.map((option, i) => {


								return (
									<MenuItem
										key={i}
										data-index={i}
										className={this.selectedOptions.has(option.id) ? 'selected' : undefined}
										children={this.renderMenuItem(option)}
										onClick={fn => this.onItemClick(option)}
									/>
								);
							})}
						</MenuList>
					)}

					{!this.optionsLoaded && (
						<EmptyPlaceholder>
							<CircularProgress />
							<Loading />
						</EmptyPlaceholder>
					)}
				</Paper>
			</div>
		);
	}
}
