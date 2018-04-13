global.Plural = class Plural {
	static word(n, one, two, many) {
		n  = Math.abs(n) % 100;
		let n1 = n % 10;

		if(n > 10 && n < 20) {
			return many;
		}

		if(n1 > 1 && n1 < 5) {
			return two;
		}

		if(n1 == 1) {
			return one;
		}

		return many;
	}

	static format(n, one, two, many, zero) {
		one  = one  || '';
		two  = two  || '';
		many = many || '';
		zero = zero || '';

		if(n == 0 && zero) {
			return zero;
		}

		return n + ' ' + Plural.word(n, one, two, many);
	}
};