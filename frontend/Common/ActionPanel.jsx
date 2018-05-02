import Action from "./Action/Action";

export default class ActionPanel extends ReactComponent {
	@prop actions;
	@prop target;

	render() {
		return (
			<div {...this.cls}>
				{this.actions && this.actions.map((actionFn, key) => actionFn({
					key,
					target: this.target,
					renderMode: Action.RENDER_REGULAR,
					buttonProps: {
						// variant: 'raised',
						// color: 'primary'
					}
				}))}
			</div>
		);
	}
}