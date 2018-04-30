import {MenuItem} from "material-ui";
import ContextIconButton from "../../Common/ContextIconButton";
import Semitransparent from "../../Common/Semitransparent";

export default class AccountMenu extends ReactComponent {
	render() {
		return (
			<ContextIconButton active icon={icon('account circle')}>
				<MenuItem onClick={fn => console.log('edit account')}>Редактировать аккаунт</MenuItem>
				<MenuItem onClick={fn => console.log('choose role')}>
					Кабинет:
					&nbsp;
					<Semitransparent>Кабинет подрядчика</Semitransparent>
				</MenuItem>
				<MenuItem onClick={fn => console.log('logout')}>Выйти из системы</MenuItem>
			</ContextIconButton>
		);
	}
}