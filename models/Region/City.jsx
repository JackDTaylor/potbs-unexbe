import {ListItemText} from "material-ui";

@registerBundle('/region/city')
export default class RegionCity extends PlatformSpecificModel {
	static get SearchCriteria() {
		return ['name', 'district', 'region'];
	}

	get fullRegionName() {
		return [this.district, this.region, 'Россия'].filter(x => x).join(', ');
	}

	toMenuItem() {
		return (
			<ListItemText primary={this.name} secondary={this.fullRegionName} style={{padding:'5px 10px'}} />
		);
	}
}