import {Typography} from "material-ui";

export default class SystemClock extends ReactComponent {
	get cssClass() { return [...super.cssClass, 'SystemClock'] };

	clockInterval = null;

	componentDidMount() {
		this.clockInterval = setInterval(fn => this.forceUpdate(), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.clockInterval);
	}


	get hours() {
		return dateFormat('H');
	}

	get minutes() {
		return dateFormat('i');
	}

	get dayOfWeek() {
		return dateFormat('l, j F');
	}

	render() {
		return (
			<div {...this.cls}>
				<Typography variant="title">
					{this.hours}
					<span className="clock-separator">:</span>
					{this.minutes}
				</Typography>

				<Typography>{this.dayOfWeek}</Typography>
			</div>
		);
	}
}