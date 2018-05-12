import Control from "./Control";
import {Paper} from "material-ui";
import Button from "../Button/Button";
import SelectControl from "./Controls/SelectControl";
import TabBody from "../Tab/TabBody";
import TabLayout from "../Tab/TabLayout";
import ModelSource from "../../Application/Data/Source/ModelSource";
import FieldSeparator from "./FieldSeparator";

export default class FormLayout extends ReactComponent {
	@prop provider;
	@prop record;

	@state formState = {};

	submit() {
		console.warn('submit');
	}

	componentWillMount() {
		this.cityDataSource = new ModelSource('Region/City');

		let formState = {};

		if(this.record) {
			this.provider.properties.forEach(property => {
				if(property.hidden == false) {
					formState[property.name] = this.record[property.name];
				}
			});
		}

		console.log(formState);
		this.formState = formState;
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

	render() {
		const name = this.provider.id;
		const FormCls = this.provider.formComponent;

		const tabs = this.provider.tabs;

		return (
			<div {...this.cls}>
				<FormCls name={name} {...this.wire} onSubmit={fn => this.submit()}>
					<Paper>
						<TabLayout>
							{Object.keys(tabs).map(tabName => (
								<TabBody key={tabName} label={tabName}>
									{tabs[tabName].map((field, i) => (
										<___ key={`${i}-${field.name}`}>
											{<FieldSeparator show={field.separator & FormSeparator.BEFORE} />}
											{RenderComponent({
												type: GetRenderer(field.renderer),
												width: field.width,
												property: field.property
											})}
											{<FieldSeparator show={field.separator & FormSeparator.AFTER} />}
										</___>

									))}
								</TabBody>
							))}

							{/*
							<TabBody label="Основное">
								<SelectControl
									name="city_ids"
									label="Выпадающий список"
									multiple
									dataSource={this.cityDataSource}
									description="Выберите города, куда может быть отправлен субъект"
								/>
								<Control name="name" label="Название" multiline />
								<Control name="owner_id" label="Владелец" />
							</TabBody>

							<TabBody label="Рецепты">
								<Control name="recipe" label="Рецепты" />
							</TabBody>

							<TabBody label="Прочее">
								<Control name="recipe_x" label="Рецепт 2ы" />
								<Control name="recipe_x" label="Рецепт 3ы" />
							</TabBody>*/}
						</TabLayout>

						<FormSubmit/>
					</Paper>
				</FormCls>
			</div>
		);
	}
}

class FormSubmit extends ReactComponent {
	render() {
		return (
			<div {...this.cls} style={{textAlign: 'center'}}>
				<Button variant="raised" color="primary">Сохранить</Button>
				&nbsp;&nbsp;&nbsp;
				<Button variant="raised">Отменить</Button>
			</div>
		);
	}
}