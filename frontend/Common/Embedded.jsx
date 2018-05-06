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

class StorageUpdateSession {
	promise;
	storage;
	operations = [];

	constructor(storage) {
		this.storage = storage;
		this.promise = delay(0).then(fn => this.resolve());
	}

	schedule(operation) {
		this.operations.push(operation);
	}

	resolve() {
		const nodeDb = {};
		const nodeRoots = {};

		// Calculate new node roots
		this.operations.forEach(operation => {
			let oldNode = operation.oldNode;
			let newNode = operation.newNode;

			nodeDb[oldNode.key] = oldNode;
			nodeDb[newNode.key] = newNode;

			nodeRoots[newNode.key] = operation.container;

			if(oldNode.key in nodeRoots == false) {
				nodeRoots[oldNode.key] = this.storage.root;
			}
		});

		// Apply new node roots
		Object.keys(nodeRoots).forEach(key => {
			nodeDb[key].mount(nodeRoots[key]);
		});

		this.operations.forEach(op => op.done());

		this.storage.endUpdateSession();
	}
}

class EmbeddedStorage {
	root;
	storage = {};

	activeUpdateSession = null;

	constructor() {
		this.root = document.createElement('div');
		this.root.id = 'embeddedRoot';

		document.body.appendChild(this.root);
	}

	startUpdateSession(operation) {
		if(this.activeUpdateSession == null) {
			this.activeUpdateSession = new StorageUpdateSession(this);
		}

		this.activeUpdateSession.schedule(operation);
	}

	endUpdateSession() {
		this.activeUpdateSession = null;
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
		if(Object.equal(newProps.code, this.props.code)) {
			return false;
		}

		this.constructor.Storage.startUpdateSession({
			oldNode: this.node,
			newNode: this.getNodeForProps(newProps),
			container: this.container,

			// Not necessarily needed, but just in case
			done: fn => this.props = newProps
		});

		return false;
	}

	componentWillUnmount() {
		this.node.unmount();
	}

	render() {
		return <div className="embedded" ref={c => this.container = c} />;
	}
}