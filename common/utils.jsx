import "./constants";

import "./Assembly/Utils/Random";
import "./Assembly/Utils/Plural";
import "./Assembly/Utils/Noun";

import "./Assembly/Fixes";
import "./Assembly/Types";
import "./Assembly/Async";
import "./Assembly/Decorators";

import CoreUtils from "./Assembly/Core";
import ModelsUtils from "./Assembly/Models";

export default function sharedUtils(global) {
	CoreUtils(global);
	ModelsUtils(global);
}


