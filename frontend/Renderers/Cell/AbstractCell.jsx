import Loading from "../../Common/Typography/Loading";
import Empty from "../../Common/Typography/Empty";
import ReadableList from "../../Common/ReadableList";
import ErrorSign from "../../Common/Typography/ErrorSign";

const NO_VALUE = Symbol('NO_VALUE');

export default class AbstractCell extends ReactComponent {
	static CssClasses = ['Cell'];

	@prop value;
	@prop row;
	@prop column;

	@state asyncValue = NO_VALUE;
	asyncPromise = null;

	get property() {
		return this.column.property;
	}

	async waitAsyncValue(value) {
		// await delay(1000);
		this.asyncValue = await value;
	}

	renderEmpty(value) {
		return <Empty />;
	}

	renderError(value) {
		return <ErrorSign error={value} />;
	}

	renderLoading(value) {
		return <Loading />;
	}

	renderPlain(value) {
		return value;
	}

	renderArray(value) {
		return value.map(item => this.renderPlain(item)).toReact();
	}

	renderValue(value) {
		try {
			if(empty(value)) {
				return this.renderEmpty(value);
			}

			if(value instanceof Bluebird) {
				return (async() => this.renderValue(await value))();
			}

			if(value instanceof Array) {
				return this.renderArray(value);
			}

			// This is probably a ReactElement or plain value
			// If it isn't, then React will throw and error about it.
			return this.renderPlain(value);
		} catch(error) {
			return this.renderError(error);
		}
	}

	/**
	 * This getter takes a raw value from props and renders it according to it's type.
	 * Each of the render<...>() methods should return a valid renderable value.
	 * @return {*} Renderable value
	 */
	get preparedValue() {
		return this.renderValue(this.value);
	}

	render() {
		return (
			<div {...this.cls}>
				{this.preparedValue}
			</div>
		);
	}
}