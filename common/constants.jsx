global.ID = 'id';

// Not in decorators.jsx because constants are included before everything
global.markedAs = function(mark, container = false) {
	return function(proto, field, descriptor) {
		if(container === false) {
			container = proto;

			mark = 'markedAs$' + mark;
		}

		container[mark] = container[mark] || [];
		container[mark].push(field);

		return descriptor;
	}
};

global.nonEnumerable = function(proto, field, descriptor) {
	descriptor.enumerable = false;
	return descriptor;
};

global.Enum = class {
	@nonEnumerable static Name(code) {
		return Object.keys(this).filter(k => this[k] == code)[0] || '__UNKNOWN__';
	}

	@nonEnumerable static get Keys() {
		return Object.keys(this);
	}

	@nonEnumerable static get Values() {
		return Object.values(this);
	}
};

const MICROSECOND = 1;
const SECOND      = 1000 * MICROSECOND;
const MINUTE      = 60   * SECOND;
const HOUR        = 60   * MINUTE;
const DAY         = 24   * HOUR;
const WEEK        = 7    * DAY;
const YEAR        = 365  * DAY;

global.Time = class extends Enum {
	static MICROSECOND = MICROSECOND;
	static SECOND      = SECOND;
	static MINUTE      = MINUTE;
	static HOUR        = HOUR;
	static DAY         = DAY;
	static WEEK        = WEEK;
	static YEAR        = YEAR;
};

global.TimeSecond = class extends Enum {
	static MICROSECOND = MICROSECOND / SECOND;
	static SECOND      = SECOND      / SECOND;
	static MINUTE      = MINUTE      / SECOND;
	static HOUR        = HOUR        / SECOND;
	static DAY         = DAY         / SECOND;
	static WEEK        = WEEK        / SECOND;
	static YEAR        = YEAR        / SECOND;
};

global.DayOfWeek = class extends Enum {
	static MON = 0;
	static TUE = 1;
	static WED = 2;
	static THU = 3;
	static FRI = 4;
	static SAT = 5;
	static SUN = 6;
};



const KB          = 1024;
const MB          = 1024 * KB;
const GB          = 1024 * MB;

global.FileSize = class extends Enum {
	static KB = KB;
	static MB = MB;
	static GB = GB;
};

global.RequestType = class extends Enum {
	static POST   = 'POST';
	static GET    = 'GET';
	static PUT    = 'PUT';
	static DELETE = 'DELETE';
};

const ScopeMarks = {};
const read     = markedAs('Readable', ScopeMarks);
const write    = markedAs('Writable', ScopeMarks);
const reserved = markedAs('Reserved', ScopeMarks);

global.Scope = class extends Enum {
	static ALL   = 0xFFFFF;
	static NONE  = 0x00000;

	// Basic operations
	@read  static READ  = 2 ** 0;
	@write static WRITE = 2 ** 1;

	// By page
	@read  static LIST  = 2 ** 2;
	@write static FORM  = 2 ** 3;
	@read  static VIEW  = 2 ** 4;

	// Reserved
	@reserved static U005  = 2 ** 5;
	@reserved static U006  = 2 ** 6;
	@reserved static U007  = 2 ** 7;
	@reserved static U008  = 2 ** 8;
	@reserved static U009  = 2 ** 9;
	@reserved static U010  = 2 ** 10;
	@reserved static U011  = 2 ** 11;
	@reserved static U012  = 2 ** 12;
	@reserved static U013  = 2 ** 13;
	@reserved static U014  = 2 ** 14;
	@reserved static U015  = 2 ** 15;
	@reserved static U016  = 2 ** 16;
	@reserved static U017  = 2 ** 17;
	@reserved static U018  = 2 ** 18;
	@reserved static U019  = 2 ** 19;

	@nonEnumerable static get Readable() {
		return ScopeMarks.Readable.reduce((p,c) => p|Scope[c], 0);
	}

	@nonEnumerable static get Writable() {
		return ScopeMarks.Writable.reduce((p,c) => p|Scope[c], 0);
	}

	@nonEnumerable static parse(scope) {
		return Object.keys(this)
			.filter(key => key != 'ALL')
			.map(key => (this[key] & scope) ? key : false)
			.filter(x => x)
			.join(' | ');
	}
};

global.Type = class extends Enum {
	// SQL Types
	static STRING    = 'STRING';
	static NUMBER    = 'NUMBER';
	static DATE      = 'DATE';
	static ARRAY     = 'ARRAY';
	static OBJECT    = 'OBJECT';
};

global.Link = class extends Enum {
	static O2M = 'O2M';
	static M2O = 'M2O';
	static M2M = 'M2M';
};

global.ConstraintAction = class extends Enum {
	static NO_ACTION   = 'NO ACTION';
	static CASCADE     = 'CASCADE';
	static RESTRICT    = 'RESTRICT';
	static SET_NULL    = 'SET NULL';
	static SET_DEFAULT = 'SET DEFAULT';
};


global.Order = class extends Enum {
	static ASC  = 'asc';
	static DESC = 'desc';
};

// noinspection CommaExpressionJS
const descs = {}, desc = (desc) => (p,f,d) => (descs[f] = desc, d);

global.ErrorCode = class extends Enum {
	@desc('Page not found')
	static NOT_FOUND = 404;

	@desc('Internal error occured')
	static INTERNAL = 500;

	@desc('Internal error occured')
	static E_INTERNAL = 550;

	@desc('Fatal error occured!')
	static E_FATAL = 551;

	@nonEnumerable static Description(code) {
		return descs[ ErrorCode.Name(code) ] || 'Error occured';
	}

	@nonEnumerable static Format(code, message = null) {
		const codeName = ErrorCode.Name(code);
		const description = message || ErrorCode.Description(code);

		return `${codeName}: ${description}`;
	}
};

global.ModelMeta = class extends Enum {
	static GRID_CONFIG = 'gridConfig';
	static FORM_CONFIG = 'formConfig';
	static VIEW_CONFIG = 'viewConfig';
};