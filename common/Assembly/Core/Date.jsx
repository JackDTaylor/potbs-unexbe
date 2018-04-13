export default () => {
	Date.unixNow = function() {
		return Math.floor(Date.now() / 1000);
	};

	Date.today = function() {
		let now = new Date();
		return (Math.floor(now.getTime() / Time.DAY) * Time.DAY) + now.getTimezoneOffset()*60*1000;
	};

	Date.unixToday = function() {
		return Math.floor(Date.today() / 1000);
	};
}