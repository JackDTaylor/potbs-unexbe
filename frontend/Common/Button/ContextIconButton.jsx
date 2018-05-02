import {Menu} from "material-ui";
import {MenuItem} from "material-ui";
import IconButton from "./IconButton";

export default class ContextIconButton extends ReactComponent {
	@state open = false;
	@state anchor;

	doOpen(ev) {
		this.open = true;
		this.anchor = ev.currentTarget;
	}

	doClose() {
		this.open = false;
		this.anchor = null;
	}

	get items() {
		let children = this.props.children;

		if(empty(children)) {
			return [];
		}

		if(children instanceof Array == false) {
			return [children];
		}

		return children;
	}


	render() {
		const openMenu = ev => this.doOpen(ev);
		const closeMenu = fn => this.doClose();

		let i = 0;

		return (
			<div {...this.cls}>
				<IconButton
					active={this.props.active}
					color={this.props.color}
					onClick={openMenu}
					children={this.props.icon}
				/>

				<Menu anchorEl={this.anchor} open={this.open} onClose={closeMenu}>
					{this.items.map(child => {
						let props = { ...child.props };

						let handler = props.onClick || (fn => {});

						props.onClick = function() {
							if(handler.apply(this, arguments) !== false) {
								closeMenu();
							}
						};

						return (
							<MenuItem {...props} key={i++} />
						)
					})}
				</Menu>
			</div>
		);
	}
}