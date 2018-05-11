export default class SelectDropdownBehavior {
	enabled = true;
	order = 849; // Just before the computeStyles

	fn = function(data) {
		let {
			left, top,
			right, bottom,
			width, height
		} = data.instance.reference.getBoundingClientRect();

		let viewport = {
			width: jQuery(window).width(),
			height: jQuery(window).height(),
		};

		let rect = {
			top, left,
			width, height,

			right: viewport.width - right,
			bottom: viewport.height - bottom,
		};

		let maxHeight = rect.bottom;

		if(maxHeight < 270) {
			maxHeight = rect.top;
		}

		if(maxHeight < 250) {
			maxHeight = viewport.height;
		}

		maxHeight -= 20;

		if(data.instance.state.isCreated == false) {
			data.instance.scheduleUpdate();
		}

		data.styles = {
			...data.styles,
			width: rect.width,
			maxHeight: maxHeight,
		};

		return data;
	}
}