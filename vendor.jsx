import "./vendor/babel-polyfill.min";
import jQuery from "./vendor/jquery.ajax.min";
// import jQuery from "jquery";
import Bluebird from "bluebird";
import * as MaterialUI from "material-ui";
import * as DxReactGrid from "@devexpress/dx-react-grid";
import * as DxReactGridMaterialUi from "@devexpress/dx-react-grid-material-ui";

window.Bluebird = Bluebird;
window.jQuery = jQuery;
window.MaterialUI = MaterialUI;
window.DxReactGrid = DxReactGrid;
window.DxReactGridMaterialUi = DxReactGridMaterialUi;