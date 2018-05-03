import Caption from "../Typography/Caption";

export default class WidgetProperties extends ReactComponent {
	@prop provider;

	render() {
		return (
			<div {...this.cls}>
				{Object.values(this.provider.properties).map(property => (
					<div className="row" key={property.name}>
						<label className="property-name"><Caption>{property.label}</Caption></label>
						{this.provider.renderValue(property.name)}
					</div>
				))}
			</div>
		);
	}
}