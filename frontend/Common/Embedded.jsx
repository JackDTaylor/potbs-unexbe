class EmbeddedStorageNode {
	storage;
	key;
	element;
	dateDreated;
	container;

	constructor(storage, key, contents) {
		this.key = key;
		this.storage = storage;
		this.dateDreated = Date.now();

		this.init(contents);
	}

	init(contents) {
		this.element = document.createElement('div');
		this.element.dataset.key = this.key;

		this.unmount();

		ReactDOM.render(contents, this.element);
	}

	mount(targetNode) {
		targetNode.appendChild(this.element);
		this.container = targetNode;
	}

	swapWith(node) {
		let targetContainer = node.container;

		node.mount(this.container);
		this.mount(targetContainer);
	}

	unmount() {
		this.storage.root.appendChild(this.element);
		this.container = this.storage.root;
	}

	destroy() {
		ReactDOM.unmountComponentAtNode(this.element);
		this.element.remove();

		this.storage.unregisterNode(this);
	}
}

class EmbeddedStorage {
	root;
	storage = {};

	constructor() {
		this.root = document.createElement('div');
		this.root.id = 'embeddedRoot';

		console.log(document.body);
		document.body.appendChild(this.root);
	}

	unregisterNode(node) {
		delete this.storage[node.key];
	}

	get(key, contents) {
		if(key in this.storage == false) {
			this.storage[key] = new EmbeddedStorageNode(this, key, contents);
		}

		return this.storage[key];
	}
}

export default class Embedded extends React.Component {
	static Storage = new EmbeddedStorage();

	@prop code;
	@prop contents;

	container;

	get node() {
		return this.getNodeForProps(this.props);
	}

	getNodeForProps(props) {
		return this.constructor.Storage.get(props.code, props.contents);
	}

	componentDidMount() {
		this.node.mount(this.container);
	}

	shouldComponentUpdate(newProps) {
		this.node.swapWith(this.getNodeForProps(newProps));

		this.props = newProps;
		return false;
	}

	componentWillUnmount() {
		this.node.unmount();
	}

	render() {
		return <div className="embedded" ref={c => this.container = c} />;
	}
}