export default function FieldSeparator(props) {
	if(notUndefinedOrNull(props.show) && !props.show) {
		return '';
	}

	return (
		<div {...this.cls} />
	);
}