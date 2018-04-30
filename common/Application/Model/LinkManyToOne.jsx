import LinkAbstract from "./LinkAbstract";

export default class LinkManyToOne extends LinkAbstract {
	get otherKey() {
		return ID;
	}
}