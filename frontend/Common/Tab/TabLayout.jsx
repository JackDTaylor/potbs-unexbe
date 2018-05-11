import {Divider, Tab, Tabs} from "material-ui";
import TabBody from "./TabBody";

export default class TabLayout extends ReactComponent {
	@state currentTab = 0;

	get wireTabs() {
		return {
			value: this.currentTab,
			onChange: (ev, v) => this.currentTab = v
		}
	}

	get wireTabViews() {
		return {
			index: this.currentTab,
			onChangeIndex: (v) => this.currentTab = v
		}
	}

	get tabs() {
		let children = this.props.children;

		if(children instanceof Array == false) {
			children = [children];
		}

		return [].concat(...children);
	}

	get tabNames() {
		return this.tabs.map(tab => tab.props.label);
	}

	render() {
		return (
			<div {...this.cls}>
				<Tabs {...this.wireTabs} indicatorColor="primary" textColor="primary" scrollable scrollButtons="auto">
					{this.tabNames.map((name, i) => <Tab key={i} label={name} />)}
				</Tabs>

				<Divider />

				<div style={{padding: '1em 1.5em'}}>
					<SwipeableViews axis="x" animateTransitions={false} {...this.wireTabViews}>
						{this.tabs.map((tab, i) => (
							<TabBody{...tab.props} key={i} tabIndex={i} tabLayout={this} />
						))}
					</SwipeableViews>
				</div>
			</div>
		);
	}
}