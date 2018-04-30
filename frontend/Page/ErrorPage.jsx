import Header from "../Common/Typography/Header";
import Text from "../Common/Typography/Text";
import Page from "./Page";
import Link from "../Common/Link";

const errors = {
	404: {
		title: 'Страница не найдена',
		message: <span>Запрошенная вами страница не найдена. <Link href="/">Вернуться на главную</Link></span>
	},

};

export default class ErrorPage extends Page {
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

	get pageTitle() {
		return 'Ошибка';
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