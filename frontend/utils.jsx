global = window;
global.frontendData = global.frontendData || {};

global.IsBackend = false;
global.IsFrontend = true;

global.StartTime = Date.now();

global.VERBOSE = false;
global.___ = React.Fragment;

console.verbose = (...a) => VERBOSE && console.log(...a);
console.verbose(`Dmi v${frontendData.version}`);

import "./../common/utils";

import "./Utils/Ajax";
import "./Utils/Classnames";
import "./Utils/Decorators";
import "./Utils/ReactComponent";
import "./Utils/Reactified";
import "./Utils/MaterialUI";
import "./Utils/URL";
import "./Utils/Webpack";

import "./Renderers/Base";