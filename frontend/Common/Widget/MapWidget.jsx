import BaseWidget from "./BaseWidget";

export default class MapWidget extends BaseWidget {
	get additionalClasses() {
		return [...super.additionalClasses, 'paddingless'];
	}

	render() {
		return (
			<div {...this.cls}>
				<img src="https://pp.userapi.com/c846320/v846320318/3efae/WCTwH3ob95E.jpg" style={{display:'block'}} alt="Map example" width="100%" />
			</div>
		);
	}
}