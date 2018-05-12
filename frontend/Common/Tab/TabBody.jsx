
export default class TabBody extends ReactComponent {
	@prop tabIndex;
	@prop tabLayout;

	onFocusCapture() {
		if(this.tabLayout.currentTab > this.tabIndex) {
			this.tabLayout.currentTab = this.tabIndex;
		}
	}

	render() {

		return (
			<div {...this.cls} onFocusCapture={fn => this.onFocusCapture()}>
				{this.props.children}
			</div>
		);
	}
}