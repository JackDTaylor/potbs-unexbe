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

const MICROSECOND = 1;
const SECOND      = 1000 * MICROSECOND;
const MINUTE      = 60   * SECOND;
const HOUR        = 60   * MINUTE;
const DAY         = 24   * HOUR;
const WEEK        = 7    * DAY;
const YEAR        = 365  * DAY;


global.Time = class {
	static MICROSECOND = MICROSECOND;
	static SECOND      = SECOND;
	static MINUTE      = MINUTE;
	static HOUR        = HOUR;
	static DAY         = DAY;
	static WEEK        = WEEK;
	static YEAR        = YEAR;
};

global.TimeSecond = class {
	static MICROSECOND = MICROSECOND / SECOND;
	static SECOND      = SECOND      / SECOND;
	static MINUTE      = MINUTE      / SECOND;
	static HOUR        = HOUR        / SECOND;
	static DAY         = DAY         / SECOND;
	static WEEK        = WEEK        / SECOND;
	static YEAR        = YEAR        / SECOND;
};

const KB          = 1024;
const MB          = 1024 * KB;
const GB          = 1024 * MB;

global.FileSize = class {
	static KB = KB;
	static MB = MB;
	static GB = GB;
};

global.RequestType = class {
	static POST   = 'POST';
	static GET    = 'GET';
	static PUT    = 'PUT';
	static DELETE = 'DELETE';
};

const ScopeMarks = {};
const read     = markedAs('Readable', ScopeMarks);
const write    = markedAs('Writable', ScopeMarks);
const reserved = markedAs('Reserved', ScopeMarks);

global.Scope = class {
	static ALL   = 0xFFFFF;
	static NONE  = 0x00000;

	// Basic operations
	@read  static READ  = 2 ** 0;
	@write static WRITE = 2 ** 1;

	// By page
	@read  static LIST  = 2 ** 2;
	@read  static FORM  = 2 ** 3;
	@write static VIEW  = 2 ** 4;

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

	static get Readable() {
		return ScopeMarks.Readable.reduce((p,c) => p|Scope[c], 0);
	}

	static get Writable() {
		return ScopeMarks.Writable.reduce((p,c) => p|Scope[c], 0);
	}
};

global.Type = class {
	// Custom types
	static PRICE  = 'PRICE';

	// SQL Types
	static DECIMAL   = 'DECIMAL';
	static STRING    = 'STRING';
	static CHAR      = 'CHAR';
	static TEXT      = 'TEXT';
	static NUMBER    = 'NUMBER';
	static INTEGER   = 'INTEGER';
	static TINYINT   = 'TINYINT';
	static SMALLINT  = 'SMALLINT';
	static MEDIUMINT = 'MEDIUMINT';
	static BIGINT    = 'BIGINT';
	static FLOAT     = 'FLOAT';
	static REAL      = 'REAL';
	static DOUBLE    = 'DOUBLE PRECISION';
	static BOOLEAN   = 'BOOLEAN';
	static TIME      = 'TIME';
	static DATE      = 'DATE';
	static DATEONLY  = 'DATEONLY';
	static HSTORE    = 'HSTORE';
	static JSON      = 'JSON';
	static JSONB     = 'JSONB';
	static NOW       = 'NOW';
	static BLOB      = 'BLOB';
	static RANGE     = 'RANGE';
	static UUID      = 'UUID';
	static UUIDV1    = 'UUIDV1';
	static UUIDV4    = 'UUIDV4';
	static VIRTUAL   = 'VIRTUAL';
	static ENUM      = 'ENUM';
	static ARRAY     = 'ARRAY';
	static GEOMETRY  = 'GEOMETRY';
	static GEOGRAPHY = 'GEOGRAPHY';
};

global.Link = class {
	static O2M = 'O2M';
	static M2M = 'M2M';
};