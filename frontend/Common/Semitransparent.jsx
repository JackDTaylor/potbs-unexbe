export default function Semitransparent(props) {
	const newProps = {...props};

	if(!newProps.style) {
		newProps.style = {};
	}

	newProps.style.opacity = 0.65;

	return <span {...newProps} />;
}