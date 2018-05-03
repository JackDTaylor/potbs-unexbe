import ContextIconButton from "../Button/ContextIconButton";

export default class WidgetHandle extends ReactComponent {
	@prop children;

	render() {
		return (
			<div {...this.cls}>
				<ContextIconButton icon={icon('menu')}>
					{this.props.children}
				</ContextIconButton>
			</div>
		);
	}
}