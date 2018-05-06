import "./vendor/babel-polyfill.min";

// import jQuery from "./vendor/jquery.ajax.min";

import jQuery from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import Bluebird from "bluebird";
import SwipeableViews from "react-swipeable-views";
import * as MaterialUI from "material-ui";
import * as MaterialUI_colors from "material-ui/colors";
import * as MaterialUI_styles from "material-ui/styles";
import * as MaterialUI_transitions from "material-ui/transitions";
import * as ReactPopper from "react-popper";
import * as DxReactGrid from "@devexpress/dx-react-grid";
import * as DxReactGridMaterialUi from "@devexpress/dx-react-grid-material-ui";

window.React = React;
window.ReactDOM = ReactDOM;
window.Bluebird = Bluebird;
window.jQuery = jQuery;

window.MaterialUI = MaterialUI;

window.MaterialUI_colors      = MaterialUI_colors;
window.MaterialUI_styles      = MaterialUI_styles;
window.MaterialUI_transitions = MaterialUI_transitions;

window.SwipeableViews = SwipeableViews;
window.ReactPopper = ReactPopper;
window.DxReactGrid = DxReactGrid;
window.DxReactGridMaterialUi = DxReactGridMaterialUi;

