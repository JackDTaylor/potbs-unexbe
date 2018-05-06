import Field from "./Field";
import {AppBar, Divider, Paper, Tab, Tabs} from "material-ui";
import Button from "../Button/Button";
import SelectField from "./Fields/SelectField";
import IntegrationReactSelect from "./Fields/ReactSelect/ReactSelectMUI";
import ReactSelect from 'react-select';

export default class FormLayout extends ReactComponent {
	@prop provider;
	@prop record;

	@state formState = {};

	submit() {
		console.warn('submit');
	}

	get wire() {
		return {
			value: this.formState,
			onChange: v => {
				this.formState = v;
				this.commitState();
			}
		}
	}

	get wireTabs() {
		return {
			value: this.currentTab,
			onChange: (ev, v) => this.currentTab = v
		}
	}

	get wireTabViews() {
		return {
			index: this.currentTab,
			onChangeIndex: v => this.currentTab = v
		}
	}

	@state currentTab = 0;

	render() {
		const name = this.provider.id;
		const FormCls = this.provider.formComponent;

		return (
			<div {...this.cls}>
				<FormCls name={name} {...this.wire} onSubmit={fn => this.submit()}>
					<Paper>
						<Tabs {...this.wireTabs} indicatorColor="primary" textColor="primary" scrollable scrollButtons="auto">
							<Tab label="Основное" />
							<Tab label="Рецепты" />
							<Tab label="Прочее" />
						</Tabs>
						<Divider  />
						<div style={{marginTop: '1px', padding: '1em 1.5em'}}>
							<SwipeableViews axis="x" {...this.wireTabViews}>
								<div>
									<Field name="Название" multiline />
									<br />
									<Field name="Владелец" />
									<br />
									<SelectField name="Выпадающий список" />
									{/*<IntegrationReactSelect />*/}
								</div>
								<div>
									Item Two
									<br />
									<Field name="Рецепты" />
								</div>
							</SwipeableViews>
							<div style={{textAlign: 'center'}}>
								<Button variant="raised" color="primary">Сохранить</Button>
								&nbsp;&nbsp;&nbsp;
								<Button variant="raised">Отменить</Button>
							</div>
						</div>
					</Paper>
				</FormCls>
			</div>
		);
	}
}