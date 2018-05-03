import DefaultCell from "./DefaultCell";
import Link from "../../Common/Link";

export default class RowLinkCell extends DefaultCell {
	renderPlain(value) {
		return <Link target={this.dataSource}>{icon('visibility', null, { className: 'inline' })}{super.renderPlain(value)}</Link>;
	}
}