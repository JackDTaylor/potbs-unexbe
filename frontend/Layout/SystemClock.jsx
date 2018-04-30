import {Typography} from "material-ui";

export default class SystemClock extends ReactComponent {
	clockInterval = null;

	componentDidMount() {
		this.clockInterval = setInterval(fn => this.forceUpdate(), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.clockInterval);
	}


	get hours() {
		return Date.current.format('H');
	}

	get minutes() {
		return Date.current.format('i');
	}

	get dayOfWeek() {
		return Date.current.format('l, j F');
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