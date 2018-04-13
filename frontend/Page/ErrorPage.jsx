import Header from "../Common/Typography/Header";
import Text from "../Common/Typography/Text";
import Page from "./Page";

const errors = {
	404: {
		title: 'Страница не найдена',
		message: <span>Запрошенная вами страница не найдена. <a href="/">Вернуться на главную</a></span>
	},

};

export default class ErrorPage extends Page {
	get cssClass() { return [...super.cssClass, 'ErrorPage'] };

	get error() {
		if(this.params.error && this.params.error.code && this.params.error.message) {
			return {
				title: `Ошибка ${this.params.error.code}`,
				message: this.params.error.message
			};
		}

		return errors[this.params.error];
	}

	get errorTitle() {
		if(this.error) {
			return this.error.title;
		}

		return 'Произошла ошибка!';
	}

	get errorMessage() {
		if(this.error) {
			return this.error.message;
		}

		return 'Сообщите об этом администратору ресурса';
	}

	render() {
		return (
			<div {...this.cls}>
				<Header>{this.errorTitle}</Header>
				<Text>{this.errorMessage}</Text>
			</div>
		);
	}
}